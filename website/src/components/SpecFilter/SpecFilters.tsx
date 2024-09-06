import { SpecFilterSection } from "./SpecFilterSection.js";

export type FiltersByCategory = Record<
  string,
  Record<string, Record<string, string | number>>
>;
interface SpecFiltersProps {
  filters: Record<
    string,
    { category: string; values: Record<string, string | number> }
  >;
  activeFilters: Record<string, Record<string, Set<string>>>;
  onActiveFilterChange?: (
    category: string,
    filterName: string,
    filterValue: string
  ) => void;
  removeFilter?: (
    category: string,
    filterName: string,
    filterValue: string
  ) => void;
}

export const SpecFilters = ({
  filters,
  activeFilters,
  onActiveFilterChange,
  removeFilter,
}: SpecFiltersProps): JSX.Element => {
  const filtersByCategory = Object.entries(filters).reduce(
    (acc: FiltersByCategory, [filterName, filterDetails]) => {
      if (!Object.hasOwn(acc, filterDetails.category)) {
        acc[filterDetails.category] = {};
      }

      acc[filterDetails.category][filterName] = filterDetails.values;

      return acc;
    },
    {}
  );

  return (
    <>
      {Object.entries(filtersByCategory).map(([category, categoryFilters]) => (
        <SpecFilterSection
          key={category}
          category={category}
          filters={categoryFilters}
          activeFilters={activeFilters[category]}
          onActiveFilterChange={(filterName, filterValue) =>
            onActiveFilterChange?.(category, filterName, filterValue)
          }
          removeFilter={(filterName, filterValue) =>
            removeFilter?.(category, filterName, filterValue)
          }
        />
      ))}
    </>
  );
};
