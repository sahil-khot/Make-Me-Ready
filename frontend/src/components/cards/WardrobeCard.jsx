import { Heart } from "../common/Heart.jsx";
import { IMG } from "../../data/constants.js";

export const WardrobeCard = ({ w, on, onClick }) => (
  <div
    onClick={onClick}
    className={`group tile relative aspect-[4/4.3] rounded-2xl overflow-hidden border bg-card2 cursor-pointer transition hover:-translate-y-1 ${
      on
        ? "border-acc shadow-[0_0_20px_rgba(255,159,47,.25)]"
        : "border-line"
    }`}
  >
    <img
      src={w.img || IMG["hero-wardrobe"]}
      alt={w.name}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
    <Heart id={w.id} cls="absolute top-2 right-2" />
    <div className="absolute bottom-0 p-3">
      <div className="text-sm font-medium">{w.name}</div>
      <div className="text-[11px] text-mute">{w.tag}</div>
    </div>
  </div>
);

export const WCard = WardrobeCard;
