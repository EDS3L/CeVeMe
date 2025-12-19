import React from 'react';

/**
 * ATS-First: Jednokolumnowe CV (reverse-chronological)
 * - Bez kolumn/tabel/ikon
 * - Standardowe punktorzy <ul>/<li>
 * - Klarowne nagłówki sekcji
 */
const TEXT = '#0f172a';
const MUTED = '#475569';
const PAD_MM = 4; // ciaśniej = pełniejsza strona

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

const CVPreviewAts = React.forwardRef(({ cvData }, ref) => {
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

  const experienceList = experience.filter((e) => e?.visible !== false);
  const portfolioList = (portfolio || []).filter((p) => p?.visible !== false);
  const educationList = (educations || education || []).filter(
    (e) => e?.visible !== false
  );
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
        color: TEXT,
        padding: `${PAD_MM}mm`,
      }}
    >
      {/* Header */}
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

      {/* Podsumowanie */}
      {summary && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Podsumowanie zawodowe</SectionTitle>
          <Line>{summary}</Line>
        </section>
      )}

      {/* Doświadczenie (reverse-chronological) */}
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

              {/* Bullet pointy (standardowe) */}
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

      {/* Projekty (opcjonalnie, z punktami efektów) */}
      {portfolioList.length > 0 && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Projekty</SectionTitle>
          {portfolioList.map((item, i) => {
            const bullets =
              Array.isArray(item.highlights) && item.highlights.length
                ? item.highlights
                : Array.isArray(item.achievements) && item.achievements.length
                ? item.achievements.map((a) => a.description)
                : [];
            return (
              <article key={i} style={{ marginBottom: '3mm' }}>
                <Line strong>{item.name || item.title}</Line>
                {item.description && <Line muted>{item.description}</Line>}
                <List items={bullets} />
                {Array.isArray(item.technologies) &&
                  item.technologies.filter((t) => t.visible !== false).length >
                    0 && (
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

      {/* Umiejętności (słowa-klucze) */}
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

      {/* Edukacja */}
      {educationList.length > 0 && (
        <section style={{ marginBottom: '4mm' }}>
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

      {/* Certyfikaty */}
      {certificatesList.length > 0 && (
        <section>
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
    </div>
  );
});

export default CVPreviewAts;
