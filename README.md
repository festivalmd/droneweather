# AEROCHECK

Сервис для проверки условий полёта на дроне.

## Запуск

```bash
# Frontend
npm run dev

# Backend (Express)
npm run server

# Vercel (frontend + API)
npx vercel dev
```

## Деплой на Vercel

1. Добавь переменные окружения в Vercel Dashboard:
   - `RAPIDAPI_KEY`
   - `GEMINI_API_KEY`

2. Деплой:
```bash
vercel --prod
```
