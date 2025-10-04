import React from 'react';
import { X } from 'lucide-react';
import EditableText from '../components/EditableText';

export default function CertificateItem({
  cert,
  onChange,
  onRemove,
  onToggleVisible,
}) {
  return (
    <div className="p-3 border rounded relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500"
      >
        <X className="w-4 h-4" />
      </button>
      <label className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={cert.visible !== false}
          onChange={(e) => onToggleVisible(e.target.checked)}
        />
        <span className="text-xs text-gray-500">Pokaż w CV</span>
      </label>
      <EditableText
        value={cert.name}
        onChange={(v) => onChange('name', v)}
        placeholder="Nazwa certyfikatu"
        className="font-semibold mb-1"
      />
      <EditableText
        value={cert.issuer}
        onChange={(v) => onChange('issuer', v)}
        placeholder="Wystawca"
        className="mb-1"
      />
      <EditableText
        value={cert.date}
        onChange={(v) => onChange('date', v)}
        placeholder="Data (np. 2023-05)"
      />
      <EditableText
        value={cert.description || ''}
        onChange={(v) => onChange('description', v)}
        placeholder="Opis certyfikatu"
        className="mb-1"
      />
    </div>
  );
}
