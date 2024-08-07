import type { Instrument as InstrumentType } from "../../types";

interface InstrumentProps {
  instrument: InstrumentType;
}

export const Instrument = ({ instrument }: InstrumentProps) => {
  return (
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
  );
};
