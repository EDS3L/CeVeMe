import React from 'react';
import ActivateAccountForm from '../components/ActivateAccountForm';

export default function ActivateAccount() {
  return (
    <div className="bg-manilla min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slatemedium rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ivorylight">
            Aktywuj swoje konto
          </h1>
          <p className="text-cloudmedium mt-2">
            Wklej otrzymany kod aktywacyjny lub poproś o jego ponowne wysłanie.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-6">
            <ActivateAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
