import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* --- types --- */

export interface WeatherInfo {
  temp: number;
  description: string;
}

export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  population?: number;
  weather?: WeatherInfo;
}

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface CityFilters {
  name: string;
  population: [number, number];
}

export interface CityState {
  cities: City[];
  cityCache: Record<number, City>;
  loading: boolean;
  filters: CityFilters;
  mapBounds: MapBounds | null;

  /* --- NEW: focus for search --- */
  focusedCity: {
    lat: number;
    lon: number;
  } | null;
}

/* --- initial state --- */

const initialState: CityState = {
  cities: [],
  cityCache: {},
  loading: false,
  filters: {
    name: "",
    population: [0, 10_000_000],
  },
  mapBounds: null,
  focusedCity: null,
};

/* --- slice --- */

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCities(state, action: PayloadAction<City[]>) {
      state.cities = action.payload;

      /* --- keep cache updated --- */
      action.payload.forEach((c) => {
        state.cityCache[c.id] = c;
      });
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setFilters(state, action: PayloadAction<CityFilters>) {
      state.filters = action.payload;
    },

    mapBoundsChanged(state, action: PayloadAction<MapBounds>) {
      state.mapBounds = action.payload;
    },

    /* --- NEW: search focus --- */
    focusCity(
      state,
      action: PayloadAction<{ lat: number; lon: number }>
    ) {
      state.focusedCity = action.payload;
    },

    clearFocusCity(state) {
      state.focusedCity = null;
    },
  },
});

/* --- exports --- */

export const {
  setCities,
  setLoading,
  setFilters,
  mapBoundsChanged,
  focusCity,
  clearFocusCity,
} = citySlice.actions;

export default citySlice.reducer;
