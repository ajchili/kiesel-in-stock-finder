import { useMemo } from "react";

export const useBinnedPriceRange = (prices: number[]) => {
  const { minPrice, maxPrice, averagePriceDifference, priceBins, largestBinSize } =
    useMemo(() => {
      const sortedPrices = prices.sort((a, b) => a - b);
      const minPrice = sortedPrices[0];
      const maxPrice = sortedPrices[sortedPrices.length - 1];

      const cumulativeDifferenceBetweenPrices = sortedPrices.reduce(
        (acc, price, index) => {
          if (index === 0) {
            return acc;
          }

          return acc + (price - sortedPrices[index - 1]);
        },
        0
      );
      const averagePriceDifference = Math.floor(
        cumulativeDifferenceBetweenPrices / (sortedPrices.length - 1)
      );

      const numberOfPriceBins = Math.min(
        Math.floor((maxPrice - minPrice) / averagePriceDifference),
        10
      );

      const priceBins: number[][] = Array.from(
        { length: numberOfPriceBins },
        () => []
      );
      for (const price of sortedPrices) {
        const binIndex = Math.floor(
          (price - minPrice) / averagePriceDifference
        );
        if (binIndex >= 0 && binIndex < priceBins.length) {
          priceBins[binIndex].push(price);
        } else if (binIndex > priceBins.length) {
          priceBins.push([price]);
        }
      }

      return {
        minPrice,
        maxPrice,
        averagePriceDifference,
        priceBins,
        largestBinSize: Math.max(...priceBins.map((i) => i.length)),
      };
    }, [prices]);

  return { minPrice, maxPrice, averagePriceDifference, priceBins, largestBinSize };
};
