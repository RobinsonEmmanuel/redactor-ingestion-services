# ingestion-service

Microservice d'ingestion d'articles WordPress.

**Port par défaut :** 4001

## Responsabilité

- Téléchargement des articles d'un site WordPress via son API REST
- Extraction du contenu en Markdown (WPML multi-langues)
- Gestion des jobs d'ingestion asynchrones via QStash

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/v1/ingest` | Ingestion synchrone |
| `POST` | `/api/v1/ingest/enqueue` | Ingestion asynchrone (QStash) |
| `GET` | `/api/v1/ingest/status/:jobId` | Statut d'un job |
| `POST` | `/api/v1/ingest/single-url` | Ingestion d'un article unique |
| `POST` | `/api/v1/ingest/sync-translations` | Synchronisation des URLs WPML |
| `POST` | `/api/v1/ingest/run` | Callback worker QStash (sans X-Api-Key) |
| `GET` | `/health` | Santé du service |

## Variables d'environnement

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

| Variable | Requis | Description |
|---|---|---|
| `PORT` | Non (4001) | Port d'écoute |
| `MONGODB_URI` | Oui | URI de connexion MongoDB |
| `MONGODB_DB_NAME` | Oui | Nom de la base |
| `API_KEY_SECRET` | Recommandé | Clé d'authentification entrante (header `X-Api-Key`) |
| `QSTASH_TOKEN` | Oui (async) | Token Upstash QStash |
| `INGEST_WORKER_URL` | Oui (async) | URL publique de ce service (callback QStash) |

## Démarrage

```bash
# Depuis la racine du monorepo
npm run dev:ingestion

# Ou directement
cd apps/ingestion-service
npm run dev
```

## Collections MongoDB utilisées

- `articles_raw` — articles ingérés
- `ingest_jobs` — jobs d'ingestion asynchrones
- `prompts` — prompts IA (pour l'analyse d'images optionnelle)

## Authentification

Toutes les routes nécessitent le header `X-Api-Key: <API_KEY_SECRET>`, sauf :
- `GET /health`
- `POST /api/v1/ingest/run` (callback QStash, signé par QStash)
