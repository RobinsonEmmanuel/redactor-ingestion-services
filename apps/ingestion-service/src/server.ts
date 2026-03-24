import Fastify from 'fastify';
import { Db } from 'mongodb';
import { env } from './config/env.js';

export async function createServer(db: Db, _port: number) {
  const fastify = Fastify({ logger: true });

  fastify.decorate('mongo', { db });

  fastify.get('/', async () => ({
    name: 'Redactor Ingestion Services — ingestion-service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  }));

  fastify.get('/health', async () => {
    try {
      await db.admin().ping();
      return { status: 'healthy', database: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', database: 'disconnected', error: error instanceof Error ? error.message : 'Unknown', timestamp: new Date().toISOString() };
    }
  });

  await fastify.register(import('@fastify/cors'), {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  await fastify.register(
    async (api) => {
      if (env.API_KEY_SECRET) {
        api.addHook('onRequest', async (request, reply) => {
          const path = request.url;
          const isWorkerRoute = path.includes('/ingest/run');
          if (isWorkerRoute) return;

          const apiKey = request.headers['x-api-key'];
          if (!apiKey || apiKey !== env.API_KEY_SECRET) {
            return reply.code(401).send({ error: 'Non autorisé', message: 'Header X-Api-Key manquant ou invalide' });
          }
        });
      }

      const { ingestRoutes } = await import('./routes/ingest.routes.js');
      await api.register(ingestRoutes);
    },
    { prefix: '/api/v1' }
  );

  return fastify;
}

declare module 'fastify' {
  interface FastifyInstance {
    mongo: { db: Db };
  }
}
