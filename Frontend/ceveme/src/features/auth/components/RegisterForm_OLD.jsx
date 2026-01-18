import React, { useState } from "react";
import UseAuth from "../hooks/UseAuth";
import { useNavigate } from "react-router-dom";

const formatPL = (digits) => {
  const d = (digits || "").replace(/\D/g, "").slice(0, 9);
  return d.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
};

const extractNationalDigits = (input) => {
  const onlyDigits = (input || "").replace(/\D/g, "");
  return onlyDigits.slice(-9);
};

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const useAuth = new UseAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formattedPhone = phoneNumber ? `+48${phoneNumber}` : "";
    try {
      localStorage.setItem("activationEmail", email);
    } catch (error) {
      console.error("Error saving email to localStorage:", error);
    }
    useAuth.register(
      name,
      surname,
      formattedPhone,
      email,
      password,
      city,
      navigate
    );
  };

  return (
    <div className="bg-manilla min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-slatemedium rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ivorylight">Stwórz konto</h1>
          <p className="text-cloudmedium mt-2">
            Dołącz do nas i zacznij już dziś.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-ivorymedium mb-2"
            >
              Imię
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Twoje imię"
              className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="surname"
              className="block text-sm font-medium text-ivorymedium mb-2"
            >
              Nazwisko
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Twoje nazwisko"
              className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-ivorymedium mb-2"
            >
              Miasto
            </label>
            <input
              type="text"
              id="city"
              name="city"
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto zamieszkania"
              className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
            />
          </div>

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
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@przyklad.com"
              className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-ivorymedium mb-2"
            >
              Numer Telefonu
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cloudmedium pointer-events-none">
                +48
              </span>
              <input
                type="tel"
                inputMode="numeric"
                id="phoneNumber"
                name="phoneNumber"
                value={formatPL(phoneNumber)}
                onChange={(e) =>
                  setPhoneNumber(extractNationalDigits(e.target.value))
                }
                placeholder="600 000 000"
                className="w-full rounded-lg border px-3 py-2 pl-14 bg-slatelight border-clouddark text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus transition duration-200"
                aria-label="Numer telefonu (9 cyfr)"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ivorymedium mb-2"
            >
              Stwórz hasło
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 znaków"
              className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-bookcloth text-ivorylight font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slatemedium focus:ring-bookcloth transition duration-200"
            >
              Zarejestruj się
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-cloudmedium">
            Masz już konto?{" "}
            <a
              href="/auth/login"
              className="font-medium text-kraft hover:underline focus:outline-none focus:ring-1 focus:ring-kraft rounded"
            >
              Zaloguj się
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
