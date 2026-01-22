import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* --- types --- */
export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface WeatherInfo {
  temp: number;
  description: string;
}

export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
  population?: number;
  weather?: WeatherInfo;
}

export interface CityFilters {
  name: string;
  population: [number, number];
}

export interface CityState {
  cities: City[];
  loading: boolean;
  filters: CityFilters;
  mapBounds: MapBounds | null;
}

/* --- initial state --- */
const initialState: CityState = {
  cities: [],
  loading: false,
  filters: {
    name: "",
    population: [0, 10_000_000],
  },
  mapBounds: null,
};

/* --- slice --- */
const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCities(state, action: PayloadAction<City[]>) {
      state.cities = action.payload;
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
  },
});

export const {
  setCities,
  setLoading,
  setFilters,
  mapBoundsChanged,
} = citySlice.actions;

export default citySlice.reducer;
