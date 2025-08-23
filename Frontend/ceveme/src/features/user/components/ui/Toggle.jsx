import React from 'react';

export default function Toggle({ id, label, checked, onChange, disabled }) {
  return (
    <label
      htmlFor={id}
      className="grid grid-cols-[auto_1fr] items-center gap-3"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <span
        aria-hidden="true"
        className={`inline-flex w-11 h-6 items-center rounded-full border border-cloudlight p-[2px] transition ${
          checked ? 'bg-bookcloth' : 'bg-cloudlight/40'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-basewhite transition ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}
