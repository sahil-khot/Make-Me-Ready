import { useState } from "react";
import { Shirt, Check } from "lucide-react";
import { Heart } from "../common/Heart.jsx";
import { Modal } from "../common/Modal.jsx";
import { useStore } from "../../context/StoreContext.jsx";

export function LookCard({ l, saved }) {
  const { toggleSave, saved: sv = [], catalog } = useStore();
  const wardrobeItems = catalog?.wardrobe || [];
  const by = Object.fromEntries(wardrobeItems.map((w) => [w.id, w]));

  const [modalOpen, setModalOpen] = useState(false);
  const [wornOpen, setWornOpen] = useState(false);

  return (
    <div className="card p-3 hover:-translate-y-1 hover:border-line2 animate-up">
      <div className="group tile relative rounded-xl overflow-hidden aspect-[4/3] bg-card2">
        <img
          src={l.img}
          alt={l.title}
          className="absolute left-0 top-0 h-full w-[68%] object-cover"
        />
        <Heart id={"look-" + l.id} cls="absolute top-2 left-2" />
        <div className="absolute right-2 top-2 bottom-2 w-[26%] rounded-xl bg-black/50 backdrop-blur p-1.5 flex flex-col gap-1.5">
          {l.items.map((i) => (
            <img
              key={i}
              src={by[i]?.img || "/img/hero-wardrobe.jpg"}
              alt={by[i]?.name || "Item"}
              className="flex-1 min-h-0 w-full rounded-lg object-cover bg-card2"
            />
          ))}
        </div>
      </div>

      <div className="px-1 pt-3">
        <h3 className="font-serif font-semibold">{l.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {l.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-mute"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-s h-10 rounded-xl text-sm"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => setWornOpen(true)}
            className="btn-p h-10 rounded-xl text-sm"
          >
            <Shirt size={15} />
            Wear This
          </button>
        </div>

        {saved && (
          <button
            type="button"
            onClick={() => toggleSave(l.id)}
            className="text-xs text-mute hover:text-acc mt-3"
          >
            {sv.includes(l.id) ? "Remove from saved" : "Save look"}
          </button>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={l.title}
      >
        <div className="grid grid-cols-5 gap-2 mb-4">
          {l.items.map((i) => (
            <div key={i}>
              <img
                src={by[i]?.img || "/img/hero-wardrobe.jpg"}
                alt=""
                className="aspect-square rounded-lg object-cover"
              />
              <div className="text-[10px] text-mute mt-1 truncate">
                {by[i]?.name || "Wardrobe Item"}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            toggleSave(l.id);
            setModalOpen(false);
          }}
          className="btn-p w-full"
        >
          {sv.includes(l.id) ? "Remove from Saved" : "Save Look"}
        </button>
      </Modal>

      <Modal
        open={wornOpen}
        onClose={() => setWornOpen(false)}
        title="Looking sharp!"
      >
        <p className="text-mute text-sm mb-4 flex items-center gap-2">
          <Check className="text-acc shrink-0" size={18} />
          {l.title} is set as today's outfit.
        </p>
        <button
          type="button"
          onClick={() => setWornOpen(false)}
          className="btn-p w-full"
        >
          Done
        </button>
      </Modal>
    </div>
  );
}

export default LookCard;
