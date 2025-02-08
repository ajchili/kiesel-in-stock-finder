import type { Specs } from "../../types.js";
import { SpecFilterSectionItem } from "./SpectFilterSectionItem.js";

interface SpecFilterSectionProps {
  name: string;
  specs: Specs;
  filters: Record<string, Set<string | number>>;
  onFilterChange?: (filterName: string, filterValue: string) => void;
  removeFilter?: (filterName: string, filterValue: string) => void;
}

export const SpecFilterSection = ({
  name,
  specs,
  filters,
  onFilterChange,
  removeFilter,
}: SpecFilterSectionProps) => {
  return (
    <div className="drawer w-full">
      <input id={`${name}-drawer`} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-full">
        <label
          htmlFor={`${name}-drawer`}
          className="btn btn-neutral drawer-button w-full"
        >
          {name} filters
        </label>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor={`${name}-drawer`}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80">
          {/* Sidebar content here */}
          {Object.entries(specs).map(([specName, spec]) => (
            <div key={specName} className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                {specName}
              </div>
              <div className="collapse-content">
                <SpecFilterSectionItem
                  specName={specName}
                  spec={spec}
                  filters={filters}
                  onFilterChange={onFilterChange}
                  removeFilter={removeFilter}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
