import { createRef, useCallback, useEffect, useState } from "react";

import { asCurrency } from "../../utils/currency.js";
import { useBinnedPriceRange } from "../../hooks/usePriceRangeFilter.js";

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};

const calculatePriceBinRange = (
  priceRangeSlider: HTMLDivElement,
  selectedRangeSlider: HTMLDivElement,
  numberOfBins: number
): [number, number] => {
  const sliderWidth = priceRangeSlider.clientWidth;
  const { left, right } = selectedRangeSlider.style;

  const relativeBinSize = 1 / numberOfBins;
  const leftBinIndex = Math.floor(
    parseFloat(left.substring(0, left.length - 2)) /
      sliderWidth /
      relativeBinSize
  );
  const rightBinIndex = Math.floor(
    (1 - parseFloat(right.substring(0, right.length - 2)) / sliderWidth) /
      relativeBinSize
  );

  return [leftBinIndex, clamp(rightBinIndex, 0, numberOfBins - 1)];
};

interface PriceFilterProps {
  prices: number[];
  onFilterChange?: (min: number, max: number) => void;
}

export const PriceFilter = (props: PriceFilterProps) => {
  const priceRangeSliderRef = createRef<HTMLDivElement>();
  const selectedPriceRangeSliderRef = createRef<HTMLDivElement>();
  const leftRangeSliderButtonRef = createRef<HTMLButtonElement>();
  const rightRangeSliderButtonRef = createRef<HTMLButtonElement>();

  const [leftBinIndex, setLeftBinIndex] = useState(0);
  const [rightBinIndex, setRightBinIndex] = useState(0);
  const [leftRangeSliderSelected, setLeftRangeSlideSelected] = useState(false);
  const [rightRangeSliderSelected, setRightRangeSlideSelected] =
    useState(false);

  const {
    minPrice,
    maxPrice,
    averagePriceDifference,
    priceBins,
    largestBinSize,
  } = useBinnedPriceRange(props.prices);

  useEffect(() => {
    setLeftBinIndex(0);
    setRightBinIndex(priceBins.length - 1);
  }, [priceBins])

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

    const [leftBinIndex, rightBinIndex] = calculatePriceBinRange(
      priceRangeSliderRef.current,
      selectedPriceRangeSliderRef.current,
      priceBins.length
    );

    const leftBin = priceBins[leftBinIndex];
    const rightBin = priceBins[rightBinIndex];

    setLeftBinIndex(leftBinIndex);
    setRightBinIndex(rightBinIndex);

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
        {priceBins.map((priceBin, index) => {
          const indexSelected = index >= leftBinIndex && index <= rightBinIndex;
          return (
            <div key={index} className="group flex-1 h-12 flex items-end">
              <div
                className={`flex-1 ${
                  indexSelected ? "bg-neutral-content" : "bg-neutral"
                }`}
                style={{
                  height: `${(priceBin.length / largestBinSize) * 100}%`,
                }}
              />
            </div>
          );
        })}
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
        <p>{asCurrency(priceBins[leftBinIndex]?.[0])}</p>
        <p>
          {asCurrency(
            priceBins[rightBinIndex]?.[priceBins[rightBinIndex]?.length - 1]
          )}
        </p>
      </div>
    </div>
  );
};
