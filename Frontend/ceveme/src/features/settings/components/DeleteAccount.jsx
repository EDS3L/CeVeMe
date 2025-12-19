import { Lock, ShieldAlert, Trash } from 'lucide-react';
import React from 'react';

function DeleteAccount() {
  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex gap-2">
          <Trash />
          <p className="text-lg font-bold">Usuń konto</p>
        </div>
        <p className="text-sm text-gray-600">
          Usunięcie konta jest nieodwracalne
        </p>
      </div>
      <div className="flex p-3">
        <button className="text-white font-bold cursor-pointer bg-rose-600 hover:bg-rose-800 p-2 rounded-2xl">
          Usuń konto
        </button>
      </div>
    </div>
  );
}

export default DeleteAccount;
