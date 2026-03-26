// Типы данных для API

export interface FlightCheckRequest {
  city: string;
  drone: string;
}

export interface WeatherData {
  wind: number;      // м/с
  gust: number;      // м/с
  rain: number;      // мм
  visibility: number; // метры
  temperature: number; // °C
}

export type FlightResult = 'SAFE' | 'CAUTION' | 'UNSAFE';

export interface FlightCheckResponse {
  result: FlightResult;
  risk_score: number;
  explanation: string;
  weather: WeatherData;
}

export interface DroneSpec {
  name: string;
  max_wind: number; // м/с
}

// Raw WeatherAPI response
export interface WeatherAPIResponse {
  current: {
    temp_c: number;
    wind_kph: number;
    gust_kph: number;
    precip_mm: number;
    vis_km: number;
  };
}