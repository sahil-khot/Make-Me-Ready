import { Heart, MoreVertical, Trash2 } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";
import { IMG } from "../../data/constants.js";

export const WardrobeCard = ({ w, on, onClick, onRemove }) => {
  const { favs = [], toggleFav } = useStore();
  const isFav = favs.includes(w.id);

  return (
    <div
      onClick={onClick}
      className={`group tile relative aspect-[4/4.8] rounded-2xl overflow-hidden border bg-[#131313] cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
        on
          ? "border-acc shadow-[0_0_20px_rgba(255,159,47,.25)]"
          : "border-white/[.08] hover:border-amber-500/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      }`}
    >
      <img
        src={w.img || w.image || IMG["white-shirt"] || "/img/hero-wardrobe-luxury.jpg"}
        alt={w.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
        }}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

      {/* Action buttons at top right */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(w.id);
          }}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
          className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm grid place-items-center hover:scale-110 transition border border-white/10"
        >
          <Heart
            size={13}
            className={isFav ? "fill-[#ef4444] text-[#ef4444]" : "text-white/60 hover:text-white"}
          />
        </button>

        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(w);
            }}
            title="Remove item"
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-red-500/80 backdrop-blur-sm grid place-items-center hover:scale-110 transition border border-white/10 text-white/60 hover:text-white"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Bottom item information */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 z-10">
        <div className="text-[14px] font-medium text-white truncate leading-snug">
          {w.name}
        </div>
        <div className="text-[11px] text-stone-400 font-sans mt-0.5 truncate flex items-center justify-between">
          <span>{w.tag || "Casual"}</span>
          {w.brand && <span className="text-[10px] text-acc/80 uppercase font-semibold">{w.brand}</span>}
        </div>
      </div>
    </div>
  );
};

export const WCard = WardrobeCard;
