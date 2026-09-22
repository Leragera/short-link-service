# Сервис сокращения ссылок

Веб-приложение для создания коротких ссылок, редиректов и просмотра статистики переходов.

## Технологии

### Backend

- Node.js 20+
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Redis
- Zod

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Hot Toast
- CSS3 с адаптивной версткой

### Инфраструктура

- Docker и Docker Compose
- Nginx

## Установка и запуск через Docker

Требования: Docker Desktop с поддержкой Docker Compose.

Из корня проекта выполните:

```powershell
cd КОРЕНЬ ПРОЕКТА
docker compose up -d --build
```

Команда запускает PostgreSQL, Redis, backend и frontend. Backend ожидает готовности PostgreSQL и Redis, а затем автоматически выполняет Prisma-миграции.

После запуска:

- frontend: http://localhost
- backend health check: http://localhost:3001/api/health

Проверить состояние контейнеров:

```powershell
docker compose ps
```

Посмотреть логи backend:

```powershell
docker compose logs -f backend
```

Остановить приложение:

```powershell
docker compose down
```

## Локальный запуск в режиме разработки

Запустите PostgreSQL и Redis:

```powershell
docker compose up -d postgres redis
```

В отдельном терминале установите и запустите backend:

```powershell
cd backend
copy .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

В другом терминале установите и запустите frontend:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend будет доступен по адресу, который выведет Vite, обычно http://localhost:5173.

## API

### Проверка состояния backend

```bash
curl http://localhost:3001/api/health
```

Ожидаемый ответ:

```json
{"status":"OK","message":"Backend работает!"}
```

### Создание короткой ссылки

```bash
curl -X POST http://localhost:3001/api/shorten \
	-H "Content-Type: application/json" \
	-d '{"originalUrl":"https://example.com"}'
```

Пример ответа:

```json
{
	"shortCode": "abc123",
	"shortUrl": "http://localhost:3001/abc123"
}
```

В PowerShell используйте `curl.exe`, если команда `curl` перенаправлена на `Invoke-WebRequest`:

```powershell
curl.exe -X POST http://localhost:3001/api/shorten `
	-H "Content-Type: application/json" `
	-d '{"originalUrl":"https://example.com"}'
```

### Переход по короткой ссылке

Откройте URL из ответа в браузере или выполните:

```bash
curl -i http://localhost:3001/abc123
```

Успешный запрос возвращает HTTP 302 и перенаправляет на исходный URL.

### Получение статистики

```bash
curl http://localhost:3001/api/stats/abc123
```

Пример ответа:

```json
{
	"originalUrl": "https://example.com",
	"shortCode": "abc123",
	"clicks": 1,
	"createdAt": "2026-09-14T12:00:00.000Z"
}
```

## Переменные окружения

Скопируйте соответствующий `.env.example` в `.env`. Файлы `.env` не должны добавляться в Git.

### Backend: `backend/.env`

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/app_db?schema=public"
REDIS_URL="redis://localhost:6379"
APP_URL="http://localhost:3001"
```

Для запуска backend внутри Docker используются имена сервисов Compose:

```env
DATABASE_URL="postgresql://dev_user:dev_password@postgres:5432/app_db?schema=public"
REDIS_URL="redis://redis:6379"
APP_URL="http://localhost:3001"
```

### Frontend: `frontend/.env`

```env
VITE_API_URL="http://localhost:3001"
```