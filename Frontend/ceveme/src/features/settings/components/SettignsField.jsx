export default function SettignsField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  multiline = false,
  help,
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
        <div className="relative">
          {multiline ? (
            <textarea
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder={placeholder}
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
              aria-invalid={!!error}
              aria-describedby={`${described} ${error ? errorId : ''}`}
              className={baseInput}
            />
          )}
        </div>
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
