import { useEffect, useMemo, useState } from "react";

import type { Instrument as InstrumentType, Specs } from "../types.js";
import { Instrument } from "./Instrument/Instrument.js";
import { SpecFilterSection } from "./SpecFilter/SpecFilterSection.js";
import { NavBar } from "./NavBar/NavBar.js";

export const Everything = () => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);
  const [specs, setSpecs] = useState<Record<string, Specs>>({});
  const [searchText, setSearchText] = useState<string>(""); // TODO
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [sortOrder, setSortOrder] = useState<string>();

  const onFilterChange = (filterName: string, filterValue: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: filterValue,
    }));
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
        for (const [specName, value] of Object.entries(filters)) {
          if (
            !!value &&
            (!(specName in instrument.specs) ||
              instrument.specs[specName].value !== value)
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
    <>
      <NavBar />
      <div className="w-full h-dvh overflow-y-scroll">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            overflowY: "scroll",
          }}
        >
          <div>
            {Object.entries(filters).map(([filterName, value]) => (
              <div>
                <p>
                  {filterName}: {value}
                </p>
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters[filterName];
                    setFilters(newFilters);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
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
              />
            ))}
        </div>
        <div className="flex w-full p-4 justify-between">
          <span>Results: {visibleInstruments.length}</span>
          <div className="flex">
            <label>Sort by:</label>
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="date">List Date</option>
              <option value="title">Alphabetical</option>
              <option value="price-asc">Price ($ - $$$)</option>
              <option value="price-desc">Price ($$$ - $)</option>
            </select>
          </div>
        </div>
        <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 items-center p-4 gap-4 overflow-y-scroll">
          {visibleInstruments.map((instrument) => (
            <Instrument key={instrument.title} instrument={instrument} />
          ))}
        </div>
      </div>
    </>
  );
};
