import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function useAuth() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1];

    if (token) {
      try {
        const decodedToken = decodeURIComponent(token);
        const decoded = jwtDecode(decodedToken);
        console.log('Decoded JWT:', decoded);
        setEmail(decoded.sub);
      } catch (error) {
        console.error('Invalid JWT token:', error);
        console.error('Token value:', token);

        try {
          const decoded = jwtDecode(token);
          console.log('Decoded JWT (without URL decode):', decoded);
          setEmail(decoded.email);
        } catch (secondError) {
          console.error('Second attempt failed:', secondError);
        }
      }
    } else {
      console.log('No JWT token found in cookies');
    }
  }, []);

  return { email };
}

export default useAuth;
