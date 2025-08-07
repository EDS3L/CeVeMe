import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function CollapsibleSection({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}) {
  return (
    <div className="mb-2 border rounded-lg bg-white shadow-sm">
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-ivorymedium rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-bookcloth" />
          <h3 className="font-semibold text-slatedark">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-cloudmedium" />
        ) : (
          <ChevronRight className="w-5 h-5 text-cloudmedium" />
        )}
      </div>
      {isOpen && (
        <div className="p-2 border-t border-ivorydark">{children}</div>
      )}
    </div>
  );
}
