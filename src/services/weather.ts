const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export interface WeatherResponse {
  temp: number;
  description: string;
}

export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherResponse | null> {
  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("Weather API error:", res.status);
      return null;
    }

    const data = await res.json();

    return {
      temp: data.main.temp,
      description: data.weather[0].description,
    };
  } catch (error) {
    console.error("Weather fetch failed:", error);
    return null;
  }
}
