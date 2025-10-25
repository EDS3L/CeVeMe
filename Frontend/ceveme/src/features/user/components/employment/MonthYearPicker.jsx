import { useMemo } from 'react';

function pad2(n) {
  return String(n).padStart(2, '0');
}

export default function MonthYearPicker({
  id,
  value, // np. "2025-10-01" albo "2025-10" albo ""
  onChange, // (isoDateString) => void, np. "2025-10-01"
  disabled = false,
  min = '1900-01', // opcjonalnie: "YYYY-MM"
  max = '2100-12', // opcjonalnie: "YYYY-MM"
  locale = 'pl-PL',
  className = '',
}) {
  // Parsowanie wartości wejsciowej
  const [initYear, initMonth] = (() => {
    if (!value) return ['', ''];
    const v = value.slice(0, 7); // "YYYY-MM"
    const [y, m] = v.split('-');
    return [y || '', m || ''];
  })();

  // Zakres lat (z min/max)
  const { minY, minM, maxY, maxM } = useMemo(() => {
    const [minYear, minMonth] = (min || '1900-01').split('-').map(Number);
    const [maxYear, maxMonth] = (max || '2100-12').split('-').map(Number);
    return { minY: minYear, minM: minMonth, maxY: maxYear, maxM: maxMonth };
  }, [min, max]);

  const years = useMemo(() => {
    const arr = [];
    for (let y = minY; y <= maxY; y++) arr.push(y);
    return arr;
  }, [minY, maxY]);

  // Lokalizowane nazwy miesięcy
  const monthLabels = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i, 1).toLocaleString(locale, { month: 'long' })
      ),
    [locale]
  );

  function handleYearChange(e) {
    const y = e.target.value;
    const m = initMonth || pad2(Math.max(1, minM));
    if (!y) return onChange?.('');
    commit(y, m);
  }

  function handleMonthChange(e) {
    // dodatkowa ochrona — jeśli brak roku, ignoruj
    if (!initYear) return;
    const m = e.target.value;
    const y = initYear || String(minY);
    if (!m) return onChange?.('');
    commit(y, m);
  }

  function commit(y, m) {
    // Wymuś min/max (np. 2024-01 <-> 2026-12)
    let yy = Number(y);
    let mm = Number(m);
    if (yy < minY || (yy === minY && mm < minM)) {
      yy = minY;
      mm = Math.max(mm, minM);
    }
    if (yy > maxY || (yy === maxY && mm > maxM)) {
      yy = maxY;
      mm = Math.min(mm, maxM);
    }
    onChange?.(`${yy}-${pad2(mm)}-01`);
  }

  // Filtruj miesiące w skrajnych latach
  function monthDisabled(y, m) {
    const yy = Number(y),
      mm = Number(m);
    if (!yy || !mm) return false;
    if (yy === minY && mm < minM) return true;
    if (yy === maxY && mm > maxM) return true;
    return false;
  }

  const isMonthDisabled = disabled || !initYear;

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        id={`${id}-year`}
        value={initYear}
        onChange={handleYearChange}
        disabled={disabled}
        className="rounded-xl border border-cloudlight bg-basewhite px-3 py-2"
      >
        <option value="">Rok</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        id={`${id}-month`}
        value={initMonth}
        onChange={handleMonthChange}
        disabled={isMonthDisabled}
        aria-disabled={isMonthDisabled}
        tabIndex={isMonthDisabled ? -1 : 0}
        className={
          `rounded-xl border border-cloudlight bg-basewhite px-3 py-2 ` +
          (isMonthDisabled ? 'opacity-60 cursor-not-allowed' : '')
        }
      >
        <option value="">Miesiąc</option>
        {Array.from({ length: 12 }, (_, i) => {
          const mVal = pad2(i + 1);
          const disabledOpt = monthDisabled(initYear, i + 1);
          const label =
            monthLabels[i][0].toUpperCase() + monthLabels[i].slice(1);
          return (
            <option key={mVal} value={mVal} disabled={disabledOpt}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
