import { useState } from "react";
import type { Spec } from "../../types.js";

interface SpecFilterSectionItemProps {
  specName: string;
  spec: Spec;
  filters: Record<string, Set<string | number>>;
  onFilterChange?: (filterName: string, filterValue: string) => void;
  removeFilter?: (filterName: string, filterValue: string) => void;
}

export const SpecFilterSectionItem = ({
  specName,
  spec,
  filters,
  onFilterChange,
  removeFilter,
}: SpecFilterSectionItemProps) => {
  const [variantFilter, setVariantFilter] = useState<string>("");

  return (
    <div className="flex flex-col gap-2">
      <input
        className="input input-bordered w-full max-w-xs"
        type="text"
        placeholder="Filter variants..."
        value={variantFilter}
        onChange={(e) => setVariantFilter(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {spec.variants
          .filter((variant) => {
            const variantString = variant.toString().toLowerCase();
            if (variantFilter.length > 0) {
              return (
                variantString.startsWith(variantFilter.toLowerCase()) ||
                variantString.endsWith(variantFilter.toLowerCase()) ||
                variantString === variantFilter.toLowerCase()
              );
            }

            return !!variant;
          })
          .map((variant) => (
            <button
              key={`${specName}-${variant}`}
              className={`btn btn-sm ${
                filters[specName]?.has(variant) && "btn-primary"
              }`}
              onClick={() => {
                if (filters[specName]?.has(variant)) {
                  removeFilter?.(specName, variant.toString());
                } else {
                  onFilterChange?.(specName, variant.toString());
                }
              }}
            >
              {variant}
            </button>
          ))}
      </div>
    </div>
  );
};
