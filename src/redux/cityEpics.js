import { ofType } from "redux-observable";
import { debounceTime, mergeMap } from "rxjs/operators";
import { setCities, setLoading } from "./citySlice";
import { getCities } from "../services/overpass";
import { getWeather } from "../services/weather";

const LOAD_CITIES = "LOAD_CITIES";

// minimal population with large zoom out
const MIN_POPULATION = 100000;

export const loadCities = (bounds) => ({
  type: LOAD_CITIES,
  payload: bounds,
});

const loadCitiesEpic = (action$) =>
  action$.pipe(
    ofType(LOAD_CITIES),
    debounceTime(300),
    mergeMap(async (action) => {
      try {
        // start loading
        const citiesData = await getCities(action.payload);

        // 1. FILTERING + SORTING (KEY PART)
        const filteredCities = citiesData
          .filter((city) => {
            // Overpass often returns population as a string
            const population = Number(city.population);

            // if there is no population → we do not discard (important for capitals)
            if (!city.population) return true;

            return population >= MIN_POPULATION;
          })
          .sort((a, b) => {
            const popA = Number(a.population) || 0;
            const popB = Number(b.population) || 0;
            return popB - popA;
          })
          .slice(0, 20);

        // 2. WEATHER DOWNLOAD (parallel)
        const citiesWithWeather = await Promise.all(
          filteredCities.map(async (city) => ({
            ...city,
            weather: await getWeather(city.lat, city.lon),
          }))
        );

        return setCities(citiesWithWeather);
      } catch (error) {
        console.error("Error loading cities:", error);
        return setCities([]);
      } finally {
        // stop loading
        setLoading(false);
      }
    })
  );

export const rootEpic = loadCitiesEpic;