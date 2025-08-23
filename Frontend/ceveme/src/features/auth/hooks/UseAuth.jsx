import axios from 'axios';
import { toast } from 'react-toastify';

class UseAuth {
  async login(email, password, nav) {
    axios({
      url: 'http://localhost:8080/api/auth/login',
      method: 'POST',
      data: {
        email,
        password,
      },
      withCredentials: true,
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.message);
          nav('/offers');
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: 'top-center',
          style: {
            background: 'bookcloth',
            color: 'var(--color-slatedark)',
            border: '2px solid var(--color-feedbackerror)',
            boxShadow: '0 2px 16px 0 rgba(191,77,67,0.08)',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
          },
          icon: '⚠️',
          rogressStyle: {
            background: 'bg-bookcloth',
          },
        });
      });
  }
}

export default UseAuth;
