import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { buildMockWeather } from './mockData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const WEATHER_AI_BASE_URL = process.env.WEATHER_AI_BASE_URL || 'https://api.weather-ai.co';
const WEATHER_AI_API_KEY = process.env.WEATHER_AI_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'weather-ai-smart-agri-backend' });
});

function normalizeWeatherApiResponse(data, query) {
  const current = data.current || data.weather || data.current_weather || {};
  const forecast = data.forecast || data.daily || data.days || [];

  return {
    source: 'weather-ai',
    location: data.location || data.geo || { lat: Number(query.lat), lon: Number(query.lon) },
    current: {
      temperature: current.temperature ?? current.temp ?? current.temp_c ?? null,
      humidity: current.humidity ?? null,
      windSpeed: current.windSpeed ?? current.wind_speed ?? current.wind_kph ?? null,
      rainfallProbability:
        current.rainfallProbability ?? current.precipitation_probability ?? current.rain_probability ?? null,
      condition: current.condition ?? current.summary ?? current.description ?? 'Weather data available'
    },
    ai_summary: data.ai_summary || data.summary || data.insight || data.aiSummary || 'AI summary was not included in the API response.',
    forecast: Array.isArray(forecast)
      ? forecast.map((item, index) => ({
          label: item.date || item.day || `Day ${index + 1}`,
          temp: item.temperature ?? item.temp ?? item.max_temp ?? item.temp_c ?? null,
          rain: item.rainfallProbability ?? item.precipitation_probability ?? item.rain_probability ?? item.rain ?? 0,
          wind: item.windSpeed ?? item.wind_speed ?? item.wind_kph ?? null,
          condition: item.condition ?? item.summary ?? item.description ?? 'Forecast'
        }))
      : [],
    raw: data,
    generated_at: new Date().toISOString()
  };
}

app.get('/api/weather', async (req, res) => {
  const { lat = '-1.2921', lon = '36.8219', days = '7', units = 'metric', lang = 'en' } = req.query;

  if (!WEATHER_AI_API_KEY) {
    return res.json(buildMockWeather({ lat, lon, days }));
  }

  try {
    const response = await axios.get(`${WEATHER_AI_BASE_URL}/v1/weather`, {
      params: { lat, lon, days, ai: true, units, lang },
      headers: { Authorization: `Bearer ${WEATHER_AI_API_KEY}` },
      timeout: 12000
    });

    res.json(normalizeWeatherApiResponse(response.data, { lat, lon }));
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: true,
      message: error.response?.data?.message || error.message || 'Weather-AI request failed',
      fallback: buildMockWeather({ lat, lon, days })
    });
  }
});

app.post('/api/sms-preview', (req, res) => {
  const { location = 'Demo Farm', risk = 'Medium', recommendation = 'Monitor rainfall and drainage.' } = req.body || {};
  const message = `WEATHER ALERT: ${location}. Risk: ${risk}. ${recommendation}`.slice(0, 160);
  res.json({ message, characters: message.length, maxCharacters: 160 });
});

app.listen(PORT, () => {
  console.log(`Weather-AI Smart Agri backend running on port ${PORT}`);
});
