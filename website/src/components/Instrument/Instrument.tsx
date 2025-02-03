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

  const title = instrument.title.slice(0, instrument.title.lastIndexOf("-"));

  return (
    <div className="card card-side bg-base-200 shadow-xl">
      <figure className="flex-[4]">
        {instrument.images.length > 0 && (
          <img
            loading="lazy"
            className="object-contain object-left"
            src={instrument.images[0].node.url}
          />
        )}
      </figure>
      <div className="card-body flex-[6]">
        <h2 className="card-title">{title}</h2>
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
