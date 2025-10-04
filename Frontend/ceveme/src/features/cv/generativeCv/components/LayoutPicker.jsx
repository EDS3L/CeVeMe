import React from 'react';
import MiniCvPreview from './MiniCvPreview';

export default function LayoutPicker({ layouts, value, onChange, cvData }) {
  const current = layouts.find((l) => l.value === value) || layouts[0];

  return (
    <div className="w-full">
      {/* Segmented group */}
      <div
        className="inline-flex p-1 rounded-lg bg-[var(--color-ivorydark)]/50 border border-[color:rgba(0,0,0,0.06)]
                   shadow-sm"
        role="tablist"
        aria-label="Wybór formatu CV"
      >
        {layouts.map((l) => {
          const active = l.value === value;
          return (
            <button
              key={l.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(l.value)}
              className={[
                'px-4 py-2 rounded-md text-sm font-semibold transition',
                active
                  ? 'bg-[var(--color-basewhite)] text-[var(--color-slatedark)] shadow'
                  : 'text-[var(--color-clouddark)] hover:bg-[var(--color-ivorylight)]',
              ].join(' ')}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Opis + mini preview */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-slatedark)]">
              {current.label}
            </h3>
            {current.badge && (
              <span
                className="inline-block text-[10px] uppercase tracking-wide
                               bg-[var(--color-manilla)] text-[var(--color-slatedark)]
                               px-2 py-0.5 rounded"
              >
                {current.badge}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-clouddark)]">
            {current.desc}
          </p>
        </div>

        <div className="justify-self-end">
          <MiniCvPreview
            component={current.component}
            cvData={cvData}
            width={340}
          />
        </div>
      </div>
    </div>
  );
}
