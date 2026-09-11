// Набор символов: маленькие буквы + цифры
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

// Функция генерации случайного кода длиной 6 символов
export function generateShortCode(length: number = 6): string {
  let result = '';
  
  for (let i = 0; i < length; i++) {
    // Случайный индекс от 0 до длины CHARS
    const randomIndex = Math.floor(Math.random() * CHARS.length);
    // Добавляем случайный символ к результату
    result += CHARS[randomIndex];
  }
  
  return result;
}