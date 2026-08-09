
# Multietapas 
# Etapa de Construcción
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN pnpm ci

COPY . .

RUN pnpm run build

# Etapa de producción
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN pnpm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]