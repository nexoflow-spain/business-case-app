# Dockerfile para Google Cloud Run
FROM node:20-alpine AS builder

# Instalar dependencias del sistema para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar package.json files
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY package*.json ./

# Instalar dependencias
RUN cd server && npm ci
RUN cd client && npm ci

# Copiar código fuente
COPY server/ ./server/
COPY client/ ./client/

# Generar Prisma client
RUN cd server && npx prisma generate

# Build del frontend
RUN cd client && npm run build

# Build del backend
RUN cd server && npm run build

# Imagen final
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos necesarios
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/prisma ./prisma
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/package*.json ./

# Puerto que usará Cloud Run
ENV PORT=8080
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "dist/index.js"]
