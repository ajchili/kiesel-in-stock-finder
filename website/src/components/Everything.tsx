import { useEffect, useMemo, useState } from "react";

import type { Instrument as InstrumentType, Specs } from "../types.js";
import { Instrument } from "./Instrument/Instrument.js";
import { SpecFilterSection } from "./SpecFilter/SpecFilterSection.js";
import { NavBar } from "./NavBar/NavBar.js";

export const Everything = () => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);
  const [specs, setSpecs] = useState<Record<string, Specs>>({});
  const [filters, setFilters] = useState<Record<string, Set<string | number>>>(
    {}
  );
  const [sortOrder, setSortOrder] = useState<string>();

  const onFilterChange = (filterName: string, filterValue: string | number) => {
    setFilters((prev) => {
      const previousFilterValue = prev[filterName] || new Set();
      previousFilterValue.add(filterValue);
      return { ...prev, [filterName]: previousFilterValue };
    });
  };

  const removeFilter = (filterName: string, filterValue: string | number) => {
    setFilters((prev) => {
      const previousFilterValue = prev[filterName] || new Set();
      // @ts-ignore
      previousFilterValue.delete(filterValue);
      return { ...prev, [filterName]: previousFilterValue };
    });
  };

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const { VITE_BACKEND_ENDPOINT = window.location.host } = import.meta.env;
      const response = await fetch(
        `${window.location.protocol}//${VITE_BACKEND_ENDPOINT}/guitars`
      );
      const { instruments, specs } = await response.json();

      setInstruments(instruments);
      setSpecs(specs);
    })();
  }, []);

  const visibleInstruments = useMemo(() => {
    return instruments
      .filter((instrument) => {
        for (const [specName, filterVariants] of Object.entries(filters)) {
          if (filterVariants.size === 0) {
            continue;
          } else if (
            !!filterVariants &&
            (!(specName in instrument.specs) ||
              !filterVariants.has(instrument.specs[specName].value))
          ) {
            return false;
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
  }, [instruments, filters, sortOrder]);

  return (
    <div className="flex flex-col h-dvh">
      <NavBar />
      <div className="flex flex-row max-sm:flex-col flex-1">
        <div className="flex flex-col md:w-[20%] overflow-y-scroll p-4 gap-4">
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
              {Object.entries(filters).map(([filterName, values]) => (
                <>
                  {Array.from(values).map((value) => (
                    <button
                      key={`${filterName}-value`}
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeFilter(filterName, value.toString())}
                    >
                      {filterName}: {value}
                      <div className="badge badge-ghost">❌</div>
                    </button>
                  ))}
                </>
              ))}
            </div>
          </div>
          {["general", "body", "neck", "electronics", "hardware", "other"]
            .filter((category) => category in specs)
            .map((category) => (
              <SpecFilterSection
                key={category}
                name={category}
                specs={specs[category]}
                filters={filters}
                onFilterChange={onFilterChange}
                removeFilter={removeFilter}
              />
            ))}
        </div>
        <div className="flex-1 grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center p-4 gap-4 overflow-y-scroll">
          {visibleInstruments.map((instrument) => (
            <Instrument key={instrument.title} instrument={instrument} />
          ))}
        </div>
      </div>
    </div>
  );
};
