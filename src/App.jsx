import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getWeather } from "./redux/weatherSlice";

function App() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.weather);

  useEffect(() => {
    dispatch(getWeather("Warsaw"));
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather App</h1>

      {status === "loading" && <p>Ładowanie danych...</p>}
      {status === "failed" && <p>Błąd: {error}</p>}

      {status === "succeeded" && data && (
        <div>
          <h2>{data.name}</h2>
          <p>Temperatura: {data.main.temp}°C</p>
          <p>Pogoda: {data.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
