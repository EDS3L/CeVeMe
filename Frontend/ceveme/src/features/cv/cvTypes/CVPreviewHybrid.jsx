import React from 'react';

/**
 * Hybrid „Human-First, ATS-Safe”
 * - dwie kolumny wizualnie (CSS Grid), ale bez tabel/ikon
 * - standardowe punktorów (list-style: disc)
 * - DOM kolejno: Header → Summary → Experience → Projects → Skills/Cert/Języki → Education
 */
const TEXT = '#0f172a';
const MUTED = '#475569';
const PAD_MM = 4; // ciasny, „pełna kartka”
const RIGHT_COL_MM = 70; // szerokość prawej kolumny

const SectionTitle = ({ children }) => (
  <h2
    style={{
      fontSize: '12pt',
      fontWeight: 800,
      color: TEXT,
      borderBottom: '0.4mm solid #e2e8f0',
      paddingBottom: '1.6mm',
      margin: '0 0 2.2mm 0',
    }}
  >
    {children}
  </h2>
);

const Line = ({ children, muted = false, strong = false }) => (
  <div
    style={{
      fontSize: '10pt',
      color: muted ? MUTED : TEXT,
      fontWeight: strong ? 700 : 400,
      lineHeight: 1.45,
    }}
  >
    {children}
  </div>
);

const List = ({ items }) => {
  const data = (items || []).filter(Boolean);
  if (!data.length) return null;
  return (
    <ul
      style={{
        listStyle: 'disc',
        paddingLeft: '5mm',
        margin: '1.2mm 0 0 0',
        fontSize: '10pt',
        lineHeight: 1.45,
        color: TEXT,
      }}
    >
      {data.map((t, i) => (
        <li key={i} style={{ marginBottom: '0.9mm' }}>
          {t}
        </li>
      ))}
    </ul>
  );
};

const CVPreviewHybrid = React.forwardRef(({ cvData }, ref) => {
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
    languages, // opcjonalnie
  } = cvData;

  const experienceList = (experience || []).filter((e) => e?.visible !== false);
  const portfolioList = (portfolio || []).filter((p) => p?.visible !== false);
  const educationList = (educations || education || []).filter(
    (e) => e?.visible !== false
  );
  const certificatesList = (certificates || []).filter(
    (c) => c?.visible !== false
  );

  // Języki: obsłuż różne kształty danych (stringi / obiekty)
  const langs = Array.isArray(languages)
    ? languages
        .filter((l) => l && l.visible !== false)
        .map((l) =>
          typeof l === 'string'
            ? l
            : [l.name, l.level].filter(Boolean).join(' — ')
        )
    : Array.isArray(personalData?.languages)
    ? personalData.languages
        .filter((l) => l && l.visible !== false)
        .map((l) =>
          typeof l === 'string'
            ? l
            : [l.name, l.level].filter(Boolean).join(' — ')
        )
    : [];

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        fontFamily:
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        color: TEXT,
        padding: `${PAD_MM}mm`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: '4mm',
          borderBottom: '0.4mm solid #e2e8f0',
          paddingBottom: '2mm',
        }}
      >
        <div style={{ fontSize: '17pt', fontWeight: 800, lineHeight: 1.15 }}>
          {personalData?.name}
        </div>
        {headline && <Line muted>{headline}</Line>}
        <Line muted>
          {[personalData?.email, personalData?.phoneNumber, personalData?.city]
            .filter(Boolean)
            .join(' • ')}
        </Line>
      </div>

      {/* SUMMARY */}
      {summary && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Podsumowanie zawodowe</SectionTitle>
          <Line>{summary}</Line>
        </section>
      )}

      {/* GRID: MAIN (L) + SIDE (R) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `1fr ${RIGHT_COL_MM}mm`,
          gap: '6mm',
        }}
      >
        {/* LEFT: EXPERIENCE + PROJECTS */}
        <div>
          {/* EXPERIENCE */}
          {experienceList.length > 0 && (
            <section style={{ marginBottom: '4mm' }}>
              <SectionTitle>Doświadczenie</SectionTitle>
              {experienceList.map((exp, i) => (
                <article key={i} style={{ marginBottom: '3.2mm' }}>
                  <Line strong>
                    {exp.title}
                    {exp.company ? ` — ${exp.company}` : ''}
                  </Line>
                  {exp.period && <Line muted>{exp.period}</Line>}
                  <List
                    items={
                      Array.isArray(exp.achievements)
                        ? exp.achievements
                            .filter((a) => a && a.visible !== false)
                            .map((a) => a.description)
                        : []
                    }
                  />
                </article>
              ))}
            </section>
          )}

          {/* PROJECTS */}
          {portfolioList.length > 0 && (
            <section>
              <SectionTitle>Projekty</SectionTitle>
              {portfolioList.map((item, i) => {
                const bullets =
                  Array.isArray(item.highlights) && item.highlights.length
                    ? item.highlights
                    : Array.isArray(item.achievements) &&
                      item.achievements.length
                    ? item.achievements.map((a) => a.description)
                    : [];
                return (
                  <article key={i} style={{ marginBottom: '3mm' }}>
                    <Line strong>{item.name || item.title}</Line>
                    {item.description && <Line muted>{item.description}</Line>}
                    <List items={bullets} />
                    {Array.isArray(item.technologies) &&
                      item.technologies.filter((t) => t.visible !== false)
                        .length > 0 && (
                        <Line muted>
                          <span style={{ fontWeight: 700, color: TEXT }}>
                            Technologie:{' '}
                          </span>
                          {item.technologies
                            .filter((t) => t.visible !== false)
                            .map((t) => t.name)
                            .join(', ')}
                        </Line>
                      )}
                    {item.url && <Line muted>{item.url}</Line>}
                  </article>
                );
              })}
            </section>
          )}
        </div>

        {/* RIGHT: SKILLS + CERTS + LANGS + EDUCATION */}
        <aside>
          {/* SKILLS */}
          {Array.isArray(skills) && skills.length > 0 && (
            <section style={{ marginBottom: '4mm' }}>
              <SectionTitle>Umiejętności</SectionTitle>
              {skills.map((grp, i) => (
                <Line key={i}>
                  <span style={{ fontWeight: 700 }}>{grp.category}: </span>
                  {(grp.items || [])
                    .filter((it) => it?.visible !== false)
                    .map((it) => it.name)
                    .join(', ')}
                </Line>
              ))}
            </section>
          )}

          {/* CERTIFICATES */}
          {certificatesList.length > 0 && (
            <section style={{ marginBottom: '4mm' }}>
              <SectionTitle>Certyfikaty</SectionTitle>
              {certificatesList.map((c, i) => (
                <Line key={i}>
                  <span style={{ fontWeight: 700 }}>{c.name}</span>
                  {c.issuer ? ` — ${c.issuer}` : ''}
                  {c.date ? ` (${c.date})` : ''}
                </Line>
              ))}
            </section>
          )}

          {/* LANGUAGES */}
          {langs.length > 0 && (
            <section style={{ marginBottom: '4mm' }}>
              <SectionTitle>Języki</SectionTitle>
              {langs.map((l, i) => (
                <Line key={i}>{l}</Line>
              ))}
            </section>
          )}

          {/* EDUCATION */}
          {educationList.length > 0 && (
            <section>
              <SectionTitle>Edukacja</SectionTitle>
              {educationList.map((edu, i) => (
                <article key={i} style={{ marginBottom: '2.6mm' }}>
                  <Line strong>{edu.degree}</Line>
                  <Line muted>
                    {[edu.institution, edu.specialization]
                      .filter(Boolean)
                      .join(' • ')}
                  </Line>
                  {edu.period && <Line muted>{edu.period}</Line>}
                </article>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
});

export default CVPreviewHybrid;
