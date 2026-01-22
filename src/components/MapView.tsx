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
import FiltersPanel from "./FiltersPanel";
import CenterMapButton from "./CenterMapButton";

/* --- reacts to map movement and dispatches bounds --- */
function MapEvents() {
  const dispatch = useDispatch();

  useMapEvents({
    moveend: (e) => {
      const b = e.target.getBounds();

      dispatch(
        mapBoundsChanged({
          south: b.getSouth(),
          west: b.getWest(),
          north: b.getNorth(),
          east: b.getEast(),
        })
      );
    },
  });

  return null;
}

export default function MapView() {
  const { cities, filters, loading } = useSelector(
    (state: RootState) => state.city
  );

  const [center, setCenter] = useState<[number, number]>([
    52.2297, 21.0122, // fallback: Warsaw
  ]);

  /* --- center map on user location (initial) --- */
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
      return { label: "nice", emoji: "☀️" };

    if (tempNice || noRain)
      return { label: "passable", emoji: "⛅" };

    return { label: "not nice", emoji: "🌧️" };
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      {/* --- filters panel (absolute overlay) --- */}
      <FiltersPanel />

      {/* --- loading indicator (non-blocking) --- */}
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
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* --- map movement listener --- */}
        <MapEvents />

        {/* --- custom button to center map --- */}
        <CenterMapButton center={center} />

        {/* --- markers --- */}
        {cities
          .filter((city) =>
            city.name
              .toLowerCase()
              .includes(filters.name.toLowerCase())
          )
          .filter((city) => {
            const pop = city.population ?? 0;
            return pop >= filters.population[0];
          })
          .map((city) => {
            if (!city.weather) return null;

            const w = classifyWeather(city.weather);

            return (
              <Marker
                key={city.id}
                position={[city.lat, city.lon]}
              >
                <Tooltip>
                  <div>
                    <strong>
                      {city.name} {w.emoji}
                    </strong>
                    <br />
                    Temp: {city.weather.temp}°C
                    <br />
                    {city.weather.description}
                    <br />
                    Class: {w.label}
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
