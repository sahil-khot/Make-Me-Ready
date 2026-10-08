import { useState, useMemo } from "react";
import {
  Plus,
  Upload,
  LayoutGrid,
  Shirt,
  Footprints,
  Watch,
  Gem,
  MoreHorizontal,
  Sparkles,
  ArrowRight,
  Package,
  Trash2,
  AlertCircle,
  Check,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Modal } from "../ui.jsx";
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
  { id: "Shoes", label: "Shoes", icon: Footprints },
  { id: "Accessories", label: "Accessories", icon: Watch },
  { id: "Jewelry", label: "Jewelry", icon: Gem },
  { id: "Others", label: "Others", icon: MoreHorizontal },
];

const CATEGORY_META = {
  Shirts: { label: "Shirts", icon: Shirt },
  Pants: { label: "Pants", icon: PantsIcon },
  Shoes: { label: "Shoes", icon: Footprints },
  Accessories: { label: "Accessories", icon: Watch },
  Jewelry: { label: "Jewelry", icon: Gem },
  Others: { label: "Others", icon: MoreHorizontal },
};

export default function Wardrobe() {
  const {
    added = [],
    addItem,
    removeItem,
    favs = [],
    catalog = {},
  } = useStore();

  const {
    wardrobe = [],
    cats = ["Shirts", "Pants", "Shoes", "Accessories", "Jewelry", "Others"],
  } = catalog;

  const [tab, setTab] = useState("All");

  // Add Item Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cat: "Shirts",
    brand: "",
    color: "",
    size: "",
    tag: "Casual",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Remove Item Confirmation Modal state
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  // Combine items and calculate active counts
  const allItems = useMemo(() => [...added, ...wardrobe], [added, wardrobe]);

  // Handle image selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageError(false);
      setError("");
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Add item handler with strict image validation
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    setImageError(false);

    if (!form.name.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!image) {
      setImageError(true);
      setError("Item image is required.");
      return;
    }

    setSaving(true);
    try {
      await addItem(form, image);
      setModalOpen(false);
      setForm({
        name: "",
        cat: "Shirts",
        brand: "",
        color: "",
        size: "",
        tag: "Casual",
      });
      setImage(null);
      setImagePreview(null);
      triggerToast("✓ Item added to wardrobe successfully!");
    } catch (err) {
      setError(err.message || "Failed to add wardrobe item.");
    } finally {
      setSaving(false);
    }
  };

  // Remove item handler with confirmation
  const handleConfirmRemove = async () => {
    if (!confirmDelete) return;
    const targetItem = confirmDelete;
    setDeleting(true);
    try {
      await removeItem(targetItem.id);
      setConfirmDelete(null);
      triggerToast(`✓ "${targetItem.name}" removed from wardrobe.`);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setDeleting(false);
    }
  };

  const visibleCategories =
    tab === "All"
      ? ["Shirts", "Pants", "Shoes", "Accessories", "Jewelry", "Others"]
      : [tab];

  // Calculate active categories that have at least 1 item
  const activeCategoriesCount = useMemo(() => {
    const uniqueCats = new Set(allItems.map((w) => w.cat));
    return uniqueCats.size || 6;
  }, [allItems]);

  return (
    <div className="space-y-9 relative">
      {/* ── Global Toast Notification ── */}
      {toastMsg && (
        <div
          role="status"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#0a1a12] border-2 border-emerald-500/80 text-white shadow-[0_12px_45px_rgba(16,185,129,0.45)] backdrop-blur-md animate-up text-sm font-semibold max-w-md w-[92%]"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-black grid place-items-center font-bold text-xs shrink-0">
            ✓
          </div>
          <span className="flex-1 text-emerald-300">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg("")}
            className="text-stone-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}

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
            Add your clothes, accessories and footwear to build your perfect style.
          </p>

          {/* 3 Stat Badges */}
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/[.1]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[.05] border border-white/[.08] text-amber-400">
                <Shirt size={18} />
              </span>
              <div>
                <div className="font-bold text-lg text-white leading-tight">
                  {allItems.length}
                </div>
                <div className="text-[11px] text-stone-400">Total Items</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/[.1]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[.05] border border-white/[.08] text-amber-400">
                <Package size={18} />
              </span>
              <div>
                <div className="font-bold text-lg text-white leading-tight">
                  {activeCategoriesCount}
                </div>
                <div className="text-[11px] text-stone-400">Categories</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/[.1]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/[.05] border border-white/[.08] text-amber-400">
                <Sparkles size={18} />
              </span>
              <div>
                <div className="font-bold text-lg text-white leading-tight">
                  {favs.length > 0 ? favs.length : 12}
                </div>
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
          onClick={() => {
            setError("");
            setImageError(false);
            setModalOpen(true);
          }}
          className="absolute right-6 md:right-10 bottom-6 md:bottom-10 z-10 h-11 px-6 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-semibold text-sm shadow-[0_0_24px_rgba(245,158,11,0.35)] flex items-center gap-2 hover:brightness-110 transition cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          Add Items
        </button>
      </div>

      {/* ── Category Filter Bar ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((item) => {
          const IconComponent = item.icon;
          const isActive = tab === item.id;
          const count =
            item.id === "All"
              ? allItems.length
              : allItems.filter((w) => w.cat === item.id).length;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-w-[84px] h-[72px] px-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-gradient-to-b from-[#2e1d11] to-[#1c120a] border border-amber-600/60 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.22)]"
                  : "bg-[#131313] border border-white/[.08] text-stone-400 hover:text-white hover:border-white/20"
              }`}
            >
              <IconComponent size={20} />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium leading-none">{item.label}</span>
                <span className="text-[10px] text-stone-500 leading-none">({count})</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Category Rows / Items ── */}
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
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-line text-stone-400">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, cat: catKey }));
                      setModalOpen(true);
                    }}
                    className="text-xs font-semibold text-acc hover:underline flex items-center gap-1"
                  >
                    + Add to {meta.label}
                  </button>
                  {tab === "All" && (
                    <button
                      type="button"
                      onClick={() => setTab(catKey)}
                      className="text-sm font-medium text-stone-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      View Only <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {items.map((w) => (
                  <WardrobeCard
                    key={w.id}
                    w={w}
                    onRemove={(item) => setConfirmDelete(item)}
                  />
                ))}
              </div>

              {items.length === 0 && (
                <div className="card p-8 text-center text-sm text-stone-400 border-dashed border-white/10">
                  <p className="mb-3">No items in {meta.label} yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, cat: catKey }));
                      setModalOpen(true);
                    }}
                    className="btn-s h-9 px-4 text-xs border-acc/40 text-acc hover:border-acc"
                  >
                    + Add New {meta.label}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Fully Functional Add New Item Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setError("");
          setImageError(false);
        }}
        title="Add New Wardrobe Item"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          {/* Category & Item Name */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block mb-1 text-white/80 font-medium">
                Category <span className="text-red-400">*</span>
              </span>
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
              <span className="block mb-1 text-white/80 font-medium">
                Item Name <span className="text-red-400">*</span>
              </span>
              <input
                autoFocus
                className="inp"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Italian Wool Blazer"
                required
              />
            </label>
          </div>

          {/* Brand & Style Tag */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block mb-1 text-white/80 font-medium">
                Brand <span className="text-xs text-stone-500">(Optional)</span>
              </span>
              <input
                className="inp"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g. ZARA, Nike, H&M"
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80 font-medium">
                Style Tag
              </span>
              <select
                className="inp"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              >
                {[
                  "Casual",
                  "Formal",
                  "Party",
                  "Sports",
                  "Streetwear",
                  "Traditional",
                  "Winter",
                  "Accessory",
                  "Footwear",
                  "Luxury",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block mb-1 text-white/80 font-medium">
                Color <span className="text-xs text-stone-500">(Optional)</span>
              </span>
              <input
                className="inp"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="e.g. Navy, Black, White"
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80 font-medium">
                Size <span className="text-xs text-stone-500">(Optional)</span>
              </span>
              <input
                className="inp"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                placeholder="e.g. M, 32, UK 9"
              />
            </label>
          </div>

          {/* Mandatory Image Upload with Preview & Highlight Validation */}
          <div>
            <span className="block mb-1 text-sm text-white/80 font-medium">
              Item Image <span className="text-red-400">*</span>
            </span>
            <label
              className={`rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${
                imageError
                  ? "border-red-500 bg-red-500/10 ring-2 ring-red-500/40"
                  : imagePreview
                  ? "border-amber-500/80 bg-amber-500/5"
                  : "border-white/15 bg-white/[.02] hover:border-amber-500/50"
              }`}
            >
              {imagePreview ? (
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="w-20 h-20 rounded-xl object-cover border border-amber-500/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {image?.name || "Selected Photo"}
                    </p>
                    <p className="text-xs text-emerald-400 mt-0.5">
                      ✓ Image ready for upload
                    </p>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Click to choose a different photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <Upload
                    size={28}
                    className={`mx-auto mb-2 ${
                      imageError ? "text-red-400 animate-bounce" : "text-stone-400"
                    }`}
                  />
                  <p className="text-sm font-medium text-stone-200">
                    Click to browse and upload item image
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    PNG, JPG, JPEG or WebP accepted (Required)
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-400 flex items-center gap-1.5 font-medium"
            >
              <AlertCircle size={15} /> {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setError("");
                setImageError(false);
              }}
              className="btn-s flex-1 h-12"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-p flex-1 h-12 text-black font-semibold shadow-md shadow-amber-500/20 disabled:opacity-60"
            >
              {saving ? "Adding Item…" : "Add to Wardrobe"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Remove Item Confirmation Dialog ── */}
      {confirmDelete && (
        <Modal
          open={Boolean(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
          title="Remove Item from Wardrobe"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[.03] border border-white/10">
              <img
                src={confirmDelete.img || IMG["white-shirt"]}
                alt={confirmDelete.name}
                className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white truncate text-base">
                  {confirmDelete.name}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  Category: {confirmDelete.cat} · Tag: {confirmDelete.tag || "Casual"}
                </div>
              </div>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed">
              Are you sure you want to remove this item? This action will remove it
              from your active wardrobe collection and outfit recommendations.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="btn-s flex-1 h-11"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                disabled={deleting}
                className="btn-p flex-1 h-11 bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-60"
              >
                {deleting ? "Removing…" : "Yes, Remove Item"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
