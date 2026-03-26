import { GoogleGenAI } from '@google/genai';
import { WeatherData, FlightResult } from '../types';

let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY не настроен');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

/**
 * Получить объяснение результата от Gemini
 */
export async function getExplanation(
  result: FlightResult,
  weather: WeatherData,
  drone: string,
  maxWind: number
): Promise<string> {
  const resultText = {
    SAFE: 'Полёт безопасен',
    CAUTION: 'Полёт возможен с ограничениями',
    UNSAFE: 'Полёт небезопасен',
  };

  const prompt = `Ты — эксперт по безопасности полётов дронов. Объясни пилоту результат проверки условий.

ДРОН: ${drone}
Максимальная скорость ветра: ${maxWind} м/с

ПОГОДНЫЕ УСЛОВИЯ:
- Скорость ветра: ${weather.wind} м/с
- Порывы ветра: ${weather.gust} м/с
- Осадки: ${weather.rain} мм
- Видимость: ${weather.visibility} м
- Температура: ${weather.temperature}°C

РЕЗУЛЬТАТ: ${resultText[result]}

Напиши краткое, понятное объяснение (2-4 предложения) на русском языке:
1. Почему получен такой результат
2. На что обратить внимание пилоту
3. Конкретные рекомендации

Пиши в дружелюбном, но профессиональном тоне. Без вступлений — сразу к делу.`;

  try {
    const response = await getGeminiClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Не удалось получить объяснение.';
  } catch (error) {
    console.error('Gemini error:', error);
    // Fallback объяснение без AI
    return getFallbackExplanation(result, weather, drone, maxWind);
  }
}

/**
 * Fallback объяснение без Gemini
 */
function getFallbackExplanation(
  result: FlightResult,
  weather: WeatherData,
  drone: string,
  maxWind: number
): string {
  if (result === 'UNSAFE') {
    if (weather.rain > 0) {
      return `Полёт невозможен из-за осадков (${weather.rain} мм). Дождь может повредить дрон и электронику. Дождитесь ясной погоды.`;
    }
    if (weather.wind > maxWind) {
      return `Скорость ветра (${weather.wind} м/с) превышает максимально допустимую для ${drone} (${maxWind} м/с). Дрон может потерять управление. Рекомендуем подождать.`;
    }
  }

  if (result === 'CAUTION') {
    if (weather.gust > maxWind) {
      return `Порывы ветра (${weather.gust} м/с) достигают предельных значений для вашего дрона. Будьте осторожны, держитесь рядом и избегайте манёвров на большой высоте.`;
    }
    if (weather.visibility < 3000) {
      return `Видимость ограничена (${weather.visibility} м). Это затруднит визуальный контроль дрона. Рекомендуем летать неподалёку и на небольшой высоте.`;
    }
    return `Условия близки к предельным. Ветер ${weather.wind} м/с (лимит ${maxWind} м/с). Летайте осторожно, избегайте длительных полётов.`;
  }

  return `Условия подходят для полёта на ${drone}. Ветер ${weather.wind} м/с при лимите ${maxWind} м/с, видимость ${weather.visibility} м. Хорошего полёта!`;
}