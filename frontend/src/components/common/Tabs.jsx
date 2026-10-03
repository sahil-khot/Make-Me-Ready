import { Icon } from "./Icon.jsx";

export const Tabs = ({ items = [], value, onChange, icons }) => (
  <div className="flex gap-3 overflow-x-auto p-2 rounded-2xl border border-line bg-white/[.02] animate-up">
    {items.map((t, i) => (
      <button
        key={t}
        type="button"
        onClick={() => onChange(t)}
        className={`flex-1 min-w-[110px] h-12 px-4 rounded-full text-sm flex items-center justify-center gap-2 transition duration-200 ${
          value === t
            ? "bg-acc text-black font-medium shadow-[0_4px_20px_rgba(255,159,47,.3)]"
            : "bg-white/[.03] text-mute hover:text-white"
        }`}
      >
        {icons && icons[i] && <Icon n={icons[i]} size={16} />}
        {t}
      </button>
    ))}
  </div>
);
