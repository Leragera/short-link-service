import { useState } from 'react';
import apiClient from '../api/client.ts';
import toast from 'react-hot-toast';

export default function ShortenForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortCode: string; shortUrl: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Введите URL');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/api/shorten', {
        originalUrl: url,
      });

      setResult(response.data);
      toast.success('Ссылка создана!');
      setUrl('');
    } catch (error) {
  const message = 
    error instanceof Error 
      ? error.message 
      : 'Ошибка при создании ссылки';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      toast.success('Скопировано!');
    }
  };

  return (
    <div className="form-container">
      <h2>Создать короткую ссылку</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
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