import { WeatherData, FlightResult } from '../types';

export interface AssessmentResult {
  result: FlightResult;
  risk_score: number;
}

/**
 * Оценка условий для полёта
 * 
 * Логика:
 * - если есть осадки → UNSAFE
 * - если скорость ветра выше допустимой → UNSAFE
 * - если порывы выше допустимых → CAUTION
 * - если видимость меньше 3000 м → CAUTION
 * - иначе → SAFE
 */
export function assessFlight(
  weather: WeatherData,
  maxWind: number
): AssessmentResult {
  let risk_score = 0;
  let result: FlightResult = 'SAFE';

  // Осадки → UNSAFE
  if (weather.rain > 0) {
    risk_score = Math.min(1, 0.7 + weather.rain * 0.1);
    return { result: 'UNSAFE', risk_score };
  }

  // Ветер выше допустимого → UNSAFE
  if (weather.wind > maxWind) {
    risk_score = Math.min(1, 0.6 + (weather.wind - maxWind) / maxWind);
    return { result: 'UNSAFE', risk_score };
  }

  // Расчёт risk_score на основе близости к лимитам
  const windRatio = weather.wind / maxWind;
  const gustRatio = weather.gust / maxWind;

  // Порывы выше допустимых → CAUTION
  if (weather.gust > maxWind) {
    risk_score = Math.min(0.8, 0.4 + gustRatio * 0.3);
    return { result: 'CAUTION', risk_score };
  }

  // Видимость меньше 3000 м → CAUTION
  if (weather.visibility < 3000) {
    const visibilityRisk = (3000 - weather.visibility) / 3000;
    risk_score = Math.max(risk_score, 0.3 + visibilityRisk * 0.4);
    return { result: 'CAUTION', risk_score };
  }

  // Близость к лимитам ветра
  if (windRatio > 0.7) {
    risk_score = windRatio * 0.5;
    return { result: 'CAUTION', risk_score };
  }

  if (gustRatio > 0.7) {
    risk_score = gustRatio * 0.4;
    return { result: 'CAUTION', risk_score };
  }

  // Низкая видимость (но выше 3000м)
  if (weather.visibility < 5000) {
    risk_score = 0.2;
  }

  // Базовый risk_score для SAFE
  risk_score = Math.max(risk_score, windRatio * 0.2 + gustRatio * 0.1);

  return { result: 'SAFE', risk_score: Math.min(risk_score, 0.3) };
}