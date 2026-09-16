# ==========================================
# Stage 1: Dependencies & Build
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools for native addons (bcrypt, sharp)
RUN apk add --no-cache python3 make g++

# Copy package manifests for efficient layer caching
COPY package*.json ./

# Install ALL dependencies (including dev for building/pruning)
RUN npm ci

# Copy source files
COPY . .

# Remove development dependencies for lean production image
RUN npm prune --production

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install lightweight init system for proper signal handling (SIGTERM, SIGINT)
RUN apk add --no-cache dumb-init

# Prepare logs directory with proper node user permissions before copying files
RUN mkdir -p /app/logs && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy only production dependencies and source files from builder
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/index.js ./index.js
COPY --from=builder --chown=node:node /app/migrateData.js ./migrateData.js
COPY --from=builder --chown=node:node /app/migrations ./migrations
COPY --from=builder --chown=node:node /app/hash_password.js ./hash_password.js

# Security: Run as unprivileged user
USER node

EXPOSE 5000

# Healthcheck to verify the server is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "index.js"]
