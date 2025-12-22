import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function InfoModal({
  open,
  onClose,
  title = "Informacja",
  message,
  buttonText = "OK",
  onConfirm,
  icon = "info", // "info" | "warning" | "error"
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    const onClick = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  if (!open) return null;

  const iconColors = {
    info: "var(--color-feedbackfocus)",
    warning: "var(--color-kraft)",
    error: "var(--color-feedbackerror)",
  };

  const iconSvg = {
    info: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke={iconColors.info}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke={iconColors.warning}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke={iconColors.error}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100001] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Tło */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-200"
        style={{
          background: "var(--color-ivorylight)",
          borderColor: "var(--color-cloudlight)",
        }}
      >
        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4">{iconSvg[icon] || iconSvg.info}</div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-3"
            style={{ color: "var(--color-slatedark)" }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            className="text-base mb-6"
            style={{ color: "var(--color-clouddark)" }}
          >
            {message}
          </p>

          {/* Button */}
          <button
            onClick={handleConfirm}
            className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "var(--color-kraft)",
              color: "var(--color-basewhite)",
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
