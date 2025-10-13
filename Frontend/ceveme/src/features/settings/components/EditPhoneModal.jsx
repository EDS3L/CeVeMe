import React, { useEffect, useState } from 'react';
import UserDetailsInfo from '../hooks/useUserDeailsInfo';

const formatPL = (digits) => {
  const d = (digits || '').replace(/\D/g, '').slice(0, 9);
  return d.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

const extractNationalDigits = (input) => {
  const onlyDigits = (input || '').replace(/\D/g, '');
  return onlyDigits.slice(-9);
};

export default function EditPhoneModal({
  open,
  onClose,
  currentValue = '',
  onSaved,
  fieldLabel = 'Numer telefonu',
}) {
  const [national, setNational] = useState('');
  const [confirmNational, setConfirmNational] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setNational(extractNationalDigits(currentValue));
      setConfirmNational('');
      setError('');
    }
  }, [open, currentValue]);

  const validate = () => {
    if (national.length !== 9)
      return 'Nieprawidłowy numer telefonu (wpisz 9 cyfr).';
    if (national !== confirmNational) return 'Numery nie są zgodne.';
    return '';
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const formattedToSave = `+48 ${formatPL(national)}`;

    setSaving(true);
    setError('');
    try {
      const userDetailsInfo = new UserDetailsInfo();
      const res = await userDetailsInfo.changePhoneNumber(formattedToSave);
      if (!res) throw new Error('Błąd serwera');
      onSaved?.(formattedToSave);
      onClose();
    } catch (err) {
      setError(err?.message || 'Wystąpił błąd');
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
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cloudmedium pointer-events-none">
                +48
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={formatPL(national)}
                onChange={(e) =>
                  setNational(extractNationalDigits(e.target.value))
                }
                className="w-full rounded-lg border px-3 py-2 pl-14 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
                placeholder="600 000 000"
                aria-label="Nowy numer telefonu (9 cyfr)"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-cloudmedium">Potwierdź</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cloudmedium pointer-events-none">
                +48
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={formatPL(confirmNational)}
                onChange={(e) =>
                  setConfirmNational(extractNationalDigits(e.target.value))
                }
                className="w-full rounded-lg border px-3 py-2 pl-14 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
                placeholder="600 000 000"
                aria-label="Potwierdź numer telefonu (9 cyfr)"
              />
            </div>
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
