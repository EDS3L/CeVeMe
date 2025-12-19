import React from 'react';

const TemplateSelectButton = ({ onClick, selectedTemplate }) => {
  return (
    <button
      className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-ivorylight)] border border-[var(--color-cloudlight)] rounded-lg hover:border-[var(--color-bookcloth)] hover:bg-[var(--color-ivorydark)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)] focus:ring-offset-2 group"
      onClick={onClick}
      aria-haspopup="dialog"
    >
      <span className="text-sm font-medium text-[var(--color-slatedark)] group-hover:text-[var(--color-bookcloth)] truncate">
        {selectedTemplate || 'Wybierz szablon'}
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-[var(--color-clouddark)] group-hover:text-[var(--color-bookcloth)] transition-colors"
        aria-hidden="true"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default TemplateSelectButton;
