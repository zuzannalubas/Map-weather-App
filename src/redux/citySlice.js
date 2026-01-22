import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cities: [],
  loading: false,
  filters: {
    name: "",
    population: [0, 10000000], // min/max
  },
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setCities, setLoading, setFilters } = citySlice.actions;
export default citySlice.reducer;