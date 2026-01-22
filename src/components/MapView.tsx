import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { mapBoundsChanged } from "../redux/citySlice";
import "leaflet/dist/leaflet.css";

/* --- helper component: reacts to map movement --- */
function MapEvents() {
  const dispatch = useDispatch();

  useMapEvents({
    moveend: (event) => {
      const bounds = event.target.getBounds();

      dispatch(
        mapBoundsChanged({
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
        })
      );
    },
  });

  return null;
}

export default function MapView() {
  const dispatch = useDispatch();
  const { cities, loading } = useSelector(
    (state: RootState) => state.city
  );

  const [center, setCenter] = useState<[number, number]>([
    52.2297, 21.0122, // Warsaw fallback
  ]);

  /* --- center map on user geolocation --- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      () => {}
    );
  }, []);

  /* --- weather classification --- */
  const classifyWeather = (weather: {
    temp: number;
    description: string;
  }) => {
    const tempNice =
      weather.temp >= 18 && weather.temp <= 25;
    const noRain = !weather.description
      .toLowerCase()
      .includes("rain");

    if (tempNice && noRain)
      return { type: "nice", emoji: "☀️" };

    if (tempNice || noRain)
      return { type: "passable", emoji: "⛅" };

    return { type: "not nice", emoji: "🌧️" };
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      {/* --- loading spinner (non-blocking) --- */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "white",
            padding: "6px 12px",
            border: "1px solid #333",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          Loading...
        </div>
      )}

      <MapContainer
        center={center}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          setTimeout(() => {
            map.invalidateSize();
          }, 0);
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents />

        {cities.map((city) => {
          if (!city.weather) {
            return null;
          }

          const weatherClass = classifyWeather(
            city.weather
          );

          return (
            <Marker
              key={city.id}
              position={[city.lat, city.lon]}
            >
              <Tooltip>
                <div>
                  <strong>
                    {city.name} {weatherClass.emoji}
                  </strong>
                  <br />
                  Temp: {city.weather.temp}°C
                  <br />
                  {city.weather.description}
                  <br />
                  Class: {weatherClass.type}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
