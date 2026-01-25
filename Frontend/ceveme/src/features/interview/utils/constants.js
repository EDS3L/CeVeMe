export const SESSION_MODES = {
  TEXT_BASIC: {
    id: "TEXT_BASIC",
    name: "Tryb Tekstowy - Podstawowy",
    description: "Odpowiadaj pisemnie, bez limitu czasu. Idealny na start.",
    features: [
      "Bez limitu czasu",
      "Pisemne odpowiedzi",
      "Szczegółowy feedback",
    ],
    difficulty: 1,
    timeLimit: null,
    estimatedDuration: "15-25 min",
    questionsCount: 10,
  },
  TEXT_TIMED: {
    id: "TEXT_TIMED",
    name: "Tryb Tekstowy - Z Presją",
    description: "Odpowiadaj pisemnie w określonym czasie (5 min na pytanie).",
    features: ["Limit czasu: 5 min/pytanie", "Symulacja stresu", "Timer"],
    difficulty: 2,
    timeLimit: 300,
    estimatedDuration: "20-30 min",
    questionsCount: 10,
  },
  VOICE_BASIC: {
    id: "VOICE_BASIC",
    name: "Tryb Głosowy - Swobodny",
    description: "Odpowiadaj głosowo, AI konwertuje mowę na tekst.",
    features: [
      "Nagrywanie głosu",
      "Speech-to-Text",
      "Ocena płynności wypowiedzi",
    ],
    difficulty: 3,
    timeLimit: null,
    estimatedDuration: "20-35 min",
    questionsCount: 10,
  },
  VOICE_PRESSURE: {
    id: "VOICE_PRESSURE",
    name: "Tryb Głosowy - Pod Presją",
    description:
      "Symulacja prawdziwej rozmowy z limitem czasu i natychmiastowymi pytaniami.",
    features: ["90 sek/pytanie", "Auto-kolejne pytanie", "Ocena pewności"],
    difficulty: 4,
    timeLimit: 90,
    estimatedDuration: "15-20 min",
    questionsCount: 10,
  },
  REALTIME_FEEDBACK: {
    id: "REALTIME_FEEDBACK",
    name: "Tryb Feedbacku Na Żywo",
    description: "AI podpowiada Ci w trakcie odpowiedzi (jak coach).",
    features: [
      "Podpowiedzi w czasie rzeczywistym",
      "Sugestie słów kluczowych",
      "STAR guidance",
    ],
    difficulty: 2,
    timeLimit: null,
    estimatedDuration: "25-40 min",
    questionsCount: 8,
  },
};

export const QUESTION_CATEGORIES = {
  TECHNICAL: {
    id: "TECHNICAL",
    name: "Techniczne",
    color: "#60a5fa",
    description: "Pytania o umiejętności techniczne i narzędzia",
  },
  BEHAVIORAL: {
    id: "BEHAVIORAL",
    name: "Behawioralne",
    color: "#4ade80",
    description: "Pytania o zachowanie w przeszłości (metoda STAR)",
  },
  SITUATIONAL: {
    id: "SITUATIONAL",
    name: "Sytuacyjne",
    color: "#f59e0b",
    description: "Hipotetyczne scenariusze i rozwiązywanie problemów",
  },
  COMPANY_CULTURE: {
    id: "COMPANY_CULTURE",
    name: "Kultura firmy",
    color: "#8b5cf6",
    description: "Pytania o dopasowanie do kultury organizacji",
  },
};

export const SESSION_STATUS = {
  CREATED: "CREATED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  ABANDONED: "ABANDONED",
};

export const SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  AVERAGE: 55,
  NEEDS_WORK: 40,
};

export const INTERVIEW_COLORS = {
  primary: "#d4a27f",
  secondary: "#cc785c",
  accent: "#8b5cf6",
  success: "#4ade80",
  warning: "#f59e0b",
  danger: "#ef4444",
  muted: "#666663",
  categories: {
    TECHNICAL: "#60a5fa",
    BEHAVIORAL: "#4ade80",
    SITUATIONAL: "#f59e0b",
    COMPANY_CULTURE: "#8b5cf6",
  },
  scores: {
    excellent: "#4ade80",
    good: "#60a5fa",
    average: "#f59e0b",
    needsWork: "#ef4444",
  },
};

export const STAR_CRITERIA = {
  situation: {
    name: "Sytuacja",
    description: "Czy jasno opisano kontekst i okoliczności?",
    maxScore: 25,
  },
  task: {
    name: "Zadanie",
    description: "Czy zdefiniowano cel i wyzwanie?",
    maxScore: 25,
  },
  action: {
    name: "Działanie",
    description: "Czy opisano konkretne podjęte kroki?",
    maxScore: 25,
  },
  result: {
    name: "Rezultat",
    description: "Czy przedstawiono mierzalne wyniki?",
    maxScore: 25,
  },
};

export const BADGES = [
  {
    id: "first_session",
    name: "Pierwszy krok",
    description: "Ukończ pierwszą sesję",
    icon: "🎯",
    requirement: { type: "sessions_completed", value: 1 },
  },
  {
    id: "five_sessions",
    name: "Konsekwentny",
    description: "Ukończ 5 sesji",
    icon: "⭐",
    requirement: { type: "sessions_completed", value: 5 },
  },
  {
    id: "ten_sessions",
    name: "Weteran",
    description: "Ukończ 10 sesji",
    icon: "🏆",
    requirement: { type: "sessions_completed", value: 10 },
  },
  {
    id: "high_scorer",
    name: "Ekspert",
    description: "Uzyskaj wynik powyżej 90%",
    icon: "💎",
    requirement: { type: "score_above", value: 90 },
  },
  {
    id: "pressure_master",
    name: "Opanowanie",
    description: "Ukończ 3 sesje w trybie pod presją",
    icon: "🔥",
    requirement: { type: "mode_completed", mode: "VOICE_PRESSURE", value: 3 },
  },
  {
    id: "star_master",
    name: "Mistrz STAR",
    description: "Uzyskaj pełne punkty STAR w 5 odpowiedziach",
    icon: "⭐",
    requirement: { type: "perfect_star", value: 5 },
  },
];
