import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Trash2,
  Check,
  ArrowRight,
  Package,
  Calendar,
  Layers,
  X,
  Plus,
} from "lucide-react";
import { Hero, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

export default function SavedLooks() {
  const {
    saved = [],
    favs = [],
    toggleSave,
    products = [],
    addCart,
    isInCart,
    addToWardrobe,
    isInWardrobe,
  } = useStore();

  const [tab, setTab] = useState("All");
  const [sort, setSort] = useState("Recently Saved");
  const [toast, setToast] = useState(null);
  const [selectedLookModal, setSelectedLookModal] = useState(null);

  // Read explicitly saved custom looks from localStorage into reactive state
  const [customLooks, setCustomLooks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mmr_custom_looks") || "[]");
    } catch {
      return [];
    }
  });

  // Keep customLooks in sync if localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      try {
        setCustomLooks(JSON.parse(localStorage.getItem("mmr_custom_looks") || "[]"));
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Only display outfit looks that the user EXPLICITLY saved (matching an active saved ID)
  // No demo/catalog looks with fake match percentages!
  const savedLooks = useMemo(() => {
    const list = customLooks.filter((l) => saved.includes(l.id));
    if (sort === "A–Z") {
      return [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    // Default: Recently Saved
    return [...list].sort((a, b) => {
      const timeA = a.savedAt ? new Date(a.savedAt).getTime() : 0;
      const timeB = b.savedAt ? new Date(b.savedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [customLooks, saved, sort]);

  // Saved shopping/wardrobe products (explicitly saved by the user)
  const savedProducts = useMemo(() => {
    const list = products.filter((p) => {
      const pId = p.id;
      return (
        saved.includes(pId) ||
        saved.includes(`p-${pId}`) ||
        favs.includes(pId) ||
        favs.includes(`p-${pId}`)
      );
    });
    if (sort === "A–Z") {
      return [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return list;
  }, [products, saved, favs, sort]);

  const totalCount = savedLooks.length + savedProducts.length;

  const handleAddToCart = async (p) => {
    try {
      await addCart(p);
      triggerToast(`✓ "${p.name}" added to cart`);
    } catch (err) {
      triggerToast(err.message || "Failed to add to cart");
    }
  };

  const handleAddToWardrobe = async (p) => {
    try {
      await addToWardrobe(p);
      triggerToast(`✓ "${p.name}" added to your wardrobe!`);
    } catch (err) {
      triggerToast(err.message || "Failed to add to wardrobe");
    }
  };

  // Remove individual saved piece
  const handleRemoveProduct = async (id, name) => {
    try {
      await toggleSave(id);
      triggerToast(`Removed "${name}" from saved items`);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove saved look immediately from both context state and localStorage
  const handleRemoveLook = async (lookId, lookTitle) => {
    try {
      await toggleSave(lookId);
      const updated = customLooks.filter((l) => l.id !== lookId);
      setCustomLooks(updated);
      localStorage.setItem("mmr_custom_looks", JSON.stringify(updated));
      if (selectedLookModal?.id === lookId) {
        setSelectedLookModal(null);
      }
      triggerToast(`Removed "${lookTitle}" from saved looks`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Toast Notification ── */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0a1a12] border-2 border-emerald-500/80 text-white shadow-lg backdrop-blur-md animate-up text-sm font-semibold"
        >
          <span className="text-emerald-300">{toast}</span>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <Hero
        img={IMG["hero-saved-looks"] || "/BackGround Images/Saved Looks BG.png"}
        kicker="SAVED COLLECTION"
        script={
          <>
            Saved Today.
            <br />
            Styled Tomorrow.
          </>
        }
      >
        <h1 className="h1">
          Your Curated <span className="text-acc block">Saved Collection</span>
        </h1>
        <p className="text-mute mt-3 max-w-lg leading-relaxed">
          Keep track of your favorite individual wardrobe pieces and complete styling looks in
          one place.
        </p>
      </Hero>

      {/* ── Navigation Tabs & Sorting ── */}
      {totalCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 bg-[#131313] p-1.5 rounded-2xl border border-white/10">
            {[
              { id: "All", label: `All Saved (${totalCount})` },
              { id: "Products", label: `Pieces & Products (${savedProducts.length})` },
              { id: "Looks", label: `Outfit Looks (${savedLooks.length})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  tab === t.id
                    ? "bg-amber-500 text-black shadow-sm font-bold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Sort by:</span>
            <select
              aria-label="Sort saved items"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#141414] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white cursor-pointer"
            >
              <option>Recently Saved</option>
              <option>A–Z</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Initial Empty State (When no looks or products are saved) ── */}
      {totalCount === 0 ? (
        <div className="card p-12 md:p-16 text-center flex flex-col items-center justify-center my-8 border-dashed border-white/10 bg-[#121212]/70 backdrop-blur-sm rounded-3xl animate-up">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 grid place-items-center mb-4 shadow-[0_0_24px_rgba(245,158,11,0.15)]">
            <Heart size={28} />
          </div>
          <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-2">
            No saved items yet.
          </h3>
          <p className="text-stone-400 text-sm md:text-base max-w-md mx-auto mb-7 leading-relaxed">
            Save your favorite pieces to find them easily later.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shopping"
              className="h-11 px-6 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-semibold text-sm shadow-[0_0_24px_rgba(245,158,11,0.3)] flex items-center gap-2 hover:brightness-110 transition cursor-pointer"
            >
              <span>Explore Shopping</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/create-outfit"
              className="h-11 px-6 rounded-full bg-white/5 border border-white/15 text-stone-300 font-semibold text-sm hover:border-amber-500/50 hover:text-white flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Create Outfits</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* ── Saved Outfit Looks (Data-Driven, user explicitly saved) ── */}
          {(tab === "All" || tab === "Looks") && savedLooks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-semibold text-xl text-white">
                    Saved Outfits ({savedLooks.length})
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Your personalized outfits crafted in the outfit studio.
                  </p>
                </div>
                <Link
                  to="/create-outfit"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Create Another Look <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedLooks.map((look) => {
                  const pieces = Array.isArray(look.pieces) ? look.pieces : [];
                  const savedDateFormatted = look.savedAt
                    ? new Date(look.savedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Saved recently";

                  return (
                    <div
                      key={look.id}
                      className="card p-5 bg-[#141414] border border-white/[.08] hover:border-amber-500/40 transition-all duration-300 rounded-3xl group flex flex-col justify-between shadow-xl"
                    >
                      <div className="space-y-4">
                        {/* Outfit Image Card */}
                        <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-black/50 border border-white/[.06]">
                          <img
                            src={look.img || "/img/hero-wardrobe-luxury.jpg"}
                            alt={look.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
                              {look.occ || look.occasion || "Outfit"}
                            </span>
                            {look.style && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 backdrop-blur-md text-stone-200 border border-white/10">
                                {look.style}
                              </span>
                            )}
                          </div>

                          {/* Delete from Saved */}
                          <button
                            type="button"
                            onClick={() => handleRemoveLook(look.id, look.title)}
                            title="Remove from saved looks"
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md grid place-items-center hover:scale-110 transition border border-white/15 text-red-400 hover:text-red-300 cursor-pointer shadow-lg"
                          >
                            <Trash2 size={13} />
                          </button>

                          {/* Bottom info strip on image */}
                          <div className="absolute bottom-3 left-3 right-3 text-left">
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                              <Calendar size={11} />
                              <span>{savedDateFormatted}</span>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-white truncate mt-0.5">
                              {look.title}
                            </h3>
                          </div>
                        </div>

                        {/* Real pieces thumbnails strip */}
                        {pieces.length > 0 && (
                          <div>
                            <div className="text-[11px] font-semibold text-stone-400 mb-2 flex items-center justify-between">
                              <span>Outfit Pieces ({pieces.length})</span>
                              <span className="text-[10px] text-amber-400/80">Curated Mix</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {pieces.slice(0, 4).map((p, idx) => (
                                <div
                                  key={p.id || idx}
                                  className="aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 group/item relative"
                                  title={`${p.name} (${p.cat || "Item"})`}
                                >
                                  <img
                                    src={p.img || p.image || "/img/hero-wardrobe-luxury.jpg"}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Why it works / summary */}
                        {(look.summary || look.whyItWorks) && (
                          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                            {look.summary || look.whyItWorks}
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 mt-2 border-t border-white/[.08] grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLookModal(look)}
                          className="h-10 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Layers size={13} />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveLook(look.id, look.title)}
                          className="h-10 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs border border-red-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Saved Products / Pieces (Explicitly saved pieces) ── */}
          {(tab === "All" || tab === "Products") && savedProducts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-semibold text-xl text-white">
                    Saved Pieces ({savedProducts.length})
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Individual wardrobe & shopping items saved for styling.
                  </p>
                </div>
                <Link
                  to="/shopping"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Browse More Pieces <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {savedProducts.map((p) => {
                  const inCart = isInCart(p.id);
                  const inWardrobe = isInWardrobe(p.id);

                  return (
                    <div
                      key={p.id}
                      className="card overflow-hidden flex flex-col justify-between border-white/[.08] bg-[#131313] rounded-2xl group shadow-md"
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
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(p.id, p.name)}
                          title="Remove from saved"
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md grid place-items-center hover:scale-110 transition border border-white/10 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                          {p.cat || p.category}
                        </span>
                      </div>

                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <div className="text-[11px] text-stone-400 uppercase font-semibold">
                            {p.brand || "Exclusive"}
                          </div>
                          <div className="font-serif font-semibold text-sm text-white line-clamp-1 mt-0.5">
                            {p.name}
                          </div>
                          <div className="text-sm font-bold text-amber-400 mt-1">
                            ₹{Number(p.price).toLocaleString("en-IN")}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(p)}
                            className={`h-8 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                              inCart
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-white/[.08] hover:bg-white/[.15] text-white border border-white/10"
                            }`}
                          >
                            {inCart ? (
                              <>
                                <Check size={11} className="stroke-[3]" />
                                <span>In Cart</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={11} />
                                <span>Add Cart</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddToWardrobe(p)}
                            className={`h-8 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                              inWardrobe
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-semibold"
                            }`}
                          >
                            {inWardrobe ? (
                              <>
                                <Check size={11} className="stroke-[3]" />
                                <span>In Closet</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={11} />
                                <span>Wardrobe</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Dedicated Saved Look Details Modal ── */}
      {selectedLookModal && (
        <Modal
          open={Boolean(selectedLookModal)}
          onClose={() => setSelectedLookModal(null)}
          title={selectedLookModal.title || "Saved Outfit Look"}
        >
          <div className="space-y-6">
            {/* Visual Overview */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <img
                  src={selectedLookModal.img || "/img/hero-wardrobe-luxury.jpg"}
                  alt={selectedLookModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold uppercase">
                      {selectedLookModal.occ || selectedLookModal.occasion || "Outfit"}
                    </span>
                    {selectedLookModal.style && (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-stone-200">
                        {selectedLookModal.style}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {selectedLookModal.title}
                  </h3>
                  <div className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>
                      {selectedLookModal.savedAt
                        ? `Saved on ${new Date(selectedLookModal.savedAt).toLocaleDateString()}`
                        : "Saved Look"}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 mt-3 leading-relaxed">
                    {selectedLookModal.whyItWorks ||
                      selectedLookModal.summary ||
                      "A customized luxury ensemble curated to match your aesthetic proportions."}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveLook(selectedLookModal.id, selectedLookModal.title)}
                    className="w-full h-10 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Trash2 size={14} />
                    <span>Remove Look from Saved Collection</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Breakdown of all pieces in outfit */}
            {Array.isArray(selectedLookModal.pieces) && selectedLookModal.pieces.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Outfit Pieces ({selectedLookModal.pieces.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedLookModal.pieces.map((piece, pIdx) => {
                    const inW = isInWardrobe(piece.id);
                    return (
                      <div
                        key={piece.id || pIdx}
                        className="p-2.5 rounded-2xl bg-white/[.03] border border-white/[.08] flex flex-col justify-between gap-2"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-black/40">
                          <img
                            src={piece.img || piece.image || "/img/hero-wardrobe-luxury.jpg"}
                            alt={piece.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase font-semibold">
                            {piece.cat || "Clothing"}
                          </div>
                          <div className="text-xs font-semibold text-white truncate">
                            {piece.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddToWardrobe(piece)}
                          className={`h-7 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                            inW
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          {inW ? (
                            <>
                              <Check size={10} className="stroke-[3]" />
                              <span>In Closet</span>
                            </>
                          ) : (
                            <>
                              <Plus size={10} />
                              <span>Add to Closet</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
