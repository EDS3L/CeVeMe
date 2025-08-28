import React, { useEffect, useState } from 'react';
import UserDetailsInfo from '../hooks/useUserDeailsInfo';

export default function EditContactModal({
  open,
  onClose,
  currentValue = '',
  onSaved,
  fieldLabel = 'E-mail',
  fieldType = 'email',
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

  const validate = () => {
    if (fieldType === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return 'Nieprawidłowy format e-mail';
      if (value !== confirm) return 'E-maile nie są zgodne';
    } else {
      if (!value.trim()) return 'Pole nie może być puste';
      if (value !== confirm) return 'Wartości nie są zgodne';
    }
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
      if (fieldType === 'email') {
        const res = await userDetailsInfo.changeEmail(value);
        document.cookie =
          'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.clear();
        window.location.href = '/';
        if (!res) throw new Error('Błąd serwera');
      } else {
        const res = await userDetailsInfo.changeEmail(value);
        if (!res) throw new Error('Błąd serwera');
      }

      onSaved?.(value);
      onClose();
    } catch (err) {
      setError(err?.message || 'Błąd zapisu, spróbuj ponownie');
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
          Wprowadź nową wartość i potwierdź.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-cloudmedium">
              Nowy {fieldLabel}
            </label>
            <input
              type={fieldType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
              placeholder={fieldType === 'email' ? 'nowy@przyklad.com' : ''}
            />
          </div>

          <div>
            <label className="text-xs text-cloudmedium">Potwierdź</label>
            <input
              type={fieldType}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
              placeholder={fieldType === 'email' ? 'powtórz e-mail' : ''}
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
              saving ? 'bg-gray-400' : 'bg-bookcloth hover:opacity-95'
            }`}
          >
            {saving ? 'Zapis...' : `Zapisz ${fieldLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}
