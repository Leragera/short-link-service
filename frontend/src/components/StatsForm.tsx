import { useState } from 'react';
import apiClient, { getApiErrorMessage } from '../api/client.ts';
import toast from 'react-hot-toast';

interface Stats {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

export default function StatsForm() {
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shortCode.trim()) {
      toast.error('Введите короткий код');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.get(`/api/stats/${shortCode}`);
      setStats(response.data);
      toast.success('Статистика получена!');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Ошибка при получении статистики'));
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Получить статистику</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введите короткий код (например, abc123)"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Загружаю...' : 'Получить статистику'}
        </button>
      </form>

      {stats && (
        <div className="stats">
          <div className="stat-item">
            <strong>Оригинальный URL:</strong>
            <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer">
              {stats.originalUrl}
            </a>
          </div>

          <div className="stat-item">
            <strong>Количество переходов:</strong>
            <span>{stats.clicks}</span>
          </div>

          <div className="stat-item">
            <strong>Дата создания:</strong>
            <span>{new Date(stats.createdAt).toLocaleString('ru-RU')}</span>
          </div>
        </div>
      )}
    </div>
  );
}