import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import type { RootState } from "../redux/store";
import { setFilters, focusCity } from "../redux/citySlice";

/* --- styled components --- */

const Panel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;

  width: 260px;
  padding: 14px;

  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text};

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
`;

const Range = styled.input`
  width: 100%;
  box-sizing: border-box; /* ✅ prevents overflow */
  margin: 0; /* ✅ fixes slider overflow */
`;

const Value = styled.div`
  font-size: 12px;
  margin-top: 4px;
`;

const Suggestions = styled.ul`
  list-style: none;
  margin: 4px 0 8px 0;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 4px;
`;

const Suggestion = styled.li`
  padding: 4px 6px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

/* --- component --- */

export default function FiltersPanel() {
  const dispatch = useDispatch();

  const { cities, filters } = useSelector(
    (s: RootState) => s.city
  );

  const [name, setName] = useState(filters.name);
  const [minPopulation, setMinPopulation] = useState(
    filters.population[0]
  );

  const maxPopulation = useMemo(() => {
    if (!cities.length) return 10_000_000;
    return Math.max(
      ...cities.map((c) => c.population ?? 0),
      0
    );
  }, [cities]);

  const suggestions = useMemo(() => {
    if (!name) return [];

    return cities
      .filter((c) =>
        c.name.toLowerCase().includes(name.toLowerCase())
      )
      .slice(0, 3);
  }, [name, cities]);

  /* --- debounce 200 ms --- */
  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(
        setFilters({
          name,
          population: [minPopulation, maxPopulation],
        })
      );
    }, 200);

    return () => clearTimeout(id);
  }, [name, minPopulation, maxPopulation, dispatch]);

  return (
    <Panel>
      <Title>Filters</Title>

      {/* --- city name search --- */}
      <Label>City name</Label>
      <Input
        value={name}
        placeholder="Type city name"
        onChange={(e) => setName(e.target.value)}
      />

      {suggestions.length > 0 && (
        <Suggestions>
          {suggestions.map((c) => (
            <Suggestion
              key={c.id}
              onClick={() => {
                setName(c.name);
                dispatch(
                  focusCity({ lat: c.lat, lon: c.lon })
                );
              }}
            >
              {c.name}
            </Suggestion>
          ))}
        </Suggestions>
      )}

      {/* --- population filter --- */}
      <Label>Min population</Label>
      <Range
        type="range"
        min={0}
        max={maxPopulation}
        step={Math.max(
          Math.floor(maxPopulation / 100),
          10_000
        )}
        value={minPopulation}
        onChange={(e) =>
          setMinPopulation(Number(e.target.value))
        }
      />
      <Value>
        {minPopulation.toLocaleString()}+
      </Value>
    </Panel>
  );
}
