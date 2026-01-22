import { ofType } from "redux-observable";
import {
  debounceTime,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { from, of, interval } from "rxjs";
import { setCities, setLoading, mapBoundsChanged } from "./citySlice";
import type { RootState } from "./store";
import { getCities } from "../services/overpass";
import { getWeather } from "../services/weather";

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

export const mapBoundsEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(mapBoundsChanged.type),
    debounceTime(300),
    withLatestFrom(state$),
    switchMap(([action, state]: [any, RootState]) => {
      if (!action.payload) return of();

      return from(
        loadCitiesWithWeather(
          action.payload,
          state.city.cityCache
        )
      ).pipe(
        switchMap((cities) => of(setCities(cities)))
      );
    })
  );

export const hourlyReloadEpic = (_: any, state$: any) =>
  interval(60 * 60 * 1000).pipe(
    withLatestFrom(state$),
    switchMap(([, state]: [any, RootState]) => {
      const bounds = state.city.mapBounds;
      if (!bounds) return of();

      return from(
        loadCitiesWithWeather(bounds, {})
      ).pipe(
        switchMap((cities) => of(setCities(cities)))
      );
    })
  );
