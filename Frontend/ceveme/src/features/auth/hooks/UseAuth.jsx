<<<<<<< HEAD
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
=======
import axios from "axios";
import { toast } from "react-toastify";

class UseAuth {
	async login(email, password, nav) {
		axios({
			url: "http://localhost:8080/api/auth/login",
			method: "POST",
			data: {
				email,
				password,
			},
			withCredentials: true,
		})
			.then((response) => {
				if (response.status === 200) {
					toast.success(response.message);
					nav("/offers");
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "top-center",
					style: {
						background: "bookcloth",
						color: "var(--color-slatedark)",
						border: "2px solid var(--color-feedbackerror)",
						boxShadow: "0 2px 16px 0 rgba(191,77,67,0.08)",
						fontWeight: 600,
						fontSize: "1rem",
						borderRadius: "1rem",
						padding: "1rem 1.5rem",
					},
					icon: "⚠️",
					progressStyle: {
						background: "bg-bookcloth",
					},
				});
			});
	}

	async register(name, surname, phoneNumber, email, password, nav) {
		axios({
			url: "http://localhost:8080/api/auth/register",
			method: "POST",
			data: {
				name,
				surname,
				phoneNumber,
				email,
				password,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					toast.success(response.message);
					nav("/auth/login");
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "top-center",
					style: {
						background: "bookcloth",
						color: "var(--color-slatedark)",
						border: "2px solid var(--color-feedbackerror)",
						boxShadow: "0 2px 16px 0 rgba(191,77,67,0.08)",
						fontWeight: 600,
						fontSize: "1rem",
						borderRadius: "1rem",
						padding: "1rem 1.5rem",
					},
					icon: "⚠️",
					progressStyle: {
						background: "bg-bookcloth",
					},
				});
			});
	}
>>>>>>> 1b95144e43e3d17137ce4fe67d70ab70670a558d
}

export default UseAuth;
