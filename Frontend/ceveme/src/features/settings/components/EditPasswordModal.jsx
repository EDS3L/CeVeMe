import React, { useState, useEffect } from 'react';

export default function EditPasswordModal({ open, onClose }) {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPass('');
      setConfirm('');
      setShow(false);
      setError('');
    }
  }, [open]);

  const validate = () => {
    if (pass.length < 8) return 'Hasło musi mieć min. 8 znaków';
    if (pass !== confirm) return 'Hasła nie są zgodne';
    return '';
  };

  const handleSave = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 700));
      onClose();
    } catch (err) {
      setError('Błąd zmiany hasła', err);
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
      <div className="relative z-10 w-full max-w-2xl bg-basewhite rounded-2xl shadow-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Zmień hasło</h3>
          <button onClick={onClose} className="text-cloudmedium px-2">
            Anuluj
          </button>
        </div>

        <p className="text-sm text-cloudmedium mb-4">
          Wprowadź nowe hasło i potwierdź je.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-cloudmedium">Nowe hasło</label>
            <div className="mt-1 relative">
              <input
                type={show ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-cloudmedium"
              >
                {show ? 'Ukryj' : 'Pokaż'}
              </button>
            </div>
            <p className="text-xs text-cloudmedium mt-2">Min. 8 znaków.</p>
          </div>

          <div>
            <label className="text-xs text-cloudmedium">Potwierdź hasło</label>
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
              placeholder="••••••••"
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
            {saving ? 'Zapis...' : 'Zapisz hasło'}
          </button>
        </div>
      </div>
    </div>
  );
}
