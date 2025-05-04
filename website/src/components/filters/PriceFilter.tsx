import { createRef, useCallback, useEffect, useMemo, useState } from "react";

import { asCurrency } from "../../utils/currency.js";

interface PriceFilterProps {
  prices: number[];
  onFilterChange?: (min: number, max: number) => void;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};

export const PriceFilter = (props: PriceFilterProps) => {
  const priceRangeSliderRef = createRef<HTMLDivElement>();
  const selectedPriceRangeSliderRef = createRef<HTMLDivElement>();
  const leftRangeSliderButtonRef = createRef<HTMLButtonElement>();
  const rightRangeSliderButtonRef = createRef<HTMLButtonElement>();

  const [leftRangeSliderSelected, setLeftRangeSlideSelected] = useState(false);
  const [rightRangeSliderSelected, setRightRangeSlideSelected] =
    useState(false);

  const { minPrice, maxPrice, averagePriceDifference, priceBins } =
    useMemo(() => {
      const sortedPrices = props.prices.sort((a, b) => a - b);
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
      };
    }, [props.prices]);

  const onMove = useCallback(
    (event: MouseEvent) => {
      if (
        !priceRangeSliderRef.current ||
        !selectedPriceRangeSliderRef.current ||
        !leftRangeSliderButtonRef.current ||
        !rightRangeSliderButtonRef.current
      ) {
        return;
      }

      if (leftRangeSliderSelected) {
        const left = clamp(
          event.clientX -
            priceRangeSliderRef.current.getBoundingClientRect().left,
          0,
          rightRangeSliderButtonRef.current.getBoundingClientRect().x -
            leftRangeSliderButtonRef.current.clientWidth * 2.5
        );

        leftRangeSliderButtonRef.current.style.left = `${left}px`;
        selectedPriceRangeSliderRef.current.style.left = `${left}px`;
      }

      if (rightRangeSliderSelected) {
        const right = clamp(
          priceRangeSliderRef.current.getBoundingClientRect().right -
            event.clientX,
          0,
          priceRangeSliderRef.current.clientWidth -
            leftRangeSliderButtonRef.current.getBoundingClientRect().x -
            leftRangeSliderButtonRef.current.clientWidth * 0.5
        );

        rightRangeSliderButtonRef.current.style.right = `${right}px`;
        selectedPriceRangeSliderRef.current.style.right = `${right}px`;
      }
    },
    [
      priceRangeSliderRef,
      selectedPriceRangeSliderRef,
      leftRangeSliderButtonRef,
      leftRangeSliderSelected,
      rightRangeSliderButtonRef,
      rightRangeSliderSelected,
    ]
  );

  const onMouseUp = useCallback(() => {
    setLeftRangeSlideSelected(false);
    setRightRangeSlideSelected(false);

    if (!priceRangeSliderRef.current || !selectedPriceRangeSliderRef.current) {
      return;
    }

    const sliderWidth = priceRangeSliderRef.current.clientWidth;
    const { left, right } = selectedPriceRangeSliderRef.current.style;

    const leftBinIndex = Math.floor(
      parseFloat(left.substring(0, left.length - 2)) / sliderWidth / 0.1
    );
    const leftBin = priceBins[leftBinIndex];

    const rightBinIndex = Math.floor(
      (1 - parseFloat(right.substring(0, right.length - 2)) / sliderWidth) / 0.1
    );
    const rightBin = priceBins[clamp(rightBinIndex, 0, priceBins.length - 1)];

    props.onFilterChange?.(leftBin[0], rightBin[rightBin.length - 1]);
  }, [
    priceRangeSliderRef,
    selectedPriceRangeSliderRef,
    minPrice,
    maxPrice,
    averagePriceDifference,
    priceBins,
  ]);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [onMove, onMouseUp]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        {priceBins.map((priceBin, index) => (
          <div key={index} className="group flex-1 h-12 flex items-end">
            <div
              className="flex-1 bg-neutral-content group-hover:bg-primary"
              style={{
                height: `${
                  (priceBin.length /
                    Math.max(...priceBins.map((i) => i.length))) *
                  100
                }%`,
              }}
            />
          </div>
        ))}
      </div>
      <div ref={priceRangeSliderRef} className="flex-1 relative pb-1">
        <div className="absolute top-1 w-full h-2 bg-neutral rounded" />
        <div
          ref={selectedPriceRangeSliderRef}
          className="absolute top-1 h-2 bg-neutral-content"
          style={{ left: 0, right: 0 }}
        />
        <button
          ref={leftRangeSliderButtonRef}
          onMouseDown={() => setLeftRangeSlideSelected(true)}
          className="absolute w-4 h-4 bg-primary rounded"
          style={{ left: 0 }}
        />
        <button
          ref={rightRangeSliderButtonRef}
          onMouseDown={() => setRightRangeSlideSelected(true)}
          className="absolute w-4 h-4 bg-primary rounded right-0"
        ></button>
      </div>
      <div className="flex flex-row justify-between">
        <p>{asCurrency(minPrice)}</p>
        <p>{asCurrency(maxPrice)}</p>
      </div>
    </div>
  );
};
