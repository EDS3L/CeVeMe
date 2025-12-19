import React, { useState } from 'react';
import { CreditCard, Plus, Clock, Check } from 'lucide-react';

export default function Payments() {
  const [methods] = useState([
    { id: 1, brand: 'test', last4: 'test', exp: 'test/test' },
    { id: 2, brand: 'test', last4: 'test', exp: 'test/test' },
  ]);
  const [history] = useState([
    { id: 1, date: 'test', amount: 'test', status: 'test' },
    { id: 2, date: 'test', amount: 'test', status: 'test' },
  ]);

  return (
    <div className="p-3">
      <div className="font-semibold grid gap-3 p-2">
        <div className="flex items-center gap-2">
          <CreditCard />
          <p className="text-lg font-bold">Płatności</p>
        </div>
        <p className="text-sm text-gray-600">
          Zarządzaj metodami płatności oraz historią transakcji.
        </p>
      </div>

      <div className="grid gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Metody płatności</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bookcloth text-basewhite">
            <Plus size={16} /> Dodaj metodę
          </button>
        </div>

        <div className="grid gap-3">
          {methods.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3 bg-basewhite rounded-2xl shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 flex items-center justify-center bg-ivorymedium rounded-md">
                  <span className="text-sm font-semibold">{m.brand}</span>
                </div>
                <div>
                  <div className="font-medium text-slatedark">
                    •••• {m.last4}
                  </div>
                  <div className="text-xs text-cloudmedium">
                    Ważna do {m.exp}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded-md bg-ivorymedium text-sm">
                  Ustaw domyślną
                </button>
                <button className="px-3 py-1 rounded-md text-rose-600">
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="font-semibold">Historia rozliczeń</h3>
          <div className="grid gap-2 mt-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 bg-basewhite rounded-2xl shadow-sm border"
              >
                <div className="flex items-center gap-3">
                  <Clock />
                  <div>
                    <div className="font-medium">{h.date}</div>
                    <div className="text-xs text-cloudmedium">Płatność</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{h.amount}</div>
                  <div className="text-xs text-cloudmedium flex items-center gap-2">
                    {h.status === 'OK' ? (
                      <Check className="text-green-500" />
                    ) : null}
                    <span>{h.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
