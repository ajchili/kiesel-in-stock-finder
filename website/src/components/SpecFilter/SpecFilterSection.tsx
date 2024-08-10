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
      <button
        className={`w-full p-2 bg-gray-50 hover:bg-sky-100 border-sky-100 ${
          opened && "border-r-4"
        }`}
        onClick={() => setOpened(!opened)}
      >
        {opened ? "Hide" : "Show"} {name} filters
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
