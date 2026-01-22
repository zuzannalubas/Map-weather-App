import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeather } from "../services/weatherService";

export const getWeather = createAsyncThunk(
  "weather/getWeather",
  async (city, { rejectWithValue }) => {
    try {
      return await fetchWeather(city);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    data: null,
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default weatherSlice.reducer;
