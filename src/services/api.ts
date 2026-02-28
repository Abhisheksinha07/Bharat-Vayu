import { GoogleGenAI } from "@google/genai";
import { AQIData, CityInfo } from "../types";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function searchCities(query: string): Promise<CityInfo[]> {
  if (!OPENWEATHER_API_KEY) {
    // Fallback for demo if no API key
    return [
      { name: "London", lat: 51.5074, lon: -0.1278, country: "GB" },
      { name: "New York", lat: 40.7128, lon: -74.0060, country: "US" },
      { name: "New Delhi", lat: 28.6139, lon: 77.2090, country: "IN" },
      { name: "Beijing", lat: 39.9042, lon: 116.4074, country: "CN" },
    ].filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }

  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${OPENWEATHER_API_KEY}`
  );
  return response.json();
}

export async function getAQIData(lat: number, lon: number): Promise<AQIData> {
  if (!OPENWEATHER_API_KEY) {
    // Mock data for demo
    return {
      aqi: Math.floor(Math.random() * 5) + 1,
      main: { aqi: Math.floor(Math.random() * 5) + 1 },
      components: {
        pm2_5: 12.5,
        pm10: 25.3,
        no2: 18.2,
        so2: 2.1,
        co: 350.5,
        o3: 45.8,
      },
      dt: Math.floor(Date.now() / 1000),
      coord: { lat, lon }
    };
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
  );
  const data = await response.json();
  return { ...data.list[0], coord: { lat, lon } };
}

export async function getPrediction(city: string, currentData: AQIData) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found in environment");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      As an expert environmental scientist and AI model, predict the Air Quality Index (AQI) for the next 24 hours for ${city}.
      Current Data: ${JSON.stringify(currentData)}
      Historical Trends (last few hours): []
      
      Provide a JSON response with:
      1. "predictions": an array of 24 objects, each with "time" (ISO string) and "aqi" (1-5 scale, can be float for precision).
      2. "confidence": a number between 0 and 1.
      3. "analysis": a brief explanation of why the AQI might change (weather, traffic, etc).
      4. "healthAdvisory": {
          "level": "Good/Fair/Moderate/Poor/Very Poor",
          "advice": {
            "general": "string",
            "children": "string",
            "elderly": "string",
            "patients": "string"
          },
          "precautions": ["string"]
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Prediction error:", error);
    // Return mock prediction if AI fails
    return {
      predictions: Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() + i * 3600000).toISOString(),
        aqi: currentData.aqi + (Math.random() * 0.5 - 0.25)
      })),
      confidence: 0.5,
      analysis: "AI prediction currently unavailable. Showing baseline estimates.",
      healthAdvisory: {
        level: "Moderate",
        advice: {
          general: "Standard precautions recommended.",
          children: "Limit prolonged outdoor exertion.",
          elderly: "Monitor air quality levels.",
          patients: "Keep medication handy."
        },
        precautions: ["Stay informed", "Reduce heavy exertion"]
      }
    };
  }
}
