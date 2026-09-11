"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortCode = generateShortCode;
// Набор символов: маленькие буквы + цифры
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
// Функция генерации случайного кода длиной 6 символов
function generateShortCode(length = 6) {
    let result = '';
    for (let i = 0; i < length; i++) {
        // Случайный индекс от 0 до длины CHARS
        const randomIndex = Math.floor(Math.random() * CHARS.length);
        // Добавляем случайный символ к результату
        result += CHARS[randomIndex];
    }
    return result;
}
