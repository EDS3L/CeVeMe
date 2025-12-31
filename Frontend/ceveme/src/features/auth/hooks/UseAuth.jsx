import axios from "../../../../api";
import { toast } from "react-toastify";

class UseAuth {
  async login(email, password, nav, checkAuth) {
    axios({
      url: "/api/auth/login",
      method: "POST",
      data: {
        email,
        password,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.message);
          if (checkAuth) checkAuth();
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

  async register(name, surname, phoneNumber, email, password, city, nav) {
    axios({
      url: "/api/auth/register",
      method: "POST",
      data: {
        name,
        surname,
        phoneNumber,
        email,
        password,
        city,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.message);
          nav("/auth/active");
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

  async logout(nav) {
    axios({
      url: "/api/auth/logout",
      method: "POST",
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message || "Wylogowano pomyślnie");
          nav("/auth/login");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Błąd wylogowania", {
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
        });
      });
  }
  async activeAccount(UUID, nav) {
    try {
      const response = await axios({
        url: `/api/auth/active/user/${UUID}`,
        method: "POST",
      });

      if (response.status === 200) {
        toast.success(response.data?.message || "Konto aktywowane pomyślnie");
        nav("/auth/login");
      }

      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Błąd podczas aktywowania konta",
        {
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
        }
      );
      throw error;
    }
  }

  async sendActiveCodeAgain(email) {
    try {
      const response = await axios({
        url: "/api/auth/active/sendConfirmationCode",
        method: "POST",
        data: { email },
      });

      if (response.status === 200) {
        toast.success(response.data?.message || "Kod wysłany prawidłowo!");
      }

      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Błąd podczas wysyłania kodu",
        {
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
        }
      );
      throw error;
    }
  }
}

export default UseAuth;
