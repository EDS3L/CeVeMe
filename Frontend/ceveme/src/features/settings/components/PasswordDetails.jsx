import { Lock, Phone, Save, ShieldAlert, User } from 'lucide-react';
import React, { useState } from 'react';
import EditPasswordModal from './EditPasswordModal';

function PasswordDetails() {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex gap-2">
          <ShieldAlert />
          <p className="text-lg font-bold">Hasło i zebezpieczenia</p>
        </div>
        <p className="text-sm text-gray-600">
          Zabezpiecz swoje konto za pomocą hasło i tokenu ukryteko w
          ciasteczkach.
        </p>
      </div>
      <div className="flex">
        <div className="flex gap-2 w-full">
          <div className="flex flex-col w-full">
            <div className="flex w-full gap-2 justify-around">
              <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-2xl w-full">
                <div className="flex items-center gap-2">
                  <Lock />
                  <div>
                    <p className="text-lg font-bold text-slatedark">Hasło</p>
                    <p>Pamiętaj - nigdy nie podawaj nikomu swojego hasła.</p>
                  </div>
                </div>
                <div>
                  <button
                    className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold"
                    type="button"
                    onClick={() => setOpenPasswordModal(true)}
                  >
                    Zapisz
                  </button>
                </div>
              </div>
              <div className="flex"></div>
            </div>
          </div>
        </div>
      </div>

      <EditPasswordModal
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </div>
  );
}

export default PasswordDetails;
