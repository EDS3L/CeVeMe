import {
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
  UserCheck,
  FileCheck,
  FilePlus,
  FileMinus,
  FileLock,
} from 'lucide-react';

export const STATUS_MAP = {
  PENDING: { label: 'Oczekuje', icon: Loader2, color: 'text-yellow-500' },
  SUBMITTED: { label: 'Wysłane', icon: FileText, color: 'text-blue-500' },
  REJECTED: { label: 'Odrzucone', icon: XCircle, color: 'text-red-500' },
  SCREENING: { label: 'Screening', icon: UserCheck, color: 'text-sky-500' },
  INTERVIEW: {
    label: 'Rozmowa rekrutacyjna',
    icon: UserCheck,
    color: 'text-green-500',
  },
  ASSIGNMENT: {
    label: 'Zadanie techniczne',
    icon: FileCheck,
    color: 'text-teal-500',
  },
  OFFERED: { label: 'Oferta', icon: FilePlus, color: 'text-emerald-500' },
  ACCEPTED: {
    label: 'Zaakceptowane',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  DECLINED: {
    label: 'Odrzucone przez Ciebie',
    icon: FileMinus,
    color: 'text-orange-500',
  },
  CLOSED: {
    label: 'Oferta zakończona, brak odpowiedzi',
    icon: FileLock,
    color: 'text-gray-500',
  },
};

export const STATUS_OPTIONS = Object.entries(STATUS_MAP).map(
  ([key, { label }]) => ({
    value: key,
    label,
  })
);
