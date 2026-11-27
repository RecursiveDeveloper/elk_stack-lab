# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /build

COPY apollo-server/package*.json ./
RUN npm ci

COPY apollo-server/ ./
RUN npm run compile

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /opt/apollo-server

COPY --from=builder /build/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /build/dist ./dist

ENV NODE_ENV=development

CMD ["node", "./dist/index.js"]
