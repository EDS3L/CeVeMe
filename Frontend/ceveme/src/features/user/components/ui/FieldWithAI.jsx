import React from 'react';
import { Wand2 } from 'lucide-react';

export default function FieldWithAI({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  multiline = false,
  disabled = false,
  help,
  onImprove,
  aiButton = false,
}) {
  const described = `${id}-desc`;
  const errorId = `${id}-err`;
  const baseInput =
    'w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus';
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
        {multiline ? (
          <textarea
            id={id}
            ref={(el) => {
              if (el) {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
              }
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={`${described} ${error ? errorId : ''}`}
            className={`${baseInput} resize-none overflow-hidden`}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={`${described} ${error ? errorId : ''}`}
            className={baseInput}
          />
        )}
        {aiButton && (
          <button
            type="button"
            onClick={onImprove}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-cloudlight bg-manilla text-slatedark px-3 py-2 hover:opacity-90 focus:ring-2 focus:ring-feedbackfocus"
            aria-label={`Popraw przez AI: ${label}`}
            title="Popraw przez AI"
          >
            <Wand2 size={20} strokeWidth={2} />
            <span className="text-sm font-semibold">Popraw</span>
          </button>
        )}
      </div>
      {help ? (
        <p id={described} className="text-xs text-clouddark">
          {help}
        </p>
      ) : (
        <span id={described} className="sr-only">
          {' '}
        </span>
      )}
      {error ? (
        <p id={errorId} className="text-xs text-feedbackerror">
          {error}
        </p>
      ) : null}
    </div>
  );
}
