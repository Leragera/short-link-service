import ShortenForm from './components/ShortenForm.tsx';
import StatsForm from './components/StatsForm.tsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Сервис коротких ссылок</h1>
        <p>Сокращайте ссылки и отслеживайте статистику</p>
      </header>

      <main className="main">
        <ShortenForm />
        <StatsForm />
      </main>
    </div>
  );
}

export default App;