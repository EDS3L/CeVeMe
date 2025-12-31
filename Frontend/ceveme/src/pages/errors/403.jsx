import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-ivorylight)] px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-[var(--color-ivorydark)]">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert size={40} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[var(--color-slatedark)]">
          403
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-slatedark)]">
          Brak dostępu
        </h2>

        <p className="text-[var(--color-clouddark)]">
          Nie masz uprawnień do przeglądania tej strony. Jeśli uważasz, że to
          błąd, skontaktuj się z administratorem.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-[var(--color-kraft)] text-white rounded-lg font-semibold hover:bg-[var(--color-manilla)] transition-colors duration-200"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
