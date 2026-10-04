export const Logo = ({ size = 34, text = true, big = false }) => (
  <div className="flex items-center gap-2.5">
    <img
      src="/img/logo.jpg"
      alt="Make Me Ready"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
    />
    {text && (
      <span
        className={`font-serif font-semibold ${big ? "text-3xl" : "text-lg"}`}
      >
        Make Me Ready
      </span>
    )}
  </div>
);
