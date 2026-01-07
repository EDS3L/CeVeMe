import React, { memo, useState, useCallback } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Search, Loader2 } from "lucide-react";

const SearchInput = memo(({ value, onChange, loading }) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useDebounce((newValue) => {
    onChange(newValue);
  }, 400);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange]
  );

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? (
          <Loader2 className="w-5 h-5 text-clouddark animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-clouddark" />
        )}
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Wyszukaj stanowisko, firmę, miasto..."
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate/20 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slatedark placeholder:text-clouddark"
        aria-label="Wyszukiwanie ofert pracy"
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;
