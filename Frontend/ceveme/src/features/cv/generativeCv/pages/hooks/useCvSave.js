import { useCallback, useState } from 'react';
import axios from '../../../../../utils/AxiosConfig';
import { toast } from 'react-toastify';

export function useCvSave({ cvData, offerLink, generatePdfBlob }) {
  const [savingMode, setSavingMode] = useState(null);
  const [cvId, setCvId] = useState(null);

  const uploadGeneratedPdf = useCallback(async () => {
    const blob = await generatePdfBlob();
    const filename = cvData?.personalData?.name
      ? `CV_${cvData.personalData.name.replace(/\s+/g, '_')}.pdf`
      : 'CV.pdf';

    const formData = new FormData();
    formData.append('multipartFile', blob, filename);
    formData.append('jobOfferLink', offerLink || '');

    const { data } = await axios({
      url: `/api/users/upload/cvFile`,
      method: 'POST',
      data: formData,
      withCredentials: true,
    });

    if (!data?.cvId) throw new Error('Brak cvId w odpowiedzi uploadu');
    setCvId(data.cvId);
    return data.cvId;
  }, [cvData?.personalData?.name, offerLink, generatePdfBlob]);

  const saveToHistory = useCallback(
    async (id) => {
      if (!offerLink) throw new Error('Brak linku do oferty');

      return axios({
        url: `/api/applicationHistory/save`,
        method: 'POST',
        data: { link: offerLink, cvId: id },
        withCredentials: true,
      });
    },
    [offerLink]
  );

  const handleSaveAndHistory = useCallback(async () => {
    try {
      setSavingMode('uploadAndHistory');
      if (!offerLink) {
        toast.info('Podaj link do oferty, aby przypisać go do CV.');
        return;
      }
      const newCvId = await uploadGeneratedPdf();
      await saveToHistory(newCvId);
      toast.success('CV zapisane i dodane do historii aplikacji.');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Błąd podczas zapisu CV lub dodawania do historii.';
      toast.error(msg);
    } finally {
      setSavingMode(null);
    }
  }, [offerLink, saveToHistory, uploadGeneratedPdf]);

  return { savingMode, handleSaveAndHistory, cvId };
}
