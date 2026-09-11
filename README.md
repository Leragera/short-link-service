# Сервис сокращения ссылок (URL Shortener)

Полноценное веб-приложение для создания коротких ссылок с отслеживанием статистики переходов, кэшированием и современным пользовательским интерфейсом.

## Инструкция по установке и запуску

# Требования
Node.js 20 или новее
npm
Docker Desktop с поддержкой Docker Compose

# Локальный запуск
Запустите PostgreSQL и Redis из корня проекта:
docker compose up -d postgres redis

Настройте backend:
cd backend
copy .env.example .env
npm install
npx prisma migrate deploy
npm run dev

В отдельном терминале настройте frontend:
cd frontend
copy .env.example .env
npm install
npm run dev

# Запуск через Docker Compose
Для запуска всего приложения выполните из корня проекта:
docker compose up -d --build postgres redis

Примените миграции базы данных:
docker compose run --rm backend npx prisma migrate deploy

Запустите backend и frontend:
docker compose up -d --build backend frontend

## Стек технологий

- **TypeScript** — строгая типизация
- **Prisma ORM** — работа с базой данных и миграции
- **Zod** — валидация входящих данных
- **PostgreSQL** — основная реляционная база данных
- **Redis** — кэширование для ускорения редиректов (TTL 1 час)

### Frontend
- **React** + **TypeScript** — библиотека для создания интерфейса
- **Vite** — быстрый сборщик и dev-сервер
- **Axios** — HTTP-клиент для запросов к API
- **React Hot Toast** — система уведомлений
- **CSS3** — кастомная стилизация с адаптивным дизайном

### Инфраструктура
- **Docker** + **Docker Compose** — контейнеризация всех сервисов
- **Nginx** — раздача статических файлов фронтенда и проксирование API-запросов

---

## Переменные окружения

Для работы приложения необходимо создать файлы `.env` на основе `.env.example`.

### Backend (`backend/.env`)
```env
# Порт сервера
PORT=3001
# Окружение (development, production)
NODE_ENV=development
# Строка подключения к PostgreSQL (для Docker используйте имя сервиса 'postgres' вместо 'localhost')
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/app_db?schema=public"
# Строка подключения к Redis
REDIS_URL="redis://localhost:6379"
# Базовый URL приложения (для генерации коротких ссылок)
APP_URL="http://localhost:3001"