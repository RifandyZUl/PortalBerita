# ==========================================
# Stage 1: Build Frontend Assets
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Build arguments for dynamic API URL injection
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy package manifests for efficient layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx Alpine
# ==========================================
FROM nginx:1.25-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
