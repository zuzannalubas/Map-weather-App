import { ofType } from "redux-observable";
import {
  debounceTime,
  switchMap,
  mergeMap,
  withLatestFrom,
} from "rxjs/operators";
import { from, of, interval } from "rxjs";
import {
  setCities,
  mapBoundsChanged,
} from "./citySlice";
import type { RootState } from "./store";
import { getCities } from "../services/overpass";
import { getWeather } from "../services/weather";

/* --- helper: load cities + weather --- */
const loadCitiesWithWeather = async (bounds: {
  south: number;
  west: number;
  north: number;
  east: number;
}) => {
  const cities = await getCities(bounds);

  const filtered = cities
    .filter((city: any) => {
      if (!city.population) return true;
      return Number(city.population) >= 100_000;
    })
    .sort(
      (a: any, b: any) =>
        (Number(b.population) || 0) - (Number(a.population) || 0)
    )
    .slice(0, 20);

  return Promise.all(
    filtered.map(async (city: any) => {
      const weather = await getWeather(city.lat, city.lon);

      if (!weather) {
        return city;
      }

      return {
        ...city,
        weather,
      };
    })
  );
};

/* --- EPIC: react to map movement --- */
export const mapBoundsEpic = (action$: any) =>
  action$.pipe(
    ofType(mapBoundsChanged.type),
    debounceTime(300),
    switchMap((action: any) =>
      from(loadCitiesWithWeather(action.payload)).pipe(
        mergeMap((cities) => of(setCities(cities)))
      )
    )
  );

/* --- EPIC: reload visible cities every hour --- */
export const hourlyReloadEpic = (
  action$: any,
  state$: any
) =>
  interval(60 * 60 * 1000).pipe(
    withLatestFrom(state$),
    switchMap(([, state]: [any, RootState]) => {
      const bounds = state.city.mapBounds;
      if (!bounds) return of();

      return from(loadCitiesWithWeather(bounds)).pipe(
        mergeMap((cities) => of(setCities(cities)))
      );
    })
  );
