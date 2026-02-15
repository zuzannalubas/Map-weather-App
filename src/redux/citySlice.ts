import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* =========================
   Types
========================= */

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
  focusedCity: {
    lat: number;
    lon: number;
  } | null;
}

/* =========================
   Initial state
========================= */

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

/* =========================
   Slice
========================= */

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCities(state, action: PayloadAction<City[]>) {
      state.cities = action.payload;

      // Update cache only with valid cities
      action.payload.forEach((city) => {
        state.cityCache[city.id] = city;
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

    focusCity(state, action: PayloadAction<{ lat: number; lon: number }>) {
      state.focusedCity = action.payload;
    },

    clearFocusCity(state) {
      state.focusedCity = null;
    },
  },
});

/* =========================
   Exports
========================= */

export const {
  setCities,
  setLoading,
  setFilters,
  mapBoundsChanged,
  focusCity,
  clearFocusCity,
} = citySlice.actions;

export default citySlice.reducer;
