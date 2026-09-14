# Используем Node.js 20
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Prisma Client requires OpenSSL on Alpine
RUN apk add --no-cache openssl

# Копируем package.json
COPY package*.json ./
COPY prisma ./prisma

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Компилируем TypeScript
RUN npm run build

# Открываем порт
EXPOSE 3001

# Запускаем сервер
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]