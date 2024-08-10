import { NumberSpec, Spec } from "../../types.js";

interface SpecFilterProps {
  specName: string;
  spec: Spec;
  onChange?: (value: any) => void;
  value?: any;
}

const NumberSpecFilter = ({
  specName,
  spec,
  onChange,
  value,
}: {
  specName: string;
  spec: NumberSpec;
  onChange?: (value: number) => void;
  value?: number;
}) => {
  const min = Math.min(...spec.variants);
  const max = Math.max(...spec.variants);

  return (
    <div
      key={specName}
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0px 10px",
      }}
    >
      <label>{specName}</label>
      <input
        type="range"
        step={100}
        min={min}
        max={max}
        onChange={(e) => onChange?.(Number(e.target.value))}
        value={value}
      />
    </div>
  );
};

export const SpecFilter = ({
  specName,
  spec,
  onChange,
  value,
}: SpecFilterProps) => {
  if (spec.type === "number") {
    return (
      <NumberSpecFilter
        spec={spec}
        specName={specName}
        onChange={onChange}
        value={value}
      />
    );
  }

  return (
    <div className="flex justify-between">
      <label>{specName}</label>
      <select onChange={(e) => onChange?.(e.target.value)} value={value}>
        <option value="">Show All</option>
        {spec.variants
          .filter((variant) => !!variant)
          .map((variant, i) => (
            <option key={`${variant.toString()}-${i}`}>{variant}</option>
          ))}
      </select>
    </div>
  );
};
