import { Marker, Popup } from "react-leaflet";
import { classifyWeather } from "../domain/weatherClassifier";
import type { City } from "../redux/citySlice";

interface Props {
  city: City;
}

export default function WeatherMarker({ city }: Props) {
  if (!city.weather) return null;

  const classification = classifyWeather(city.weather);

  return (
    <Marker position={[city.lat, city.lon]}>
      <Popup autoClose={false} closeOnClick={false}>
        <strong>
          {city.name} {classification.emoji}
        </strong>
        <br />
        Quality: {classification.label}
        <br />
        Temp: {city.weather.temp}°C
        <br />
        {city.weather.description}
      </Popup>
    </Marker>
  );
}
