import { WeatherData, WeatherAPIResponse } from '../types';

const WEATHER_API_HOST = 'weatherapi-com.p.rapidapi.com';
const WEATHER_API_URL = `https://${WEATHER_API_HOST}/current.json`;

/**
 * Получить текущую погоду для города
 */
export async function getWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY не настроен');
  }

  const url = new URL(WEATHER_API_URL);
  url.searchParams.set('q', city);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': WEATHER_API_HOST,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WeatherAPI error: ${response.status} - ${errorText}`);
  }

  const data: WeatherAPIResponse = await response.json();

  // Преобразуем данные в нужный формат
  return {
    wind: Number((data.current.wind_kph / 3.6).toFixed(1)),       // км/ч → м/с
    gust: Number((data.current.gust_kph / 3.6).toFixed(1)),       // км/ч → м/с
    rain: data.current.precip_mm,                                  // мм
    visibility: Math.round(data.current.vis_km * 1000),           // км → метры
    temperature: data.current.temp_c,                              // °C
  };
}