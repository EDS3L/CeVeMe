import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import EditContactModal from './EditContactModal';
import EditPhoneModal from './EditPhoneModal';
import SettignsField from './SettignsField';

function EmailAndPhone({ data = {} }) {
  const [form, setForm] = useState({
    phoneNumber: data.phoneNumber || '',
    email: data.email || '',
  });

  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);

  useEffect(() => {
    setForm({
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
    });
  }, [data]);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailSaved = (newEmail) => {
    setForm((prev) => ({ ...prev, email: newEmail }));
  };

  const handlePhoneSaved = (newPhone) => {
    setForm((prev) => ({ ...prev, phoneNumber: newPhone }));
  };

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
                <SettignsField
                  label="Email"
                  value={form.email}
                  onChange={handleChange('email')}
                ></SettignsField>
                <div className="flex items-end">
                  <button
                    className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold items-end h-2/3"
                    type="button"
                    onClick={() => setOpenEmailModal(true)}
                  >
                    Edytuj
                  </button>
                </div>
              </div>
              <div className="flex gap-2 w-1/2 p-3">
                <SettignsField
                  label="Numer Telefonu"
                  value={form.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                ></SettignsField>
                <div className="flex items-end">
                  <button
                    className="text-center bg-slatelight p-3 rounded-2xl text-white font-bold items-end h-2/3"
                    type="button"
                    onClick={() => setOpenPhoneModal(true)}
                  >
                    Edytuj
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Chroń swoje dane.</p>
          </div>
        </div>
      </div>

      <EditContactModal
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        currentValue={form.email}
        onSaved={handleEmailSaved}
        fieldLabel="E-mail"
        fieldType="email"
      />

      <EditPhoneModal
        open={openPhoneModal}
        onClose={() => setOpenPhoneModal(false)}
        currentValue={form.phoneNumber}
        onSaved={handlePhoneSaved}
        fieldLabel="Numer telefonu"
      />
    </div>
  );
}

export default EmailAndPhone;
