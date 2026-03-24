FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/core-model/package.json ./packages/core-model/
COPY packages/ingestion-wp/package.json ./packages/ingestion-wp/
COPY apps/ingestion-service/package.json ./apps/ingestion-service/

RUN npm ci

COPY packages/core-model ./packages/core-model
COPY packages/ingestion-wp ./packages/ingestion-wp
COPY apps/ingestion-service ./apps/ingestion-service
COPY tsconfig.json ./

RUN npm run build --workspace=packages/core-model
RUN npm run build --workspace=packages/ingestion-wp
RUN npm run build --workspace=apps/ingestion-service

FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/core-model/package.json ./packages/core-model/
COPY packages/ingestion-wp/package.json ./packages/ingestion-wp/
COPY apps/ingestion-service/package.json ./apps/ingestion-service/

RUN npm ci --omit=dev

COPY --from=builder /app/packages/core-model/dist ./packages/core-model/dist
COPY --from=builder /app/packages/ingestion-wp/dist ./packages/ingestion-wp/dist
COPY --from=builder /app/apps/ingestion-service/dist ./apps/ingestion-service/dist

WORKDIR /app/apps/ingestion-service

EXPOSE 3000

CMD ["node", "dist/index.js"]
