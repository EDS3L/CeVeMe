import React, { useState } from "react";
import UseAuth from "../hooks/UseAuth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { Mail, Lock, ArrowRight, Sparkles, FileText } from "lucide-react";

const LoginForm = () => {
  const hasError = false;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const useAuth = new UseAuth();
  const navigate = useNavigate();
  const { checkAuth } = useAuthContext();

  const handleSignIn = async (e) => {
    e.preventDefault();
    await useAuth.login(email, password, navigate, checkAuth);
  };

  return (
    <div className="bg-gradient-to-br from-manilla via-kraft to-bookcloth min-h-screen flex flex-col font-sans relative overflow-hidden">
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
            <Link to="/auth/register">
              <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30">
                Zarejestruj
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-kraft/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-bookcloth/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-manilla/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 animate-float">
          <FileText className="text-white/20 w-20 h-20" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-float-delayed">
          <Sparkles className="text-white/20 w-16 h-16" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10 space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-kraft to-bookcloth rounded-2xl shadow-lg mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Witaj ponownie
              </h1>
              <p className="text-white/80 text-lg">
                Zaloguj się, aby kontynuować tworzenie perfekcyjnych CV
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
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
                    placeholder="ty@przyklad.com"
                    className={`w-full pl-12 pr-4 py-4 bg-white/30 backdrop-blur-sm border-2 ${
                      hasError ? "border-feedbackerror" : "border-white/40"
                    } rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200`}
                  />
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
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all duration-200"
                  />
                </div>
                {hasError && (
                  <p className="text-sm text-feedbackerror bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 mt-2">
                    Nieprawidłowy email lub hasło.
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-white/90 hover:text-white font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-2 py-1 transition-all"
                >
                  Nie pamiętasz hasła?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full cursor-pointer bg-gradient-to-r from-slatedark to-slatemedium text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Zaloguj się
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slatemedium to-slatedark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-white/80">
                Nie masz jeszcze konta?{" "}
                <Link
                  to="/auth/register"
                  className="font-bold text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-1 transition-all"
                >
                  Zarejestruj się
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Decorative Text */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              🔒 Bezpieczne połączenie szyfrowane SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
