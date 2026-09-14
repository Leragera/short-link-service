import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.error;

    if (typeof serverMessage === 'string') {
      return serverMessage;
    }

    if (error.response?.status) {
      return `${fallback} (код ${error.response.status})`;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Сервер не ответил вовремя';
    }

    return 'Не удалось связаться с сервером';
  }

  return fallback;
}

export default apiClient;