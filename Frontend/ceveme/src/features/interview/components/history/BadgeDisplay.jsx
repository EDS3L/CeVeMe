import { BADGES } from "../../utils/constants";

export default function BadgeDisplay({ earnedBadges = [], compact = false }) {
  const allBadges = BADGES.map((badge) => ({
    ...badge,
    earned: earnedBadges.includes(badge.id),
  }));

  if (compact) {
    const earned = allBadges.filter((b) => b.earned);
    if (earned.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        {earned.slice(0, 5).map((badge) => (
          <div
            key={badge.id}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-kraft)] to-[var(--color-bookcloth)] flex items-center justify-center text-lg"
            title={badge.name}
          >
            {badge.icon}
          </div>
        ))}
        {earned.length > 5 && (
          <span className="text-sm text-[var(--color-clouddark)]">
            +{earned.length - 5}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {allBadges.map((badge) => (
        <div
          key={badge.id}
          className={`rounded-xl p-4 border transition-all ${
            badge.earned
              ? "bg-gradient-to-br from-[var(--color-kraft)]/10 to-[var(--color-bookcloth)]/10 border-[var(--color-kraft)] shadow-sm"
              : "bg-gray-50 border-gray-200 opacity-50"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-3xl ${badge.earned ? "" : "grayscale opacity-50"}`}
            >
              {badge.icon}
            </span>
            <div>
              <h4
                className={`font-semibold ${
                  badge.earned
                    ? "text-[var(--color-slatedark)]"
                    : "text-gray-400"
                }`}
              >
                {badge.name}
              </h4>
              {badge.earned && (
                <span className="text-xs text-green-600">Zdobyta!</span>
              )}
            </div>
          </div>
          <p
            className={`text-sm ${
              badge.earned ? "text-[var(--color-clouddark)]" : "text-gray-400"
            }`}
          >
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
}
