# Docker: dev-сервер React и production со статикой

## Цели

1. **Development:** контейнер поднимает React dev server (hot reload), порт проброшен на хост — можно работать без локально установленного Node.
2. **Production:** образ со **сборкой** фронта и раздачей **статики** через nginx (или другой веб-сервер).

API в учебных проектах запускается отдельно (`back/`), контейнер фронта обращается к нему по URL из переменных окружения.

## Порядок действий (обзор)

### Dev

1. В корне фронта — `Dockerfile.dev` (или один `Dockerfile` с target `development`).
2. Базовый образ `node:20-alpine` (или актуальный LTS).
3. `WORKDIR /app`, копирование `package.json` / lock-файла, `npm ci`.
4. Копирование исходников, команда `CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]` для Vite (слушать все интерфейсы внутри контейнера).
5. Сборка: `docker build -f Dockerfile.dev -t coworking-front-dev .`
6. Запуск: `docker run --rm -p 5173:5173 -v $(pwd):/app -v /app/node_modules coworking-front-dev` (пример с монтированием кода для hot reload — уточните под свой шаблон).

Переменная **`VITE_API_URL=http://host.docker.internal:3010`** (macOS/Windows) или IP хоста в Linux — чтобы запросы из браузера пользователя шли на API (часто API вызывается из браузера, не из контейнера Node — тогда URL должен быть доступен с машины студента).

Уточнение: если запросы идут **из браузера**, base URL API — это `localhost:3010` на хосте; если из SSR или прокси внутри Docker — нужен другой хостнейм.

### Production (multi-stage)

**Стадия 1 — build**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
```

**Стадия 2 — nginx**

```dockerfile
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Пример минимального **`nginx.conf`** для SPA (fallback на `index.html` для client-side routing):

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Сборка образа с подстановкой API URL на этапе билда:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t coworking-front-prod .
docker run --rm -p 8080:80 coworking-front-prod
```

Откройте `http://localhost:8080`.

## Частые замечания

- Не коммитьте секреты в образ; для публичного API достаточно публичного base URL.
- Multi-stage уменьшает размер финального образа (нет devDependencies в nginx-слое).
- Для HTTPS в проде обычно ставят reverse-proxy (Traefik, Caddy) перед контейнером — это уже инфраструктурный уровень.
