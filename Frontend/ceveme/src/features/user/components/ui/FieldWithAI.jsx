import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import Refinement from '../../hooks/userAirefinement';
import AILoading from './LoadingDots'; // ⬅ nowa animacja

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
  aiButton = false,
  isEditing,
}) {
  const described = `${id}-desc`;
  const errorId = `${id}-err`;
  const baseInput =
    'w-full rounded-xl border border-cloudlight bg-basewhite text-slatedark px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-feedbackfocus';
  const refinement = new Refinement();
  const [loadingAi, setLoadingAi] = useState(false);

  const refinementText = async () => {
    if (loadingAi) return;
    try {
      setLoadingAi(true);
      const res = await refinement.refinementRequirements(value, label);

      if (res != null) {
        onChange(res.refinementText);
      }
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
        <div className="relative">
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
              disabled={disabled || loadingAi}
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
              disabled={disabled || loadingAi}
              aria-invalid={!!error}
              aria-describedby={`${described} ${error ? errorId : ''}`}
              className={baseInput}
            />
          )}

          <div
            className={[
              'absolute inset-0 flex items-center justify-center rounded-xl bg-basewhite/75',
              'transition-[opacity,backdrop-filter] duration-[2000ms] ease-out',
              'will-change-[opacity,backdrop-filter]',
              loadingAi
                ? 'opacity-100 backdrop-blur-sm pointer-events-auto'
                : 'opacity-0 backdrop-blur-0 pointer-events-none',
            ].join(' ')}
            aria-hidden={!loadingAi}
            style={{ zIndex: 2 }}
          >
            <AILoading />
          </div>
        </div>

        {aiButton && isEditing && (
          <button
            type="button"
            onClick={refinementText}
            disabled={disabled || loadingAi}
            className={`${
              loadingAi
                ? 'bg-gray-400 cursor-not-allowed text-white '
                : 'bg-manilla'
            } inline-flex items-center gap-2 rounded-2xl text-slatedark px-3 py-2 hover:opacity-90 focus:ring-2 focus:ring-feedbackfocus`}
            aria-label={`Popraw przez AI: ${label}`}
            title="Popraw przez AI"
          >
            <Wand2 size={20} strokeWidth={2} />
            <span className="text-sm font-semibold">
              {loadingAi ? 'Generowanie…' : 'Ulepsz z AI'}
            </span>
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
