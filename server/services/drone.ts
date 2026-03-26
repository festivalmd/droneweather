import { DroneSpec } from '../types';

// База данных DJI дронов
const drones: DroneSpec[] = [
  { name: 'DJI Mini 3', max_wind: 10 },
  { name: 'DJI Mini 3 Pro', max_wind: 10.7 },
  { name: 'DJI Mini 4 Pro', max_wind: 10.7 },
  { name: 'DJI Air 2S', max_wind: 12 },
  { name: 'DJI Air 3', max_wind: 12 },
  { name: 'DJI Mavic 3', max_wind: 12 },
  { name: 'DJI Avata 2', max_wind: 10 },
  { name: 'DJI Mavic 3 Pro', max_wind: 12 },
  { name: 'DJI Mini 2', max_wind: 10 },
  { name: 'DJI Mavic Air 2', max_wind: 10.5 },
];

/**
 * Получить характеристики дрона по названию
 */
export function getDroneSpec(droneName: string): DroneSpec | null {
  // Точное совпадение
  const exactMatch = drones.find(
    (d) => d.name.toLowerCase() === droneName.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Частичное совпадение (без учёта регистра)
  const partialMatch = drones.find(
    (d) =>
      droneName.toLowerCase().includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(droneName.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  return null;
}

/**
 * Получить список всех доступных дронов
 */
export function getAllDrones(): DroneSpec[] {
  return drones;
}