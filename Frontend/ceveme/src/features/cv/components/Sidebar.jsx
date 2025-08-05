import React from 'react';
import { FaUser, FaBriefcase, FaGraduationCap, FaLink } from 'react-icons/fa';
import SectionLink from './SectionLink';

function Sidebar() {
  const sections = [
    { name: 'Dane osobowe', icon: <FaUser />, id: 'personal' },
    { name: 'Doświadczenie', icon: <FaBriefcase />, id: 'experience' },
    { name: 'Edukacja', icon: <FaGraduationCap />, id: 'education' },
    { name: 'Linki', icon: <FaLink />, id: 'links' },
  ];

  return (
    <div className="bg-manilla w-1/4 min-h-screen p-6 shadow-lg">
      <h2 className="text-xl font-bold text-slatedark mb-6">Kreator CV</h2>
      <ul className="space-y-4">
        {sections.map((section) => (
          <SectionLink
            key={section.id}
            name={section.name}
            icon={section.icon}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
