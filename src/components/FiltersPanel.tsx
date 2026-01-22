import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import type { RootState } from "../redux/store";
import { setFilters } from "../redux/citySlice";

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
  font-family: inherit;
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

const TextInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  box-sizing: border-box;

  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};

  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 4px;
`;

const RangeInput = styled.input`
  width: 100%;
`;

const Value = styled.div`
  font-size: 12px;
  margin-top: 4px;
`;

/* --- component --- */

export default function FiltersPanel() {
  const dispatch = useDispatch();

  const filters = useSelector(
    (state: RootState) => state.city.filters
  );

  const [name, setName] = useState(filters.name);
  const [minPopulation, setMinPopulation] =
    useState<number>(filters.population[0]);

  /* --- debounce 200 ms (REQUIRED) --- */
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
    <Panel>
      <Title>Filters</Title>

      {/* --- name filter --- */}
      <div style={{ marginBottom: 12 }}>
        <Label>City name</Label>
        <TextInput
          type="text"
          value={name}
          placeholder="e.g. War"
          onChange={(e) =>
            setName(e.target.value)
          }
        />
      </div>

      {/* --- population filter --- */}
      <div>
        <Label>Min population</Label>
        <RangeInput
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
        />
        <Value>
          {minPopulation.toLocaleString()}
        </Value>
      </div>
    </Panel>
  );
}
