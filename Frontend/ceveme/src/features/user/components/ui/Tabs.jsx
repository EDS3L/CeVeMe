/* eslint-disable no-unused-vars */
import React from 'react';

export default function Tabs({ tabs, active, onChange }) {
  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.key === active);
    if (e.key === 'ArrowRight') {
      onChange(tabs[(i + 1) % tabs.length].key);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      onChange(tabs[(i - 1 + tabs.length) % tabs.length].key);
      e.preventDefault();
    } else if (e.key === 'Home') {
      onChange(tabs[0].key);
      e.preventDefault();
    } else if (e.key === 'End') {
      onChange(tabs[tabs.length - 1].key);
      e.preventDefault();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Zakładki"
      onKeyDown={onKeyDown}
      className="flex flex-wrap gap-2 p-3 border-b border-cloudlight"
    >
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          aria-controls={`panel-${key}`}
          id={`tab-${key}`}
          onClick={() => onChange(key)}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border
            ${
              active === key
                ? 'bg-manilla border-kraft'
                : 'bg-transparent border-cloudlight hover:bg-ivorymedium/60'
            }`}
        >
          <Icon size={20} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  );
}
