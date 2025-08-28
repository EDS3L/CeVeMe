import React, { useEffect, useState } from 'react';
import { X, UploadCloud, Trash2, Check } from 'lucide-react';
import userPNG from '../../../../public/user.png';

export default function EditAvatarModal({
  open,
  onClose,
  currentAvatar,
  onSaved,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentAvatar || userPNG);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setFile(null);
      setPreview(currentAvatar || userPNG);
      setError('');
      setSaving(false);
    }
  }, [open, currentAvatar]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Wybierz plik obrazu.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(userPNG);
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      // przekazujemy zarówno preview (do natychmiastowego UI) jak i plik (do uploadu)
      onSaved?.(preview, file);
      onClose();
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
          <h3 className="text-lg font-semibold">Zmień zdjęcie profilowe</h3>
          <button onClick={onClose} className="text-cloudmedium px-2">
            <X />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-ivorymedium border">
              <img
                src={preview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-cloudmedium text-center">
              Podgląd avatara. Jeśli nie wybierzesz pliku, zostanie użyty
              domyślny.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Wybierz obraz"
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ivorymedium text-slatedark hover:opacity-95">
                <UploadCloud />
                <span className="text-sm font-medium">Wybierz plik</span>
              </div>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-manilla text-slatedark"
              >
                <Trash2 />
                Usuń
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-basewhite ${
                  saving ? 'bg-gray-400' : 'bg-bookcloth hover:opacity-95'
                }`}
              >
                {saving ? (
                  'Zapis...'
                ) : (
                  <>
                    <Check />
                    Zapisz zdjęcie
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-feedbackerror mt-2">{error}</p>
            )}

            <p className="text-xs text-cloudmedium mt-4">
              Obsługiwane formaty: JPG, PNG. Max rozmiar: zależny od backendu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
