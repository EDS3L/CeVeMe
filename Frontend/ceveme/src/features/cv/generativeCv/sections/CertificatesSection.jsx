import React from 'react';
import { Award, Plus } from 'lucide-react';
import CollapsibleSection from '../components/CollapsibleSection';
import CertificateItem from './CertificateItem';

export default function CertificatesSection({
  certificates = [],
  updateData,
  isOpen,
  onToggle,
}) {
  return (
    <CollapsibleSection
      title="Certyfikaty"
      icon={Award}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {certificates.map((cert, i) => (
          <CertificateItem
            key={i}
            cert={cert}
            onChange={(field, value) =>
              updateData((d) => {
                d.certificates[i][field] = value;
              })
            }
            onRemove={() =>
              updateData((d) => {
                d.certificates.splice(i, 1);
              })
            }
            onToggleVisible={(checked) =>
              updateData((d) => {
                d.certificates[i].visible = checked;
              })
            }
          />
        ))}
        <button
          onClick={() =>
            updateData((d) => {
              d.certificates = d.certificates || [];
              d.certificates.push({
                name: '',
                issuer: '',
                date: '',
                description: '',
                visible: true,
              });
            })
          }
          className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
        >
          <Plus className="w-4 h-4" /> Dodaj certyfikat
        </button>
      </div>
    </CollapsibleSection>
  );
}
