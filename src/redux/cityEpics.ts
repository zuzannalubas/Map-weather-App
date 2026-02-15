import { ofType, type Epic } from "redux-observable";
import {
  debounceTime,
  switchMap,
  withLatestFrom,
  catchError,
  startWith,
} from "rxjs/operators";
import { from, of, interval } from "rxjs";
import { setCities, setLoading, mapBoundsChanged } from "./citySlice";
import type { RootState } from "./store";
import { getCities } from "../services/overpass";
import { getWeather } from "../services/weather";

/* ===============================
   Load cities + weather safely
================================ */

const loadCitiesWithWeather = async (
  bounds: any,
  cache: Record<number, any>
) => {
  const cities = await getCities(bounds);

  const filtered = cities
    .filter((c) => !c.population || c.population >= 100_000)
    .slice(0, 20);

  return Promise.all(
    filtered.map(async (city) => {
      if (cache[city.id]?.weather) {
        return cache[city.id];
      }

      const weather = await getWeather(city.lat, city.lon);
      return { ...city, weather };
    })
  );
};

/* ===============================
   Map move epic (typed)
================================ */

export const mapBoundsEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(mapBoundsChanged.type),
    debounceTime(300),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      if (!action.payload) return of();

      return from(
        loadCitiesWithWeather(action.payload, state.city.cityCache)
      ).pipe(
        switchMap((cities) => of(setCities(cities), setLoading(false))),
        startWith(setLoading(true)),
        catchError((error) => {
          console.error("Overpass error:", error);
          return of(setLoading(false));
        })
      );
    })
  );

/* ===============================
   Hourly reload epic
================================ */

export const hourlyReloadEpic: Epic<any, any, RootState> = (_, state$) =>
  interval(60 * 60 * 1000).pipe(
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const bounds = state.city.mapBounds;
      if (!bounds) return of();

      return from(loadCitiesWithWeather(bounds, {})).pipe(
        switchMap((cities) => of(setCities(cities))),
        catchError((error) => {
          console.error("Hourly reload error:", error);
          return of();
        })
      );
    })
  );
