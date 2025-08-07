import { useState } from 'react';
import ApiService from '../hooks/Gemini';
import useAuth from '../../../hooks/useAuth';

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
      setCvData(data);
    } catch (e) {
      setError(e.message || 'Błąd generowania CV.');
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
