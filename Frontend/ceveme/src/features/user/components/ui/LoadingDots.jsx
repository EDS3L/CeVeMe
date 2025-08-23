export default function AILoading() {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="flex flex-col items-center justify-center gap-2 text-center "
    >
      {/* Kropeczki */}
      <div className="flex gap-1 mt-1" aria-hidden="true">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="inline-block w-2 h-2 rounded-full bg-[#89CBDF]"
            style={{
              transformOrigin: '50% 50%',
              animation: `bounce 900ms ease-in-out ${d * 120}ms infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
