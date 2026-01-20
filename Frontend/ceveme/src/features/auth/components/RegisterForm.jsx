import React, { useState } from "react";
import UseAuth from "../hooks/UseAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

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
      navigate,
    );
  };

  return (
    <div className="bg-gradient-to-br from-kraft via-bookcloth to-manilla min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* Navbar */}
      <nav className="w-full z-50 bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/20 h-20 flex-shrink-0">
        <div className="flex items-center justify-between px-6 md:px-12 h-full">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kraft to-bookcloth flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-white">CeVeMe</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30">
                Zaloguj
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-bookcloth/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-kraft/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-manilla/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 animate-float">
          <CheckCircle className="text-white/20 w-16 h-16" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-float-delayed">
          <Sparkles className="text-white/20 w-20 h-20" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-lg">
          {/* Glassmorphism Card */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-bookcloth to-kraft rounded-2xl shadow-lg mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Stwórz konto
              </h1>
              <p className="text-white/80 text-lg">
                Dołącz do nas i zacznij tworzyć profesjonalne CV już dziś
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              {/* Name and Surname Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-white/90"
                  >
                    Imię
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Twoje imię"
                      className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="surname"
                    className="block text-sm font-semibold text-white/90"
                  >
                    Nazwisko
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Twoje nazwisko"
                      className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white/90"
                >
                  Adres Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@przyklad.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* City and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-white/90"
                  >
                    Miasto
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Warszawa"
                      className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-white/90"
                  >
                    Telefon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-white/60" />
                    </div>
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-sm">
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
                      className="w-full pl-20 pr-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                      aria-label="Numer telefonu (9 cyfr)"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white/90"
                >
                  Hasło
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 znaków"
                    className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative w-full cursor-pointer bg-gradient-to-r from-slatedark to-slatemedium text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Zarejestruj się
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slatemedium to-slatedark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-white/80">
                Masz już konto?{" "}
                <Link
                  to="/auth/login"
                  className="font-bold text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-1 transition-all"
                >
                  Zaloguj się
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Decorative Text */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              🔒 Twoje dane są bezpieczne • Rejestracja zajmuje 30 sekund
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
