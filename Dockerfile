# syntax=docker/dockerfile:1

# ---------- 1. Сборка статики Nuxt ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Продовые настройки (см. README). Переопределяются через --build-arg.
ARG NUXT_APP_BASE_URL=/snowbase/
ARG NUXT_PUBLIC_ENABLE_METRIC=true
ARG NUXT_PUBLIC_INDEXABLE=true
ENV NUXT_APP_BASE_URL=$NUXT_APP_BASE_URL \
    NUXT_PUBLIC_ENABLE_METRIC=$NUXT_PUBLIC_ENABLE_METRIC \
    NUXT_PUBLIC_INDEXABLE=$NUXT_PUBLIC_INDEXABLE \
    NUXT_TELEMETRY_DISABLED=1

RUN npx nuxt generate

# ---------- 2. Раздача через nginx (без root) ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# файлы лежат по тому же пути, что и на сайте: /snowbase/...
COPY --from=build /app/.output/public /usr/share/nginx/html/snowbase

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
