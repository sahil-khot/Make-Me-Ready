import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export function OccCard({ o, onClick, on, small }) {
  const navigate = useNavigate();
  const title = o.name || o.title;
  const image = o.image || o.img;

  const handleClick = () => {
    if (onClick) {
      onClick(o);
    } else {
      navigate("/create-outfit", { state: { occasion: o.id, occasionName: title } });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group tile relative overflow-hidden rounded-2xl border text-left aspect-[2/3] transition duration-200 hover:-translate-y-1 ${
        on
          ? "border-acc shadow-[0_0_24px_rgba(255,159,47,.25)]"
          : "border-white/[.08] hover:border-amber-500/50"
      }`}
    >
      <img
        src={image}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `/img/${o.id}.jpg`;
        }}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      {on && (
        <span className="absolute top-2 right-2 grid place-items-center w-6 h-6 rounded-full bg-acc text-black">
          <Check size={14} />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between">
        <div className="min-w-0 pr-1">
          <div className="font-serif font-bold text-[16px] text-white tracking-wide truncate">
            {o.title}
          </div>
          {!small && (
            <div className="text-[11px] text-stone-300 font-medium truncate mt-0.5">
              {o.sub}
            </div>
          )}
        </div>
        {!small && (
          <span className="grid place-items-center w-7 h-7 rounded-full border border-white/20 text-amber-400 bg-black/60 shrink-0 group-hover:scale-110 group-hover:border-amber-500 transition">
            <ArrowRight size={13} />
          </span>
        )}
      </div>
    </button>
  );
}
