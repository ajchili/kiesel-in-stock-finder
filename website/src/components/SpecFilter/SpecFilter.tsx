interface SpecFilterProps {
  specName: string;
  variants: string[];
  onChange?: (value: string) => void;
  value?: string;
}

export const SpecFilter = ({
  specName,
  variants,
  onChange,
  value = "",
}: SpecFilterProps) => {
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
      <select onChange={(e) => onChange?.(e.target.value)} value={value}>
        <option value="">Show All</option>
        {variants
          .filter((variant) => !!variant)
          .map((variant) => (
            <option>{variant}</option>
          ))}
      </select>
    </div>
  );
};
