export const Logo = ({ size = 42, text = true, big = false, className = "" }) => (
  <div className={`flex items-center gap-3 select-none ${className}`}>
    <img
      src="/MMR LOGO.png"
      alt="Make Me Ready Logo"
      width={size}
      height={size}
      className="object-contain shrink-0 rounded-xl drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]"
      style={{
        width: size,
        height: size,
      }}
    />
    {text && (
      <span
        className={`font-serif font-bold tracking-tight text-white whitespace-nowrap ${
          big ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        }`}
      >
        Make Me Ready
      </span>
    )}
  </div>
);
