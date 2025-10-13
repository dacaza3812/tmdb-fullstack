# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Instala dependencias del sistema necesarias para construir (si las hubiera)
RUN apk add --no-cache python3 make g++

# Activar Corepack y preparar pnpm (usa pnpm lockfile si existe)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiamos los archivos de lock/package para optimizar la cache
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# Copiamos el resto del código y compilamos
COPY . .
RUN pnpm run build

# Production stage: imagen más pequeña que solo contiene artefacto compilado
FROM node:18-alpine AS runner
WORKDIR /app

# Si tu app necesita certificados u otras dependencias, instálalas aquí
RUN apk add --no-cache libstdc++

# Copiamos artefactos desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
