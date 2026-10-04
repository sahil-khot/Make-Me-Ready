import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, ArrowRight, Plus, Sparkles, Check } from "lucide-react";
import { Hero, Heart, OccCard, Modal } from "../ui.jsx";
import { WCard } from "./Wardrobe.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

const Step = ({ n, t, s, right, badge }) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
    <div className="flex gap-3.5 items-start">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-acc text-black font-bold text-sm shrink-0 shadow-md shadow-amber-500/20">
        {n}
      </span>
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif font-semibold text-xl text-white tracking-wide">
            {t}
          </h2>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/40 text-amber-400">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-stone-400 mt-0.5">{s}</p>
      </div>
    </div>
    {right}
  </div>
);

export default function CreateOutfit() {
  const { toggleSave, saved, catalog, added } = useStore();
  const { occasions, wardrobe, cats, looks } = catalog;
  const allWardrobe = useMemo(() => [...added, ...wardrobe], [added, wardrobe]);

  const [o, setO] = useState("casual");
  const [c, setC] = useState("Tops");
  const [sel, setSel] = useState(["white-shirt"]);
  const [seed, setSeed] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ok, setOk] = useState(false);

  // Intelligently generate matching looks for the selected occasion and selected wardrobe items
  const gen = useMemo(() => {
    const occLooks = (looks || []).filter((l) => l.occ === o);

    // Score looks by how many selected items they contain
    const scored = occLooks
      .map((look) => {
        const matches = (look.items || []).filter((i) => sel.includes(i)).length;
        return { ...look, matches };
      })
      .sort((a, b) => b.matches - a.matches);

    // If fewer than 3 looks exist for this occasion, supplement with others
    const otherLooks = (looks || []).filter((l) => l.occ !== o);
    const pool = scored.length >= 3 ? scored : [...scored, ...otherLooks];

    // Cycle through looks when clicking "Regenerate Looks"
    const offset = pool.length > 0 ? (seed * 3) % pool.length : 0;
    const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

    return rotated.slice(0, 3);
  }, [o, seed, looks, sel]);

  const handleRegenerate = () => {
    setIsSpinning(true);
    setSeed((s) => s + 1);
    setTimeout(() => setIsSpinning(false), 500);
  };

  const steps = [
    "Select Occasion",
    "Choose Items",
    "Generate Looks",
    "Finalize & Save",
  ];

  return (
    <div className="space-y-6">
      {/* ── Premium Hero Banner (Enhanced Height & Typography) ── */}
      <Hero
        img={IMG["hero-wardrobe"] || "/img/hero-wardrobe-luxury.jpg"}
        script={
          <>
            Your Wardrobe.
            <br />
            New Possibilities.
            <br />
            Every Occasion.
          </>
        }
        h="min-h-[320px] md:min-h-[360px]"
      >
        <div className="max-w-xl">
          <span className="text-xs uppercase font-bold tracking-[.3em] text-acc mb-3 block">
            Make Me Ready · AI Styling Studio
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            Create <span className="text-acc">Outfit</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed max-w-lg">
            Build your perfect look for any occasion using pieces from your
            curated wardrobe with intelligent styling matches.
          </p>
        </div>
      </Hero>

      {/* ── Steps Tracker ── */}
      <div className="hidden md:flex items-center gap-4 text-sm bg-card2/60 border border-white/[.06] rounded-2xl p-4">
        {steps.map((s, i) => {
          const isDone = i === 0;
          return (
            <div key={s} className="flex items-center gap-3 flex-1">
              <span
                className={`grid place-items-center w-8 h-8 rounded-full text-xs font-bold transition ${
                  isDone
                    ? "bg-acc text-black shadow-md shadow-amber-500/20"
                    : "bg-white/[.05] border border-white/10 text-stone-400"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-sm font-medium ${
                  isDone ? "text-white" : "text-stone-400"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <i className="flex-1 h-px bg-white/[.08] ml-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Select Occasion ── */}
      <section className="card p-6">
        <Step
          n="1"
          t="Select Occasion"
          s="Choose the event and let our stylist curate tailored outfits for you."
          right={
            <Link
              to="/occasions"
              className="text-sm font-medium text-acc hover:text-amber-400 flex items-center gap-1 transition self-start sm:self-auto"
            >
              View All Occasions →
            </Link>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3.5">
          {occasions
            .filter((x) =>
              [
                "casual",
                "college",
                "office",
                "date",
                "party",
                "wedding",
                "mountain",
              ].includes(x.id),
            )
            .map((x) => (
              <OccCard
                key={x.id}
                o={x}
                small
                on={o === x.id}
                onClick={() => setO(x.id)}
              />
            ))}
        </div>
      </section>

      {/* ── Step 2: Choose from Your Wardrobe ── */}
      <section className="card p-6">
        <Step
          n="2"
          t="Choose from Your Wardrobe"
          s="Pick key pieces from your wardrobe to incorporate into your outfit."
          badge={
            sel.length > 0 ? `${sel.length} item${sel.length > 1 ? "s" : ""} selected` : null
          }
          right={
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {sel.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSel([])}
                  className="text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition"
                >
                  Clear Selection
                </button>
              )}
              <Link to="/wardrobe" className="btn-s h-9 text-xs sm:text-sm">
                <Plus size={14} />
                Add New Item
              </Link>
            </div>
          }
        />

        {/* Category Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 mb-5">
          {cats.map((catName) => (
            <button
              key={catName}
              onClick={() => setC(catName)}
              className={`chip shrink-0 ${c === catName ? "chip-on" : ""}`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Wardrobe Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {allWardrobe
            .filter((w) => w.cat === c)
            .map((w) => {
              const isSelected = sel.includes(w.id);
              return (
                <div key={w.id} className="relative group">
                  <WCard
                    w={w}
                    on={isSelected}
                    onClick={() =>
                      setSel((s) =>
                        s.includes(w.id)
                          ? s.filter((i) => i !== w.id)
                          : [...s, w.id],
                      )
                    }
                  />
                  {isSelected && (
                    <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-acc text-black flex items-center justify-center pointer-events-none shadow-md shadow-amber-500/30 z-20">
                      <Check size={13} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* ── Step 3: Generated Outfit Looks (Matching Outfits & Accessories) ── */}
      <section className="card p-6">
        <Step
          n="3"
          t="Generated Outfit Looks"
          s="Curated complete looks matching your selected occasion and wardrobe."
          right={
            <button
              onClick={handleRegenerate}
              className="btn-s h-10 text-xs sm:text-sm flex items-center gap-2 self-start sm:self-auto hover:border-amber-500/40"
            >
              <RefreshCw
                size={14}
                className={isSpinning ? "animate-spin text-acc" : "text-stone-400"}
              />
              <span>Regenerate Looks</span>
            </button>
          }
        />

        <div className="grid md:grid-cols-3 gap-6">
          {gen.map((l) => (
            <div
              key={l.id}
              className="card p-3.5 bg-card2 border border-white/[.08] hover:border-amber-500/40 transition flex flex-col group"
            >
              {/* Look Preview with Right-Side Matching Accessories Strip */}
              <div className="relative aspect-[4/3.4] rounded-xl overflow-hidden bg-black/40 shadow-inner">
                {/* Main Look Photo */}
                <img
                  src={l.img}
                  alt={l.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `/img/${l.occ}.jpg`;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Vertical Matching Accessories Column on Right */}
                <div
                  className="absolute right-2.5 top-2.5 bottom-2.5 w-14 sm:w-16 rounded-xl bg-black/65 backdrop-blur-md p-1.5 flex flex-col gap-1.5 border border-white/15 shadow-xl z-10"
                  title="Matching clothing & accessories in this look"
                >
                  {(l.items || []).map((itemId) => {
                    const itemObj = allWardrobe.find((w) => w.id === itemId);
                    const itemImg = itemObj?.img || `/img/${itemId}.jpg`;
                    const itemName = itemObj?.name || itemId.replace("-", " ");

                    return (
                      <div
                        key={itemId}
                        className="relative flex-1 min-h-0 rounded-lg overflow-hidden bg-white/5 border border-white/10 group/thumb hover:border-amber-400 transition"
                        title={itemName}
                      >
                        <img
                          src={itemImg}
                          alt={itemName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `/img/${itemId}.jpg`;
                          }}
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Look Details & Meta */}
              <div className="flex justify-between items-start mt-3.5 px-1">
                <div>
                  <h3 className="font-serif font-semibold text-white text-base">
                    {l.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {(l.tags || []).join(" · ")}
                  </p>
                </div>
                <Heart id={"look-" + l.id} cls="!bg-transparent" />
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2 border-t border-white/[.06] flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {(l.items || []).length} matched pieces
                </span>
                <button
                  type="button"
                  onClick={() => toggleSave(l.id)}
                  className="btn-p h-9 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  {saved.includes(l.id) ? (
                    <>
                      <Check size={13} />
                      Saved
                    </>
                  ) : (
                    <>
                      Use This Look
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Step 4: Finalize & Save ── */}
      <section className="card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3.5 items-center">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-acc text-black font-bold text-sm shadow-md shadow-amber-500/20">
            4
          </span>
          <div>
            <h2 className="font-serif font-semibold text-xl text-white">
              Finalize & Save
            </h2>
            <p className="text-sm text-stone-400">
              Save your favorite generated look to your wardrobe collection.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/wardrobe" className="btn-s h-11 text-sm">
            + Save to Wardrobe
          </Link>
          <button
            type="button"
            onClick={() => {
              if (gen[0] && !saved.includes(gen[0].id)) {
                toggleSave(gen[0].id);
              }
              setOk(true);
            }}
            className="btn-p h-11 text-sm flex items-center gap-2"
          >
            <Sparkles size={14} />
            Save Look
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── Look Saved Modal ── */}
      <Modal open={ok} onClose={() => setOk(false)} title="Look Saved Successfully">
        <div className="p-2">
          <p className="text-sm text-stone-300 mb-5 leading-relaxed">
            Your styled look has been saved to your collection. You can review,
            customize, or share it anytime.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOk(false)}
              className="btn-s flex-1 h-11 text-sm"
            >
              Continue Styling
            </button>
            <Link to="/saved-looks" className="btn-p flex-1 h-11 text-sm text-center flex items-center justify-center">
              View Saved Looks
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
