import type { Instrument as InstrumentType } from "../../types.js";

interface InstrumentProps {
  instrument: InstrumentType;
}

export const Instrument = ({ instrument }: InstrumentProps) => {
  const hasSold = instrument.variants.some(
    (variant) => variant.node.availableForSale === false
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>
        {hasSold && <span style={{ background: "red" }}>SOLD</span>}{" "}
        {instrument.title}
      </p>
      <div>
        {instrument.images.map((image) => (
          <img key={image.node.url} width="100px" src={image.node.url} />
        ))}
      </div>
      <p>{instrument.variants[0].node.price.amount}</p>
      <a
        href={`https://www.kieselguitars.com/in-stock/${instrument.handle}`}
        target="_blank"
      >
        Buy
      </a>
    </div>
  );
};
