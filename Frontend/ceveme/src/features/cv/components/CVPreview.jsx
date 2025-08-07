import React from 'react';

export default function CVPreview({ cvData }) {
  if (!cvData) return null;
  const { headline, personalData, summary, experience, skills } = cvData;

  return (
    <div className="w-2/3 p-8 overflow-auto">
      <h1 className="text-4xl font-bold mb-2">{headline}</h1>
      <p className="text-gray-600 mb-4">
        {personalData?.name} • {personalData?.email} •{' '}
        {personalData?.phoneNumber}
        {personalData?.city && ` • ${personalData.city}`}
      </p>

      {summary && (
        <>
          <h2 className="text-2xl font-semibold mt-6">Podsumowanie</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{summary}</p>
        </>
      )}

      {experience?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-6">Doświadczenie</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-4">
              <h3 className="font-semibold">
                {exp.title} – {exp.company}
              </h3>
              <p className="text-sm text-gray-500">{exp.period}</p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {exp.achievements?.map((ach, j) => (
                  <li key={j}>{ach.description}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {skills?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-6">Umiejętności</h2>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {skills.map((grp, i) => (
              <div key={i}>
                <h4 className="font-medium">{grp.category}</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {grp.items?.map((it, j) => (
                    <li key={j}>{it.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
