import axios from 'axios';

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
          nav('/offers');
        } else {
          console.error('Login failed');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  }
}

export default UseAuth;
