import React, { useCallback } from 'react';

const TemplateCard = ({ template, onSelect }) => {
  const handleSelect = useCallback(
    () => onSelect(template),
    [onSelect, template]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    },
    [handleSelect]
  );

  // Ile sekcji pokazujemy „na wierzchu”
  const VISIBLE_SECTIONS = 6;
  const extraCount = Math.max(
    0,
    (template.sections?.length || 0) - VISIBLE_SECTIONS
  );

  return (
    <div
      className="cv-card relative h-full flex flex-col rounded-xl border border-[var(--color-cloudlight)] bg-[var(--color-ivorylight)] p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--color-feedbackfocus)] focus-within:ring-offset-2"
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      aria-label={`Wybierz szablon ${template.title}`}
      aria-describedby={`desc-${template.key}`}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base md:text-lg font-semibold text-[var(--color-slatedark)] leading-snug break-words">
          {template.title}
        </h3>
        <p className="mt-1 text-xs md:text-sm text-[var(--color-clouddark)] break-words">
          {template.style}
        </p>
      </div>

      {/* Content (scrollowalny, żeby nic się nie „wylewało”) */}
      <div
        id={`desc-${template.key}`}
        className="flex-1 min-h-[120px] max-h-[220px] overflow-y-auto pr-1"
      >
        <p className="text-sm md:text-[15px] leading-relaxed text-[var(--color-slatedark)] whitespace-pre-wrap break-words">
          {template.description}
        </p>

        <div className="mt-3">
          <strong className="block text-[11px] md:text-xs uppercase tracking-wide text-[var(--color-clouddark)]">
            Sekcje
          </strong>

          <ul className="mt-2 flex flex-wrap gap-1.5">
            {(template.sections || [])
              .slice(0, VISIBLE_SECTIONS)
              .map((s, i) => (
                <li
                  key={i}
                  className="px-2 py-1 text-xs rounded-md border border-[var(--color-cloudlight)] bg-[var(--color-ivorydark)] text-[var(--color-slatedark)]"
                  title={s}
                >
                  {s}
                </li>
              ))}
            {extraCount > 0 && (
              <li className="px-2 py-1 text-xs rounded-md bg-[var(--color-bookcloth)]/10 text-[var(--color-bookcloth)] border border-[var(--color-bookcloth)]/20">
                +{extraCount} więcej
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* CTA przyklejony do dołu karty */}
      <div className="pt-3 mt-3 border-t border-[var(--color-cloudlight)]">
        <button
          className="w-full rounded-lg bg-[var(--color-bookcloth)] text-[var(--color-ivorylight)] text-sm md:text-[15px] font-medium py-2.5 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)] focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
        >
          Użyj szablonu
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
