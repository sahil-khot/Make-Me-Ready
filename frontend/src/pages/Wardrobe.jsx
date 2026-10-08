import { useState } from "react";
import {
  Plus,
  Upload,
  LayoutGrid,
  Shirt,
  Layers,
  Footprints,
  Watch,
  Gem,
  MoreHorizontal,
  Sparkles,
  ArrowRight,
  Package,
} from "lucide-react";
import { Hero, Modal } from "../ui.jsx";
import { WardrobeCard } from "../components/cards/WardrobeCard.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

export { WardrobeCard, WardrobeCard as WCard };

// Custom SVG icon for trousers / bottoms
const PantsIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4h16l-1 16-6-2-1-8-1 8-6 2L4 4z" />
  </svg>
);

const CATEGORY_TABS = [
  { id: "All", label: "All", icon: LayoutGrid },
  { id: "Shirts", label: "Shirts", icon: Shirt },
  { id: "Pants", label: "Pants", icon: PantsIcon },
  { id: "Accessories", label: "Accessories", icon: Watch },
  { id: "Jewelry", label: "Jewelry", icon: Gem },
  { id: "Others", label: "Others", icon: MoreHorizontal },
];

const CATEGORY_META = {
  Shirts: { label: "Shirts", icon: Shirt },
  Pants: { label: "Pants", icon: PantsIcon },
  Accessories: { label: "Accessories", icon: Watch },
  Jewelry: { label: "Jewelry", icon: Gem },
  Others: { label: "Others", icon: MoreHorizontal },
};

export default function Wardrobe() {
  const { added = [], addItem, favs = [], catalog = {} } = useStore();
  const { wardrobe = [], cats = ["Shirts", "Pants", "Accessories", "Jewelry", "Others"] } = catalog;
  const [tab, setTab] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", cat: "Shirts", tag: "Casual" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const allItems = [...added, ...wardrobe];

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError("");
    try {
      await addItem(form, image);
      setModalOpen(false);
      setForm({ name: "", cat: "Shirts", tag: "Casual" });
      setImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const visibleCategories =
    tab === "All"
      ? ["Shirts", "Pants", "Accessories", "Jewelry", "Others"]
      : [tab];

  return (
    <div className="space-y-9">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[.08] min-h-[360px] md:min-h-[400px] flex items-center">
        <img
          src={IMG["hero-wardrobe"] || "/img/hero-wardrobe-luxury.jpg"}
          alt="Luxury Wardrobe"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/60 to-transparent" />

        <div className="relative p-6 md:p-10 w-full max-w-2xl z-10">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] text-white">
            My <span className="text-[#f59e0b]">Wardrobe</span>
          </h1>
          <p className="text-stone-300 mt-2.5 mb-7 text-sm md:text-base leading-relaxed font-sans max-w-lg">
            Add your clothes, accessories and build your perfect style.
          </p>

          {/* 3 Stat Badges */}
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/[.1]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[.05] border border-white/[.08] text-amber-400">
                <Shirt size={18} />
              </span>
              <div>
                <div className="font-bold text-lg text-white leading-tight">{allItems.length}</div>
                <div className="text-[11px] text-stone-400">Items</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/[.1]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[.05] border border-white/[.08] text-amber-400">
                <Package size={18} />
              </span>
              <div>
                <div className="font-bold text-lg text-white leading-tight">5</div>
                <div className="text-[11px] text-stone-400">Categories</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/[.1]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[.05] border border-white/[.08] text-amber-400">
                <Sparkles size={18} />
              </span>
              <div>
                <div className="font-bold text-lg text-white leading-tight">{favs.length > 0 ? favs.length : 12}</div>
                <div className="text-[11px] text-stone-400">Favorite Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Script text & Add button on right side */}
        <div className="hidden lg:block absolute right-8 top-8 w-56 font-script text-3xl md:text-4xl text-[#d4af37]/90 leading-tight -rotate-3 z-10 pointer-events-none">
          Your Style.
          <br />
          Your Story.
          <br />
          Always Ready.
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="absolute right-6 md:right-10 bottom-6 md:bottom-10 z-10 h-11 px-6 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-semibold text-sm shadow-[0_0_24px_rgba(245,158,11,0.35)] flex items-center gap-2 hover:brightness-110 transition cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          Add New Item
        </button>
      </div>

      {/* ── Category Filter Bar ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((item) => {
          const IconComponent = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-w-[80px] h-[72px] px-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-gradient-to-b from-[#2e1d11] to-[#1c120a] border border-amber-600/60 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.22)]"
                  : "bg-[#131313] border border-white/[.08] text-stone-400 hover:text-white hover:border-white/20"
              }`}
            >
              <IconComponent
                size={20}
                className={isActive ? "text-amber-400" : "text-stone-400"}
              />
              <span className="text-[12px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Category Sections ── */}
      <div className="space-y-10">
        {visibleCategories.map((catKey) => {
          const meta = CATEGORY_META[catKey] || { label: catKey, icon: Shirt };
          const CatIcon = meta.icon;
          const items = allItems.filter((w) => w.cat === catKey);

          return (
            <section key={catKey}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-amber-500">
                    <CatIcon size={22} />
                  </span>
                  <h2 className="font-serif font-semibold text-2xl text-white tracking-wide">
                    {meta.label}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setTab(catKey)}
                  className="text-sm font-medium text-amber-500 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {/* Items Grid (5 columns on large screens as in photo) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {items.map((w) => (
                  <WardrobeCard key={w.id} w={w} />
                ))}
              </div>

              {items.length === 0 && (
                <div className="card p-8 text-center text-sm text-stone-400">
                  No items in this category yet. Click "+ Add New Item" to add clothes!
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Add New Item Modal ── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Item">
        <form onSubmit={handleAddItem} className="space-y-4">
          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Item Name</span>
            <input
              autoFocus
              className="inp"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Linen Overshirt"
            />
          </label>

          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Category</span>
            <select
              className="inp"
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Style Tag</span>
            <select
              className="inp"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            >
              {["Casual", "Formal", "Winter", "Sports", "Accessory", "Jewelry"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="btn-s w-full h-12 cursor-pointer flex items-center justify-center gap-2">
            <Upload size={16} />
            <span>{image?.name || "Upload Clothing Photo"}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button type="submit" className="btn-p w-full h-12 mt-2">
            Add to Wardrobe
          </button>
        </form>
      </Modal>
    </div>
  );
}
