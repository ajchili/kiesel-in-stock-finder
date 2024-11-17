import { useEffect, useMemo, useState } from "react";

import type { Instrument as InstrumentType, Specs } from "../types.js";
import { Instrument } from "./Instrument/Instrument.js";

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
    <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 items-center p-4 gap-4">
      {visibleInstruments.map((instrument) => (
        <Instrument key={instrument.title} instrument={instrument} />
      ))}
    </div>
  );
};
