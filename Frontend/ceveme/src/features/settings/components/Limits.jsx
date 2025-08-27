import { BatteryPlus, BrainCog } from 'lucide-react';
import React from 'react';

function Limits() {
  return (
    <div className="border-b border-gray-300 p-3">
      <div className="font-semibold items-center grid gap-3 p-2 ">
        <div className="flex">
          <BrainCog />
          <p className="text-lg font-bold">Limity</p>
        </div>
        <p className="text-sm text-gray-600">
          Ilość użyć AI do ulepszeń tekstów oraz generowania CV pod ofertę pracy
        </p>
      </div>
      <div className="flex">
        <div className="w-1/2 grid gap-2">
          <p>Całkowita ilość użyć AI: 60</p>
          <p>Pozostała ilosć użyć AI: 12</p>
          <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-bookcloth text-basewhite hover:opacity-90 disabled:opacity-60 w-1/3">
            <BatteryPlus size={40} strokeWidth={2} />
            Doładuj ilość użyć AI
          </button>
        </div>
      </div>
    </div>
  );
}

export default Limits;
