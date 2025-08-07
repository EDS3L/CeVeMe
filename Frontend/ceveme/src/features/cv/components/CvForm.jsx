import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function CvForm({
  offerLink,
  setOfferLink,
  onGenerate,
  loading,
  error,
}) {
  return (
    <div className="w-full max-w-lg bg-ivorylight p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-slatedark mb-2">Wygeneruj CV</h1>
      <p className="text-cloudmedium mb-6">
        Wklej link do oferty pracy, a my dopasujemy do niej Twoje CV.
      </p>
      <div className="space-y-4">
        <Input
          type="text"
          value={offerLink}
          onChange={(e) => setOfferLink(e.target.value)}
          placeholder="np. https://nofluffjobs.com/job/..."
        />
        <Button onClick={onGenerate} disabled={loading} className="w-full">
          {/* {loading ? <Spinner /> : 'Generuj CV'} */}
        </Button>
      </div>
      {error && <Alert message={error} type="error" className="mt-6" />}
    </div>
  );
}
