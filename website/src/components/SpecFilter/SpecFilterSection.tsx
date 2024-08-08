import { useState } from "react";

import type { Specs } from "../../types.js";
import { SpecFilter } from "./SpecFilter.js";

interface SpecFilterSectionProps {
  name: string;
  specs: Specs;
  filters: any;
  onFilterChange?: (filterName: string, filterValue: string) => void;
}

export const SpecFilterSection = ({
  name,
  specs,
  filters,
  onFilterChange,
}: SpecFilterSectionProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <p>{name}</p>
      <button onClick={() => setOpened(!opened)}>
        {opened ? "Show" : "Hide"}
      </button>
      <div style={{ display: opened ? "inherit" : "none" }}>
        {Object.entries(specs).map(([specName, spec]) => (
          <SpecFilter
            key={specName}
            specName={specName}
            spec={spec}
            onChange={(value) => onFilterChange?.(specName, value)}
            value={filters[specName]}
          />
        ))}
      </div>
    </div>
  );
};
