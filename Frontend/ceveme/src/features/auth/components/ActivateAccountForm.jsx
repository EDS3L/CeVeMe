import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UseAuth from '../hooks/UseAuth';

const COOLDOWN_SECONDS = 30;

export default function ActivateAccountForm() {
  const useAuth = new UseAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [email, setEmail] = useState('');
  const [token, setToken] = useState(params.get('token') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [showResentEmail, setShowResentEmail] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  useEffect(() => {
    const qEmail = params.get('email');
    if (qEmail) setEmail(qEmail);
  }, [search]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = (seconds = COOLDOWN_SECONDS) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    setMessage(null);
    if (!token || !email) {
      setError('Podaj kod aktywacyjny i email.');
      return;
    }
    setLoading(true);
    try {
      await useAuth.activateAccount({ token });
      setMessage('Konto aktywowane. Przekierowuję do logowania...');
      setTimeout(() => navigate('/auth/login'), 1200);
    } catch (err) {
      setError(err?.message || 'Błąd aktywacji. Sprawdź kod.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(null);
    setMessage(null);
    if (!email) {
      setError('Podaj email, by wysłać ponownie kod.');
      return;
    }
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await useAuth.resendActivation({ email });
      setMessage('Kod został wysłany ponownie na podany email.');
      setShowResentEmail(true);
      startCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      setError(err?.message || 'Nie udało się wysłać kodu.');
    } finally {
      setLoading(false);
    }
  };

  const onClickShownEmail = () => {
    setShowResentEmail(false);
  };

  const progressPct =
    cooldown > 0
      ? Math.round(((COOLDOWN_SECONDS - cooldown) / COOLDOWN_SECONDS) * 100)
      : 0;

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md w-full">
      {!showResentEmail ? (
        <div>
          <label className="block text-sm font-medium text-ivorymedium mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twój@email.com"
            className="w-full px-4 py-2 rounded-md bg-slatelight border border-clouddark text-ivorylight"
          />
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-ivorymedium mb-2">
          Kod aktywacyjny
        </label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
          placeholder="Wklej kod"
          className="w-full px-4 py-2 rounded-md bg-slatelight border border-clouddark text-ivorylight"
        />
      </div>

      {message && <div className="text-sm text-emerald-600">{message}</div>}
      {error && <div className="text-sm text-feedbackerror">{error}</div>}

      <div className="flex gap-3 items-center relative">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-bookcloth text-ivorylight font-bold py-2 rounded-md disabled:opacity-60"
        >
          {loading ? 'Trwa...' : 'Aktywuj konto'}
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={loading || cooldown > 0}
          className="relative px-4 py-2 rounded-md border border-clouddark text-ivorylight disabled:opacity-60 overflow-hidden"
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              height: 3,
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg,#10B981,#06B6D4)',
              transition: 'width 400ms linear',
            }}
          />
          <span className="relative z-10">
            {cooldown > 0
              ? `Wyślij ponownie (${cooldown}s)`
              : loading
              ? 'Wysyłanie...'
              : 'Wyślij kod ponownie'}
          </span>
        </button>
      </div>

      {showResentEmail && email ? (
        <div className="mt-2">
          <a
            href={`mailto:${email}`}
            onClick={onClickShownEmail}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/6 border border-clouddark text-ivorylight hover:bg-white/10 transition"
            title="Kliknij, aby otworzyć wiadomość w kliencie poczty"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ivorylight"
            >
              <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <polyline points="3 8.5 12 14 21 8.5" />
            </svg>
            <span className="text-sm">{email}</span>
          </a>
        </div>
      ) : null}

      <div className="text-sm text-cloudmedium">
        Masz problem?{' '}
        <a href="/auth/login" className="text-kraft">
          Przejdź do logowania
        </a>
      </div>
    </form>
  );
}
