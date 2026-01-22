const ReportCard = ({ title, children, icon }) => {
  return (
    <div className="bg-[var(--color-basewhite)] rounded-2xl shadow-lg border border-[var(--color-ivorydark)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[var(--color-kraft)]/30">
      <div className="px-6 py-4 bg-gradient-to-r from-[var(--color-ivorylight)] to-[var(--color-basewhite)] border-b border-[var(--color-ivorydark)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-kraft)] to-[var(--color-bookcloth)] flex items-center justify-center text-[var(--color-basewhite)]">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-[var(--color-slatedark)]">
            {title}
          </h3>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ReportCard;
