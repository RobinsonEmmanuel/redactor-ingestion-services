# poi-service

Microservice d'extraction POI (Points d'Intérêt), déduplication et matching clusters Region Lovers.

**Port par défaut :** 4002

## Responsabilité

- Classification des articles WordPress (mono-POI / multi-POI / exclus)
- Extraction des POIs par IA (OpenAI)
- Déduplication algorithmique + LLM
- Matching des POIs avec les clusters Region Lovers (algorithme Levenshtein)

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/v1/guides/:id/pois/generate` | Lance l'extraction des POIs |
| `GET` | `/api/v1/guides/:id/pois/latest-job` | Dernier job en attente d'action |
| `GET` | `/api/v1/guides/:id/pois/job-status/:jobId` | Statut d'un job POI |
| `POST` | `/api/v1/guides/:id/pois/jobs/:jobId/deduplicate` | Lance la déduplication |
| `POST` | `/api/v1/guides/:id/matching/generate` | Matching POIs ↔ clusters |
| `GET` | `/api/v1/guides/:id/matching` | Résultat du matching sauvegardé |
| `POST` | `/api/v1/guides/:id/matching/save` | Sauvegarde le matching |
| `POST` | `/api/v1/guides/:id/clusters` | Crée un cluster manuel |
| `DELETE` | `/api/v1/guides/:id/clusters/:clusterId` | Supprime un cluster |
| `PATCH` | `/api/v1/guides/:id/clusters/:clusterId` | Renomme un cluster |
| `POST` | `/api/v1/workers/generate-pois` | Worker QStash — extraction |
| `POST` | `/api/v1/workers/deduplicate-pois` | Worker QStash — déduplication |
| `GET` | `/health` | Santé du service |

## Variables d'environnement

Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

| Variable | Requis | Description |
|---|---|---|
| `PORT` | Non (4002) | Port d'écoute |
| `MONGODB_URI` | Oui | URI de connexion MongoDB |
| `MONGODB_DB_NAME` | Oui | Nom de la base (même que ingestion-service) |
| `API_KEY_SECRET` | Recommandé | Clé d'authentification entrante (header `X-Api-Key`) |
| `QSTASH_TOKEN` | Oui (async) | Token Upstash QStash |
| `POI_WORKER_URL` | Oui (async) | URL publique de ce service (callbacks QStash workers) |
| `OPENAI_API_KEY` | Oui | Clé OpenAI (extraction et déduplication) |
| `REGION_LOVERS_API_URL` | Non | URL API Region Lovers |
| `PROMPT_ID_POI_EXTRACTION` | Non | ID du prompt d'extraction en MongoDB |
| `PROMPT_ID_POI_DEDUP` | Non | ID du prompt de déduplication en MongoDB |

## Démarrage

```bash
# Depuis la racine du monorepo
npm run dev:poi

# Ou directement
cd apps/poi-service
npm run dev
```

## Collections MongoDB utilisées

- `guides` — métadonnées des guides (destination, destination_rl_id)
- `articles_raw` — articles ingérés (lus, non écrits)
- `pois_generation_jobs` — jobs d'extraction et déduplication
- `pois_selection` — POIs confirmés pour un guide
- `cluster_assignments` — résultat du matching POI ↔ clusters
- `prompts` — prompts IA

## Authentification

Toutes les routes nécessitent le header `X-Api-Key: <API_KEY_SECRET>`, sauf :
- `GET /health`
- `POST /api/v1/workers/generate-pois` (callback QStash)
- `POST /api/v1/workers/deduplicate-pois` (callback QStash)

Pour les routes de matching, le token JWT Region Lovers doit être transmis via le header `Authorization: Bearer <token>` ou le cookie `accessToken`.
