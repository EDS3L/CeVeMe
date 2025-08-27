import { Save, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import FieldWithAI from '../../user/components/ui/FieldWithAI';
import userPNG from '../../../../public/user.png';
import UserDetails from '../hooks/useUserDeailsInfo';

function PersonalData() {
  const userDatails = new UserDetails();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
  });

  useEffect(() => {
    async function fetchData() {
      const res = await userDatails.getUserDetailsInfo();
      setForm({
        firstName: res.name || '',
        lastName: res.surname || '',
        city: res.city || '',
      });
    }
    fetchData();
  }, []);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex">
          <User />
          <p className="text-lg font-bold">Szczegóły użytkownika</p>
        </div>
        <p className="text-sm text-gray-600">
          Wybierz jak chcesz się prezetnować w swoim CV.
        </p>
      </div>
      <div className="flex">
        <div className="w-1/2 grid gap-2">
          <FieldWithAI
            label="Imię"
            value={form.firstName}
            onChange={handleChange('firstName')}
          />
          <FieldWithAI
            label="Nazwisko"
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
          <FieldWithAI
            label="Miasto"
            value={form.city}
            onChange={handleChange('city')}
          />
          <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-bookcloth text-basewhite hover:opacity-90 disabled:opacity-60 w-1/3">
            <Save size={20} strokeWidth={2} />
            Zapisz
          </button>
        </div>
        <div className="w-1/4 h-1/2 flex flex-col justify-center items-center gap-2">
          <p>Twoje zdjęcie</p>
          <div className=" w-1/2">
            <img src={userPNG} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalData;
