import React from 'react';

function GreenBlackATSCV({ data = {} }) {
  // --- Normalizacja danych z Twojego JSONa ---
  const pd = data.personalData || {};
  const name = pd.name || 'Imię i nazwisko';
  const headline = data.headline || '';
  const phoneRaw = pd.phoneNumber || '';
  const phone =
    phoneRaw && !phoneRaw.startsWith('+') ? `+48 ${phoneRaw}` : phoneRaw;
  const email = pd.email || '';
  const city = pd.city || '';

  // links: [{type,url}] -> wybierz LinkedIn/GitHub + lista stringów na później
  const linksRaw = Array.isArray(pd.links) ? pd.links : [];
  const getUrlByType = (t) =>
    linksRaw.find((l) => (l?.type || '').toLowerCase() === t)?.url || '';
  const linkedIn = getUrlByType('linkedin');
  const github = getUrlByType('github');
  const linksFlat = linksRaw
    .map((l) => (typeof l === 'string' ? l : l?.url))
    .filter(Boolean);

  // Umiejętności: spłaszcz nazwy ze wszystkich kategorii
  const skills = Array.isArray(data.skills)
    ? data.skills.flatMap((cat) =>
        (cat?.items || []).map((i) => i?.name).filter(Boolean)
      )
    : [];

  const educations = Array.isArray(data.educations) ? data.educations : [];
  const experiences = Array.isArray(data.experience) ? data.experience : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const certificates = Array.isArray(data.certificates)
    ? data.certificates.map((c) => ({
        name: c?.name || '',
        issuer: c?.issuer || '',
        date: c?.date || c?.data || '',
        description: c?.description || '',
      }))
    : [];
  const summary = data.summary || '';
  const rodo = data.gdprClause || '';

  // --- Renderery małych elementów ---
  const ContactRow = () => {
    const bits = [
      email && `✉ ${email}`,
      phone && `☎ ${phone}`,
      city && `📍 ${city}`,
      linkedIn && `in ${linkedIn}`,
      github && `gh ${github}`,
    ].filter(Boolean);
    // Jeśli brak typowanych linków, dorzuć pierwszy raw
    if (!linkedIn && !github && linksFlat.length) {
      bits.push(linksFlat[0]);
    }
    return bits.length ? (
      <div className="contact">{bits.join('  |  ')}</div>
    ) : null;
  };

  const SectionHeader = ({ children }) => (
    <div className="section-header">
      <div className="section-title">{children}</div>
      <div className="section-rule" />
    </div>
  );

  return (
    <div className="cv-wrapper">
      <style>{`
        /* --- Rozmiar strony A4 i podstawy --- */
        .cv-wrapper {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          color: #0f172a;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          padding: 12mm;
          box-sizing: border-box;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
            Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans",
            sans-serif;
        }
        .page {
          display: flex;
          flex-direction: column;
          gap: 6mm;
        }

        /* --- Nagłówek --- */
        .name {
          font-size: 28pt;
          font-weight: 800;
          line-height: 1.15;
          color: #0f172a;
          margin: 0;
        }
        .headline {
          margin-top: 2mm;
          font-size: 11pt;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          color: #374151;
        }
        .header-rule {
          margin-top: 6mm;
          height: 1.2mm;
          background: #10b981; /* jaśniejsza zieleń */
          border-radius: 1mm;
        }
        .contact {
          margin-top: 3mm;
          color: #374151;
          font-size: 9.5pt;
          font-weight: 500;
        }

        /* --- Layout kolumn --- */
        .cols {
          display: grid;
          grid-template-columns: 1fr 1.8fr; /* ok. 36% / 64% */
          gap: 6mm;
          align-items: start;
        }

        /* --- Sekcje --- */
        .section-header {
          margin-bottom: 3mm;
        }
        .section-title {
          font-size: 11pt;
          font-weight: 800;
          color: #16a34a; /* akcent zielony */
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }
        .section-rule {
          margin-top: 1.6mm;
          height: 0.9mm;
          background: #10b981;
          border-radius: 1mm;
        }

        .body {
          font-size: 10pt;
          line-height: 1.45;
          color: #111827;
        }
        .muted {
          color: #374151;
        }
        .strong {
          font-weight: 700;
          color: #0f172a;
        }

        /* --- Listy --- */
        .list {
          display: block;
          white-space: pre-wrap;
        }
        .list-item {
          margin: 0 0 1.5mm 0;
        }

        /* --- Karty wpisów (doświadczenie/edukacja) --- */
        .entry { break-inside: avoid; margin-bottom: 4mm; }
        .entry-head { font-weight: 700; color: #0f172a; }
        .entry-meta { font-size: 9.5pt; color: #374151; margin-top: 1mm; }
        .entry-desc { margin-top: 1.2mm; }
        .entry-bullets { margin-top: 1.2mm; }

        /* --- Sekcja RODO --- */
        .rodo {
          margin-top: 8mm;
          font-size: 8.5pt;
          line-height: 1.35;
          color: #334155;
        }

        /* --- Druk / responsywność podglądu --- */
        @media screen and (max-width: 900px) {
          .cv-wrapper { width: 100%; padding: 16px; }
          .cols { grid-template-columns: 1fr; }
        }
        @media print {
          .cv-wrapper { padding: 10mm; }
        }
      `}</style>

      <div className="page">
        {/* NAGŁÓWEK */}
        <header>
          <h1 className="name">{name}</h1>
          {headline ? <div className="headline">{headline}</div> : null}
          <div className="header-rule" />
          <ContactRow />
        </header>

        {/* DWIE KOLUMNY */}
        <div className="cols">
          {/* LEWA: Umiejętności + Edukacja + (opcjonalnie Języki/Certyfikaty) */}
          <aside>
            {skills.length > 0 && (
              <section>
                <SectionHeader>Kluczowe umiejętności</SectionHeader>
                <div className="body list">
                  {skills.map((s, i) => (
                    <div
                      className="list-item"
                      key={`skill-${i}`}
                    >{`• ${s}`}</div>
                  ))}
                </div>
              </section>
            )}

            {educations.length > 0 && (
              <section style={{ marginTop: '10mm' }}>
                <SectionHeader>Edukacja</SectionHeader>
                <div>
                  {educations.map((ed, idx) => {
                    const l1 = [ed?.degree, ed?.institution]
                      .filter(Boolean)
                      .join(' – ');
                    const l2 = ed?.specialization || '';
                    const l3 = ed?.period || '';
                    return (
                      <div className="entry" key={`edu-${idx}`}>
                        {l1 ? <div className="entry-head">{l1}</div> : null}
                        {l2 ? (
                          <div className="body entry-desc">{l2}</div>
                        ) : null}
                        {l3 ? <div className="entry-meta">{l3}</div> : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {languages.length > 0 && (
              <section style={{ marginTop: '10mm' }}>
                <SectionHeader>Języki</SectionHeader>
                <div className="body list">
                  {languages.map((l, i) => (
                    <div className="list-item" key={`lang-${i}`}>
                      {`• ${l?.language || ''}${
                        l?.level ? ` – ${l.level}` : ''
                      }`}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certificates.filter((c) => c.name).length > 0 && (
              <section style={{ marginTop: '10mm' }}>
                <SectionHeader>Certyfikaty</SectionHeader>
                <div className="body list">
                  {certificates
                    .filter((c) => c.name)
                    .map((c, i) => {
                      const line = [c.name, c.issuer]
                        .filter(Boolean)
                        .join(' – ');
                      const extra = c.date ? ` (${c.date})` : '';
                      return (
                        <div className="list-item" key={`cert-${i}`}>
                          {`• ${line}${extra}`}
                        </div>
                      );
                    })}
                </div>
              </section>
            )}
          </aside>

          {/* PRAWA: Podsumowanie + Doświadczenie */}
          <main>
            {summary && (
              <section>
                <SectionHeader>Podsumowanie</SectionHeader>
                <div className="body">{summary}</div>
              </section>
            )}

            {experiences.length > 0 && (
              <section style={{ marginTop: summary ? '10mm' : 0 }}>
                <SectionHeader>Doświadczenie zawodowe</SectionHeader>
                <div>
                  {experiences.map((exp, idx) => {
                    const head = [exp?.title, exp?.company]
                      .filter(Boolean)
                      .join(' – ');
                    const metaBits = [exp?.period || '', exp?.location || '']
                      .filter(Boolean)
                      .join('  |  ');
                    const bullets = (exp?.achievements || [])
                      .map((a) => a?.description)
                      .filter(Boolean);

                    return (
                      <div className="entry" key={`exp-${idx}`}>
                        {head ? <div className="entry-head">{head}</div> : null}
                        {metaBits ? (
                          <div className="entry-meta">{metaBits}</div>
                        ) : null}
                        {exp?.jobDescription ? (
                          <div className="body entry-desc">
                            {exp.jobDescription}
                          </div>
                        ) : null}
                        {bullets.length > 0 ? (
                          <div className="body entry-bullets">
                            {bullets.map((b, bi) => (
                              <div
                                className="list-item"
                                key={`expb-${idx}-${bi}`}
                              >
                                {`• ${b}`}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>
        </div>

        {/* RODO na dole strony, jeśli jest */}
        {rodo && (
          <section className="rodo">
            <div className="section-title" style={{ color: '#16a34a' }}>
              Klauzula RODO
            </div>
            <div style={{ marginTop: '2mm' }}>{rodo}</div>
          </section>
        )}
      </div>
    </div>
  );
}

export default GreenBlackATSCV;
