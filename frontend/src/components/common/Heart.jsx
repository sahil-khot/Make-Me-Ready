import { Heart as LucideHeart } from "lucide-react";
import { useStore } from "../../context/StoreContext.jsx";

export function Heart({ id, cls = "" }) {
  const { favs = [], toggleFav } = useStore();
  const on = favs.includes(id);

  return (
    <button
      type="button"
      aria-label="Favourite"
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFav(id);
      }}
      className={`grid place-items-center w-8 h-8 rounded-full bg-black/50 backdrop-blur hover:scale-110 transition ${cls}`}
    >
      <LucideHeart
        size={15}
        className={on ? "fill-acc text-acc" : "text-white/80"}
      />
    </button>
  );
}
