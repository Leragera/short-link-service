import { useState } from 'react';
import apiClient, { getApiErrorMessage } from '../api/client.ts';
import toast from 'react-hot-toast';
import { isValidHttpUrl } from '../utils/validation.ts';

export default function ShortenForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortCode: string; shortUrl: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedUrl = url.trim();

    if (!normalizedUrl) {
      toast.error('Введите URL');
      return;
    }

    if (!isValidHttpUrl(normalizedUrl)) {
      toast.error('Введите корректный URL, начинающийся с http:// или https://');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/api/shorten', {
        originalUrl: normalizedUrl,
      });

      setResult(response.data);
      toast.success('Ссылка создана!');
      setUrl('');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Ошибка при создании ссылки'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      toast.success('Скопировано!');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  return (
    <div className="form-container">
      <h2>Создать короткую ссылку</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Введите длинный URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Сокращаю...' : 'Сократить'}
        </button>
      </form>

      {result && (
        <div className="result">
          <p>Сокращённая ссылка:</p>
          <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
            {result.shortUrl}
          </a>
          <button onClick={handleCopy}>Копировать</button>
        </div>
      )}
    </div>
  );
}