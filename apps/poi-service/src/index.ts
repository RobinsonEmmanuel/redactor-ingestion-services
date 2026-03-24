import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { createServer } from './server.js';

async function bootstrap() {
  try {
    console.log('Démarrage de Redactor Ingestion Services — poi-service...');
    console.log(`Environnement: ${env.NODE_ENV} | Port: ${env.PORT}`);

    const db = await connectDatabase();
    console.log(`Base de données: ${db.databaseName}`);

    const server = await createServer(db, env.PORT);
    await server.listen({ port: env.PORT, host: '0.0.0.0' });

    console.log('poi-service démarré');
    console.log(`  - http://localhost:${env.PORT}/health`);
    console.log(`  - http://localhost:${env.PORT}/api/v1/guides/:id/pois/generate`);
    console.log(`  - http://localhost:${env.PORT}/api/v1/guides/:id/matching/generate`);
  } catch (error) {
    console.error('Erreur au démarrage:', error);
    await disconnectDatabase();
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => { console.error('Unhandled Rejection:', reason); process.exit(1); });
process.on('uncaughtException', (error) => { console.error('Uncaught Exception:', error); process.exit(1); });

bootstrap();
