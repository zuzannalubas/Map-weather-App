const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export interface WeatherData {
  temp: number;
  description: string;
}

export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) return null;

    const data = await res.json();

    return {
      temp: data.main.temp,
      description: data.weather[0].description,
    };
  } catch {
    return null;
  }
}
