import React from 'react';

/**
 * Project / Case-Study CV (Impact-First)
 * - Jednokolumnowe, ATS-safe
 * - Najpierw projekty/case studies z efektami i metrykami
 * - Potem skrócone doświadczenie, umiejętności, edukacja, certyfikaty
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

const CVPreviewProject = React.forwardRef(({ cvData }, ref) => {
  if (!cvData) return null;

  const {
    headline,
    personalData,
    summary, // użyjemy jako "Wartość dla roli"
    portfolio = [],
    experience = [],
    skills = [],
    education,
    educations,
    certificates = [],
  } = cvData;

  const projects = (portfolio || []).filter((p) => p?.visible !== false);
  const expList = (experience || []).filter((e) => e?.visible !== false);
  const eduList = (educations || education || []).filter(
    (e) => e?.visible !== false
  );
  const certList = (certificates || []).filter((c) => c?.visible !== false);

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

      {/* VALUE PROP / SUMMARY */}
      {summary && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Wartość dla roli</SectionTitle>
          <Line>{summary}</Line>
        </section>
      )}

      {/* SELECTED PROJECTS / CASE STUDIES */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Wybrane projekty / Case studies</SectionTitle>
          {projects.map((p, i) => {
            const bullets =
              Array.isArray(p.highlights) && p.highlights.length
                ? p.highlights
                : Array.isArray(p.achievements) && p.achievements.length
                ? p.achievements.map((a) => a.description)
                : [];
            // opcjonalne pola: rola, zakres, kontekst, metryki
            const meta = [
              p.role ? `Rola: ${p.role}` : '',
              p.scope ? `Zakres: ${p.scope}` : '',
              p.team ? `Zespół: ${p.team}` : '',
            ]
              .filter(Boolean)
              .join(' • ');

            return (
              <article key={i} style={{ marginBottom: '3.2mm' }}>
                <Line strong>{p.name || p.title}</Line>
                {meta && <Line muted>{meta}</Line>}
                {p.description && <Line muted>{p.description}</Line>}
                {/* Punkty efektów (STAR/CAR) */}
                <List items={bullets} />

                {/* Technologie / Link / Metryki */}
                {Array.isArray(p.technologies) &&
                  p.technologies.filter((t) => t.visible !== false).length >
                    0 && (
                    <Line muted>
                      <span style={{ fontWeight: 700, color: TEXT }}>
                        Technologie:{' '}
                      </span>
                      {p.technologies
                        .filter((t) => t.visible !== false)
                        .map((t) => t.name)
                        .join(', ')}
                    </Line>
                  )}
                {p.metrics && (
                  <Line muted>
                    <span style={{ fontWeight: 700, color: TEXT }}>
                      Metryki:{' '}
                    </span>
                    {p.metrics}
                  </Line>
                )}
                {p.url && <Line muted>{p.url}</Line>}
              </article>
            );
          })}
        </section>
      )}

      {/* CONDENSED EXPERIENCE */}
      {expList.length > 0 && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Doświadczenie (skrót)</SectionTitle>
          {expList.map((exp, i) => (
            <article key={i} style={{ marginBottom: '3mm' }}>
              <Line strong>
                {exp.title}
                {exp.company ? ` — ${exp.company}` : ''}
              </Line>
              {exp.period && <Line muted>{exp.period}</Line>}
              {/* 0–2 kluczowe punkty (jeśli są) */}
              <List
                items={
                  Array.isArray(exp.achievements)
                    ? exp.achievements
                        .filter((a) => a && a.visible !== false)
                        .slice(0, 2)
                        .map((a) => a.description)
                    : []
                }
              />
            </article>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {Array.isArray(skills) && skills.length > 0 && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Umiejętności</SectionTitle>
          {skills.map((grp, i) => (
            <Line key={i}>
              <span style={{ fontWeight: 700 }}> {grp.category}: </span>
              {(grp.items || [])
                .filter((it) => it?.visible !== false)
                .map((it) => it.name)
                .join(', ')}
            </Line>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {eduList.length > 0 && (
        <section style={{ marginBottom: '4mm' }}>
          <SectionTitle>Edukacja</SectionTitle>
          {eduList.map((edu, i) => (
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

      {/* CERTIFICATES */}
      {certList.length > 0 && (
        <section>
          <SectionTitle>Certyfikaty</SectionTitle>
          {certList.map((c, i) => (
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

export default CVPreviewProject;
