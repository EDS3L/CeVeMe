// CVPreviewSidebar.js
import React from 'react';

const CVPreviewSidebar = React.forwardRef(({ cvData }, ref) => {
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
      className="w-full bg-white flex"
      style={{
        minHeight: '297mm',
        maxWidth: '210mm',
        fontSize: '11px',
        lineHeight: '1.3',
      }}
    >
      {/* Sidebar - węższa */}
      <div
        className="w-1/3 bg-gray-50 p-3 border-r flex flex-col"
        style={{ padding: '12px' }}
      >
        <div className="mb-4" style={{ marginBottom: '12px' }}>
          <h2
            className="text-lg font-bold mb-1"
            style={{ fontSize: '16px', marginBottom: '4px' }}
          >
            {personalData?.name}
          </h2>
          <div
            className="text-gray-600"
            style={{ fontSize: '10px', lineHeight: '1.2' }}
          >
            {personalData?.email && <div>{personalData.email}</div>}
            {personalData?.phoneNumber && <div>{personalData.phoneNumber}</div>}
            {personalData?.city && <div>{personalData.city}</div>}
          </div>
        </div>

        {/* Links Section */}
        {personalData?.links?.length > 0 && (
          <div className="mb-4" style={{ marginBottom: '12px' }}>
            <h4
              className="font-semibold mb-1"
              style={{ fontSize: '12px', marginBottom: '4px' }}
            >
              Linki
            </h4>
            <ul style={{ fontSize: '9px' }}>
              {personalData.links.map((link, i) => (
                <li key={i} style={{ marginBottom: '2px' }}>
                  <span className="font-medium">{link.type}: </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="mb-4" style={{ marginBottom: '12px' }}>
            <h4
              className="font-semibold mb-1"
              style={{ fontSize: '12px', marginBottom: '4px' }}
            >
              Umiejętności
            </h4>
            <ul className="space-y-1">
              {skills.map((grp, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>
                  <div
                    className="font-medium"
                    style={{ fontSize: '10px', marginBottom: '2px' }}
                  >
                    {grp.category}
                  </div>
                  <ul
                    className="ml-2 list-disc text-gray-700"
                    style={{ fontSize: '9px' }}
                  >
                    {grp.items
                      ?.filter((it) => it.visible !== false)
                      .map((it, j) => (
                        <li key={j} style={{ marginBottom: '1px' }}>
                          {it.name}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certificates Section - kompaktowe */}
        {certificatesList.filter((c) => c.visible !== false).length > 0 && (
          <div>
            <h4
              className="font-semibold mb-1"
              style={{ fontSize: '12px', marginBottom: '4px' }}
            >
              Certyfikaty
            </h4>
            <ul className="space-y-1">
              {certificatesList
                .filter((c) => c.visible !== false)
                .map((cert, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <span className="font-medium" style={{ fontSize: '9px' }}>
                      {cert.name}
                    </span>
                    <div className="text-gray-500" style={{ fontSize: '8px' }}>
                      {cert.issuer}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content - szerszy i kompaktowy */}
      <div className="w-2/3 p-4" style={{ padding: '12px' }}>
        <h1
          className="font-bold mb-2"
          style={{ fontSize: '18px', marginBottom: '6px' }}
        >
          {headline}
        </h1>

        {/* Summary Section */}
        {summary && (
          <div className="mb-3" style={{ marginBottom: '10px' }}>
            <h2
              className="font-semibold mb-1"
              style={{ fontSize: '13px', marginBottom: '3px' }}
            >
              Podsumowanie
            </h2>
            <p
              className="text-gray-700 whitespace-pre-line"
              style={{ fontSize: '10px', lineHeight: '1.3' }}
            >
              {summary}
            </p>
          </div>
        )}

        {/* Experience Section */}
        {experienceList.filter((e) => e.visible !== false).length > 0 && (
          <div className="mb-3" style={{ marginBottom: '10px' }}>
            <h2
              className="font-semibold mb-1"
              style={{ fontSize: '13px', marginBottom: '4px' }}
            >
              Doświadczenie
            </h2>
            {experienceList
              .filter((e) => e.visible !== false)
              .map((exp, i) => (
                <div key={i} className="mb-2" style={{ marginBottom: '8px' }}>
                  <div
                    className="font-semibold"
                    style={{ fontSize: '11px', marginBottom: '1px' }}
                  >
                    {exp.title} – {exp.company}
                  </div>
                  <div
                    className="text-gray-500 mb-1"
                    style={{ fontSize: '9px', marginBottom: '2px' }}
                  >
                    {exp.period}
                  </div>
                  <ul
                    className="list-disc list-inside text-gray-700"
                    style={{ fontSize: '9px' }}
                  >
                    {exp.achievements
                      ?.filter((a) => a.visible !== false)
                      .map((ach, j) => (
                        <li key={j} style={{ marginBottom: '1px' }}>
                          {ach.description}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        {/* Education Section */}
        {educationList.filter((e) => e.visible !== false).length > 0 && (
          <div className="mb-3" style={{ marginBottom: '10px' }}>
            <h2
              className="font-semibold mb-1"
              style={{ fontSize: '13px', marginBottom: '4px' }}
            >
              Edukacja
            </h2>
            {educationList
              .filter((e) => e.visible !== false)
              .map((edu, i) => (
                <div key={i} className="mb-2" style={{ marginBottom: '6px' }}>
                  <div
                    className="font-semibold"
                    style={{ fontSize: '11px', marginBottom: '1px' }}
                  >
                    {edu.degree}
                  </div>
                  <div className="text-gray-500" style={{ fontSize: '9px' }}>
                    {edu.institution}
                    {edu.specialization && ` • ${edu.specialization}`}
                  </div>
                  <div className="text-gray-500" style={{ fontSize: '9px' }}>
                    {edu.period}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Portfolio Section */}
        {portfolioList.filter((p) => p.visible !== false).length > 0 && (
          <div className="mb-3" style={{ marginBottom: '10px' }}>
            <h2
              className="font-semibold mb-1"
              style={{ fontSize: '13px', marginBottom: '4px' }}
            >
              Portfolio
            </h2>
            {portfolioList
              .filter((p) => p.visible !== false)
              .map((item, i) => (
                <div key={i} className="mb-2" style={{ marginBottom: '6px' }}>
                  <div
                    className="font-semibold"
                    style={{ fontSize: '11px', marginBottom: '1px' }}
                  >
                    {item.name || item.title}
                  </div>
                  {item.description && (
                    <div
                      className="text-gray-500"
                      style={{ fontSize: '9px', marginBottom: '1px' }}
                    >
                      {item.description}
                    </div>
                  )}
                  {item.technologies &&
                    item.technologies.filter((t) => t.visible !== false)
                      .length > 0 && (
                      <div style={{ fontSize: '9px', marginBottom: '1px' }}>
                        <span className="font-medium">Technologie: </span>
                        {item.technologies
                          .filter((t) => t.visible !== false)
                          .map((t) => t.name)
                          .join(', ')}
                      </div>
                    )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                      style={{ fontSize: '9px' }}
                    >
                      {item.url}
                    </a>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default CVPreviewSidebar;
