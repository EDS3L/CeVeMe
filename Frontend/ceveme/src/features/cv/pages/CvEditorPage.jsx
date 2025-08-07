import React from 'react';
import { useCvEditor } from '../hooks/useCvEditor';
import CvForm from '../components/CvForm';
import SidebarEditor from '../components/SidebarEditor';
import CVPreview from '../components/CVPreview';

export default function CvEditorPage() {
  const {
    cvData,
    offerLink,
    setOfferLink,
    loading,
    error,
    handleGenerateCv,
    setCvData,
  } = useCvEditor();

  return (
    <div className="flex h-screen bg-gray-50">
      {!cvData ? (
        <div className="m-auto">
          <CvForm
            offerLink={offerLink}
            setOfferLink={setOfferLink}
            onGenerate={handleGenerateCv}
            loading={loading}
            error={error}
          />
        </div>
      ) : (
        <>
          <SidebarEditor cvData={cvData} onDataChange={setCvData} />
          <CVPreview cvData={cvData} />
        </>
      )}
    </div>
  );
}
