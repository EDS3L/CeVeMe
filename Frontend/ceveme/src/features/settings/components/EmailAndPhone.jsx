import React from 'react';
import FieldWithAI from '../../user/components/ui/FieldWithAI';
import { Phone } from 'lucide-react';

function EmailAndPhone() {
  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex gap-2">
          <Phone />
          <p className="text-lg font-bold">E-mail i telefon</p>
        </div>
        <p className="text-sm text-gray-600">
          Zarządzaj swoimi danymi kontaktowymi.
        </p>
      </div>
      <div className="flex">
        <div className="flex gap-2 w-full">
          <div className="flex flex-col w-full">
            <div className="flex w-full gap-2 justify-around">
              <div className="flex gap-2 w-1/2 p-3">
                <FieldWithAI label={'Email'}></FieldWithAI>
                <div className="flex items-end">
                  <button className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold items-end h-2/3">
                    Edytuj
                  </button>
                  <button className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold items-end h-2/3">
                    Zapisz
                  </button>
                </div>
              </div>
              <div className="flex gap-2 w-1/2 p-3">
                <FieldWithAI label={'Numer Telefonu'}></FieldWithAI>
                <div className="flex items-end">
                  <button className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold items-end h-2/3">
                    Edytuj
                  </button>
                  <button className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold items-end h-2/3">
                    Zapisz
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Chroń swoje dane.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailAndPhone;
