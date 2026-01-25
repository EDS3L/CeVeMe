import {
  MessageSquare,
  Clock,
  Mic,
  Zap,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";

const icons = {
  TEXT_BASIC: MessageSquare,
  TEXT_TIMED: Clock,
  VOICE_BASIC: Mic,
  VOICE_PRESSURE: Zap,
  REALTIME_FEEDBACK: Sparkles,
};

const gradients = {
  TEXT_BASIC: "from-blue-500 to-blue-600",
  TEXT_TIMED: "from-orange-500 to-orange-600",
  VOICE_BASIC: "from-purple-500 to-purple-600",
  VOICE_PRESSURE: "from-red-500 to-red-600",
  REALTIME_FEEDBACK: "from-green-500 to-green-600",
};

export default function ModeCard({ mode, onSelect, disabled = false }) {
  const IconComponent = icons[mode.id] || MessageSquare;
  const gradient = gradients[mode.id] || "from-gray-500 to-gray-600";

  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      className={`relative group rounded-2xl bg-white border border-[var(--color-ivorydark)] overflow-hidden transition-all duration-300 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-xl hover:border-[var(--color-kraft)] hover:-translate-y-1"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
          >
            <IconComponent className="w-7 h-7 text-white" />
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < mode.difficulty
                    ? "text-[var(--color-kraft)] fill-[var(--color-kraft)]"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-[var(--color-slatedark)] mb-2">
          {mode.name}
        </h3>

        <p className="text-[var(--color-clouddark)] text-sm mb-4 line-clamp-2">
          {mode.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {mode.features.map((feature, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium bg-[var(--color-ivorylight)] text-[var(--color-slatedark)] rounded-full border border-[var(--color-ivorydark)]"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-ivorydark)]">
          <div className="flex items-center gap-4 text-sm text-[var(--color-clouddark)]">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {mode.estimatedDuration}
            </span>
            <span>{mode.questionsCount} pytań</span>
          </div>

          <div
            className={`flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all`}
          >
            Wybierz <ArrowRight className="w-4 h-4 text-current opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
