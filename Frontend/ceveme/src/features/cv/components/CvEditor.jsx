import React, { useState } from 'react';
import ApiService from '../hooks/Gemini';
import useAuth from '../../../hooks/useAuth';
import CVViewer from './CVViewer';
import { data } from 'react-router-dom';

export default function CvEditor() {
  const [offerLink, setOfferLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const { email } = useAuth();
  const transformRaw = (raw) => {
    try {
      const headline =
        raw.headline?.trim() ||
        raw.personalData?.match(/name:\s*(.+)/i)?.[1]?.trim() ||
        '';

      const summary = raw.summary?.replace(/^text:\s*/i, '').trim() || '';

      const pdLines = raw.personalData?.split('\n').map((l) => l.trim()) || [];
      const personal = {
        name:
          pdLines
            .find((l) => /^name:/i)
            ?.split(':')[1]
            ?.trim() || '',
        city:
          pdLines
            .find((l) => /^city:/i)
            ?.split(':')[1]
            ?.trim() || '',
        phone:
          pdLines
            .find((l) => /^phone:/i)
            ?.split(':')[1]
            ?.trim() || '',
        email:
          pdLines
            .find((l) => /^email:/i)
            ?.split(':')[1]
            ?.trim() || '',
        links: [],
      };

      const education = raw.education
        ? raw.education.split('\n').map((line) => {
            const [key, ...rest] = line.split(':');
            return { [key.trim()]: rest.join(':').trim() };
          })
        : [];

      const skills = { technical: [], tools: [], soft: [] };
      const skLines =
        raw.skills?.split('\n').map((l) => l.replace(/^•\s*/, '')) || [];
      let currentCat = '';
      skLines.forEach((l) => {
        if (l.startsWith('category:')) {
          const cat = l.split(':')[1].trim().toLowerCase();
          currentCat = cat.includes('technical')
            ? 'technical'
            : cat.includes('soft')
            ? 'soft'
            : 'tools';
        } else if (l.startsWith('name:')) {
          const name = l.split(':')[1].trim();
          if (currentCat) skills[currentCat].push(name);
        }
      });

      const experience = raw.experience
        ? raw.experience
            .split('• period:')
            .slice(1)
            .map((block) => {
              const lines = block.trim().split('\n');
              const exp = { achievements: [] };
              lines.forEach((l) => {
                if (l.startsWith('title:')) exp.title = l.split(':')[1].trim();
                else if (l.startsWith('company:'))
                  exp.company = l.split(':')[1].trim();
                else if (l.startsWith('location:'))
                  exp.location = l.split(':')[1].trim();
                else if (/^\d{4}-\d{2}/.test(l)) exp.period = l.trim();
                else if (l.startsWith('• '))
                  exp.achievements.push(l.replace(/^•\s*/, '').trim());
              });
              return exp;
            })
        : [];

      const portfolio = raw.portfolio
        ? raw.portfolio
            .split('• name:')
            .slice(1)
            .map((block) => {
              const lines = block.trim().split('\n');
              const p = { technologies: [], achievements: [] };
              lines.forEach((l) => {
                if (l.startsWith('name:')) p.name = l.split(':')[1].trim();
                else if (l.startsWith('type:')) p.type = l.split(':')[1].trim();
                else if (l.startsWith('description:'))
                  p.description = l.split(':')[1].trim();
                else if (l.startsWith('url:')) p.url = l.split(':')[1].trim();
                else if (l.startsWith('• '))
                  p.technologies.push(l.replace(/^•\s*/, '').trim());
              });
              return p;
            })
        : [];

      const certificates = raw.certificates?.trim()
        ? raw.certificates.split('\n')
        : [];

      const gdprClause = raw.gdprClause?.trim() || '';

      return {
        headline,
        summary,
        personalData: personal,
        education,
        skills,
        experience,
        portfolio,
        certificates,
        gdprClause,
      };
    } catch (err) {
      console.error('Error transforming raw data:', err);
      throw new Error('Błąd podczas przetwarzania danych CV.');
    }
  };

  const handleGenerateCv = async () => {
    if (!offerLink) {
      setError('Proszę wprowadzić link do oferty pracy.');
      return;
    }
    if (!email) {
      setError('Brak danych uwierzytelniania.');
      return;
    }

    setLoading(true);
    setError(null);
    setCvData(null);

    try {
      const raw = await ApiService.generateCv(email, offerLink);
      console.log(raw);
      const structured = transformRaw(raw);
      setCvData(structured);
    } catch (err) {
      console.error('CV generation error:', err);
      setError('Wystąpił błąd podczas generowania CV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-ivorymedium p-8">
      <h1 className="text-2xl font-bold text-slatedark mb-4">Generuj CV</h1>
      <p className="text-cloudmedium mb-6">
        Wklej link do oferty pracy, aby wygenerować CV dopasowane do tej oferty.
      </p>

      <div className="space-y-4">
        <input
          type="text"
          value={offerLink}
          onChange={(e) => setOfferLink(e.target.value)}
          placeholder="Wklej link do oferty pracy"
          className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus transition"
        />

        <button
          onClick={handleGenerateCv}
          disabled={loading || !email}
          className="w-full bg-bookcloth text-ivorylight font-bold py-3 rounded-md hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Generowanie...' : 'Generuj CV'}
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {cvData && (
        <div className="mt-6">
          <CVViewer cvData={cvData} />
        </div>
      )}
    </div>
  );
}
