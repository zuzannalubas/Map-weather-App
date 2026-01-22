import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setFilters } from "../redux/citySlice";

export default function FiltersPanel() {
  const dispatch = useDispatch();

  const filters = useSelector(
    (state: RootState) => state.city.filters
  );

  const [name, setName] = useState<string>(
    filters.name ?? ""
  );

  const [minPopulation, setMinPopulation] =
    useState<number>(filters.population[0] ?? 0);

  /* --- debounce 200 ms (REQUIRED BY ASSIGNMENT) --- */
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        setFilters({
          name,
          population: [
            minPopulation,
            filters.population[1],
          ],
        })
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [name, minPopulation, dispatch, filters.population]);

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 1000,
        background: "#ffffff",
        padding: 14,
        border: "1px solid #333",
        borderRadius: 8,
        width: 240,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: 8,
        }}
      >
        Filters
      </div>

      {/* --- city name filter --- */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          City name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="e.g. War"
          style={{
            width: "100%",
            padding: "4px 6px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* --- population filter --- */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          Min population
        </label>
        <input
          type="range"
          min={0}
          max={10_000_000}
          step={100_000}
          value={minPopulation}
          onChange={(e) =>
            setMinPopulation(
              Number(e.target.value)
            )
          }
          style={{ width: "100%" }}
        />
        <div
          style={{
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {minPopulation.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
