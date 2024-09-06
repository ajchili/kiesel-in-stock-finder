import { useEffect, useMemo, useState } from "react";

import type { Instrument as InstrumentType } from "../types.js";
import { Instrument } from "./Instrument/Instrument.js";
import { NavBar } from "./NavBar/NavBar.js";
import { SpecFilters } from "./SpecFilter/SpecFilters.js";

export const Everything = () => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);
  const [filters, setFilters] = useState<
    Record<
      string,
      { category: string; values: Record<string, string | number> }
    >
  >({});
  const [activeFilters, setActiveFilters] = useState<
    Record<string, Record<string, Set<string>>>
  >({});
  const [sortOrder, setSortOrder] = useState<string>();

  const onActiveFilterChange = (
    category: string,
    filterName: string,
    filterValue: string
  ) => {
    setActiveFilters((prev) => {
      if (!prev[category]) {
        prev[category] = {};
      } else if (!prev[category][filterName]) {
        prev[category][filterName] = new Set();
      }

      const previousFilterValue = prev[category][filterName] || new Set();
      previousFilterValue.add(filterValue);
      return {
        ...prev,
        [category]: { ...prev[category], [filterName]: previousFilterValue },
      };
    });
  };

  const removeFilter = (
    category: string,
    filterName: string,
    filterValue: string
  ) => {
    setActiveFilters((prev) => {
      if (!prev?.[category]?.[filterName]) {
        return prev;
      }

      const previousFilterValue = prev[category][filterName] || new Set();
      previousFilterValue.delete(filterValue);
      return {
        ...prev,
        [category]: { ...prev[category], [filterName]: previousFilterValue },
      };
    });
  };

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const { VITE_BACKEND_ENDPOINT = window.location.host } = import.meta.env;
      const response = await fetch(
        `${window.location.protocol}//${VITE_BACKEND_ENDPOINT}/guitars`
      );
      const { instruments } = await response.json();

      setInstruments(instruments);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const { VITE_BACKEND_ENDPOINT = window.location.host } = import.meta.env;
      const response = await fetch(
        `${window.location.protocol}//${VITE_BACKEND_ENDPOINT}/api/v2/kiesel/filters`
      );
      const _filters: typeof filters = await response.json();

      setFilters(_filters);
    })();
  }, []);

  const visibleInstruments = useMemo(() => {
    return instruments
      .filter((instrument) => {
        console.log(instrument, activeFilters);
        for (const activeFiltersInCategory of Object.values(activeFilters)) {
          for (const [filterName, activeFilterValues] of Object.entries(
            activeFiltersInCategory
          )) {
            if (activeFilterValues.size === 0) {
              continue;
            } else if (
              !(filterName in instrument.specs) ||
              !activeFilterValues.has(instrument.specs?.[filterName].value)
            ) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((leftInstrument, rightInstrument) => {
        switch (sortOrder) {
          case "price-asc":
            return (
              Number(leftInstrument.variants[0].node.price.amount) -
              Number(rightInstrument.variants[0].node.price.amount)
            );
          case "price-desc":
            return (
              Number(rightInstrument.variants[0].node.price.amount) -
              Number(leftInstrument.variants[0].node.price.amount)
            );
          case "title":
            return leftInstrument.title.localeCompare(rightInstrument.title);
          default:
            return (
              new Date(rightInstrument.createdAt).getTime() -
              new Date(leftInstrument.createdAt).getTime()
            );
        }
      });
  }, [instruments, filters, sortOrder, activeFilters]);

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-row max-sm:flex-col flex-1">
        <div className="flex flex-col md:w-[25%] p-4 gap-4">
          <div className="p-2">
            <div className="flex flex-col max-sm:flex-row justify-between">
              <h3>Filters & Sorting</h3>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Sort by</span>
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="date">List Date</option>
                  <option value="title">Alphabetical</option>
                  <option value="price-asc">Price ($ - $$$)</option>
                  <option value="price-desc">Price ($$$ - $)</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap">
              {Object.entries(activeFilters).map(
                ([filterCategory, activeFiltersInCategory]) => (
                  <>
                    {Object.entries(activeFiltersInCategory).map(
                      ([filterName, values]) => (
                        <>
                          {Array.from(values).map((value) => (
                            <button
                              key={`${filterCategory}-${filterName}-${value}`}
                              className="btn btn-ghost btn-sm"
                              onClick={() =>
                                removeFilter(filterCategory, filterName, value)
                              }
                            >
                              {filterName}: {filters[filterName].values[value]}
                              <div className="badge badge-ghost">❌</div>
                            </button>
                          ))}
                        </>
                      )
                    )}
                  </>
                )
              )}
            </div>
          </div>
          <SpecFilters
            filters={filters}
            activeFilters={activeFilters}
            onActiveFilterChange={onActiveFilterChange}
            removeFilter={removeFilter}
          />
        </div>
        <div className="flex-1 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center p-4 gap-4">
          {visibleInstruments.map((instrument) => (
            <Instrument key={instrument.title} instrument={instrument} />
          ))}
        </div>
      </div>
    </div>
  );
};
