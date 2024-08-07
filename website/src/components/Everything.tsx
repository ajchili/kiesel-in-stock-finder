import { useEffect, useState } from "react";

interface Instrument {
  id: string;
  title: string;
  tags: string[];
  productType: string;
  variants: unknown;
  images: Array<{ node: { url: string; altText: string | null } }>;
  specs: Record<string, any>;
  handle: string;
  createdAt: string;
  updatedAt: string;
}

type Specs = Record<string, string[]>;

export const Everything = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [specs, setSpecs] = useState<Specs>({});
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
      <div style={{ flex: 1, overflowX: "hidden", overflowY: "scroll" }}>
        {Object.entries(specs).map(([specName, variants]) => (
          <div key={specName}>
            <label>{specName}</label>
            <select
              onChange={(e) => onFilterChange(specName, e.target.value)}
              value={filters[specName] || ""}
            >
              <option value="">Show All</option>
              {variants
                .filter((variant) => !!variant)
                .map((variant) => (
                  <option>{variant}</option>
                ))}
            </select>
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 3,
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
            <div
              key={instrument.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p>{instrument.title}</p>
              <div>
                {instrument.images.map((image) => (
                  <img width="100px" src={image.node.url} />
                ))}
              </div>
              <a
                href={`https://www.kieselguitars.com/in-stock/${instrument.handle}`}
                target="_blank"
              >
                Buy
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};
