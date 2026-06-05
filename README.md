# Weather-AI Smart Agriculture Dashboard

A 48-hour technical challenge submission integrating Weather-AI APIs into a clean, functional agriculture-focused weather intelligence dashboard.

## What it does

- Searches weather by latitude/longitude or quick location presets.
- Calls Weather-AI through a backend proxy so API keys are not exposed in the browser.
- Displays current conditions, forecast cards, AI summary, agriculture risk level, farming recommendations, and SMS alert preview.
- Includes a mock/fallback mode so reviewers can run the project even without an API key.

## Architecture

```txt
React + Vite Frontend
        |
        v
Node.js + Express Backend Proxy
        |
        v
Weather-AI REST API
```

## Weather-AI endpoints used

- `GET /v1/weather` for current conditions + forecast + AI summary.
- The app is prepared to work with `lat`, `lon`, `days`, `ai`, `units`, and `lang` query parameters.

## Tech Stack

Frontend:
- React
- Vite
- CSS

Backend:
- Node.js
- Express
- Axios
- CORS
- dotenv

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd weather-ai-smart-agri
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env`:

```env
WEATHER_AI_API_KEY=wai_your_key_here
WEATHER_AI_BASE_URL=https://api.weather-ai.co
PORT=5000
```

If you do not have a key yet, leave `WEATHER_AI_API_KEY` blank. The backend will serve realistic mock data for demo purposes.

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

## Deployment

Recommended deployment:

- Backend: Render, Railway, or Fly.io
- Frontend: Vercel or Netlify

Frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Backend environment variables:

```env
WEATHER_AI_API_KEY=wai_your_key_here
WEATHER_AI_BASE_URL=https://api.weather-ai.co
PORT=5000
```

## Security Notes

- The Weather-AI API key is stored only on the backend.
- The frontend never sends the API key to the browser.
- `.env` files are ignored using `.gitignore`.

## Project Focus

This implementation focuses on practical API consumption, clean architecture, user-focused weather intelligence, deployment readiness, and rapid delivery within a 48-hour assessment window.
