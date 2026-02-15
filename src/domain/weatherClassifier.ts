export type WeatherQuality = "nice" | "passable" | "not nice";

export interface WeatherClassification {
  label: WeatherQuality;
  emoji: string;
}

export function classifyWeather(weather: {
  temp: number;
  description: string;
}): WeatherClassification {
  const niceTemp = weather.temp >= 18 && weather.temp <= 25;

  const noRain = !weather.description.toLowerCase().includes("rain");

  if (niceTemp && noRain) {
    return { label: "nice", emoji: "☀️" };
  }

  if (niceTemp || noRain) {
    return { label: "passable", emoji: "⛅" };
  }

  return { label: "not nice", emoji: "🌧️" };
}
