import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import Refinement from '../../hooks/userAirefinement';
import AILoading from './LoadingDots';
import ProgressButton from './ProgressButton';
import { useAITimeout } from '../utils/AITimeoutContext';

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

  const refinement = useMemo(() => new Refinement(), []);
  const [loadingAi, setLoadingAi] = useState(false);

  const {
    timeoutData,
    isAnyAILoading,
    setIsAnyAILoading,
    setAITimeout,
    hasActiveTimeout,
  } = useAITimeout();

  const textareaRef = useRef(null);
  useLayoutEffect(() => {
    if (!multiline) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [multiline, value]);

  const refinementText = async () => {
    if (loadingAi || isAnyAILoading || hasActiveTimeout) return;

    try {
      setIsAnyAILoading(true);
      setLoadingAi(true);

      const useTimeoutAi = await refinement.checkTimeout('REFINEMENT');
      if (useTimeoutAi?.howMuchLeft > 0) {
        setAITimeout(useTimeoutAi);
        return;
      }

      const res = await refinement.refinementRequirements(value, label);

      if (res != null && typeof res.refinementText === 'string') {
        onChange(res.refinementText);
        const newTimeout = await refinement.checkTimeout('REFINEMENT');
        if (newTimeout?.howMuchLeft > 0) {
          setAITimeout(newTimeout);
        }
      }
    } catch (err) {
      console.error('Error in refinementText:', err);
    } finally {
      setLoadingAi(false);
      setIsAnyAILoading(false);
    }
  };

  const isButtonDisabled =
    disabled || loadingAi || isAnyAILoading || hasActiveTimeout;

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
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder={placeholder}
              disabled={disabled || isAnyAILoading}
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
              disabled={disabled || isAnyAILoading}
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
          <ProgressButton
            onClick={refinementText}
            disabled={isButtonDisabled}
            loading={loadingAi}
            timeoutData={timeoutData}
            label={`Popraw przez AI: ${label}`}
          />
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

      {hasActiveTimeout && timeoutData && (
        <p className="text-xs text-gray-600">
          AI będzie dostępne za{' '}
          {Math.floor((timeoutData.howMuchLeft ?? 0) / 60)}:
          {String((timeoutData.howMuchLeft ?? 0) % 60).padStart(2, '0')}
        </p>
      )}
    </div>
  );
}
