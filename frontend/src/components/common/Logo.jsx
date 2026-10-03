export const Logo = ({ size = 34, text = true, big = false }) => (
  <div className="flex items-center gap-2.5">
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M13 9l3.5 3 3.5-5 3.5 5L27 9l-1.5 6h-11z" fill="#FF9F2F" />
      <path
        d="M6 36V19l8 9 6-9 6 9 8-9v17h-4v-8l-4 5h-3l-3-5-3 5h-3l-4-5v8z"
        fill="#FF9F2F"
      />
    </svg>
    {text && (
      <span
        className={`font-serif font-semibold ${big ? "text-3xl" : "text-lg"}`}
      >
        Make Me Ready
      </span>
    )}
  </div>
);
