import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Konto', key: 'account' },
  { label: 'Limity', key: 'limits' },
  { label: 'Płatności', key: 'payments' },
];

function UserNavBar({ activeTab: controlledActive, onTabChange }) {
  const [internalActive, setInternalActive] = useState('account');
  const activeTab = controlledActive ?? internalActive;

  const handleTabClick = (key) => {
    if (!controlledActive) setInternalActive(key);
    if (onTabChange) onTabChange(key);
  };

  return (
    <div className="flex w-full justify-center border-b border-gray-300 bg-ivorylight">
      <div className="flex w-5/6 flex-col gap-2">
        <div className="flex text-4xl font-bold items-center gap-2">
          <Settings size={40} />
          <h1 className=""> Ustawienia</h1>
        </div>
        <div className="flex gap-6 p-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabClick(item.key)}
              className={`px-3 pb-2 text-lg transition-all duration-200 focus:outline-none ${
                activeTab === item.key
                  ? 'font-bold text-slatedark border-b-2 border-baseblack'
                  : 'font-normal text-cloudmedium'
              }`}
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
