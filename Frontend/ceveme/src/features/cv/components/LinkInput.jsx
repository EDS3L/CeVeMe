// components/LinkInput.jsx
import React from 'react';
import { Link2 } from 'lucide-react';

export default function LinkInput({ value, onChange }) {
  return (
    <div className="border-2 border-dashed border-gray-300 p-5 rounded-lg bg-white hover:border-indigo-400 focus-within:border-indigo-500 transition-all">
      <label
        htmlFor="offerLink"
        className="flex items-center text-gray-700 mb-2 select-none"
      >
        <Link2 className="mr-2" size={20} />
        Link do oferty pracy
      </label>
      <input
        id="offerLink"
        type="url"
        value={value}
        onChange={onChange}
        placeholder="https://www.przyklad.pl/oferta-pracy"
        className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
      />
      <p className="text-xs text-gray-500 mt-3">
        Wklej tutaj link do ogłoszenia, a Twoje CV zostanie wygenerowane pod
        kątem wymagań oferty.
      </p>
    </div>
  );
}
