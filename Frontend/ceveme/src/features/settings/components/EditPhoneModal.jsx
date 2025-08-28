import React, { useEffect, useState } from 'react';
import UserDetailsInfo from '../hooks/useUserDeailsInfo';

export default function EditPhoneModal({
  open,
  onClose,
  currentValue = '',
  onSaved,
  fieldLabel = 'Numer telefonu',
}) {
  const [value, setValue] = useState(currentValue);
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(currentValue || '');
      setConfirm('');
      setError('');
    }
  }, [open, currentValue]);

  const validatePhone = (v) => {
    const cleaned = v.replace(/[^\d+]/g, '');
    return cleaned.length >= 6;
  };

  const validate = () => {
    if (!validatePhone(value)) return 'Nieprawidłowy numer telefonu';
    if (value !== confirm) return 'Numery nie są zgodne';
    return '';
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    setError('');
    try {
      const userDetailsInfo = new UserDetailsInfo();
      const res = await userDetailsInfo.changePhoneNumber(value);
      if (!res) throw new Error('Błąd serwera');
      onSaved?.(value);
      onClose();
    } catch (err) {
      setError(err?.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl bg-basewhite rounded-2xl shadow-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edytuj {fieldLabel}</h3>
          <button onClick={onClose} className="text-cloudmedium px-2">
            Anuluj
          </button>
        </div>

        <p className="text-sm text-cloudmedium mb-4">
          Wprowadź nowy numer i potwierdź go.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-cloudmedium">Nowy numer</label>
            <input
              type="tel"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
              placeholder="+48 600 000 000"
            />
          </div>

          <div>
            <label className="text-xs text-cloudmedium">Potwierdź</label>
            <input
              type="tel"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
              placeholder="+48 600 000 000"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-feedbackerror">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-ivorymedium text-slatedark"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-basewhite ${
              saving
                ? 'bg-gray-400'
                : 'bg-manilla text-slatedark hover:opacity-95'
            }`}
          >
            {saving ? 'Zapis...' : `Zapisz ${fieldLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}
