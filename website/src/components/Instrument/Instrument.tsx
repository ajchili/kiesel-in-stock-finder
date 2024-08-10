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
    <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 h-min">
      {instrument.images.length > 0 && (
        <img
          className="h-96 object-contain"
          src={instrument.images[0].node.url}
        />
      )}
      <span className="font-extrabold text-2xl pt-2">
        {instrument.title.split("-")[0]}
      </span>
      <div className="flex gap-1 items-center pb-2">
        <span className="font-light text-xl h-min">
          {asCurrency(instrument.variants[0].node.price.amount)}
        </span>
        {instrument.variants[0].node.compareAtPrice && (
          <span className="font-extralight text-l line-through h-min">
            {asCurrency(instrument.variants[0].node.compareAtPrice.amount)}
          </span>
        )}
      </div>
      <a
        className={`w-full text-center text-xl border rounded-lg p-2 ${
          hasSold
            ? "bg-red-400 hover:bg-red-500"
            : "bg-sky-400 hover:bg-sky-500"
        }`}
        href={`https://www.kieselguitars.com/in-stock/${instrument.handle}`}
        target="_blank"
      >
        {hasSold ? "Sold" : "Buy"}
      </a>
    </div>
  );
};
