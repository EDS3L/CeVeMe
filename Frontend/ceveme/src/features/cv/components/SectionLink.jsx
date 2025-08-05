import React from 'react';

function SectionLink({ name, icon }) {
  return (
    <li className="flex items-center space-x-4 cursor-pointer hover:bg-kraft hover:text-basewhite p-3 rounded-lg transition-all duration-200">
      <span className="text-xl text-slatedark">{icon}</span>
      <span className="text-sm font-medium text-slatedark">{name}</span>
    </li>
  );
}

export default SectionLink;
