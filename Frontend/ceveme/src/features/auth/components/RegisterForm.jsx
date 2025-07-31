import React from 'react';

const RegisterForm = () => {
  return (
    <div className="bg-manilla min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-slatemedium rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ivorylight">Stwórz konto</h1>
          <p className="text-cloudmedium mt-2">
            Dołącz do nas i zacznij już dziś.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-ivorymedium mb-2"
            >
              Nazwa użytkownika
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="twojanazwa"
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
              placeholder="ty@przyklad.com"
              className="w-full px-4 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
            />
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
            Masz już konto?{' '}
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
