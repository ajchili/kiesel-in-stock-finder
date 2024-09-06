import type { Specs } from "../../types.js";
import { SpecFilter } from "./SpecFilter.js";
import { capitalize } from "./utils.js";

interface SpecFilterSectionProps {
  category: string;
  filters: Record<string, Record<string, string | number>>;
  activeFilters: Record<string, Set<string>>;
  onActiveFilterChange?: (filterName: string, filterValue: string) => void;
  removeFilter?: (filterName: string, filterValue: string) => void;
}

export const SpecFilterSection = ({
  category,
  filters,
  activeFilters,
  onActiveFilterChange,
  removeFilter,
}: SpecFilterSectionProps) => {
  const drawerId = `${category}-drawer`.toLowerCase();

  return (
    <div className="drawer w-full">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-full">
        <label
          htmlFor={drawerId}
          className="btn btn-neutral drawer-button w-full"
        >
          {category} filters
        </label>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor={drawerId}
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="menu bg-base-200 text-base-content min-h-full w-80">
          {Object.entries(filters).map(([filterName, values]) => (
            <SpecFilter
              key={filterName}
              name={filterName}
              values={values}
              activeFilters={activeFilters?.[filterName]}
              onActiveFilterChange={onActiveFilterChange}
              removeFilter={removeFilter}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
