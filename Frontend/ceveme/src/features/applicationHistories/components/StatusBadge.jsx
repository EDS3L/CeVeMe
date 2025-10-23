import React from "react";
import { STATUS_MAP } from "../constants/statusConfig";

const BADGE_STYLES = {
  PENDING: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
  SCREENING: "bg-sky-50 text-sky-700 ring-sky-200",
  INTERVIEW: "bg-green-50 text-green-700 ring-green-200",
  ASSIGNMENT: "bg-teal-50 text-teal-700 ring-teal-200",
  OFFERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ACCEPTED: "bg-green-50 text-green-700 ring-green-200",
  DECLINED: "bg-orange-50 text-orange-700 ring-orange-200",
  CLOSED: "bg-gray-50 text-gray-700 ring-gray-200",
};

export default function StatusBadge({ status, size = "md" }) {
  const s = STATUS_MAP[status] || STATUS_MAP.PENDING;
  const Icon = s.icon;
  const style = BADGE_STYLES[status] || BADGE_STYLES.PENDING;
  const sizing = size === "lg" ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ring-1 ${style} ${sizing}`}>
      <Icon size={16} className={s.color} />
      <span>{s.label}</span>
    </span>
  );
}
