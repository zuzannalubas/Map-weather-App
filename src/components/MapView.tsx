import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  mapBoundsChanged,
  clearFocusCity,
} from "../redux/citySlice";
import FiltersPanel from "./FiltersPanel";
import CenterMapButton from "./CenterMapButton";

/* --- map events: load + move --- */
function MapEvents() {
  const dispatch = useDispatch();

  useMapEvents({
    load: (e) => {
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

/* --- focus map on searched city --- */
function FocusOnCity() {
  const map = useMap();
  const dispatch = useDispatch();
  const focusedCity = useSelector(
    (s: RootState) => s.city.focusedCity
  );

  useEffect(() => {
    if (!focusedCity) return;

    map.flyTo(
      [focusedCity.lat, focusedCity.lon],
      10,
      { duration: 1 }
    );

    dispatch(clearFocusCity());
  }, [focusedCity, map, dispatch]);

  return null;
}

export default function MapView() {
  const { cities, filters, loading } = useSelector(
    (state: RootState) => state.city
  );

  const [center, setCenter] = useState<[number, number]>([
    52.2297, 21.0122,
  ]);

  /* --- center on user location --- */
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
    const niceTemp =
      weather.temp >= 18 && weather.temp <= 25;
    const noRain = !weather.description.includes("rain");

    if (niceTemp && noRain) return "☀️";
    if (niceTemp || noRain) return "⛅";
    return "🌧️";
  };

  /* --- filters --- */
  const visibleCities = cities.filter((city) =>
    city.name
      .toLowerCase()
      .includes(filters.name.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <FiltersPanel />

      {loading && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            background: "rgba(255,255,255,0.9)",
            padding: "8px 12px",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          Loading data…
        </div>
      )}

      <MapContainer
        center={center}
        zoom={7}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomleft" />
        <MapEvents />
        <FocusOnCity />
        <CenterMapButton center={center} />

        {visibleCities.map((city) =>
          city.weather ? (
            <Marker
              key={city.id}
              position={[city.lat, city.lon]}
            >
              <Popup autoClose={false} closeOnClick={false}>
                <strong>
                  {city.name}{" "}
                  {classifyWeather(city.weather)}
                </strong>
                <br />
                {city.weather.temp}°C
                <br />
                {city.weather.description}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
