import { Router, Request, Response } from 'express';
import { getWeather } from '../services/weather';
import { getDroneSpec } from '../services/drone';
import { assessFlight } from '../services/assessment';
import { getExplanation } from '../services/gemini';
import { FlightCheckRequest, FlightCheckResponse } from '../types';

const router = Router();

/**
 * POST /api/check-flight
 * 
 * Проверка условий для полёта на дроне
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city, drone } = req.body as FlightCheckRequest;

    // Валидация входных данных
    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return res.status(400).json({
        error: 'Поле "city" обязательно и должно быть непустой строкой',
      });
    }

    if (!drone || typeof drone !== 'string' || drone.trim().length === 0) {
      return res.status(400).json({
        error: 'Поле "drone" обязательно и должно быть непустой строкой',
      });
    }

    // Получаем данные о дроне
    const droneSpec = getDroneSpec(drone);
    if (!droneSpec) {
      return res.status(400).json({
        error: `Дрон "${drone}" не найден в базе данных. Доступные модели: DJI Mini 3, DJI Air 2S, DJI Mavic 3 и другие.`,
      });
    }

    // Получаем погоду
    const weather = await getWeather(city.trim());

    // Оцениваем условия
    const assessment = assessFlight(weather, droneSpec.max_wind);

    // Получаем объяснение от Gemini
    const explanation = await getExplanation(
      assessment.result,
      weather,
      droneSpec.name,
      droneSpec.max_wind
    );

    // Формируем ответ
    const response = {
      result: assessment.result,
      risk_score: Math.round(assessment.risk_score * 100) / 100,
      explanation,
      weather,
      drone: {
        name: droneSpec.name,
        max_wind: droneSpec.max_wind,
      },
    };

    return res.json(response);
  } catch (error) {
    console.error('Flight check error:', error);

    if (error instanceof Error) {
      if (error.message.includes('WeatherAPI')) {
        return res.status(502).json({
          error: 'Ошибка при получении данных о погоде. Проверьте название города.',
        });
      }
      if (error.message.includes('не настроен')) {
        return res.status(500).json({
          error: 'Ошибка конфигурации сервера.',
        });
      }
    }

    return res.status(500).json({
      error: 'Внутренняя ошибка сервера',
    });
  }
});

export default router;