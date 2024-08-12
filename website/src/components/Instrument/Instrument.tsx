import type { Instrument as InstrumentType } from "../../types.js";

interface InstrumentProps {
  instrument: InstrumentType;
}

export const Instrument = ({ instrument }: InstrumentProps) => {
  const hasSold = instrument.variants.some(
    (variant) => variant.node.availableForSale === false
  );

  const asCurrency = (num: string) => {
    return Number(num).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        {instrument.images.length > 0 && (
          <img
            className="max-h-96 object-contain rounded"
            src={instrument.images[0].node.url}
          />
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{instrument.title.split("-")[0]}</h2>
        <p>
          {asCurrency(instrument.variants[0].node.price.amount)}
          {instrument.variants[0].node.compareAtPrice && (
            <small className="line-through">
              {asCurrency(instrument.variants[0].node.compareAtPrice.amount)}
            </small>
          )}
        </p>
        <div className="card-actions justify-end">
          <a
            className={`btn btn-outline ${
              hasSold ? "btn-error" : "btn-primary"
            }`}
            href={`https://www.kieselguitars.com/in-stock/${instrument.handle}`}
            target="_blank"
          >
            {hasSold ? "Sold" : "Buy"}
          </a>
        </div>
      </div>
    </div>
  );
};
