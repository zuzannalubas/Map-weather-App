# Map-weather-App

## Project description

This project is a React application built with **Vite**, **TypeScript**, **Redux Toolkit**, and **Redux Observable**.  
The application displays weather information for cities on an interactive map using **React Leaflet**, **Overpass API**, and **OpenWeather API**.

The application was created as a final assignment for the 2026 course and follows all architectural and functional requirements defined in the assignment description.

## Notes

- The project was built using the **Vite boilerplate**
- All dependencies are listed in ```package.json```
- The project runs after a clean install without additional setup
- **No alternative** state management solutions (e.g. thunks or hooks-based fetching) are used

---

## Main features

- Interactive map built with **React Leaflet**
- Automatic centering of the map on the user’s geolocation
- Loading cities visible on the map using **Overpass API**
- Loading current weather data for cities using **OpenWeather API**
- Weather classification:
  - **Nice** – temperature between 18–25°C and no rain
  - **Passable** – one of the above conditions met
  - **Not nice** – neither condition met
- Display of weather information in map popups with icons and emojis
- Filtering cities by:
  - City name (case-insensitive, with debounce and autocomplete)
  - Minimum population (slider)
- Filters work together and auto-apply after 200 ms
- Smooth map movement and updates when the user moves the map
- Data loading handled with **Redux Observable epics**
- Debounced map events
- Cached city data to avoid unnecessary reloads
- Automatic hourly refresh of visible city data
- Loading indicator displayed during data fetch (non-blocking)
- Light and dark mode implemented using **styled-components**
- Custom styled-components used in the UI (filters panel)

---

## Technologies used

- **React 18**
- **TypeScript**
- **Vite**
- **Redux Toolkit**
- **Redux Observable (RxJS)**
- **React Leaflet / Leaflet**
- **styled-components**
- **OpenStreetMap**
- **Overpass API**
- **OpenWeather API**

---

## Project structure
```
.env --> Add your key here
src/
├── components/
│ ├── MapView.tsx
│ ├── FiltersPanel.tsx
│ ├── CenterMapButton.tsx
│ └── ToggleThemeButton.tsx --> Custom button
├── redux/
│ ├── citySlice.ts
│ ├── cityEpics.ts
│ └── store.ts
├── services/
│ ├── overpass.ts
│ └── weather.ts
├── styles/
│ ├── GlobalStyles.ts
│ └── theme.ts
├── App.tsx
└── main.tsx
```

---

## Environment variables

The application requires an API key for OpenWeather.

## Paste your key in `.env` file in the project root:

```env
VITE_WEATHER_API_KEY=your_openweather_api_key
```
---
## Installation and running the project

Clone the repository:
```
git clone git@github.com:zuzannalubas/Map-weather-App.git
cd Map-weather-App
```

## Install dependencies:
```
npm install
```

## Run the development server:
```
npm run dev
```

## Open the application in the browser:
```
http://localhost:5173
```

---
## **Redux & epics architecture**

All data flow is handled using Redux Toolkit and Redux Observable

No data fetching is done directly inside React components

Side effects (API calls, debouncing, interval refresh) are implemented in epics

Map movement events trigger Redux actions, which are handled by epics

City data is cached to prevent unnecessary reloads

Weather data for visible cities is refreshed automatically every hour

---
## Custom styled-components

The project includes custom styled-components built from scratch, for example:

FiltersPanel component
Path: src/components/FiltersPanel.tsx
Path: src/components/ToggleThemeButton.tsx

This component includes multiple custom styles and supports light and dark themes.

## Author
Zuzanna Lubas
