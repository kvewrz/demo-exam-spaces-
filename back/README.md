# Coworking exam prep — API

Краткая справка по запуску. Полное задание для фронтенда и методички — в [README в корне проекта](../README.md).

## Запуск

```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

Порт по умолчанию: **3010** (`PORT` в `.env`).

## Учётные записи

| Email | Пароль | Роль |
|--------|--------|------|
| manager@example.com | manager123 | manager |
| client@example.com | client123 | client |
| client2@example.com | client123 | client |
| client3@example.com | client123 | client |
| guest@example.com | guest123 | guest |
| admin@example.com | admin123 | admin |

База данных: `database.sqlite` (в `.gitignore`).
