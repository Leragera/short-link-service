# Используем Node.js 20
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json
COPY package*.json ./

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
CMD ["npm", "start"]