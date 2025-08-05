import React from 'react';

export default function PersonalInfo({ name, city, phone, email, links = [] }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Dane osobowe</h2>
      <ul className="text-gray-700 space-y-1">
        <li>
          <strong>Imię i nazwisko:</strong> {name}
        </li>
        {city && (
          <li>
            <strong>Miasto:</strong> {city}
          </li>
        )}
        <li>
          <strong>Telefon:</strong> {phone}
        </li>
        <li>
          <strong>E-mail:</strong> {email}
        </li>
        {links.length > 0 && (
          <li>
            <strong>Linki:</strong>
            <ul className="ml-4 list-disc">
              {links.map(({ label, url }) => (
                <li key={url}>
                  <a
                    href={url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </section>
  );
}
