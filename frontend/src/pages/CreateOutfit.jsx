import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Shirt,
  Package,
  Heart,
  Eye,
  SlidersHorizontal,
  Layers,
  Plus,
  X,
  Sun,
  CloudRain,
  Flame,
  Zap,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Watch,
  Smile,
} from "lucide-react";
import { Hero, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG, occasionList } from "../data/constants.js";

// Stepper Component
const Stepper = ({ currentStep, onStepClick, maxStepReached }) => {
  const steps = [
    { num: 1, label: "Occasion" },
    { num: 2, label: "Preferences" },
    { num: 3, label: "Wardrobe" },
    { num: 4, label: "Generate & Save" },
  ];

  return (
    <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-[#141414] border border-white/[.08]">
      {steps.map((s, idx) => {
        const isCurrent = currentStep === s.num;
        const isCompleted = currentStep > s.num;
        const canClick = s.num <= maxStepReached;

        return (
          <div key={s.num} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-initial">
            <button
              type="button"
              disabled={!canClick}
              onClick={() => onStepClick(s.num)}
              className={`flex items-center gap-2.5 text-left transition ${
                canClick ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
            >
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold grid place-items-center transition ${
                  isCurrent
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/25 ring-2 ring-amber-500/40"
                    : isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                    : "bg-white/5 border border-white/10 text-stone-400"
                }`}
              >
                {isCompleted ? <Check size={14} className="stroke-[3]" /> : s.num}
              </span>
              <div className="hidden sm:block">
                <span
                  className={`block text-xs font-semibold leading-tight ${
                    isCurrent ? "text-amber-400" : isCompleted ? "text-white" : "text-stone-400"
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[10px] text-stone-400">
                  {isCurrent ? "In Progress" : isCompleted ? "Completed" : `Step ${s.num}`}
                </span>
              </div>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-colors ${
                  currentStep > s.num ? "bg-emerald-500/50" : "bg-white/[.08]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function CreateOutfit() {
  const location = useLocation();
  const {
    toggleSave,
    saved = [],
    catalog = {},
    added = [],
    isFemale,
    womenProducts = [],
    menProducts = [],
  } = useStore();

  const { looks = [], wardrobe = [] } = catalog;

  // Active step (1: Occasion, 2: Preferences, 3: Wardrobe, 4: Generate)
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  // STEP 1 STATE: Occasion
  const [occFilter, setOccFilter] = useState("All");
  const [selectedOccId, setSelectedOccId] = useState(
    () => location.state?.occasion || "casual-outing"
  );

  // STEP 2 STATE: Preferences
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedStyles, setSelectedStyles] = useState(["Smart Casual"]);
  const [selectedColors, setSelectedColors] = useState(["Any"]);
  const [customColor, setCustomColor] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("Warm");
  const [selectedFit, setSelectedFit] = useState("Regular");

  // STEP 3 STATE: Wardrobe
  const [wardrobeMode, setWardrobeMode] = useState("ai"); // 'ai' | 'manual'
  const [wardrobeCat, setWardrobeCat] = useState("All");
  const [selectedWardrobeIds, setSelectedWardrobeIds] = useState([]);

  // STEP 4 STATE: Generated Looks & Customization
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [generatedLooks, setGeneratedLooks] = useState([]);

  // Modals for Step 4
  const [modalLook, setModalLook] = useState(null); // Full view modal
  const [changeItemLook, setChangeItemLook] = useState(null); // Look being edited
  const [itemToReplace, setItemToReplace] = useState(null); // Piece being replaced
  const [addAccessoryLook, setAddAccessoryLook] = useState(null); // Look adding accessory to

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  // Safe Pool of Wardrobe Items: User added items prioritized, backed by catalog
  const wardrobePool = useMemo(() => {
    const userItems = added || [];
    const seedPieces = isFemale ? womenProducts : (menProducts?.length ? menProducts : wardrobe);
    return userItems.length > 0 ? [...userItems, ...seedPieces] : seedPieces;
  }, [added, isFemale, womenProducts, menProducts, wardrobe]);

  // Selected Occasion Object
  const selectedOccasion = useMemo(() => {
    return occasionList.find((o) => o.id === selectedOccId) || occasionList[0];
  }, [selectedOccId]);

  // Step navigation helper
  const goToStep = (newStep) => {
    setStep(newStep);
    setMaxStepReached((prev) => Math.max(prev, newStep));
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Update occasion from external location state if provided
  useEffect(() => {
    if (location.state?.occasion) {
      setSelectedOccId(location.state.occasion);
    }
  }, [location.state?.occasion]);

  // ── "Surprise Me" Intelligent Preset Generator ──
  const handleSurpriseMe = () => {
    const occId = selectedOccasion.id;

    if (["birthday", "party", "concert-night-out"].includes(occId)) {
      setAiPrompt("A bold, glamorous evening look that makes a statement while staying effortless.");
      setSelectedStyles(["Party", "Trendy"]);
      setSelectedColors(["Black", "Grey"]);
      setSelectedWeather("Warm");
      setSelectedFit("Regular");
    } else if (["job-interview", "office-work", "formal-event", "business-networking"].includes(occId)) {
      setAiPrompt("A crisp, authoritative professional outfit tailored for confidence and elegance.");
      setSelectedStyles(["Formal", "Smart Casual"]);
      setSelectedColors(["Blue", "White"]);
      setSelectedWeather("Cool");
      setSelectedFit("Slim");
    } else if (["wedding", "engagement", "family-gathering", "festive-diwali"].includes(occId)) {
      setAiPrompt("An elegant celebratory ensemble rich in royal accents and celebratory colors.");
      setSelectedStyles(["Traditional", "Elegant"]);
      setSelectedColors(["Beige", "Green"]);
      setSelectedWeather("Warm");
      setSelectedFit("Regular");
    } else if (["travel-vacation", "beach-resort", "outdoor-adventure", "shopping-city-outing"].includes(occId)) {
      setAiPrompt("A lightweight, versatile travel outfit built for effortless movement and all-day style.");
      setSelectedStyles(["Casual", "Streetwear"]);
      setSelectedColors(["White", "Beige"]);
      setSelectedWeather("Hot");
      setSelectedFit("Relaxed");
    } else {
      setAiPrompt("A stylish, comfortable outfit tailored to perfection with balanced tones.");
      setSelectedStyles(["Smart Casual", "Minimal"]);
      setSelectedColors(["Black", "White"]);
      setSelectedWeather("Warm");
      setSelectedFit("Regular");
    }

    triggerToast("✨ AI selected tailored styling preferences!");
  };

  // Toggle style chips
  const toggleStyle = (style) => {
    setSelectedStyles((prev) => {
      if (prev.includes(style)) {
        return prev.length > 1 ? prev.filter((s) => s !== style) : prev;
      }
      return [...prev, style];
    });
  };

  // Toggle color chips
  const toggleColor = (color) => {
    if (color === "Any") {
      setSelectedColors(["Any"]);
      return;
    }
    setSelectedColors((prev) => {
      const filtered = prev.filter((c) => c !== "Any");
      if (filtered.includes(color)) {
        return filtered.length > 0 ? filtered.filter((c) => c !== color) : ["Any"];
      }
      return [...filtered, color];
    });
  };

  // ── Outfit Generation Engine ──
  const generateOutfits = () => {
    setIsGenerating(true);
    setGenerationPhase(1);

    // Simulated multi-stage AI reasoning steps
    setTimeout(() => setGenerationPhase(2), 400);
    setTimeout(() => setGenerationPhase(3), 850);
    setTimeout(() => setGenerationPhase(4), 1300);

    setTimeout(() => {
      setIsGenerating(false);

      // Build 3 distinct looks tailored to occasion, preferences & wardrobe
      const occName = selectedOccasion.name;
      const primaryStyle = selectedStyles[0] || "Smart Casual";
      const primaryColor = selectedColors.includes("Any") ? "Neutral & Balanced" : selectedColors.join(" + ");

      // Pick representative pieces from wardrobe pool
      const tops = wardrobePool.filter((w) => ["Shirts", "Tops", "Dresses"].includes(w.cat || w.category));
      const bottoms = wardrobePool.filter((w) => ["Pants"].includes(w.cat || w.category));
      const shoes = wardrobePool.filter((w) => ["Shoes", "Footwear"].includes(w.cat || w.category));
      const accessories = wardrobePool.filter((w) => ["Accessories", "Jewelry"].includes(w.cat || w.category));

      // Available look images fallback
      const lookImages = (looks || [])
        .filter((l) => (isFemale ? l.gender === "Women" : l.gender === "Men"))
        .map((l) => l.img);

      const lookAImage = lookImages[0] || selectedOccasion.image;
      const lookBImage = lookImages[1] || selectedOccasion.image;
      const lookCImage = lookImages[2] || selectedOccasion.image;

      const generated = [
        {
          id: `outfit-${Date.now()}-1`,
          title: `Signature ${primaryStyle}`,
          style: primaryStyle,
          colorPalette: primaryColor,
          matchScore: 98,
          summary: `Clean, tailored silhouette built for ${occName}. Perfectly balanced for ${selectedWeather.toLowerCase()} weather.`,
          whyItWorks: `Harmonizes ${primaryStyle.toLowerCase()} lines with breathable textures. The color palette (${primaryColor}) creates an intentional, elevated appearance ideal for ${occName}.`,
          img: lookAImage,
          pieces: [
            tops[0] || { id: "p-top-1", name: "Tailored Oxford Top", cat: "Tops", img: "/wardrobe/shirt 1.png" },
            bottoms[0] || { id: "p-bot-1", name: "Pleated Tapered Trousers", cat: "Pants", img: "/wardrobe/pant 1.png" },
            shoes[0] || { id: "p-shoe-1", name: "Artisan Leather Footwear", cat: "Footwear", img: "/wardrobe/shoe 1.png" },
            accessories[0] || { id: "p-acc-1", name: "Chronograph Gold Watch", cat: "Accessories", img: "/wardrobe/a1.png" },
          ],
        },
        {
          id: `outfit-${Date.now()}-2`,
          title: "Modern Minimalist",
          style: "Minimal",
          colorPalette: "Monochrome & Earthy",
          matchScore: 95,
          summary: `Streamlined and versatile ensemble. Less visual clutter, maximum contemporary refinement.`,
          whyItWorks: `Focuses on clean drape and proportion. Designed to look sharp from day to evening without requiring outfit adjustments.`,
          img: lookBImage,
          pieces: [
            tops[1] || tops[0] || { id: "p-top-2", name: "Linen Minimalist Shirt", cat: "Tops", img: "/wardrobe/shirt 2.png" },
            bottoms[1] || bottoms[0] || { id: "p-bot-2", name: "Slim Relaxed Chinos", cat: "Pants", img: "/wardrobe/pant 2.png" },
            shoes[1] || shoes[0] || { id: "p-shoe-2", name: "Court Classic Loafers", cat: "Footwear", img: "/wardrobe/shoe 2.png" },
          ],
        },
        {
          id: `outfit-${Date.now()}-3`,
          title: "Relaxed Contemporary",
          style: selectedStyles[1] || "Trendy",
          colorPalette: "Rich Contrast",
          matchScore: 93,
          summary: `Effortless, comfortable styling featuring relaxed silhouettes and curated statement pieces.`,
          whyItWorks: `Combines relaxed comfort with intentional styling. Breathable fabrics ensure ease while subtle accessories elevate the entire presentation.`,
          img: lookCImage,
          pieces: [
            tops[2] || tops[0] || { id: "p-top-3", name: "Textured Casual Knit", cat: "Tops", img: "/wardrobe/shirt 3.png" },
            bottoms[2] || bottoms[0] || { id: "p-bot-3", name: "Utility Tailored Trousers", cat: "Pants", img: "/wardrobe/pant 3.png" },
            shoes[2] || shoes[0] || { id: "p-shoe-3", name: "Comfort Everyday Trainers", cat: "Footwear", img: "/wardrobe/shoe 3.png" },
            accessories[1] || accessories[0] || { id: "p-acc-2", name: "Minimalist Pendant", cat: "Jewelry", img: "/wardrobe/j1.png" },
          ],
        },
      ];

      setGeneratedLooks(generated);
      goToStep(4);
      triggerToast("✨ AI generated 3 complete looks!");
    }, 1600);
  };

  // ── Save Look Handler ──
  const handleSaveLook = (look) => {
    const isCurrentlySaved = saved.includes(look.id);
    // 1. Save ID in StoreContext
    toggleSave(look.id);

    // 2. Persist custom look in localStorage so SavedLooks page can render it
    try {
      const existing = JSON.parse(localStorage.getItem("mmr_custom_looks") || "[]");
      if (isCurrentlySaved) {
        const filtered = existing.filter((l) => l.id !== look.id);
        localStorage.setItem("mmr_custom_looks", JSON.stringify(filtered));
        triggerToast(`Removed "${look.title}" from Saved Looks`);
      } else {
        const lookToSave = {
          ...look,
          occ: selectedOccasion?.name || look.occ || "Casual",
          savedAt: new Date().toISOString(),
        };
        const updated = [lookToSave, ...existing.filter((l) => l.id !== look.id)];
        localStorage.setItem("mmr_custom_looks", JSON.stringify(updated.slice(0, 50)));
        triggerToast(`✓ "${look.title}" saved to your Saved Looks!`);
      }
    } catch (err) {
      console.warn("Could not cache custom look:", err);
    }
  };

  // ── "Change Item" Handler ──
  const handleReplacePiece = (lookId, oldPieceId, newPiece) => {
    setGeneratedLooks((prev) =>
      prev.map((look) => {
        if (look.id !== lookId) return look;
        const updatedPieces = look.pieces.map((p) => (p.id === oldPieceId ? newPiece : p));
        return {
          ...look,
          pieces: updatedPieces,
          whyItWorks: `${look.whyItWorks} Updated with ${newPiece.name} for an enhanced personalized silhouette.`,
        };
      })
    );
    setItemToReplace(null);
    setChangeItemLook(null);
    triggerToast(`✓ Swapped with "${newPiece.name}"`);
  };

  // ── "Try Different Style" Handler ──
  const handleTryDifferentStyle = (lookId) => {
    const styleOptions = ["Streetwear", "Formal", "Minimal", "Trendy", "Elegant", "Smart Casual"];
    setGeneratedLooks((prev) =>
      prev.map((look) => {
        if (look.id !== lookId) return look;
        const currentIdx = styleOptions.indexOf(look.style);
        const nextStyle = styleOptions[(currentIdx + 1) % styleOptions.length];
        return {
          ...look,
          style: nextStyle,
          title: `${nextStyle} Edition`,
          matchScore: Math.min(99, Math.max(90, look.matchScore + 1)),
          summary: `Re-styled with a ${nextStyle.toLowerCase()} focus for ${selectedOccasion.name}.`,
          whyItWorks: `Shifted stylistic emphasis to ${nextStyle.toLowerCase()}. The structure and proportions now convey a distinct, fresh fashion personality.`,
        };
      })
    );
    triggerToast(`✓ Shifted look to a different style direction!`);
  };

  // ── "Add Accessories" Handler ──
  const handleAddAccessoryToLook = (lookId, accessoryItem) => {
    setGeneratedLooks((prev) =>
      prev.map((look) => {
        if (look.id !== lookId) return look;
        if (look.pieces.some((p) => p.id === accessoryItem.id)) return look;
        return {
          ...look,
          pieces: [...look.pieces, accessoryItem],
          whyItWorks: `${look.whyItWorks} Finished with ${accessoryItem.name} for elevated focal detail.`,
        };
      })
    );
    setAddAccessoryLook(null);
    triggerToast(`✓ Added "${accessoryItem.name}" to outfit!`);
  };

  // Filtered occasions for Step 1
  const displayedOccasions = useMemo(() => {
    switch (occFilter) {
      case "Personal":
        return occasionList.filter((o) => o.category === "personal");
      case "Professional":
        return occasionList.filter((o) => o.category === "professional");
      case "Social":
        return occasionList.filter((o) => o.category === "social");
      case "Travel":
        return occasionList.filter((o) => o.category === "travel");
      case "Seasonal":
        return occasionList.filter((o) => o.category === "seasonal");
      case "Traditional":
        return occasionList.filter((o) => o.isTraditional || o.category === "traditional");
      case "All":
      default:
        return occasionList;
    }
  }, [occFilter]);

  // Filtered wardrobe items for Step 3
  const displayedWardrobeItems = useMemo(() => {
    if (wardrobeCat === "All") return wardrobePool;
    return wardrobePool.filter(
      (w) => (w.cat || w.category || "").toLowerCase() === wardrobeCat.toLowerCase()
    );
  }, [wardrobeCat, wardrobePool]);

  return (
    <div className="space-y-8">
      {/* ── Toast Notification ── */}
      {toastMsg && (
        <div
          role="status"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#0a1a12] border-2 border-emerald-500/80 text-white shadow-[0_12px_45px_rgba(16,185,129,0.45)] backdrop-blur-md animate-up text-sm font-semibold max-w-md w-[92%]"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-black grid place-items-center font-bold text-xs shrink-0">
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
      <Hero
        img={IMG["hero-create-outfit"] || "/BackGround Images/Create Outfit BackGround Image.png"}
        script={
          <>
            Your Wardrobe.
            <br />
            New Possibilities.
            <br />
            Every Occasion.
          </>
        }
        h="min-h-[300px] md:min-h-[340px]"
      >
        <div className="max-w-xl">
          <span className="text-[11px] uppercase font-bold tracking-[.3em] text-amber-400 mb-2.5 block">
            MAKE ME READY · AI STYLING STUDIO
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            Create <span className="text-acc">Outfit</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2.5 leading-relaxed max-w-lg">
            Build your perfect look for any occasion using pieces from your wardrobe with
            intelligent AI styling.
          </p>
        </div>
      </Hero>

      {/* ── 4-Step Visual Stepper Tracker ── */}
      <Stepper currentStep={step} onStepClick={goToStep} maxStepReached={maxStepReached} />

      {/* ════════════════════════════════════════════════════════════════════════════
          STEP 1: SELECT OCCASION
      ════════════════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <section className="card p-6 md:p-8 space-y-7 bg-[#121212] border-white/[.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[.08] pb-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                STEP 1 OF 4
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1">
                Where are you going?
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Choose an occasion and we'll create a look that fits the moment.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="btn-s h-10 px-4 text-xs text-stone-300 hover:text-white"
              >
                ⚡ Quick Skip to Wardrobe
              </button>
              <button
                type="button"
                disabled={!selectedOccId}
                onClick={() => goToStep(2)}
                className="btn-p h-10 px-6 text-xs text-black font-semibold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-40"
              >
                <span>Continue to Preferences</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Personal", "Professional", "Social", "Travel", "Seasonal", "Traditional"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setOccFilter(cat)}
                  className={`h-9 px-4 rounded-full text-xs font-semibold shrink-0 transition ${
                    occFilter === cat
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "bg-[#181818] border border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Occasion Cards Grid (4 columns desktop, 2 tablet, 1 mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedOccasions.map((occ) => {
              const isSelected = selectedOccId === occ.id;

              return (
                <div
                  key={occ.id}
                  onClick={() => setSelectedOccId(occ.id)}
                  className={`group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-[#141414] text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-2 border-amber-500 ring-4 ring-amber-500/25 shadow-[0_0_30px_rgba(245,158,11,0.3)] -translate-y-1.5"
                      : "border border-white/[.08] hover:border-amber-500/50 hover:-translate-y-1"
                  }`}
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-black/60">
                    <img
                      src={occ.image}
                      alt={occ.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                    {/* Category Tag */}
                    <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-md">
                      {occ.category}
                    </span>

                    {/* Checkmark Indicator */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-amber-500 text-black grid place-items-center shadow-md shadow-amber-500/40 animate-up">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="pt-3.5 pb-1 px-1">
                    <h3
                      className={`font-serif font-bold text-base sm:text-lg transition truncate ${
                        isSelected ? "text-amber-400" : "text-white group-hover:text-amber-400"
                      }`}
                    >
                      {occ.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 truncate">{occ.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={!selectedOccId}
              onClick={() => goToStep(2)}
              className="btn-p h-12 px-8 text-sm text-black font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/25 disabled:opacity-40 cursor-pointer"
            >
              <span>Continue to Preferences</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════
          STEP 2: PREFERENCES
      ════════════════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <section className="card p-6 md:p-8 space-y-8 bg-[#121212] border-white/[.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[.08] pb-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                STEP 2 OF 4 · FOR {selectedOccasion.name.toUpperCase()}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1">
                What are you looking for?
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Tell your AI stylist what you have in mind. Be as specific or as simple as you like.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="h-10 px-4 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Sparkles size={14} />
                <span>✨ Surprise Me</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="btn-s h-10 px-4 text-xs text-stone-300 hover:text-white"
              >
                Skip Preferences
              </button>
            </div>
          </div>

          {/* Large AI Prompt Box */}
          <div className="space-y-2">
            <label htmlFor="ai-prompt" className="block text-sm font-semibold text-white">
              AI Stylist Prompt & Description
            </label>
            <div className="relative">
              <textarea
                id="ai-prompt"
                rows={3}
                maxLength={450}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. I want a smart casual outfit for college. Something comfortable, trendy and suitable for warm weather."
                className="inp p-4 bg-[#161616] border-white/15 focus:border-amber-500 rounded-2xl w-full text-sm leading-relaxed resize-none shadow-inner"
              />
              <span className="absolute bottom-3 right-3 text-[11px] text-stone-400">
                {aiPrompt.length} / 450
              </span>
            </div>
          </div>

          {/* Quick Style Preferences Chips */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">Style Direction</label>
              <span className="text-xs text-stone-400">Choose one or more styles</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Casual",
                "Smart Casual",
                "Formal",
                "Streetwear",
                "Minimal",
                "Traditional",
                "Trendy",
                "Elegant",
              ].map((style) => {
                const isActive = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`h-9 px-4 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 ring-1 ring-amber-500"
                        : "bg-[#181818] border border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {isActive ? `✓ ${style}` : style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Preference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">Preferred Colors</label>
              <span className="text-xs text-stone-400">Selected: {selectedColors.join(", ")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { name: "Any", bg: "transparent" },
                { name: "Black", bg: "#111" },
                { name: "White", bg: "#f5f5f5" },
                { name: "Blue", bg: "#2563eb" },
                { name: "Beige", bg: "#d4b895" },
                { name: "Brown", bg: "#78350f" },
                { name: "Grey", bg: "#6b7280" },
                { name: "Green", bg: "#15803d" },
                { name: "Custom", bg: "conic-gradient(red, yellow, green, cyan, blue, magenta, red)" },
              ].map(({ name, bg }) => {
                const isSelected = selectedColors.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColor(name)}
                    className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      isSelected
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                        : "bg-[#181818] border border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {name !== "Any" && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ background: bg }}
                      />
                    )}
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>

            {selectedColors.includes("Custom") && (
              <div className="pt-1 max-w-xs animate-up">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="Enter color (e.g. Lavender, Maroon, Mustard)"
                  className="inp h-9 px-3 text-xs bg-[#161616] border-white/15 focus:border-amber-500 rounded-xl w-full"
                />
              </div>
            )}
          </div>

          {/* Weather / Temperature */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white">Weather & Climate</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {[
                { label: "Hot", icon: "☀", desc: "Breathable & light" },
                { label: "Warm", icon: "🌤", desc: "Comfortable layers" },
                { label: "Cool", icon: "☁", desc: "Light jackets & knits" },
                { label: "Cold", icon: "❄", desc: "Heavy coats & wool" },
                { label: "Rainy", icon: "🌧", desc: "Water-safe & crisp" },
                { label: "Humid", icon: "🌦", desc: "Airy & relaxed" },
              ].map(({ label, icon, desc }) => {
                const isSelected = selectedWeather === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedWeather(label)}
                    className={`p-3 rounded-2xl text-left border transition ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-500/30"
                        : "bg-[#181818] border-white/10 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="text-lg">{icon}</div>
                    <div className="text-xs font-bold text-white mt-1">{label}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fit Preference (Optional) */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white">Fit Preference (Optional)</label>
            <div className="flex flex-wrap gap-2.5">
              {["Slim", "Regular", "Relaxed", "Oversized", "No Preference"].map((fit) => {
                const isSelected = selectedFit === fit;
                return (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setSelectedFit(fit)}
                    className={`h-9 px-4 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                        : "bg-[#181818] border border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {fit}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 Bottom Navigation */}
          <div className="pt-4 flex items-center justify-between border-t border-white/[.08]">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="btn-s h-11 px-5 text-xs text-stone-300 flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Occasion</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="btn-p h-11 px-7 text-xs text-black font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <span>Continue to Wardrobe</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════
          STEP 3: CHOOSE WARDROBE
      ════════════════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <section className="card p-6 md:p-8 space-y-8 bg-[#121212] border-white/[.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[.08] pb-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                STEP 3 OF 4 · WARDROBE SELECTION
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1">
                What should we style?
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Choose pieces from your wardrobe or let AI build the outfit for you.
              </p>
            </div>

            <button
              type="button"
              onClick={generateOutfits}
              className="btn-p h-11 px-7 text-xs text-black font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/25"
            >
              <Sparkles size={14} />
              <span>Generate My Outfits</span>
            </button>
          </div>

          {/* TWO CLEAR MODES: AI Choice vs Manual Selection */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div
              onClick={() => setWardrobeMode("ai")}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                wardrobeMode === "ai"
                  ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                  : "bg-[#161616] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">✨</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Recommended
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white mt-3">Let AI Choose</h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Let your AI stylist select the best matching pieces from your wardrobe automatically.
              </p>
            </div>

            <div
              onClick={() => setWardrobeMode("manual")}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                wardrobeMode === "manual"
                  ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                  : "bg-[#161616] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">👕</span>
                {selectedWardrobeIds.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                    {selectedWardrobeIds.length} Selected
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-lg text-white mt-3">I'll Choose</h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Pick specific pieces you want guaranteed to be incorporated into your outfit.
              </p>
            </div>
          </div>

          {/* If "I'll Choose" is active, display Wardrobe Pieces Selector */}
          {wardrobeMode === "manual" && (
            <div className="space-y-5 pt-3 animate-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {["All", "Shirts", "Tops", "Pants", "Footwear", "Accessories", "Jewelry"].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setWardrobeCat(c)}
                        className={`h-8 px-3.5 rounded-full text-xs font-semibold shrink-0 transition ${
                          wardrobeCat === c
                            ? "bg-amber-500 text-black font-semibold"
                            : "bg-[#181818] border border-white/10 text-stone-300 hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    )
                  )}
                </div>

                {selectedWardrobeIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedWardrobeIds([])}
                    className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                  >
                    Clear selection ({selectedWardrobeIds.length})
                  </button>
                )}
              </div>

              {/* Wardrobe Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-96 overflow-y-auto pr-1">
                {displayedWardrobeItems.map((item) => {
                  const isChecked = selectedWardrobeIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setSelectedWardrobeIds((prev) =>
                          isChecked ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                        )
                      }
                      className={`relative rounded-xl overflow-hidden border p-2 bg-[#161616] cursor-pointer transition flex flex-col justify-between ${
                        isChecked
                          ? "border-amber-500 ring-2 ring-amber-500/40 bg-amber-500/5 shadow-md shadow-amber-500/20"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden relative bg-black/40">
                        <img
                          src={item.img || item.image || "/img/hero-wardrobe-luxury.jpg"}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/img/hero-wardrobe-luxury.jpg";
                          }}
                          className="w-full h-full object-cover"
                        />
                        {isChecked && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 text-black grid place-items-center shadow-md">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div className="pt-2">
                        <div className="text-xs font-medium text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {item.cat || item.category}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 Bottom Navigation */}
          <div className="pt-4 flex items-center justify-between border-t border-white/[.08]">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="btn-s h-11 px-5 text-xs text-stone-300 flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Preferences</span>
            </button>
            <button
              type="button"
              onClick={generateOutfits}
              className="btn-p h-12 px-8 text-sm text-black font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Generate My Outfits</span>
            </button>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════
          STEP 4: GENERATE & CUSTOMIZE STUDIO
      ════════════════════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <section className="space-y-8">
          {/* AI Generation Loading State */}
          {isGenerating ? (
            <div className="card p-16 text-center space-y-6 bg-[#131313] border border-amber-500/30 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-up">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 grid place-items-center mx-auto animate-pulse">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-2xl text-white">
                  Your AI stylist is creating your looks...
                </h3>
                <p className="text-sm text-amber-400 font-medium">
                  {generationPhase === 1 && "Analyzing your wardrobe pieces..."}
                  {generationPhase === 2 && "Matching color harmony & silhouette..."}
                  {generationPhase === 3 && `Scoring suitability for ${selectedOccasion.name}...`}
                  {generationPhase === 4 && "Building 3 complete outfit recommendations..."}
                </p>
              </div>
              <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                  style={{ width: `${(generationPhase / 4) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Studio Controls */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-6 rounded-3xl bg-[#141414] border border-white/[.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      STEP 4 OF 4 · OUTFITS READY
                    </span>
                    <span className="text-xs text-stone-400">
                      Tailored for <b className="text-white">{selectedOccasion.name}</b>
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                    Your Looks Are Ready
                  </h2>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1">
                    Review your AI recommendations, swap specific pieces, or save them to your
                    collection.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="btn-s h-10 px-4 text-xs text-stone-300 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to Wardrobe</span>
                  </button>
                  <button
                    type="button"
                    onClick={generateOutfits}
                    className="btn-s h-10 px-4 text-xs text-stone-300 hover:text-white flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>Regenerate All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="btn-p h-10 px-4 text-xs text-black font-semibold flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Start New Outfit</span>
                  </button>
                </div>
              </div>

              {/* 3–4 Generated Outfits Display */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {generatedLooks.map((look) => {
                  const isLookSaved = saved.includes(look.id);

                  return (
                    <div
                      key={look.id}
                      className="card p-5 bg-[#141414] border border-white/[.08] hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between rounded-3xl group shadow-lg"
                    >
                      <div className="space-y-4">
                        {/* Look Visual Header */}
                        <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-black/50 border border-white/[.06]">
                          <img
                            src={look.img}
                            alt={look.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = selectedOccasion.image;
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                          {/* Match Score Badge */}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-600/90 text-white shadow-md">
                            {look.matchScore}% Match
                          </span>

                          {/* Style Badge */}
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                            {look.style}
                          </span>

                          {/* Bottom Visual Info */}
                          <div className="absolute bottom-3 inset-x-3 text-left">
                            <h3 className="font-serif font-bold text-lg text-white drop-shadow-md">
                              {look.title}
                            </h3>
                            <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-1">
                              {look.summary}
                            </p>
                          </div>
                        </div>

                        {/* Selected Pieces Grid (Breakdown) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-400 font-medium">Included Pieces</span>
                            <span className="text-amber-400 text-[11px]">
                              {look.pieces.length} items
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {look.pieces.map((piece) => (
                              <div
                                key={piece.id}
                                className="group/item relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-square p-1"
                                title={piece.name}
                              >
                                <img
                                  src={piece.img || piece.image || "/img/hero-wardrobe-luxury.jpg"}
                                  alt={piece.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/item:opacity-100 transition flex items-center justify-center p-1 text-center">
                                  <span className="text-[9px] text-white leading-tight font-semibold line-clamp-2">
                                    {piece.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* "Why It Works" Stylist Rationale */}
                        <div className="p-3 rounded-2xl bg-white/[.03] border border-white/[.06] text-xs leading-relaxed space-y-1">
                          <span className="text-amber-400 font-semibold block text-[11px]">
                            💡 Why This Works:
                          </span>
                          <p className="text-stone-300 text-[11px]">{look.whyItWorks}</p>
                        </div>
                      </div>

                      {/* 5 Interactive Outfit Action Buttons */}
                      <div className="pt-4 border-t border-white/[.08] space-y-2">
                        {/* Top row actions: View Full Look & Save */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setModalLook(look)}
                            className="btn-s h-9 text-xs flex items-center justify-center gap-1.5"
                          >
                            <Eye size={12} />
                            <span>View Full Look</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveLook(look)}
                            className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                              isLookSaved
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "btn-p text-black"
                            }`}
                          >
                            {isLookSaved ? (
                              <>
                                <Check size={12} className="stroke-[3]" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Heart size={12} />
                                <span>Save Look</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Customization Row: Change Item, Try Different Style, Add Accessories */}
                        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              setChangeItemLook(look);
                              setItemToReplace(look.pieces[0]);
                            }}
                            className="h-8 px-1.5 rounded-lg border border-white/10 hover:border-amber-500/40 bg-white/5 text-stone-300 hover:text-white transition flex items-center justify-center gap-1 truncate"
                          >
                            <SlidersHorizontal size={11} className="shrink-0" />
                            <span className="truncate">Change Item</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTryDifferentStyle(look.id)}
                            className="h-8 px-1.5 rounded-lg border border-white/10 hover:border-amber-500/40 bg-white/5 text-stone-300 hover:text-white transition flex items-center justify-center gap-1 truncate"
                          >
                            <RefreshCw size={11} className="shrink-0" />
                            <span className="truncate">Diff Style</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAddAccessoryLook(look)}
                            className="h-8 px-1.5 rounded-lg border border-white/10 hover:border-amber-500/40 bg-white/5 text-stone-300 hover:text-white transition flex items-center justify-center gap-1 truncate"
                          >
                            <Watch size={11} className="shrink-0" />
                            <span className="truncate">+ Accessory</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── MODAL 1: VIEW FULL LOOK ── */}
      {modalLook && (
        <Modal open={Boolean(modalLook)} onClose={() => setModalLook(null)} title={modalLook.title}>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="relative aspect-[3/3.8] rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                <img src={modalLook.img} alt={modalLook.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  {modalLook.matchScore}% Match
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-black/75 text-amber-400 border border-amber-500/30">
                  {modalLook.style}
                </span>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-white">{modalLook.title}</h3>
                  <p className="text-xs text-stone-400 mt-1">{modalLook.summary}</p>

                  <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Occasion:</span>
                      <span className="text-white font-medium">{selectedOccasion.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Color Harmony:</span>
                      <span className="text-amber-400 font-medium">{modalLook.colorPalette}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Weather Optimization:</span>
                      <span className="text-white font-medium">{selectedWeather}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                      Selected Pieces ({modalLook.pieces.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {modalLook.pieces.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 p-2 rounded-xl bg-white/[.02] border border-white/10"
                        >
                          <img
                            src={p.img || p.image || "/img/hero-wardrobe-luxury.jpg"}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                            <div className="text-[10px] text-stone-400">{p.cat || p.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveLook(modalLook);
                      setModalLook(null);
                    }}
                    className="btn-p flex-1 h-11 text-xs text-black font-semibold flex items-center justify-center gap-2"
                  >
                    <Heart size={14} />
                    <span>Save to Saved Looks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalLook(null)}
                    className="btn-s flex-1 h-11 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL 2: CHANGE ITEM (SWAP WITH WARDROBE PIECE) ── */}
      {changeItemLook && (
        <Modal
          open={Boolean(changeItemLook)}
          onClose={() => {
            setChangeItemLook(null);
            setItemToReplace(null);
          }}
          title={`Replace Piece in "${changeItemLook.title}"`}
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-300">
              Select which item you want to swap, then pick a compatible replacement from your wardrobe:
            </p>

            {/* Select piece to replace */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {changeItemLook.pieces.map((piece) => {
                const isTarget = itemToReplace?.id === piece.id;
                return (
                  <div
                    key={piece.id}
                    onClick={() => setItemToReplace(piece)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition ${
                      isTarget
                        ? "bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40 text-white"
                        : "bg-[#181818] border-white/10 text-stone-400 hover:text-white"
                    }`}
                  >
                    <img
                      src={piece.img || piece.image || "/img/hero-wardrobe-luxury.jpg"}
                      alt={piece.name}
                      className="w-full aspect-square rounded-lg object-cover mb-1.5"
                    />
                    <div className="text-[11px] font-semibold text-white truncate">{piece.name}</div>
                    <div className="text-[9px] text-amber-400 font-medium">Click to Swap</div>
                  </div>
                );
              })}
            </div>

            {/* Available replacements */}
            {itemToReplace && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-semibold text-white block">
                  Compatible Alternatives for "{itemToReplace.name}":
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {wardrobePool
                    .filter((w) => w.id !== itemToReplace.id)
                    .slice(0, 12)
                    .map((replacement) => (
                      <div
                        key={replacement.id}
                        onClick={() => handleReplacePiece(changeItemLook.id, itemToReplace.id, replacement)}
                        className="p-2 rounded-xl border border-white/10 hover:border-amber-500 bg-[#161616] cursor-pointer group transition text-left"
                      >
                        <img
                          src={replacement.img || replacement.image || "/img/hero-wardrobe-luxury.jpg"}
                          alt={replacement.name}
                          className="w-full aspect-square rounded-lg object-cover mb-1 group-hover:scale-105 transition"
                        />
                        <div className="text-[11px] font-semibold text-white truncate">
                          {replacement.name}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-medium mt-0.5">
                          ✓ Use This Piece
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── MODAL 3: ADD ACCESSORIES ── */}
      {addAccessoryLook && (
        <Modal
          open={Boolean(addAccessoryLook)}
          onClose={() => setAddAccessoryLook(null)}
          title={`Add Accessories to "${addAccessoryLook.title}"`}
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-300">
              Pick accessories from your collection (watch, sunglasses, necklace, bag) to finish this look:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
              {wardrobePool
                .filter((w) =>
                  ["accessories", "jewelry", "other"].includes((w.cat || w.category || "").toLowerCase())
                )
                .slice(0, 12)
                .map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleAddAccessoryToLook(addAccessoryLook.id, acc)}
                    className="p-2.5 rounded-xl border border-white/10 hover:border-amber-500 bg-[#161616] cursor-pointer group transition text-left"
                  >
                    <img
                      src={acc.img || acc.image || "/img/hero-wardrobe-luxury.jpg"}
                      alt={acc.name}
                      className="w-full aspect-square rounded-lg object-cover mb-1.5 group-hover:scale-105 transition"
                    />
                    <div className="text-xs font-semibold text-white truncate">{acc.name}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">+ Add to Outfit</div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
