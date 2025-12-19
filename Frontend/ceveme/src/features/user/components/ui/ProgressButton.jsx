import React from 'react';
import { Wand2, Clock } from 'lucide-react';

const ProgressButton = ({
  onClick,
  disabled,
  loading,
  timeoutData,
  label,
  className = '',
}) => {
  const totalTimeout = 120;
  const timeLeft = Math.max(0, Number(timeoutData?.howMuchLeft ?? 0));
  const hasTimeout = timeLeft > 0;

  const clampedLeft = Math.min(timeLeft, totalTimeout);
  const progressPercent = hasTimeout
    ? ((totalTimeout - clampedLeft) / totalTimeout) * 100
    : 0;

  const isDisabled = disabled || loading || hasTimeout;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, '0')}`
      : `${secs}s`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative overflow-hidden
        inline-flex items-center gap-2 rounded-2xl px-3 py-2
        text-sm font-semibold
        hover:opacity-90 focus:ring-2 focus:ring-feedbackfocus
        transition-colors duration-200
        ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-manilla text-slatedark'
        }
        ${className}
      `}
      aria-label={`${label}${
        hasTimeout ? ` – Dostępne za ${formatTime(timeLeft)}` : ''
      }`}
      title={hasTimeout ? `Dostępne za ${formatTime(timeLeft)}` : 'Ulepsz z AI'}
    >
      {hasTimeout && (
        <div
          className="absolute inset-0 bg-gray-500/20 transition-transform duration-1000 ease-linear"
          style={{
            transform: `translateX(-${100 - progressPercent}%)`,
            transformOrigin: 'left',
          }}
        />
      )}

      <div className="relative z-10 flex items-center gap-2">
        {hasTimeout ? (
          <>
            <Clock size={20} strokeWidth={2} />
            <span>{formatTime(timeLeft)}</span>
          </>
        ) : (
          <>
            <Wand2 size={20} strokeWidth={2} />
            <span>{loading ? 'Generowanie…' : 'Ulepsz z AI'}</span>
          </>
        )}
      </div>
    </button>
  );
};

export default ProgressButton;
