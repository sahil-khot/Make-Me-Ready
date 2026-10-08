import { Icon } from "./Icon.jsx";

export const Tabs = ({ items = [], value, onChange, icons }) => (
  <div className="w-full overflow-x-auto pb-1 scrollbar-none">
    <div className="inline-flex min-w-full sm:flex sm:flex-wrap lg:flex-nowrap items-center gap-2 p-1.5 sm:p-2 rounded-2xl border border-white/15 bg-[#121212]/95 backdrop-blur-md shadow-lg">
      {items.map((t, i) => {
        const isActive = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`group shrink-0 whitespace-nowrap h-11 px-4 sm:px-4.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold shadow-[0_0_22px_rgba(245,158,11,0.35)] border border-amber-300 ring-1 ring-amber-400/50 scale-[1.01]"
                : "bg-[#1c1c1c] text-stone-200 border border-white/10 hover:border-amber-500/50 hover:bg-[#252525] hover:text-white"
            }`}
          >
            {icons && icons[i] && (
              <span
                className={`transition-colors ${
                  isActive
                    ? "text-black"
                    : "text-amber-400/90 group-hover:text-amber-300"
                }`}
              >
                <Icon n={icons[i]} size={16} />
              </span>
            )}
            <span>{t}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default Tabs;
