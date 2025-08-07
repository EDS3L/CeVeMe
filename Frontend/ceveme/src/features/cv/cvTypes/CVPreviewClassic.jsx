import React from 'react';

const CVPreviewClassic = React.forwardRef(({ cvData }, ref) => {
  if (!cvData) return null;

  const {
    headline,
    personalData,
    summary,
    experience,
    skills,
    education,
    educations,
    portfolio,
    certificates,
  } = cvData;

  const educationList = educations || education || [];
  const portfolioList = portfolio || [];
  const experienceList = experience || [];
  const certificatesList = certificates || [];

  return (
    <div
      ref={ref}
      className="w-full bg-white text-gray-900 p-6 text-sm leading-tight"
      style={{
        minHeight: '297mm',
        maxWidth: '210mm',
        fontSize: '11px',
        lineHeight: '1.4',
      }}
    >
      {/* Nagłówek */}
      <div className="mb-3 border-b border-gray-300 pb-2">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ fontSize: '24px', marginBottom: '4px' }}
        >
          {headline}
        </h1>
        <p className="text-gray-600 text-xs" style={{ fontSize: '11px' }}>
          {personalData?.name} | {personalData?.email} |{' '}
          {personalData?.phoneNumber}
          {personalData?.city && ` | ${personalData.city}`}
        </p>
      </div>

      {/* Główny układ */}
      <div className="grid grid-cols-3 gap-4">
        {/* Lewa kolumna */}
        <div className="col-span-2 pr-4">
          {/* Podsumowanie */}
          {summary && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 border-b border-gray-300 pb-1">
                Podsumowanie zawodowe
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-snug">
                {summary}
              </p>
            </div>
          )}

          {/* Doświadczenie */}
          {experienceList.filter((e) => e.visible !== false).length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 border-b border-gray-300 pb-1">
                Doświadczenie
              </h2>
              {experienceList
                .filter((e) => e.visible !== false)
                .map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base">{exp.title}</h3>
                      <span className="text-sm text-gray-500 font-medium">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-0 text-sm">
                      {exp.achievements
                        ?.filter((a) => a.visible !== false)
                        .map((ach, j) => (
                          <li key={j}>{ach.description}</li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}

          {/* Projekty */}
          {portfolioList.filter((p) => p.visible !== false).length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 border-b border-gray-300 pb-1">
                Projekty
              </h2>

              {portfolioList
                .filter((p) => p.visible !== false)
                .map((item, i) => (
                  <div key={i} className="mb-3">
                    {/* Nazwa projektu */}
                    <h3 className="font-bold text-base">
                      {item.name || item.title}
                    </h3>

                    {/* Opis projektu */}
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-1">
                        {item.description}
                      </p>
                    )}

                    {/* Osiągnięcia projektu */}
                    {item.achievements &&
                      item.achievements.filter((a) => a.visible !== false)
                        .length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 space-y-0 text-sm">
                          {item.achievements
                            .filter((a) => a.visible !== false)
                            .map((ach, j) => (
                              <li key={j}>{ach.description}</li>
                            ))}
                        </ul>
                      )}

                    {/* Technologie */}
                    {item.technologies &&
                      item.technologies.filter((t) => t.visible !== false)
                        .length > 0 && (
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Technologie: </span>
                          {item.technologies
                            .filter((t) => t.visible !== false)
                            .map((t) => t.name)
                            .join(', ')}
                        </p>
                      )}

                    {/* Link */}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Prawa kolumna */}
        <div className="col-span-1 border-l border-gray-300 pl-4">
          {/* Umiejętności */}
          {skills?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 border-b border-gray-300 pb-1">
                Umiejętności
              </h2>
              {skills.map((grp, i) => (
                <div key={i} className="mb-2">
                  <h4 className="font-bold text-sm text-gray-800">
                    {grp.category}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm">
                    {grp.items
                      ?.filter((it) => it.visible !== false)
                      .map((it, j) => (
                        <li key={j}>{it.name}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Edukacja */}
          {educationList.filter((e) => e.visible !== false).length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 border-b border-gray-300 pb-1">
                Edukacja
              </h2>
              {educationList
                .filter((e) => e.visible !== false)
                .map((edu, i) => (
                  <div key={i} className="mb-2">
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    {edu.specialization && (
                      <p className="text-sm text-gray-500">
                        {edu.specialization}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">{edu.period}</p>
                  </div>
                ))}
            </div>
          )}

          {/* Certyfikaty */}
          {certificatesList.filter((c) => c.visible !== false).length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 border-b border-gray-300 pb-1">
                Certyfikaty
              </h2>
              {certificatesList
                .filter((c) => c.visible !== false)
                .map((cert, i) => (
                  <div key={i} className="mb-2">
                    <h3 className="font-bold text-sm">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                    {cert.description && (
                      <p className="text-sm text-gray-700">
                        {cert.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CVPreviewClassic;
