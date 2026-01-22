const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL;

export async function fetchWeather(city) {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych pogodowych");
  }

  return response.json();
}
