import { formatFilterName } from "./utils.js";

interface SpecFilterSectionProps {
  name: string;
  values: Record<string, string | number>;
  activeFilters: Set<string>;
  onActiveFilterChange?: (filterName: string, filterValue: string) => void;
  removeFilter?: (filterName: string, filterValue: string) => void;
}

export const SpecFilter = ({
  name,
  values,
  activeFilters,
  onActiveFilterChange,
  removeFilter,
}: SpecFilterSectionProps) => {
  return (
    <div key={name} className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {formatFilterName(name)}
      </div>
      <div className="collapse-content flex flex-wrap gap-2">
        {Object.entries(values).map(([value, variant]) => {
          const isActive = activeFilters?.has(value);

          return (
            <button
              key={`${name}-${value}-${variant}`}
              className={`btn btn-sm ${isActive && "btn-primary"}`}
              onClick={() => {
                if (isActive) {
                  removeFilter?.(name, value);
                } else {
                  onActiveFilterChange?.(name, value.toString());
                }
              }}
            >
              {variant}
            </button>
          );
        })}
      </div>
    </div>
  );
};
