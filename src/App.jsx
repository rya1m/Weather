import { useState } from 'react';
import './index.css';
const getWeatherClass = (code) => {
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snowy';
  if (code === 45 || code === 48) return 'foggy';
  return '';
};


function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getWeatherByCity = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      const geoData = await geo.json();
      if (!geoData.results || geoData.results.length === 0) {
        setError('المدينة غير موجودة ❌');
        setLoading(false);
        return;
      }
      const { latitude, longitude, name, country } = geoData.results[0];
      const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const wData = await w.json();
      setWeather({ ...wData.current_weather, city: name, country });
    } catch {
      setError('خطأ بجلب البيانات ❗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${weather ? getWeatherClass(weather.weathercode) : ''}`}>
      <h1>🌍 حالة الطقس حسب المدينة</h1>

      <div style={{ margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="ادخل اسم المدينة (بالإنجليزي)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem', marginRight: '0.5rem' }}
        />
        <button onClick={getWeatherByCity} style={{ padding: '0.5rem 1rem' }}>
          بحث 🔍
        </button>
      </div>

      {loading && <p>جاري تحميل...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <>
          <h2>
            الطقس في {weather.city}, {weather.country}
          </h2>
          <p>🌡️ الحرارة: {weather.temperature}°C</p>
          <p>💨 سرعة الرياح: {weather.windspeed} m/s</p>
          <p>🛈 كود الطقس: {weather.weathercode}</p>
        </>
      )}
    </div>
  );
}

export default App;
