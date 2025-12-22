import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../../api";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/send/restartPasswordToken", { email });
      toast.success("Link do resetowania hasła został wysłany na Twój email.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Wystąpił błąd. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar showShadow={true} />
      <div className="bg-manilla flex-1 flex items-center justify-center font-sans p-4">
        <div className="w-full max-w-md bg-slatemedium rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ivorylight">
              Zresetuj hasło
            </h1>
            <p className="text-cloudmedium mt-2">
              Podaj swój email, aby otrzymać link do zmiany hasła.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ivorymedium mb-2"
              >
                Adres Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@przyklad.com"
                required
                className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-basewhite bg-kraft hover:bg-manilla focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-feedbackfocus transition duration-200 disabled:opacity-50"
            >
              {loading ? "Wysyłanie..." : "Wyślij link"}
            </button>
          </form>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-ivorymedium hover:text-kraft transition-colors duration-200"
            >
              Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
