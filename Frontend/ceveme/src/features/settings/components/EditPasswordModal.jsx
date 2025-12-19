import React, { useState, useEffect } from 'react';
import UserDetailsInfo from '../hooks/useUserDeailsInfo';
import UserService from '../../../hooks/UserService';
import { Eye, EyeOff } from 'lucide-react';

export default function EditPasswordModal({ open, onClose }) {
  const [oldPass, setOldPass] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const userService = new UserService();
  const token = userService.getCookie('accessToken'); //zobacz czyjest taka nazwa, ja mam rece ujebanw bo jem
  const email = userService.getEmailFromToken(token);

  useEffect(() => {
    if (open) {
      setPass('');
      setConfirm('');
      setShowCurrentPass(false);
      setShowPass(false);
      setShowConfirmPass(false);
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
    setSaving(true);
    setError('');
    try {
      const useDetailsInfo = new UserDetailsInfo();
      const res = await useDetailsInfo.changePassowrd(email, pass, oldPass);
      return res;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message;
      setError(msg);
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

        <div className="grid gap-3 md:grid-cols-1">
          <div>
            <label className="text-xs text-cloudmedium">Akutalne hasło</label>
            <div className="mt-1 relative">
              <input
                id="currentPasswordInput"
                type={showCurrentPass ? 'text' : 'password'}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass((s) => !s)}
                className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-cloudmedium"
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-cloudmedium">Nowe hasło</label>
            <div className="mt-1 relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => showPass((s) => !s)}
                className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-cloudmedium"
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-cloudmedium">Potwierdź hasło</label>
            <input
              type={showConfirmPass ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-feedbackfocus"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass((s) => !s)}
              className="absolute cursor-pointer right-8 top-2/3 text-cloudmedium"
            >
              {showConfirmPass ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <p className="text-xs text-cloudmedium mt-2">Min. 8 znaków.</p>
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
