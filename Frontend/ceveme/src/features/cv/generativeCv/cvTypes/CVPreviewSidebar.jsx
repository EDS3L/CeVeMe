import React from 'react';

const ACCENT = '#1e40af'; // indigo-800
const MUTED = '#475569'; // slate-600
const LIGHT = '#f1f5f9'; // slate-100
const PAD = 4; // mm — ciaśniej

const LINK_ICONS = {
  github:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  linkedin:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
  // Dodaj inne typy jeśli chcesz
};

// Uniwersalna lista z okrągłym markerem (kropką)
const BulletList = ({ items }) => {
  const data = (items || []).filter(Boolean);
  if (!data.length) return null;

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '1.1mm 0 0 0' }}>
      {data.map((text, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2.4mm',
            marginBottom: '0.85mm',
          }}
        >
          <span
            aria-hidden
            style={{
              width: '2.1mm',
              height: '2.1mm',
              borderRadius: '50%',
              background: ACCENT,
              marginTop: '1.3mm',
              flex: '0 0 2.1mm',
            }}
          />
          <span style={{ fontSize: '10pt', lineHeight: 1.4, color: '#0f172a' }}>
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

const CVPreviewSidebar = React.forwardRef(({ cvData }, ref) => {
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
        minHeight: '296mm',
        height: '296mm',
        boxSizing: 'border-box',
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        color: '#0f172a',
        background: LIGHT,
        display: 'grid',
        gridTemplateColumns: '66mm 1fr',
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          background: LIGHT,
          padding: `${PAD}mm ${PAD - 1}mm`,
          borderRight: '0.4mm solid #e2e8f0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Avatar */}
        {personalData?.images && (
          <div
            style={{
              width: '32mm',
              height: '32mm',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5mm solid #e2e8f0',
              background: '#fff',
              marginBottom: '4mm',
              marginTop: '2mm',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={personalData.images}
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
        )}

        {/* Nazwisko / kontakt */}
        <div style={{ marginBottom: '4.5mm', width: '100%' }}>
          <div
            style={{
              fontSize: '9pt',
              letterSpacing: '0.5px',
              color: MUTED,
              textTransform: 'uppercase',
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: '15pt', fontWeight: 800, lineHeight: 1.1 }}>
            {personalData?.name}
          </div>
          <div
            style={{
              marginTop: '1.2mm',
              fontSize: '9pt',
              color: MUTED,
              lineHeight: 1.35,
            }}
          >
            {personalData?.email && <div>{personalData.email}</div>}
            {personalData?.phoneNumber && <div>{personalData.phoneNumber}</div>}
            {personalData?.city && <div>{personalData.city}</div>}
          </div>
        </div>

        {/* Linki */}
        {Array.isArray(personalData?.links) &&
          personalData.links.length > 0 && (
            <section style={{ marginBottom: '4.5mm', width: '100%' }}>
              <h4
                style={{
                  fontSize: '10pt',
                  fontWeight: 700,
                  marginBottom: '1.8mm',
                  color: ACCENT,
                }}
              >
                Linki
              </h4>
              <ul
                style={{
                  fontSize: '9pt',
                  lineHeight: 1.35,
                  wordBreak: 'break-word',
                  padding: 0,
                  margin: 0,
                }}
              >
                {personalData.links.map((l, i) => (
                  <li
                    key={i}
                    style={{
                      marginBottom: '1.2mm',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2mm',
                    }}
                  >
                    {LINK_ICONS[l.type] && (
                      <img
                        src={LINK_ICONS[l.type]}
                        alt={l.type}
                        style={{
                          width: '5mm',
                          height: '5mm',
                          objectFit: 'contain',
                          borderRadius: '50%',
                          background: '#fff',
                          border: '0.2mm solid #e2e8f0',
                        }}
                      />
                    )}
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: ACCENT,
                        textDecoration: 'underline',
                        fontWeight: 500,
                        fontSize: '9pt',
                        wordBreak: 'break-all',
                      }}
                    >
                      {l.type.charAt(0).toUpperCase() + l.type.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

        {/* Umiejętności */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: '4.5mm', width: '100%' }}>
            <h4
              style={{
                fontSize: '10pt',
                fontWeight: 700,
                marginBottom: '1.8mm',
                color: ACCENT,
              }}
            >
              Umiejętności
            </h4>
            {skills.map((grp, i) => (
              <div key={i} style={{ marginBottom: '2.6mm' }}>
                <div style={{ fontSize: '9pt', fontWeight: 700 }}>
                  {grp.category}
                </div>
                <div style={{ fontSize: '9pt', color: MUTED }}>
                  {grp.items
                    ?.filter((it) => it.visible !== false)
                    .map((it) => it.name)
                    .join(' · ')}
                </div>
              </div>
            ))}
          </section>
        )}

        {/*  Edukacja */}
        {educationList.length > 0 && (
          <section style={{ marginBottom: '4.5mm', width: '100%' }}>
            <h4
              style={{
                fontSize: '10pt',
                fontWeight: 700,
                marginBottom: '1.8mm',
                color: ACCENT,
              }}
            >
              Edukacja
            </h4>
            {educationList.map((edu, i) => (
              <div key={i} style={{ marginBottom: '2.6mm' }}>
                <div style={{ fontWeight: 700, fontSize: '10pt' }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: '9pt', color: MUTED }}>
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

        {/* Certyfikaty */}
        {certificatesList.length > 0 && (
          <section style={{ width: '100%' }}>
            <h4
              style={{
                fontSize: '10pt',
                fontWeight: 700,
                marginBottom: '1.8mm',
                color: ACCENT,
              }}
            >
              Certyfikaty
            </h4>
            <ul
              style={{
                fontSize: '9pt',
                lineHeight: 1.35,
                color: MUTED,
                padding: 0,
                margin: 0,
              }}
            >
              {certificatesList.map((c, i) => (
                <li key={i} style={{ marginBottom: '1.3mm' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {c.name}
                  </span>
                  {c.issuer && <span> — {c.issuer}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
        {/* Fill sidebar to bottom */}
        <div style={{ flex: 1 }} />
      </aside>

      {/* MAIN */}
      <main
        style={{
          padding: `${PAD + 1}mm ${PAD + 1}mm ${PAD}mm ${PAD + 1}mm`,
          background: '#fff',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Podsumowanie */}
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
              Podsumowanie
            </h2>
            <p
              style={{
                fontSize: '10pt',
                lineHeight: 1.4,
                color: '#111827',
                whiteSpace: 'pre-line',
              }}
            >
              {summary}
            </p>
          </section>
        )}

        {/* Doświadczenie */}
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
              <div key={i} style={{ marginBottom: '3.2mm' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '4mm',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '11pt' }}>
                    {exp.title}{' '}
                    {exp.company && (
                      <span style={{ fontWeight: 500, color: MUTED }}>
                        — {exp.company}
                      </span>
                    )}
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
                {/* Opis */}
                {exp.jobDescription && (
                  <div
                    style={{
                      fontSize: '10pt',
                      color: MUTED,
                      marginTop: '1mm',
                    }}
                  >
                    {exp.jobDescription}
                  </div>
                )}
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

        {/* Portfolio */}
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
              Portfolio
            </h2>
            {portfolioList.map((item, i) => {
              const bullets =
                Array.isArray(item.highlights) && item.highlights.length
                  ? item.highlights
                  : Array.isArray(item.achievements) && item.achievements.length
                  ? item.achievements.map((a) => a.description)
                  : [];
              return (
                <div key={i} style={{ marginBottom: '3.2mm' }}>
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
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: ACCENT,
                          textDecoration: 'underline',
                          fontWeight: 500,
                        }}
                      >
                        {item.url}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
        {/* Fill main to bottom */}
        <div style={{ flex: 1 }} />
      </main>
    </div>
  );
});

export default CVPreviewSidebar;
