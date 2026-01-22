import { combineEpics } from "redux-observable";
import {
  mapBoundsEpic,
  hourlyReloadEpic,
} from "./cityEpics";

export const rootEpic = combineEpics(
  mapBoundsEpic,
  hourlyReloadEpic
);
