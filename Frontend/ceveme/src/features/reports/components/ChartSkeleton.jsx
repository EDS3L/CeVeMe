const ChartSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gradient-to-r from-[var(--color-ivorydark)] to-[var(--color-ivorymedium)] rounded w-1/3 mb-4" />
      <div className="h-64 bg-gradient-to-br from-[var(--color-ivorymedium)] to-[var(--color-ivorydark)] rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[var(--color-kraft)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--color-clouddark)] text-sm">
            Ładowanie danych...
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
