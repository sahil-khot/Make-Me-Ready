import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Heart,
  Eye,
  X,
  Trash2,
  ArrowRight,
  Shirt,
  Footprints,
  Watch,
  Gem,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Section, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG, getImg } from "../data/constants.js";
import {
  womenCats,
  menCats,
  womenShopCats,
  menShopCats,
  normalizeCategory,
  isFemaleUser,
} from "../data.js";

// Product Card with Image, Category, Name, Price, Add to Cart, Add to Wardrobe, and Save
const ProductCard = ({
  p,
  onAddToCart,
  onAddToWardrobe,
  inCart,
  inWardrobe,
  saved,
  onToggleSave,
  onQuickView,
  isAddingCart,
  isAddingWardrobe,
}) => (
  <div
    onClick={() => onQuickView(p)}
    className="group card overflow-hidden hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between border-white/[.08] hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer bg-[#131313] rounded-2xl"
  >
    <div className="relative aspect-[4/3.8] overflow-hidden bg-black/40">
      <img
        src={p.img || p.image || "/img/hero-wardrobe-luxury.jpg"}
        alt={p.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
        }}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Category Badge & Gender Tag */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
          {p.cat || p.category}
        </span>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(p);
        }}
        aria-label="Save item"
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md grid place-items-center hover:scale-110 transition border border-white/10"
      >
        <Heart
          size={14}
          className={saved ? "fill-[#ef4444] text-[#ef4444]" : "text-white/80 hover:text-white"}
        />
      </button>

      {/* Quick view hint on bottom right of image */}
      <div className="absolute bottom-2 right-2 text-[10px] font-medium text-stone-300 bg-black/75 px-2 py-0.5 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
        <Eye size={10} />
        <span>Quick View</span>
      </div>
    </div>

    <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
      <div>
        <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
          {p.brand || "Exclusive"}
        </div>
        <div
          className="font-serif font-semibold text-sm text-white line-clamp-1 mt-0.5"
          title={p.name}
        >
          {p.name}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm font-bold text-amber-400">
            ₹{p.price?.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-stone-400 flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{p.rating || "4.8"}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Add to Wardrobe */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          disabled={isAddingCart}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(p);
          }}
          className={`h-8 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            inCart
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-white/[.08] hover:bg-white/[.15] text-white border border-white/10"
          } ${isAddingCart ? "opacity-60 cursor-wait" : ""}`}
        >
          {isAddingCart ? (
            <>
              <Loader2 size={12} className="animate-spin text-amber-400" />
              <span>Adding...</span>
            </>
          ) : inCart ? (
            <>
              <Check size={12} className="stroke-[3]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag size={12} />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isAddingWardrobe}
          onClick={(e) => {
            e.stopPropagation();
            onAddToWardrobe(p);
          }}
          className={`h-8 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            inWardrobe
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 text-black shadow-sm shadow-amber-500/20"
          } ${isAddingWardrobe ? "opacity-60 cursor-wait" : ""}`}
        >
          {isAddingWardrobe ? (
            <>
              <Loader2 size={12} className="animate-spin text-black" />
              <span>Adding...</span>
            </>
          ) : inWardrobe ? (
            <>
              <Check size={12} className="stroke-[3]" />
              <span>In Wardrobe</span>
            </>
          ) : (
            <>
              <Sparkles size={12} />
              <span>Add to Wardrobe</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default function Shopping() {
  const navigate = useNavigate();
  const {
    addCart,
    removeFromCart,
    isInCart,
    cart = [],
    addToWardrobe,
    isInWardrobe,
    toggleSave,
    isSaved,
    catalog = {},
    user,
    isFemale,
    womenProducts = [],
    menProducts = [],
  } = useStore();

  // Gender filter preference: defaults to user gender preference
  const [genderFilter, setGenderFilter] = useState(() => (isFemale ? "Women" : "Men"));
  const [selectedCat, setSelectedCat] = useState("All");
  const [toast, setToast] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState(null);
  const [loadingCartIds, setLoadingCartIds] = useState({});
  const [loadingWardrobeIds, setLoadingWardrobeIds] = useState({});

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleAddToCart = async (p) => {
    setLoadingCartIds((prev) => ({ ...prev, [p.id]: true }));
    try {
      await addCart(p);
      triggerToast(`✓ "${p.name}" added to cart`);
    } catch (err) {
      triggerToast(err.message || "Could not add to cart");
    } finally {
      setTimeout(() => {
        setLoadingCartIds((prev) => ({ ...prev, [p.id]: false }));
      }, 250);
    }
  };

  const handleAddToWardrobe = async (p) => {
    setLoadingWardrobeIds((prev) => ({ ...prev, [p.id]: true }));
    try {
      await addToWardrobe(p);
      triggerToast(`✓ "${p.name}" added to your wardrobe!`);
    } catch (err) {
      triggerToast(err.message || "Could not add to wardrobe");
    } finally {
      setTimeout(() => {
        setLoadingWardrobeIds((prev) => ({ ...prev, [p.id]: false }));
      }, 250);
    }
  };

  const handleToggleSave = async (p) => {
    try {
      await toggleSave(p.id);
      const currentlySaved = isSaved(p.id);
      triggerToast(
        currentlySaved
          ? `Removed "${p.name}" from saved items`
          : `✓ "${p.name}" saved to your favorites!`
      );
    } catch (err) {
      triggerToast(err.message || "Could not save item");
    }
  };

  // Categories based on active gender filter
  const activeCategories = useMemo(() => {
    if (genderFilter === "Women") {
      return ["All", ...womenCats];
    }
    if (genderFilter === "Men") {
      return ["All", ...menCats];
    }
    return ["All", ...new Set([...womenCats, ...menCats])];
  }, [genderFilter]);

  // Visual Category Tiles based on active gender filter
  const categoryTiles = useMemo(() => {
    if (genderFilter === "Women") {
      return womenShopCats;
    }
    if (genderFilter === "Men") {
      return menShopCats;
    }
    return [...womenShopCats.slice(0, 4), ...menShopCats.slice(0, 3)];
  }, [genderFilter]);

  // Active product dataset prioritized by gender
  const activeProducts = useMemo(() => {
    if (genderFilter === "Women") {
      return womenProducts;
    }
    if (genderFilter === "Men") {
      return menProducts;
    }
    // "All" - Women products first if female user, else Men products first
    return isFemale
      ? [...womenProducts, ...menProducts]
      : [...menProducts, ...womenProducts];
  }, [genderFilter, isFemale, womenProducts, menProducts]);

  // Filtered by selected category
  const filteredProducts = useMemo(() => {
    if (!selectedCat || selectedCat === "All") {
      return activeProducts;
    }
    return activeProducts.filter((p) => {
      const normalized = normalizeCategory(p.cat || p.category, p.gender);
      return normalized.toLowerCase() === selectedCat.toLowerCase();
    });
  }, [activeProducts, selectedCat]);

  // Featured looks strip for inspiration
  const outfitStrip = useMemo(() => {
    const list = catalog?.looks || [];
    if (genderFilter === "Women") {
      return list.filter((l) => l.gender === "Women" || l.id?.includes("-w"));
    }
    if (genderFilter === "Men") {
      return list.filter((l) => l.gender === "Men" || !l.id?.includes("-w"));
    }
    return list;
  }, [catalog?.looks, genderFilter]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [cart]);

  return (
    <div className="space-y-10">
      {/* ── Global Toast Notification ── */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0a1a12] border-2 border-emerald-500/80 text-white shadow-[0_12px_45px_rgba(16,185,129,0.45)] backdrop-blur-md animate-up text-sm font-semibold max-w-md"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-black grid place-items-center font-bold text-xs shrink-0">
            ✓
          </div>
          <span className="text-emerald-300">{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-stone-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-line min-h-[320px] md:min-h-[360px] flex items-center">
        <img
          src={IMG["hero-shopping"] || "/BackGround Images/Shopping BackGround Image.png"}
          alt="Premium Luxury Collection"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 md:via-black/60 to-transparent" />
        <div className="relative p-6 md:p-10 z-10 max-w-xl">
          <div className="text-xs tracking-[.25em] text-acc font-bold uppercase mb-3">
            {genderFilter === "Women"
              ? "WOMEN'S LUXURY COLLECTION"
              : genderFilter === "Men"
              ? "MEN'S SIGNATURE COLLECTION"
              : "EXCLUSIVE DESIGNER CATALOG"}
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-white leading-tight">
            Curated <span className="text-acc">Shopping</span>
          </h1>
          <p className="text-stone-300 mt-3 mb-6 text-sm md:text-base leading-relaxed">
            Explore ready-to-wear pieces, footwear, jewelry and accessories. Add them directly
            to your personal wardrobe or cart.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-p h-12 px-6 text-black font-semibold text-sm shadow-[0_0_24px_rgba(245,158,11,0.35)] cursor-pointer"
            >
              Browse Catalog ↓
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="h-12 px-5 rounded-xl bg-black/75 hover:bg-black/90 border border-amber-500/40 hover:border-amber-400 text-white flex items-center gap-3 transition-all shadow-lg hover:scale-105 cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart size={20} className="text-amber-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="font-semibold text-sm">My Shopping Cart</span>
              <span className="text-xs text-amber-300 font-bold ml-1">
                {cart.length > 0 ? `(₹${totalCartPrice.toLocaleString("en-IN")})` : "(0)"}
              </span>
            </button>
          </div>
        </div>

        {/* Prominent "My Shopping Cart" Card Top-Right on Banner */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10 flex items-center gap-3.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-white hover:border-amber-400 hover:bg-black/95 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:scale-105 cursor-pointer group"
          aria-label="Open My Shopping Cart"
        >
          <div className="relative w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition">
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-amber-500 group-hover:bg-black text-black group-hover:text-amber-400 font-bold text-[10px] flex items-center justify-center shadow-md">
                {cart.length}
              </span>
            )}
          </div>
          <div className="text-left hidden xs:block sm:block">
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
              My Shopping Cart
            </div>
            <div className="text-[11px] text-stone-300 font-medium">
              {cart.length} {cart.length === 1 ? "item" : "items"} · ₹{totalCartPrice.toLocaleString("en-IN")}
            </div>
          </div>
        </button>
      </div>

      {/* ── Gender Filter Selector & Status ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#141414] border border-white/[.08]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
            Catalog:
          </span>
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setGenderFilter("Women");
                setSelectedCat("All");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                genderFilter === "Women"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Women’s Catalog ({womenProducts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setGenderFilter("Men");
                setSelectedCat("All");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                genderFilter === "Men"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Men’s Catalog ({menProducts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setGenderFilter("All");
                setSelectedCat("All");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                genderFilter === "All"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              All Products ({womenProducts.length + menProducts.length})
            </button>
          </div>
        </div>

        <div className="text-xs text-stone-400 flex items-center gap-2">
          <span>Personalized for:</span>
          <span className="font-semibold text-white px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
            {isFemale ? "Female Style Profile" : "Male Style Profile"}
          </span>
        </div>
      </div>

      {/* ── Shop by Category Visual Tiles ── */}
      <Section
        title={`Shop by Category (${categoryTiles.length})`}
        sub="Browse pieces curated across distinct fashion categories"
        right={
          selectedCat !== "All" ? (
            <button
              type="button"
              onClick={() => setSelectedCat("All")}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Clear filter ({selectedCat}) ×
            </button>
          ) : null
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categoryTiles.map(([catName, imgPath]) => {
            const isSelected = selectedCat.toLowerCase() === catName.toLowerCase();
            const itemCount = activeProducts.filter(
              (p) =>
                normalizeCategory(p.cat || p.category, p.gender).toLowerCase() ===
                catName.toLowerCase()
            ).length;

            return (
              <button
                key={catName}
                type="button"
                onClick={() => setSelectedCat(isSelected ? "All" : catName)}
                className={`group tile relative aspect-[3/3.8] rounded-2xl overflow-hidden border transition-all duration-300 text-left ${
                  isSelected
                    ? "border-amber-500 ring-2 ring-amber-500/40 scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    : "border-white/[.08] hover:border-amber-500/40"
                }`}
              >
                <img
                  src={IMG[imgPath] || imgPath || "/img/hero-wardrobe-luxury.jpg"}
                  alt={catName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span
                    className={`block text-xs font-semibold ${
                      isSelected ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {catName}
                  </span>
                  <span className="text-[10px] text-stone-400">{itemCount} Items</span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Featured Outfits Strip (Redesigned with generous breathing room & larger cards) ── */}
      {outfitStrip.length > 0 && (
        <Section
          title="✨ Styled Outfits & Looks"
          sub="Pair individual wardrobe items together to recreate these complete looks"
          right={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("styled-outfits-scroll")?.scrollBy({ left: -340, behavior: "smooth" });
                }}
                className="w-8 h-8 rounded-full border border-white/10 bg-black/50 text-stone-300 hover:text-white hover:border-amber-500/50 flex items-center justify-center transition cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("styled-outfits-scroll")?.scrollBy({ left: 340, behavior: "smooth" });
                }}
                className="w-8 h-8 rounded-full border border-white/10 bg-black/50 text-stone-300 hover:text-white hover:border-amber-500/50 flex items-center justify-center transition cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          }
        >
          <div
            id="styled-outfits-scroll"
            className="flex gap-6 sm:gap-7 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth scrollbar-none"
          >
            {outfitStrip.slice(0, 10).map((l) => (
              <div
                key={l.id}
                onClick={() => navigate(`/create-outfit?occ=${l.occ}`)}
                className="shrink-0 w-72 sm:w-80 group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#141414] border border-white/[.08] hover:border-amber-500/60 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                {/* Full Outfit Image Container with Proper Proportions & Zero Cropping */}
                <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-xl bg-black/60 flex items-center justify-center p-2">
                  <img
                    src={l.img}
                    alt={l.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
                    }}
                    className="w-full h-full object-contain group-hover:scale-104 transition-transform duration-500"
                  />
                  {/* Subtle top vignette */}
                  <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                  {/* Occasion Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-md">
                      {l.occ}
                    </span>
                  </div>

                  {l.matchScore && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                        {l.matchScore}% Match
                      </span>
                    </div>
                  )}
                </div>

                {/* Information Area with Generous Spacing */}
                <div className="pt-3.5 pb-1 px-1 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {l.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 capitalize">
                      {l.occ} Ensemble · {l.gender || "All"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[.06] flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>Recreate Outfit</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Main Product Catalog Grid ── */}
      <div id="catalog-grid" />
      <Section
        title="Products Catalog"
        sub={`Showing ${filteredProducts.length} ${
          genderFilter === "Women" ? "women's" : genderFilter === "Men" ? "men's" : ""
        } items${selectedCat !== "All" ? ` in ${selectedCat}` : ""}`}
        right={
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {activeCategories.map((c) => {
              const isSelected = selectedCat.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCat(c)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold shrink-0 transition ${
                    isSelected
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "bg-[#181818] border border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        }
      >
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                onAddToCart={handleAddToCart}
                onAddToWardrobe={handleAddToWardrobe}
                inCart={isInCart(p.id)}
                inWardrobe={isInWardrobe(p.id)}
                saved={isSaved(p.id)}
                onToggleSave={handleToggleSave}
                onQuickView={setQuickProduct}
                isAddingCart={Boolean(loadingCartIds[p.id])}
                isAddingWardrobe={Boolean(loadingWardrobeIds[p.id])}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center border-dashed border-white/10 my-4">
            <p className="text-stone-400 text-sm mb-4">
              No products found in category "{selectedCat}".
            </p>
            <button
              type="button"
              onClick={() => setSelectedCat("All")}
              className="btn-p h-10 px-5 text-xs text-black font-semibold"
            >
              Reset Category Filter
            </button>
          </div>
        )}
      </Section>

      {/* ── Promotional Luxury Banners ── */}
      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {[
          ["Flat 40% OFF", "On Designer Dresses & Tops", "w-dress-1", "Women"],
          ["Up to 30% OFF", "On Handcrafted Footwear", "w-footwear-1", "Women"],
          ["Flat 25% OFF", "On Luxury Jewelry & Accs", "w-jewel-1", "Women"],
        ].map(([title, desc, imKey, targetGender], i) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-2xl border border-white/[.08] p-6 min-h-[170px] bg-gradient-to-r from-amber-500/10 to-[#121212]"
          >
            <img
              src={IMG[imKey] || getImg(imKey) || "/img/hero-luxury.jpg"}
              alt=""
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/img/hero-luxury.jpg";
              }}
              className="absolute right-0 inset-y-0 w-1/2 h-full object-cover opacity-60 pointer-events-none"
            />
            <div className="relative z-10">
              <div className={`font-serif text-2xl font-bold ${i === 2 ? "text-amber-400" : "text-white"}`}>
                {title}
              </div>
              <div className="text-xs text-stone-300 mt-1 mb-4">{desc}</div>
              <button
                type="button"
                onClick={() => {
                  setGenderFilter(targetGender);
                  document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-p h-8 px-4 text-xs font-semibold text-black"
              >
                Shop Collection →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Brand Trust Badges ── */}
      <div className="card p-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-6 bg-[#121212] border-white/[.08]">
        {[
          [Truck, "Free Express Shipping", "On all orders above ₹999"],
          [ShieldCheck, "7-Day Easy Returns", "No-questions-asked refund policy"],
          [BadgeCheck, "100% Authentic Products", "Sourced directly from verified ateliers"],
          [Headphones, "Dedicated Concierge", "Styling support available 24/7"],
        ].map(([IconComponent, title, subtitle]) => (
          <div key={title} className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 grid place-items-center shrink-0">
              <IconComponent size={22} />
            </div>
            <div className="text-sm">
              <b className="block text-white font-medium">{title}</b>
              <span className="text-stone-400 text-xs">{subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick View / Product Detail Modal ── */}
      {quickProduct && (
        <Modal
          open={Boolean(quickProduct)}
          onClose={() => setQuickProduct(null)}
          title={quickProduct.name}
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <img
                src={quickProduct.img || quickProduct.image || "/img/hero-wardrobe-luxury.jpg"}
                alt={quickProduct.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
                }}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                {quickProduct.cat || quickProduct.category}
              </span>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  {quickProduct.brand || "Exclusive Brand"}
                </div>
                <h3 className="font-serif font-bold text-2xl text-white mt-1">
                  {quickProduct.name}
                </h3>

                <div className="flex items-center gap-3 mt-2">
                  <div className="text-2xl font-bold text-white">
                    ₹{quickProduct.price?.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-300 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{quickProduct.rating || "4.8"} (120+ reviews)</span>
                  </div>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed">
                  Tailored with premium craftsmanship, designed to be effortlessly styled for
                  everyday luxury and special occasions.
                </p>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Category</span>
                    <span className="font-medium text-white">{quickProduct.cat || quickProduct.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Gender Collection</span>
                    <span className="font-medium text-white">
                      {quickProduct.gender || (quickProduct.g === "Women" ? "Women" : "Men")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Availability</span>
                    <span className="font-medium text-emerald-400">In Stock · Ready to Ship</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Quick View */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(quickProduct)}
                    className={`h-11 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      isInCart(quickProduct.id)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/15"
                    }`}
                  >
                    {isInCart(quickProduct.id) ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToWardrobe(quickProduct)}
                    className={`h-11 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                      isInWardrobe(quickProduct.id)
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "btn-p text-black"
                    }`}
                  >
                    {isInWardrobe(quickProduct.id) ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>In Wardrobe</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Add to Wardrobe</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSave(quickProduct)}
                  className="w-full h-10 rounded-xl text-xs font-semibold border border-white/15 text-stone-300 hover:text-white hover:border-amber-500/40 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Heart
                    size={13}
                    className={
                      isSaved(quickProduct.id)
                        ? "fill-[#ef4444] text-[#ef4444]"
                        : "text-stone-400"
                    }
                  />
                  <span>
                    {isSaved(quickProduct.id) ? "Saved in Favorites" : "Save to Favorites"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Shopping Cart Modal ── */}
      <Modal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title={`Your Shopping Cart (${cart.length})`}
      >
        {cart.length > 0 ? (
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[.03] border border-white/[.08]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.img || item.image || "/img/hero-wardrobe-luxury.jpg"}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
                      }}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Category: {item.cat || item.category || "General"}
                      </div>
                      <div className="text-xs font-bold text-amber-400 mt-1">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item from cart"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-stone-400 hover:text-red-400 grid place-items-center transition shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-sm text-stone-400">
                <span>Items ({cart.length})</span>
                <span>₹{totalCartPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-400">
                <span>Shipping</span>
                <span className="text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-amber-400">₹{totalCartPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="btn-s flex-1 h-11 text-xs"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/payment");
                }}
                className="btn-p flex-1 h-11 text-xs text-black font-semibold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 grid place-items-center mx-auto shadow-inner">
              <ShoppingCart size={26} />
            </div>
            <h4 className="font-serif font-bold text-lg text-white">Your cart is empty.</h4>
            <p className="text-stone-400 text-xs max-w-xs mx-auto leading-relaxed">
              Add pieces from the collection to build your order.
            </p>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="btn-p h-10 px-5 text-xs text-black font-semibold mt-2"
            >
              Start Shopping
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
