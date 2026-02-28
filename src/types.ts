export interface Pollutants {
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface AQIData {
  aqi: number; // 1-5 scale
  main: {
    aqi: number;
  };
  components: Pollutants;
  dt: number;
  city?: string;
  coord?: {
    lat: number;
    lon: number;
  };
}

export interface PredictionPoint {
  time: string;
  aqi: number;
  confidence: number;
}

export interface HealthAdvisory {
  level: string;
  advice: {
    general: string;
    children: string;
    elderly: string;
    patients: string;
  };
  precautions: string[];
}

export interface CityInfo {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
