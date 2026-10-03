import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, ArrowRight, Plus } from "lucide-react";
import { Hero, Heart, OccCard, Modal } from "../ui.jsx";
import { WCard } from "./Wardrobe.jsx";
import { useStore } from "../store.jsx";
const Step = ({ n, t, s, right }) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div className="flex gap-4">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-acc text-black font-semibold shrink-0">
        {n}
      </span>
      <div>
        <h2 className="h2">{t}</h2>
        <p className="text-sm text-mute">{s}</p>
      </div>
    </div>
    {right}
  </div>
);
export default function CreateOutfit() {
  const { toggleSave, saved, catalog, added } = useStore();
  const { occasions, wardrobe, cats, looks } = catalog;
  const allWardrobe = [...added, ...wardrobe];
  const [o, setO] = useState("casual");
  const [c, setC] = useState("Tops");
  const [sel, setSel] = useState(["white-shirt"]);
  const [seed, setSeed] = useState(0);
  const [ok, setOk] = useState(false);
  const gen = useMemo(() => {
    const a = (looks || []).filter((l) => l.occ === o);
    const rest = (looks || []).filter((l) => l.occ !== o);
    const offset = rest.length > 0 ? seed % rest.length : 0;
    const r = [...a, ...rest.slice(offset), ...rest];
    return r
      .slice(0, 3)
      .map((l) => ({
        ...l,
        img: (occasions || []).find((x) => x.id === o)?.img || l.img,
      }));
  }, [o, seed, looks, occasions]);
  const steps = [
    "Select Occasion",
    "Choose Items",
    "Generate Looks",
    "Finalize & Save",
  ];
  return (
    <div>
      <Hero
        img="/img/hero-wardrobe.jpg"
        script={
          <>
            Your Wardrobe.
            <br />
            New Possibilities.
            <br />
            Every Occasion.
          </>
        }
        h="min-h-[220px]"
      >
        <h1 className="h1">
          Create <span className="text-acc">Outfit</span>
        </h1>
        <p className="text-mute mt-3">
          Build your perfect look for any occasion using your wardrobe.
        </p>
      </Hero>
      <div className="hidden md:flex items-center gap-4 mt-6 text-sm">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <span
              className={`grid place-items-center w-8 h-8 rounded-full ${i == 0 ? "bg-acc text-black" : "bg-card2 text-mute"}`}
            >
              {i + 1}
            </span>
            <span className={i == 0 ? "" : "text-mute"}>{s}</span>
            <i className="flex-1 h-px bg-line2" />
          </div>
        ))}
      </div>
      <section className="card p-6 mt-6">
        <Step
          n="1"
          t="Select Occasion"
          s="Choose the event and let us tailor the outfits for you."
          right={
            <Link to="/occasions" className="text-sm text-acc">
              View All →
            </Link>
          }
        />
        <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
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
      <section className="card p-6 mt-6">
        <Step
          n="2"
          t="Choose from Your Wardrobe"
          s="Pick items from your wardrobe or let AI suggest the best matches."
          right={
            <Link to="/wardrobe" className="btn-s h-10 text-sm">
              <Plus size={14} />
              Add New Item
            </Link>
          }
        />
        <div className="flex gap-3 overflow-x-auto mb-5">
          {cats.map((x) => (
            <button
              key={x}
              onClick={() => setC(x)}
              className={`chip shrink-0 ${c === x ? "chip-on" : ""}`}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {allWardrobe
            .filter((w) => w.cat === c)
            .map((w) => (
              <WCard
                key={w.id}
                w={w}
                on={sel.includes(w.id)}
                onClick={() =>
                  setSel((s) =>
                    s.includes(w.id)
                      ? s.filter((i) => i !== w.id)
                      : [...s, w.id],
                  )
                }
              />
            ))}
        </div>
      </section>
      <section className="card p-6 mt-6">
        <Step
          n="3"
          t="Generated Outfit Looks"
          s="Here are some personalized outfit ideas for you."
          right={
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="btn-s h-10 text-sm"
            >
              <RefreshCw size={14} />
              Regenerate Looks
            </button>
          }
        />
        <div className="grid md:grid-cols-3 gap-5">
          {gen.map((l) => (
            <div key={l.id} className="card p-3 bg-card2">
              <div className="relative aspect-[4/3.4] rounded-xl overflow-hidden">
                <img
                  src={l.img}
                  alt={l.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute right-2 top-2 bottom-2 w-14 rounded-xl bg-black/50 backdrop-blur p-1 flex flex-col gap-1">
                  {l.items.map((i) => (
                    <img
                      key={i}
                      src={allWardrobe.find((w) => w.id === i)?.img}
                      alt=""
                      className="flex-1 min-h-0 rounded object-cover"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-start mt-3">
                <div>
                  <h3 className="font-serif font-semibold">{l.title}</h3>
                  <p className="text-xs text-mute">{l.tags.join(" · ")}</p>
                </div>
                <Heart id={"look-" + l.id} cls="!bg-transparent" />
              </div>
              <button
                onClick={() => {
                  toggleSave(l.id);
                }}
                className="btn-p h-10 text-sm mt-3 ml-auto flex"
              >
                {saved.includes(l.id) ? "Saved ✓" : "Use This Look"}{" "}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="card p-6 mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-acc text-black font-semibold">
            4
          </span>
          <div>
            <h2 className="h2">Finalize & Save</h2>
            <p className="text-sm text-mute">
              Save your favorite look or make adjustments.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/wardrobe" className="btn-s">
            + Save to Wardrobe
          </Link>
          <button
            onClick={() => {
              gen[0] && !saved.includes(gen[0].id) && toggleSave(gen[0].id);
              setOk(true);
            }}
            className="btn-p h-12"
          >
            Save Look <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <Modal open={ok} onClose={() => setOk(false)} title="Look saved">
        <p className="text-sm text-mute mb-4">
          Your look is now in Saved Looks.
        </p>
        <Link to="/saved-looks" className="btn-p w-full">
          View Saved Looks
        </Link>
      </Modal>
    </div>
  );
}
