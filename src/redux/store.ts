import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./citySlice";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./rootEpic";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    city: cityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // ⛔ REQUIRED BY ASSIGNMENT
    }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
