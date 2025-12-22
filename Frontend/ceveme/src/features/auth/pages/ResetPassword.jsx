import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../../api";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Hasła muszą być identyczne.");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/api/auth/password/remind/${token}`, {
        newPassword: password,
        repeatNewPassword: confirmPassword,
      });
      toast.success("Hasło zostało zmienione. Możesz się zalogować.");
      navigate("/auth/login");
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
              Ustaw nowe hasło
            </h1>
            <p className="text-cloudmedium mt-2">
              Wprowadź nowe hasło dla swojego konta.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ivorymedium mb-2"
              >
                Nowe hasło
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-ivorymedium mb-2"
              >
                Potwierdź hasło
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-basewhite bg-kraft hover:bg-manilla focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-feedbackfocus transition duration-200 disabled:opacity-50"
            >
              {loading ? "Zmieniam hasło..." : "Zmień hasło"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
