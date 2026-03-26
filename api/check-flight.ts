import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

interface FlightCheckRequest {
  city: string;
  drone: string;
}

interface WeatherData {
  wind: number;
  gust: number;
  rain: number;
  visibility: number;
  temperature: number;
}

interface DroneSpec {
  name: string;
  max_wind: number;
}

type FlightResult = 'SAFE' | 'CAUTION' | 'UNSAFE';

// База данных дронов
const drones: DroneSpec[] = [
  { name: 'DJI Mini 3', max_wind: 10 },
  { name: 'DJI Mini 3 Pro', max_wind: 10.7 },
  { name: 'DJI Mini 4 Pro', max_wind: 10.7 },
  { name: 'DJI Air 2S', max_wind: 12 },
  { name: 'DJI Air 3', max_wind: 12 },
  { name: 'DJI Mavic 3', max_wind: 12 },
  { name: 'DJI Avata 2', max_wind: 10 },
];

function getDroneSpec(droneName: string): DroneSpec | null {
  return drones.find(d => d.name.toLowerCase() === droneName.toLowerCase()) || null;
}

async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY не настроен');

  const url = new URL('https://weatherapi-com.p.rapidapi.com/current.json');
  url.searchParams.set('q', city);

  const response = await fetch(url.toString(), {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
    },
  });

  if (!response.ok) throw new Error('WeatherAPI error');

  const data = await response.json();
  return {
    wind: Number((data.current.wind_kph / 3.6).toFixed(1)),
    gust: Number((data.current.gust_kph / 3.6).toFixed(1)),
    rain: data.current.precip_mm,
    visibility: Math.round(data.current.vis_km * 1000),
    temperature: data.current.temp_c,
  };
}

function assessFlight(weather: WeatherData, maxWind: number): { result: FlightResult; risk_score: number } {
  if (weather.rain > 0) {
    return { result: 'UNSAFE', risk_score: Math.min(1, 0.7 + weather.rain * 0.1) };
  }
  if (weather.wind > maxWind) {
    return { result: 'UNSAFE', risk_score: Math.min(1, 0.6 + (weather.wind - maxWind) / maxWind) };
  }
  if (weather.gust > maxWind) {
    return { result: 'CAUTION', risk_score: Math.min(0.8, 0.4 + (weather.gust / maxWind) * 0.3) };
  }
  if (weather.visibility < 3000) {
    return { result: 'CAUTION', risk_score: 0.5 };
  }
  const windRatio = weather.wind / maxWind;
  if (windRatio > 0.7) {
    return { result: 'CAUTION', risk_score: windRatio * 0.5 };
  }
  return { result: 'SAFE', risk_score: Math.max(0.05, windRatio * 0.2) };
}

async function getExplanation(result: FlightResult, weather: WeatherData, drone: string, maxWind: number): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return getFallbackExplanation(result, weather, drone, maxWind);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const resultText = {
      SAFE: 'Полёт безопасен',
      CAUTION: 'Полёт возможен с ограничениями',
      UNSAFE: 'Полёт небезопасен',
    };

    const prompt = `Объясни пилоту дрона ${drone} почему результат полёта: ${resultText[result]}.
Погодные условия: ветер ${weather.wind} м/с, порывы ${weather.gust} м/с, осадки ${weather.rain} мм, видимость ${weather.visibility} м, температура ${weather.temperature}°C.
Максимальная скорость ветра для дрона: ${maxWind} м/с.
Пиши кратко (2-4 предложения) на русском языке.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || getFallbackExplanation(result, weather, drone, maxWind);
  } catch {
    return getFallbackExplanation(result, weather, drone, maxWind);
  }
}

function getFallbackExplanation(result: FlightResult, weather: WeatherData, drone: string, maxWind: number): string {
  if (result === 'UNSAFE') {
    if (weather.rain > 0) return `Полёт невозможен из-за осадков. Дождитесь ясной погоды.`;
    return `Ветер (${weather.wind} м/с) превышает лимит ${drone} (${maxWind} м/с).`;
  }
  if (result === 'CAUTION') return `Условия близки к предельным. Летайте осторожно.`;
  return `Условия подходят для полёта. Ветер ${weather.wind} м/с при лимите ${maxWind} м/с.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { city, drone } = req.body as FlightCheckRequest;

    if (!city?.trim() || !drone?.trim()) {
      return res.status(400).json({ error: 'Поля city и drone обязательны' });
    }

    const droneSpec = getDroneSpec(drone);
    if (!droneSpec) {
      return res.status(400).json({ error: `Дрон "${drone}" не найден` });
    }

    const weather = await getWeather(city.trim());
    const assessment = assessFlight(weather, droneSpec.max_wind);
    const explanation = await getExplanation(assessment.result, weather, droneSpec.name, droneSpec.max_wind);

    return res.json({
      result: assessment.result,
      risk_score: Math.round(assessment.risk_score * 100) / 100,
      explanation,
      weather,
      drone: { name: droneSpec.name, max_wind: droneSpec.max_wind },
    });
  } catch (error) {
    console.error('Flight check error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}