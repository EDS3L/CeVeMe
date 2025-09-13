import { useState } from 'react';
import ApiService from '../hooks/Gemini';
import useAuth from '../../../hooks/useAuth';

// lekka normalizacja, żeby zawsze mieć 'education' (nie 'educations')
const normalizeCv = (raw) => {
  const data = raw || {};
  if (Array.isArray(data.educations) && !data.education) {
    data.education = data.educations;
  }
  return data;
};

export const useCvEditor = () => {
  const [cvData, setCvData] = useState(null);
  const [offerLink, setOfferLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { email } = useAuth();

  const handleGenerateCv = async () => {
    if (!offerLink) {
      setError('Wprowadź link do oferty pracy.');
      return;
    }
    if (!email) {
      setError('Musisz być zalogowany.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await ApiService.generateCv(email, offerLink);
      setCvData(normalizeCv(data));
    } catch (e) {
      setError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    cvData,
    offerLink,
    setOfferLink,
    loading,
    error,
    handleGenerateCv,
    setCvData,
  };
};
