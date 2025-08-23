import React, { useState } from 'react';
import { Save, X as CancelIcon, Edit3 } from 'lucide-react';

export default function EditableText({
  value,
  onChange,
  placeholder = '',
  multiline = false,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value || '');

  const save = () => {
    onChange(temp);
    setIsEditing(false);
  };
  const cancel = () => {
    setTemp(value || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`flex items-start gap-2 w-full ${className}`}>
        {multiline ? (
          <textarea
            className="flex-1 p-2 border rounded resize-y focus:ring-2 focus:ring-indigo-300"
            rows={4}
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-300"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            placeholder={placeholder}
          />
        )}
        <div className="flex flex-col gap-1">
          <button onClick={save} title="Zapisz">
            <Save className="w-4 h-4 text-green-600 hover:text-green-800" />
          </button>
          <button onClick={cancel} title="Anuluj">
            <CancelIcon className="w-4 h-4 text-red-600 hover:text-red-800" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50 ${className}`}
    >
      <span className={value ? 'text-gray-900' : 'text-gray-400'}>
        {value || placeholder}
      </span>
      <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
    </div>
  );
}
