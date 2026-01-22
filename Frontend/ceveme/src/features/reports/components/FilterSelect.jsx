const FilterSelect = ({ label, value, onChange, options, placeholder }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-clouddark)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2.5 rounded-lg border border-[var(--color-ivorydark)] bg-[var(--color-basewhite)] text-[var(--color-slatedark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-kraft)]/50 focus:border-[var(--color-kraft)] transition-all duration-200 cursor-pointer hover:border-[var(--color-cloudlight)]"
      >
        <option value="%">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
