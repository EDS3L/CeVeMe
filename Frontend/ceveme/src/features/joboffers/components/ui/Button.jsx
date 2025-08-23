import React from 'react';

export default function Button({
  as = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const Comp = as;
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2';
  const variants = {
    primary:
      'text-basewhite bg-gradient-to-r from-bookcloth to-kraft hover:to-manilla focus-visible:ring-feedbackfocus',
    ghost:
      'text-slatedark bg-ivorymedium hover:bg-ivorylight border border-cloudlight focus-visible:ring-feedbackfocus',
    danger:
      'text-basewhite bg-feedbackerror hover:bg-feedbackerror/90 focus-visible:ring-feedbackerror',
  };
  return (
    <Comp className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
