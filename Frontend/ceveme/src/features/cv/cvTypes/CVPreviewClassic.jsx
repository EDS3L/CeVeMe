import React from 'react';

const ACCENT = '#0f766e'; // teal-700
const MUTED = '#475569';
const PAD = 4; // mm — ciaśniej, pełniejsza karta

// Uniwersalna lista z okrągłym markerem (kropką)
const BulletList = ({ items }) => {
  const data = (items || []).filter(Boolean);

  if (!data.length) return null;

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '1.2mm 0 0 0' }}>
      {data.map((text, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2.5mm',
            marginBottom: '0.9mm',
          }}
        >
          <span
            aria-hidden
            style={{
              width: '2.2mm',
              height: '2.2mm',
              borderRadius: '50%',
              background: ACCENT,
              marginTop: '1.4mm',
              flex: '0 0 2.2mm',
            }}
          />
          <span
            style={{ fontSize: '10pt', lineHeight: 1.45, color: '#0f172a' }}
          >
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

const LINK_ICONS = {
  github:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  linkedin:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
};

const CVPreviewClassic = React.forwardRef(({ cvData }, ref) => {
  if (!cvData) return null;

  const {
    headline,
    personalData,
    summary,
    experience = [],
    skills = [],
    education,
    educations,
    portfolio = [],
    certificates = [],
  } = cvData;

  const educationList = (educations || education || []).filter(
    (e) => e?.visible !== false
  );
  const experienceList = (experience || []).filter((e) => e?.visible !== false);
  const portfolioList = (portfolio || []).filter((p) => p?.visible !== false);
  const certificatesList = (certificates || []).filter(
    (c) => c?.visible !== false
  );

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        color: '#0f172a',
        padding: `${PAD}mm`,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '4.5mm',
          borderBottom: '0.4mm solid #e2e8f0',
          paddingBottom: '2mm',
          display: 'flex',
          alignItems: 'center',
          gap: '16mm',
        }}
      >
        {/* Avatar */}
        {personalData?.images ||
        personalData?.image ||
        personalData?.avatarUrl ? (
          <div
            style={{
              width: '32mm',
              height: '32mm',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5mm solid #e2e8f0',
              flexShrink: 0,
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={
                personalData.images ||
                personalData.image ||
                personalData.avatarUrl
              }
              alt="Zdjęcie profilowe"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                display: 'block',
              }}
            />
          </div>
        ) : null}

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17pt', fontWeight: 800, lineHeight: 1.15 }}>
            {personalData?.name}
          </div>
          <div style={{ fontSize: '10pt', color: MUTED, marginTop: '0.8mm' }}>
            {headline}
          </div>
          <div style={{ fontSize: '9pt', color: MUTED, marginTop: '1mm' }}>
            {[
              personalData?.email,
              personalData?.phoneNumber,
              personalData?.city,
            ]
              .filter(Boolean)
              .join(' • ')}
          </div>
          {/* Linki społecznościowe */}
          {Array.isArray(personalData?.links) &&
            personalData.links.length > 0 && (
              <div style={{ marginTop: '2mm', display: 'flex', gap: '6mm' }}>
                {personalData.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2mm',
                      fontSize: '9pt',
                      color: ACCENT,
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    {LINK_ICONS[link.type] ? (
                      <img
                        src={LINK_ICONS[link.type]}
                        alt={link.type}
                        style={{
                          width: '5mm',
                          height: '5mm',
                          objectFit: 'contain',
                          borderRadius: '50%',
                          background: '#fff',
                          border: '0.2mm solid #e2e8f0',
                        }}
                      />
                    ) : null}
                    <span>
                      {link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                    </span>
                  </a>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Grid: main + side */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 66mm', gap: '5mm' }}
      >
        {/* MAIN */}
        <div>
          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: '4.5mm' }}>
              <h2
                style={{
                  fontSize: '12pt',
                  fontWeight: 800,
                  color: ACCENT,
                  borderBottom: '0.4mm solid #e2e8f0',
                  paddingBottom: '1.8mm',
                  marginBottom: '2.2mm',
                }}
              >
                Podsumowanie zawodowe
              </h2>
              <p
                style={{
                  fontSize: '10pt',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                }}
              >
                {summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experienceList.length > 0 && (
            <section style={{ marginBottom: '4.5mm' }}>
              <h2
                style={{
                  fontSize: '12pt',
                  fontWeight: 800,
                  color: ACCENT,
                  borderBottom: '0.4mm solid #e2e8f0',
                  paddingBottom: '1.8mm',
                  marginBottom: '2.2mm',
                }}
              >
                Doświadczenie
              </h2>
              {experienceList.map((exp, i) => (
                <div key={i} style={{ marginBottom: '3.5mm' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '4mm',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '11pt' }}>
                      {exp.title}
                    </div>
                    <div
                      style={{
                        fontSize: '9pt',
                        color: MUTED,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {exp.period}
                    </div>
                  </div>
                  <div style={{ fontSize: '9.5pt', color: 'black' }}>
                    {exp.company}
                  </div>
                  <div style={{ fontSize: '10pt', color: MUTED }}>
                    {exp.jobDescription}
                  </div>
                  {/* Osiągnięcia jako kropki */}
                  <BulletList
                    items={
                      Array.isArray(exp.achievements)
                        ? exp.achievements
                            .filter((a) => a && a.visible !== false)
                            .map((a) => a.description)
                        : []
                    }
                  />
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {portfolioList.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: '12pt',
                  fontWeight: 800,
                  color: ACCENT,
                  borderBottom: '0.4mm solid #e2e8f0',
                  paddingBottom: '1.8mm',
                  marginBottom: '2.2mm',
                }}
              >
                Projekty
              </h2>
              {portfolioList.map((item, i) => {
                const bullets =
                  Array.isArray(item.highlights) && item.highlights.length
                    ? item.highlights
                    : Array.isArray(item.achievements) &&
                      item.achievements.length
                    ? item.achievements.map((a) => a.description)
                    : [];
                return (
                  <div key={i} style={{ marginBottom: '3.5mm' }}>
                    <div style={{ fontWeight: 700, fontSize: '11pt' }}>
                      {item.name || item.title}
                    </div>

                    {/* Opis */}
                    {item.description && (
                      <div
                        style={{
                          fontSize: '10pt',
                          color: MUTED,
                          marginTop: '1mm',
                        }}
                      >
                        {item.description}
                      </div>
                    )}

                    {/* Bullet pointy */}
                    <BulletList items={bullets} />

                    {/* Technologie */}
                    {Array.isArray(item.technologies) &&
                      item.technologies.filter((t) => t.visible !== false)
                        .length > 0 && (
                        <div
                          style={{
                            fontSize: '9pt',
                            color: MUTED,
                            marginTop: '1mm',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>
                            Technologie:{' '}
                          </span>
                          {item.technologies
                            .filter((t) => t.visible !== false)
                            .map((t) => t.name)
                            .join(', ')}
                        </div>
                      )}

                    {/* Link */}
                    {item.url && (
                      <div
                        style={{
                          fontSize: '9pt',
                          color: ACCENT,
                          marginTop: '1mm',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.url}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* SIDE */}
        <aside>
          {/* Skills */}
          {skills?.length > 0 && (
            <section style={{ marginBottom: '4.5mm' }}>
              <h3
                style={{
                  fontSize: '12pt',
                  fontWeight: 800,
                  color: ACCENT,
                  borderBottom: '0.4mm solid #e2e8f0',
                  paddingBottom: '1.8mm',
                  marginBottom: '2.2mm',
                }}
              >
                Umiejętności
              </h3>
              {skills.map((grp, i) => (
                <div key={i} style={{ marginBottom: '3mm' }}>
                  <div style={{ fontWeight: 700, fontSize: '10pt' }}>
                    {grp.category}
                  </div>
                  <div style={{ fontSize: '9.5pt', color: MUTED }}>
                    {grp.items
                      ?.filter((it) => it.visible !== false)
                      .map((it) => it.name)
                      .join(' · ')}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Edukacja — PRZENIESIONA DO KOLUMNY BOCZNEJ */}
          {educationList.length > 0 && (
            <section style={{ marginBottom: '4.5mm' }}>
              <h3
                style={{
                  fontSize: '12pt',
                  fontWeight: 800,
                  color: ACCENT,
                  borderBottom: '0.4mm solid #e2e8f0',
                  paddingBottom: '1.8mm',
                  marginBottom: '2.2mm',
                }}
              >
                Edukacja
              </h3>
              {educationList.map((edu, i) => (
                <div key={i} style={{ marginBottom: '3mm' }}>
                  <div style={{ fontWeight: 700, fontSize: '10pt' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: '9.5pt', color: MUTED }}>
                    {edu.institution}
                    {edu.specialization ? ` • ${edu.specialization}` : ''}
                  </div>
                  {edu.period && (
                    <div style={{ fontSize: '9pt', color: MUTED }}>
                      {edu.period}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certificates */}
          {certificatesList.length > 0 && (
            <section>
              <h3
                style={{
                  fontSize: '12pt',
                  fontWeight: 800,
                  color: ACCENT,
                  borderBottom: '0.4mm solid #e2e8f0',
                  paddingBottom: '1.8mm',
                  marginBottom: '2.2mm',
                }}
              >
                Certyfikaty
              </h3>
              {certificatesList.map((cert, i) => (
                <div key={i} style={{ marginBottom: '3mm' }}>
                  <div style={{ fontWeight: 700, fontSize: '10pt' }}>
                    {cert.name}
                  </div>
                  {cert.issuer && (
                    <div style={{ fontSize: '9.5pt', color: MUTED }}>
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div style={{ fontSize: '9pt', color: MUTED }}>
                      {cert.date}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
});

export default CVPreviewClassic;
