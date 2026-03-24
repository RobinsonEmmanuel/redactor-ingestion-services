# redactor-ingestion-services

Monorepo contenant deux microservices autonomes pour l'ingestion de contenu et l'extraction de POIs touristiques.

## Services

| Service | Port | Responsabilité |
|---|---|---|
| [ingestion-service](apps/ingestion-service/README.md) | 4001 | Ingestion WordPress, gestion des jobs |
| [poi-service](apps/poi-service/README.md) | 4002 | Extraction POI, déduplication, matching clusters |

## Structure

```
redactor-ingestion-services/
├── apps/
│   ├── ingestion-service/   (port 4001)
│   └── poi-service/         (port 4002)
├── packages/
│   ├── core-model/          (schémas Zod partagés)
│   └── ingestion-wp/        (logique ingestion WordPress)
├── package.json
├── turbo.json
└── tsconfig.json
```

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer les deux services
npm run dev

# Démarrer un service seul
npm run dev:ingestion
npm run dev:poi
```

## Configuration

Chaque service a son propre `.env` :

```bash
cp apps/ingestion-service/.env.example apps/ingestion-service/.env
cp apps/poi-service/.env.example apps/poi-service/.env
```

Les deux services partagent la même base MongoDB (`MONGODB_URI` + `MONGODB_DB_NAME`).

## Authentification

Toutes les routes (sauf `/health` et les callbacks QStash) nécessitent :

```
X-Api-Key: <valeur de API_KEY_SECRET>
```

## Intégration avec redactor-guide

`apps/api` dans `redactor-guide` proxifie vers ces services :

- Ingestion → `INGESTION_SERVICE_URL` (4001)
- POI + Matching → `POI_SERVICE_URL` (4002)
