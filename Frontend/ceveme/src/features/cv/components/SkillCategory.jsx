import React from 'react';

function SkillCategory({ title, items }) {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-1">{title}</h3>
      <ul className="list-disc list-inside text-gray-700">
        {items.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills({ technical, tools, soft }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Umiejętności</h2>
      <SkillCategory title="Techniczne" items={technical} />
      <SkillCategory title="Narzędzia" items={tools} />
      <SkillCategory title="Miękkie" items={soft} />
    </section>
  );
}
