import { useEffect, useState } from "react";

import type { Instrument as InstrumentType, Specs } from "../types.js";
import { Instrument } from "./Instrument/Instrument.js";
import { SpecFilterSection } from "./SpecFilter/SpecFilterSection.js";

export const Everything = () => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);
  const [specs, setSpecs] = useState<Record<string, Specs>>({});
  const [searchText, setSearchText] = useState<string>(""); // TODO
  const [filters, setFilters] = useState<any>({});

  console.log(filters);

  const onFilterChange = (filterName: string, filterValue: string) => {
    console.log(filterName, filterValue);
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

  return (
    <div style={{ display: "flex", width: "100%", height: "100dvh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        {Object.entries(specs).map(([category, specs]) => (
          <SpecFilterSection
            key={category}
            name={category}
            specs={specs}
            filters={filters}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flex: 3,
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <div>
          <input placeholder="Search"></input>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            justifyItems: "center",
            overflowY: "scroll",
          }}
        >
          {instruments
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
            .map((instrument) => (
              <Instrument key={instrument.id} instrument={instrument} />
            ))}
        </div>
      </div>
    </div>
  );
};
