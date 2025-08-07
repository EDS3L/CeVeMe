import React from 'react';
import LinkInput from './LinkInput';

export default function CvForm({
  offerLink,
  setOfferLink,
  onGenerate,
  loading,
  error,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate();
      }}
      className="space-y-6 w-full max-w-lg bg-gray-50 p-8 rounded-lg shadow"
    >
      <LinkInput
        value={offerLink}
        onChange={(e) => setOfferLink(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? 'Generowanie…' : 'Generuj CV'}
      </button>
    </form>
  );
}
