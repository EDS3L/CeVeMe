import { Settings, Settings2 } from 'lucide-react';
import React, { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Konto', key: 'account' },
  { label: 'Limity', key: 'limits' },
  { label: 'Płatności', key: 'payments' },
];

function UserNavBar({ onTabChange }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleTabClick = (idx) => {
    setActiveIdx(idx);
    if (onTabChange) onTabChange(NAV_ITEMS[idx].key);
  };

  return (
    <div className="flex w-full justify-center border-b border-gray-300">
      <div className="flex w-5/6 flex-col gap-2">
        <div className="flex text-4xl font-bold items-center gap-2">
          <Settings size={40} />
          <h1 className=""> Ustawienia</h1>
        </div>
        <div className="flex gap-6 p-3">
          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.key}
              onClick={() => handleTabClick(idx)}
              className={`px-2 pb-2 text-lg transition-all duration-200
                ${
                  activeIdx === idx
                    ? 'font-bold text-slatedark border-b-2 border-baseblack'
                    : 'font-normal text-cloudmedium'
                }`}
              style={{ order: idx }}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserNavBar;
