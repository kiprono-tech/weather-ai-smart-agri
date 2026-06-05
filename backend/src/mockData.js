export function buildMockWeather({ lat = -1.2921, lon = 36.8219, days = 7 }) {
  const base = [
    { label: 'Today', temp: 24, rain: 68, wind: 13, condition: 'Scattered showers' },
    { label: 'Tomorrow', temp: 23, rain: 82, wind: 16, condition: 'Heavy rain risk' },
    { label: 'Day 3', temp: 25, rain: 41, wind: 10, condition: 'Cloudy' },
    { label: 'Day 4', temp: 27, rain: 18, wind: 9, condition: 'Partly sunny' },
    { label: 'Day 5', temp: 26, rain: 33, wind: 12, condition: 'Light showers' },
    { label: 'Day 6', temp: 28, rain: 12, wind: 8, condition: 'Sunny intervals' },
    { label: 'Day 7', temp: 24, rain: 54, wind: 14, condition: 'Rain likely' }
  ].slice(0, Number(days) || 7);

  return {
    source: 'mock',
    location: { lat: Number(lat), lon: Number(lon), name: 'Demo Farm Location' },
    current: {
      temperature: 24,
      humidity: 74,
      windSpeed: 13,
      rainfallProbability: 68,
      condition: 'Scattered showers'
    },
    ai_summary:
      'Moderate to heavy rainfall is likely within the next 48 hours. Farmers should delay fertilizer application, inspect drainage channels, and avoid spraying pesticides before rainfall.',
    forecast: base,
    generated_at: new Date().toISOString()
  };
}
