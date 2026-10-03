import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Hero, Section, Heart, Modal, Tabs } from "../ui.jsx";
import { useStore } from "../store.jsx";
export const WCard = ({ w, on, onClick }) => (
  <div
    onClick={onClick}
    className={`group tile relative aspect-[4/4.3] rounded-2xl overflow-hidden border bg-card2 cursor-pointer transition hover:-translate-y-1 ${on ? "border-acc shadow-[0_0_20px_rgba(255,159,47,.25)]" : "border-line"}`}
  >
    <img src={w.img} alt={w.name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
    <Heart id={w.id} cls="absolute top-2 right-2" />
    <div className="absolute bottom-0 p-3">
      <div className="text-sm font-medium">{w.name}</div>
      <div className="text-[11px] text-mute">{w.tag}</div>
    </div>
  </div>
);
export default function Wardrobe() {
  const { added, addItem, favs, catalog } = useStore();
  const { wardrobe, cats } = catalog;
  const [tab, setTab] = useState("All");
  const [m, setM] = useState(false);
  const [f, setF] = useState({ name: "", cat: "Tops", tag: "Casual" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const all = [...added, ...wardrobe];
  const show = tab === "All" ? cats : [tab];
  const sub = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    setError("");
    try {
      await addItem(f, image);
      setM(false);
      setF({ ...f, name: "" });
      setImage(null);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <Hero
        img="/img/hero-wardrobe.jpg"
        script={
          <>
            Your Style.
            <br />
            Your Story.
            <br />
            Always Ready.
          </>
        }
      >
        <h1 className="h1">
          My <span className="text-acc">Wardrobe</span>
        </h1>
        <p className="text-mute mt-3">
          Add your clothes, accessories and build your perfect style.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            [all.length, "Items"],
            [cats.length, "Categories"],
            [
              favs.filter((x) => all.some((w) => w.id === x)).length,
              "Favorite Items",
            ],
          ].map(([a, b]) => (
            <div key={b} className="card px-5 py-3">
              <div className="font-semibold">{a}</div>
              <div className="text-xs text-mute">{b}</div>
            </div>
          ))}
          <button onClick={() => setM(true)} className="btn-p h-14 ml-auto">
            + Add New Item
          </button>
        </div>
      </Hero>
      <div className="mt-6">
        <Tabs items={["All", ...cats]} value={tab} onChange={setTab} />
      </div>
      {show.map((c) => (
        <Section key={c} title={c} to="#">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {all
              .filter((w) => w.cat === c)
              .map((w) => (
                <WCard key={w.id} w={w} />
              ))}
          </div>
        </Section>
      ))}
      <Modal open={m} onClose={() => setM(false)} title="Add New Item">
        <form onSubmit={sub} className="space-y-3">
          <label className="block text-sm">
            Item name
            <input
              autoFocus
              className="inp mt-2"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="e.g. Linen Overshirt"
            />
          </label>
          <label className="block text-sm">
            Category
            <select
              className="inp mt-2"
              value={f.cat}
              onChange={(e) => setF({ ...f, cat: e.target.value })}
            >
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Style
            <select
              className="inp mt-2"
              value={f.tag}
              onChange={(e) => setF({ ...f, tag: e.target.value })}
            >
              {["Casual", "Formal", "Winter", "Sports"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="btn-s w-full h-12 cursor-pointer">
            <Upload size={16} />
            {image?.name || "Choose an item photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <button className="btn-p w-full mt-2">Add Item</button>
        </form>
      </Modal>
    </div>
  );
}
