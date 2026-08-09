# =========================
# Etapa de construcción
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Habilitar pnpm mediante Corepack
RUN corepack enable

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias exactamente según el lockfile
RUN apk add --no-cache python3 make g++ \
    && pnpm install --frozen-lockfile \
    && apk del python3 make g++

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN pnpm run build


# =========================
# Etapa de producción
# =========================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Habilitar pnpm
RUN corepack enable

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar solamente dependencias de producción
# bcrypt necesita herramientas de compilación en Alpine (no hay prebuilds para musl)
RUN apk add --no-cache python3 make g++ \
    && pnpm install --frozen-lockfile --prod \
    && apk del python3 make g++

# Copiar aplicación compilada
COPY --from=builder /app/dist ./dist

# Puerto de Fastify
EXPOSE 3000

# Ejecutar como usuario no root
USER node

CMD ["node", "dist/server.js"]