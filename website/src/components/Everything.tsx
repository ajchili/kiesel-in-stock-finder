import { useEffect, useState } from "react";

import type { Instrument as InstrumentType, Specs } from "../types";
import { Instrument } from "./Instrument/Instrument";
import { SpecFilter } from "./SpecFilter/SpecFilter";

export const Everything = () => {
  const [instruments, setInstruments] = useState<InstrumentType[]>([]);
  const [specs, setSpecs] = useState<Specs>({});
  const [searchText, setSearchText] = useState<string>(""); // TODO
  const [filters, setFilters] = useState<any>({});

  const onFilterChange = (filterName: string, filterValue: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: filterValue,
    }));
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:5000/guitars");
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
        {Object.entries(specs).map(([specName, variants]) => (
          <SpecFilter
            specName={specName}
            variants={variants}
            onChange={(value) => onFilterChange(specName, value)}
            value={filters[specName]}
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
              <Instrument instrument={instrument} />
            ))}
        </div>
      </div>
    </div>
  );
};
