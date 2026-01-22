import "leaflet/dist/leaflet.css";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./redux/store";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
);
