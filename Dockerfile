# syntax=docker/dockerfile:1

# ---------- 1. Сборка (Vue 3 + vite-ssg) и экспорт в обычную статику ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Продовые настройки (см. README). Переопределяются через --build-arg.
# METRIKA_ID пустой — без Метрики; INDEXABLE=false — noindex, nofollow.
ARG BASE_URL=/snowbase/
ARG SITE_URL=https://southhub.ru/snowbase/
ARG METRIKA_ID=89187152
ARG INDEXABLE=true

RUN npm run build && node scripts/export.mjs static --out /app/public \
      --base "$BASE_URL" --site-url "$SITE_URL" --canonical "$SITE_URL" \
      ${METRIKA_ID:+--metrika "$METRIKA_ID"} \
      $([ "$INDEXABLE" = "true" ] || echo --noindex)

# ---------- 2. Раздача через nginx (без root) ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# файлы лежат по тому же пути, что и на сайте: /snowbase/...
COPY --from=build /app/public /usr/share/nginx/html/snowbase

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
