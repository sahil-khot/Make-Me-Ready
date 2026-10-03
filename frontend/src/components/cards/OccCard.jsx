import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

export function OccCard({ o, onClick, on, small }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => (onClick ? onClick(o) : navigate("/create-outfit"))}
      className={`group tile relative overflow-hidden rounded-2xl border text-left aspect-[4/5] transition duration-200 hover:-translate-y-1 ${
        on
          ? "border-acc shadow-[0_0_24px_rgba(255,159,47,.25)]"
          : "border-line"
      }`}
    >
      <img
        src={o.img}
        alt={o.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      {on && (
        <span className="absolute top-2 right-2 grid place-items-center w-6 h-6 rounded-full bg-acc text-black">
          <Check size={14} />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between">
        <div>
          <div className="font-serif font-semibold">{o.title}</div>
          {!small && <div className="text-[11px] text-mute">{o.sub}</div>}
        </div>
        {!small && (
          <span className="grid place-items-center w-8 h-8 rounded-full border border-acc/60 text-acc bg-black/40">
            <ArrowRight size={14} />
          </span>
        )}
      </div>
    </button>
  );
}
