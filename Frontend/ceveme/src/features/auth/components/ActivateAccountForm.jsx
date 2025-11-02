/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";

const COOLDOWN_SECONDS = 30;
const cooldownKey = (email) =>
  `activationCooldown:${(email || "").toLowerCase()}`;
const emailKey = "activationEmail";

export default function ActivateAccountForm() {
  const useAuth = new UseAuth();
  const navigate = useNavigate();
  const { search, state } = useLocation();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const timerRef = useRef(null);
  const untilRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopCooldown = () => {
    clearTimer();
    untilRef.current = null;
    setCooldownRemaining(0);
    if (email) localStorage.removeItem(cooldownKey(email));
  };

  const startCooldownUntil = (untilMs) => {
    clearTimer();
    untilRef.current = untilMs;
    if (email) {
      try {
        localStorage.setItem(
          cooldownKey(email),
          new Date(untilMs).toISOString()
        );
        // eslint-disable-next-line no-empty
      } catch {}
    }
    const tick = () => {
      const now = Date.now();
      const remainingMs = Math.max(0, untilRef.current - now);
      const secs = Math.ceil(remainingMs / 1000);
      setCooldownRemaining(secs);
      if (remainingMs <= 0) stopCooldown();
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
  };

  useEffect(() => {
    const q = new URLSearchParams(search);
    const sEmail = state?.email || "";
    const qEmail = q.get("email") || "";
    const storedEmail = localStorage.getItem(emailKey) || "";
    const resolvedEmail = sEmail || qEmail || storedEmail || "";
    if (resolvedEmail && resolvedEmail !== email) {
      setEmail(resolvedEmail);
      try {
        localStorage.setItem(emailKey, resolvedEmail);
        // eslint-disable-next-line no-empty
      } catch {}
    }
    const qToken = q.get("token") || "";
    if (qToken && qToken !== token) setToken(qToken);
  }, [search, state]);

  useEffect(() => {
    clearTimer();
    if (!email) return;
    const iso = localStorage.getItem(cooldownKey(email));
    if (!iso) return;
    const until = Date.parse(iso);
    if (Number.isFinite(until) && until > Date.now()) startCooldownUntil(until);
    else localStorage.removeItem(cooldownKey(email));
  }, [email]);

  useEffect(() => () => clearTimer(), []);

  const progressPct =
    cooldownRemaining > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((COOLDOWN_SECONDS -
                Math.min(COOLDOWN_SECONDS, cooldownRemaining)) /
                COOLDOWN_SECONDS) *
                100
            )
          )
        )
      : 0;

  const submit = async (e) => {
    e?.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await useAuth.activeAccount(token, navigate);
    // eslint-disable-next-line no-empty
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (!email || resending || submitting || cooldownRemaining > 0) return;
    setResending(true);
    try {
      const data = await useAuth.sendActiveCodeAgain(email);
      const nextIso = data?.nextEmailTime;
      const untilMs = nextIso
        ? Date.parse(nextIso)
        : Date.now() + COOLDOWN_SECONDS * 1000;
      if (Number.isFinite(untilMs)) startCooldownUntil(untilMs);
    // eslint-disable-next-line no-empty
    } catch {} finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md w-full">
      <div>
        <label className="block text-xs font-medium text-ivorymedium mb-1 tracking-wide">
          Email
        </label>
        {email ? (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/6 border border-clouddark text-ivorylight text-sm"
            title="Adres e-mail użyty do aktywacji"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ivorylight"
              aria-hidden
            >
              <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <polyline points="3 8.5 12 14 21 8.5" />
            </svg>
            <span className="whitespace-nowrap">{email}</span>
          </div>
        ) : (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twój@email.com"
            className="w-full px-4 py-2 rounded-md bg-slatelight border border-clouddark text-ivorylight"
          />
        )}
      </div>

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

      <div className="flex gap-3 items-center relative">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-bookcloth text-ivorylight font-bold py-2 rounded-md disabled:opacity-60"
        >
          {submitting ? "Trwa..." : "Aktywuj konto"}
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={resending || submitting || cooldownRemaining > 0 || !email}
          className="relative px-4 py-2 rounded-md border border-clouddark text-ivorylight disabled:opacity-60 overflow-hidden"
          aria-disabled={
            resending || submitting || cooldownRemaining > 0 || !email
          }
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 3,
              width: `${progressPct}%`,
              background: "linear-gradient(90deg,#10B981,#06B6D4)",
              transition: "width 400ms linear",
            }}
          />
          <span className="relative z-10">
            {cooldownRemaining > 0
              ? `Wyślij ponownie (${cooldownRemaining}s)`
              : resending
              ? "Wysyłanie..."
              : "Wyślij kod ponownie"}
          </span>
        </button>
      </div>

      <div className="text-sm text-cloudmedium">
        Masz problem?{" "}
        <a href="/auth/login" className="text-kraft">
          Przejdź do logowania
        </a>
      </div>
    </form>
  );
}
