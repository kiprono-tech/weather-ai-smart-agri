import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CloudRain, Leaf, MapPin, MessageSquare, ShieldAlert, Wind } from 'lucide-react';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const presets = [
  { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
  { name: 'Bomet', lat: -0.7813, lon: 35.3416 },
  { name: 'Kisumu', lat: -0.0917, lon: 34.7680 },
  { name: 'Mombasa', lat: -4.0435, lon: 39.6682 }
];

function getRisk(weather) {
  const rain = Number(weather?.current?.rainfallProbability ?? weather?.forecast?.[0]?.rain ?? 0);
  const wind = Number(weather?.current?.windSpeed ?? 0);
  if (rain >= 75 || wind >= 35) return { label: 'High', className: 'risk high' };
  if (rain >= 45 || wind >= 20) return { label: 'Medium', className: 'risk medium' };
  return { label: 'Low', className: 'risk low' };
}

function getRecommendation(risk) {
  if (risk === 'High') return 'Delay fertilizer application, avoid pesticide spraying, and inspect drainage channels before rainfall.';
  if (risk === 'Medium') return 'Proceed with caution, monitor rainfall windows, and prioritize activities that tolerate light showers.';
  return 'Good window for field operations. Continue normal farm activities while monitoring daily updates.';
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function App() {
  const [coords, setCoords] = useState(presets[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const risk = useMemo(() => getRisk(weather), [weather]);
  const recommendation = useMemo(() => getRecommendation(risk.label), [risk.label]);
  const sms = `WEATHER ALERT: ${coords.name}. Risk: ${risk.label}. ${recommendation}`.slice(0, 160);

  async function fetchWeather(target = coords) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/weather?lat=${target.lat}&lon=${target.lon}&days=7&units=metric&lang=en`);
      const data = await res.json();
      if (!res.ok && data.fallback) {
        setError(data.message || 'Live API failed; showing fallback demo data.');
        setWeather(data.fallback);
      } else if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load weather data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather(coords);
  }, []);

  function selectPreset(place) {
    setCoords(place);
    fetchWeather(place);
  }

  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">Weather-AI Integration Assessment</span>
          <h1>Smart Agriculture Weather Intelligence</h1>
          <p>
            A lightweight dashboard that converts Weather-AI forecasts into practical farming risk insights,
            recommendations, and SMS-ready alerts.
          </p>
        </div>
        <div className="hero-card">
          <Leaf size={34} />
          <strong>API-first design</strong>
          <span>Frontend → Backend Proxy → Weather-AI</span>
        </div>
      </section>

      <section className="panel controls">
        <div>
          <label>Latitude</label>
          <input value={coords.lat} onChange={(e) => setCoords({ ...coords, lat: e.target.value, name: 'Custom Location' })} />
        </div>
        <div>
          <label>Longitude</label>
          <input value={coords.lon} onChange={(e) => setCoords({ ...coords, lon: e.target.value, name: 'Custom Location' })} />
        </div>
        <button onClick={() => fetchWeather(coords)} disabled={loading}>{loading ? 'Loading...' : 'Fetch Weather'}</button>
      </section>

      <div className="preset-row">
        {presets.map((place) => (
          <button key={place.name} onClick={() => selectPreset(place)}>{place.name}</button>
        ))}
      </div>

      {error && <div className="notice">{error}</div>}

      {weather && (
        <>
          <section className="dashboard-grid">
            <div className="panel main-weather">
              <div className="section-title"><MapPin size={18} /> {coords.name}</div>
              <h2>{weather.current?.temperature ?? '--'}°C</h2>
              <p>{weather.current?.condition}</p>
              <span className="source">Source: {weather.source}</span>
            </div>
            <StatCard icon={<CloudRain />} label="Rain Probability" value={`${weather.current?.rainfallProbability ?? weather.forecast?.[0]?.rain ?? '--'}%`} />
            <StatCard icon={<Wind />} label="Wind Speed" value={`${weather.current?.windSpeed ?? '--'} km/h`} />
            <div className="stat-card">
              <div className="stat-icon"><ShieldAlert /></div>
              <div>
                <p>Agriculture Risk</p>
                <strong><span className={risk.className}>{risk.label}</span></strong>
              </div>
            </div>
          </section>

          <section className="two-column">
            <div className="panel">
              <div className="section-title"><Leaf size={18} /> AI Summary</div>
              <p className="summary">{weather.ai_summary}</p>
              <div className="recommendation">
                <strong>Recommended action</strong>
                <p>{recommendation}</p>
              </div>
            </div>
            <div className="panel sms-box">
              <div className="section-title"><MessageSquare size={18} /> SMS Alert Preview</div>
              <p>{sms}</p>
              <small>{sms.length}/160 characters</small>
            </div>
          </section>

          <section className="panel">
            <div className="section-title"><CloudRain size={18} /> 7-Day Forecast</div>
            <div className="forecast-grid">
              {weather.forecast?.map((day, index) => (
                <div className="forecast-card" key={`${day.label}-${index}`}>
                  <strong>{day.label}</strong>
                  <span>{day.condition}</span>
                  <b>{day.temp ?? '--'}°C</b>
                  <small>Rain: {day.rain ?? 0}%</small>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
