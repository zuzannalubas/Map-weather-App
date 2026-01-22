import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setFilters } from "../redux/citySlice";

/* --- styled container (counts toward styled-components requirement) --- */
const Panel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;

  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 8px;
  padding: 12px;
  width: 240px;
`;

export default function FiltersPanel() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.city.filters);

  const handleNameChange = (e) => {
    dispatch(
      setFilters({
        ...filters,
        name: e.target.value,
      })
    );
  };

  const handlePopulationChange = (e) => {
    dispatch(
      setFilters({
        ...filters,
        population: [0, Number(e.target.value)],
      })
    );
  };

  return (
    <Panel>
      <div>
        <label>
          City name:
          <input
            type="text"
            value={filters.name}
            onChange={handleNameChange}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          Max population:
          <input
            type="range"
            min="0"
            max="10000000"
            step="50000"
            value={filters.population[1]}
            onChange={handlePopulationChange}
            style={{ width: "100%" }}
          />
        </label>
        <div>{filters.population[1].toLocaleString()}</div>
      </div>
    </Panel>
  );
}
