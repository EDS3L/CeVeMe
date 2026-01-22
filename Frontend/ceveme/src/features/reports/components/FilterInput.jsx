const FilterInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-clouddark)]">
        {label}
      </label>
      <input
        type={type}
        value={value === "%" ? "" : value}
        onChange={(e) => onChange(e.target.value || "%")}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-lg border border-[var(--color-ivorydark)] bg-[var(--color-basewhite)] text-[var(--color-slatedark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-kraft)]/50 focus:border-[var(--color-kraft)] transition-all duration-200 placeholder:text-[var(--color-cloudlight)]"
      />
    </div>
  );
};

export default FilterInput;
