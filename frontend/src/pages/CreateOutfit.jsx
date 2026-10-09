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
  Loader2,
} from "lucide-react";
import { Hero, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG, occasionList } from "../data/constants.js";

// Stepper Component
const Stepper = ({ currentStep, onStepClick, maxStepReached, isGenerated }) => {
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
        const isCompleted = currentStep > s.num || (s.num === 4 && Boolean(isGenerated));
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
                  isCompleted
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/50"
                    : isCurrent
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/25 ring-2 ring-amber-500/40"
                    : "bg-white/5 border border-white/10 text-stone-400"
                }`}
              >
                {isCompleted ? <Check size={14} className="stroke-[3]" /> : s.num}
              </span>
              <div className="hidden sm:block">
                <span
                  className={`block text-xs font-semibold leading-tight ${
                    isCompleted ? "text-emerald-400" : isCurrent ? "text-amber-400" : "text-stone-400"
                  }`}
                >
                  {s.label}
                </span>
                <span className={`text-[10px] ${isCompleted ? "text-emerald-400/90 font-medium" : "text-stone-400"}`}>
                  {isCompleted ? "Generated" : isCurrent ? "In Progress" : `Step ${s.num}`}
                </span>
              </div>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-colors ${
                  currentStep > s.num || (s.num === 3 && Boolean(isGenerated))
                    ? "bg-emerald-500/50"
                    : "bg-white/[.08]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const BOY_OUTFIT_COLLECTION = [
  {
    imageNum: 1,
    img: "/Recommendations/boy 1.png",
    title: "Camel Blazer Smart Casual",
    style: "Smart Casual",
    matchScore: 95,
    summary: "Refined camel blazer styling with tailored chinos and premium leather accents.",
    whyItWorks: "Warm neutral tones paired with structured tailoring deliver elevated confidence for any day-to-evening setting.",
  },
  {
    imageNum: 2,
    img: "/Recommendations/boy 2.png",
    title: "Romantic Candlelight Dinner",
    style: "Minimal",
    matchScore: 94,
    summary: "Crisp white tailored dress shirt with slate dress trousers and polished footwear.",
    whyItWorks: "Clean monochrome lines convey effortless poise and understated romance under warm evening light.",
  },
  {
    imageNum: 3,
    img: "/Recommendations/boy 3.png",
    title: "Urban Cafe Stroll",
    style: "Casual",
    matchScore: 93,
    summary: "Breezy charcoal linen shirt paired with relaxed cotton trousers and clean white sneakers.",
    whyItWorks: "Tactile natural fabrics keep you cool while subtle tailoring prevents the look from looking slouchy.",
  },
  {
    imageNum: 4,
    img: "/Recommendations/boy 4.png",
    title: "Ivory Chikankari Festive Kurta",
    style: "Traditional",
    matchScore: 96,
    summary: "Artisanal embroidered festive kurta ensemble styled with handcrafted jewelry accents.",
    whyItWorks: "Intricate tone-on-tone embroidery channels grand celebratory heritage with modern lightweight grace.",
  },
  {
    imageNum: 5,
    img: "/Recommendations/boy 5.png",
    title: "Athleisure Training Silhouette",
    style: "Sporty",
    matchScore: 92,
    summary: "High-performance all-black athletic layers with engineered stretch and trainer shoes.",
    whyItWorks: "Ergonomic cuts and moisture-wicking weaves maximize agility and dynamic athletic presence.",
  },
  {
    imageNum: 6,
    img: "/Recommendations/boy 6.png",
    title: "Airport Jetsetter Transit Look",
    style: "Travel",
    matchScore: 94,
    summary: "Tailored transit look with relaxed tapered pants, designer duffle, and polarized shades.",
    whyItWorks: "Engineered for frictionless long-haul flights and business lounge comfort without sacrificing silhouette.",
  },
  {
    imageNum: 7,
    img: "/Recommendations/boy 7.png",
    title: "Nightclub Lounge Monochrome",
    style: "Party",
    matchScore: 95,
    summary: "Sleek nocturnal tailoring with textured shirt, dark trousers, and chronograph timepiece.",
    whyItWorks: "High-contrast dark tones capture dynamic club spotlights with sharp, charismatic precision.",
  },
  {
    imageNum: 8,
    img: "/Recommendations/boy 8.png",
    title: "Executive Boardroom Power Suit",
    style: "Formal",
    matchScore: 98,
    summary: "Sharp charcoal wool suit with Italian derby shoes and executive leather belt.",
    whyItWorks: "Commanding lapels and pristine trouser crease convey executive leadership and uncompromising authority.",
  },
  {
    imageNum: 9,
    img: "/Recommendations/boy 9.png",
    title: "Mediterranean Resort Linen",
    style: "Resort",
    matchScore: 93,
    summary: "Breathable textured resort shirt with breezy cropped trousers and boat shoes.",
    whyItWorks: "Airy weave and sun-washed earth tones radiate relaxed coastal luxury and effortless holiday vibes.",
  },
  {
    imageNum: 10,
    img: "/Recommendations/boy 10.png",
    title: "Urban Crossbody Streetwear",
    style: "Streetwear",
    matchScore: 94,
    summary: "Utility cargo pants paired with structured graphic overshirt and chunky sneakers.",
    whyItWorks: "Contemporary streetwear proportions balance utility pockets with sharp clean lines for urban exploration.",
  },
  {
    imageNum: 11,
    img: "/Recommendations/boy 11.png",
    title: "Imperial Ivory Royal Sherwani",
    style: "Traditional",
    matchScore: 97,
    summary: "Opulent regal sherwani with velvet slippers and handcrafted royal neckpiece.",
    whyItWorks: "Rich zari work and structured royal collar create an unforgettable imperial presence for grand weddings.",
  },
  {
    imageNum: 12,
    img: "/Recommendations/boy 12.png",
    title: "Midnight Emerald Tuxedo",
    style: "Black Tie",
    matchScore: 96,
    summary: "Lustrous emerald silk jacket with satin shawl lapels and patent dress shoes.",
    whyItWorks: "Daring jewel tone breaks traditional tux monotony while retaining strict gala elegance.",
  },
];

export const GIRL_OUTFIT_COLLECTION = [
  {
    imageNum: 1,
    img: "/Recommendations/girl 1.png",
    title: "Glam Night-Out Mini Dress",
    style: "Party",
    matchScore: 94,
    summary: "Sculpted black cocktail mini with stiletto heels and shimmering statement jewelry.",
    whyItWorks: "Striking silhouette designed to catch nightlife ambiance with effortless glamour and movement.",
  },
  {
    imageNum: 2,
    img: "/Recommendations/girl 2.png",
    title: "Relaxed Loungewear Pastel Set",
    style: "Casual",
    matchScore: 94,
    summary: "Ultra-soft pastel knit set with minimalist slide slippers and cozy hair accessories.",
    whyItWorks: "Premium relaxed silhouette offering supreme leisure comfort while maintaining chic aesthetic appeal.",
  },
  {
    imageNum: 3,
    img: "/Recommendations/girl 3.png",
    title: "Sky Blue Romance Maxi Gown",
    style: "Romantic",
    matchScore: 94,
    summary: "Floating sky blue chiffon maxi with subtle bodice drape and delicate gold accents.",
    whyItWorks: "Soft color palette and ethereal movement create a fairytale aura ideal for garden dates and evening walks.",
  },
  {
    imageNum: 4,
    img: "/Recommendations/girl 4.png",
    title: "Brown Ribbed Top & Vintage Denim",
    style: "Streetwear",
    matchScore: 94,
    summary: "Form-fitting high-neck ribbed crop top styled with straight-leg denim and designer sneakers.",
    whyItWorks: "The timeless high-low balance: structured heavy denim anchors the sleek, feminine knitwear top.",
  },
  {
    imageNum: 5,
    img: "/Recommendations/girl 5.png",
    title: "Blush Floral Festive Lehenga",
    style: "Traditional",
    matchScore: 94,
    summary: "Exquisite floral embroidery on blush organza with authentic kundan choker and dupatta.",
    whyItWorks: "Fresh floral motifs bring modern romantic delicacy to traditional celebratory celebrations.",
  },
  {
    imageNum: 6,
    img: "/Recommendations/girl 6.png",
    title: "Emerald Royal Velvet Lehenga",
    style: "Royal",
    matchScore: 94,
    summary: "Grand deep emerald velvet skirt with intricate antique gold zardozi detailing.",
    whyItWorks: "Heavy velvet luster commands attention with regal dignity at high-profile wedding receptions.",
  },
  {
    imageNum: 7,
    img: "/Recommendations/girl 7.png",
    title: "Modern Ivory Blazer & Trousers",
    style: "Formal",
    matchScore: 94,
    summary: "Pristine tailored ivory blazer with fluid wide-leg trousers and block court heels.",
    whyItWorks: "Clean monochrome power dressing that projects supreme boardroom confidence and modern chic.",
  },
  {
    imageNum: 8,
    img: "/Recommendations/girl 8.png",
    title: "Sunset Resort Flowing Sundress",
    style: "Resort",
    matchScore: 94,
    summary: "Breezy tiered sundress in sun-drenched warm tones paired with woven straw accessories.",
    whyItWorks: "Lightweight cotton voile catches sea breezes effortlessly for vacation brunches and beach walks.",
  },
  {
    imageNum: 9,
    img: "/Recommendations/girl 9.png",
    title: "Oversized Streetwear Varsity Chic",
    style: "Streetwear",
    matchScore: 94,
    summary: "Boxy varsity bomber jacket with pleated tennis skirt, crew socks, and platform kicks.",
    whyItWorks: "Playful collegiate retro proportions infused with high-energy street culture and attitude.",
  },
  {
    imageNum: 10,
    img: "/Recommendations/girl 10.png",
    title: "Sculpted Satin Date Night Slip",
    style: "Glamour",
    matchScore: 94,
    summary: "Fluid cowl-neck satin slip dress styled with ankle-strap heels and crystal drop earrings.",
    whyItWorks: "Liquid-like satin catches dim candlelight beautifully, highlighting natural graceful curves.",
  },
  {
    imageNum: 11,
    img: "/Recommendations/girl 11.png",
    title: "Cashmere Layered Winter Elegance",
    style: "Layered",
    matchScore: 94,
    summary: "Plush cashmere knit layered under a tailored wool coat with leather gloves and Chelsea boots.",
    whyItWorks: "Multi-layered luxury fabrics offer maximum thermal insulation with impeccable European tailoring.",
  },
  {
    imageNum: 12,
    img: "/Recommendations/girl 12.png",
    title: "Heritage Banarasi Silk Drape",
    style: "Festive",
    matchScore: 94,
    summary: "Handwoven pure silk Banarasi saree with opulent zari border and temple jewelry set.",
    whyItWorks: "Timeless cultural magnificence that honours artisanal heritage with unmatched grace and majesty.",
  },
];

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

  // User gender choice override (defaults to profile gender)
  const [genderChoice, setGenderChoice] = useState(() => (isFemale ? "Women" : "Men"));

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

  // STEP 4 STATE: 4-Set Shuffled Generation Engine
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [sessionSets, setSessionSets] = useState([]); // 4 sets of 3 items each
  const [currentSetIndex, setCurrentSetIndex] = useState(0); // 0, 1, 2, or 3
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

  // Resolve active target gender: respects explicit choice, prompts, and user profile
  const activeGender = useMemo(() => {
    if (genderChoice) return genderChoice;
    const promptLower = (aiPrompt || "").toLowerCase();
    if (/\b(female|woman|women|girl|ladies|lady)\b/i.test(promptLower)) {
      return "Women";
    }
    if (/\b(male|man|men|boy|gentleman|guy)\b/i.test(promptLower)) {
      return "Men";
    }
    if (selectedWardrobeIds.length > 0) {
      const selectedW = (womenProducts || []).find((w) => selectedWardrobeIds.includes(w.id));
      if (selectedW) return "Women";
      const selectedM = (menProducts || []).find((m) => selectedWardrobeIds.includes(m.id));
      if (selectedM) return "Men";
    }
    return isFemale ? "Women" : "Men";
  }, [genderChoice, aiPrompt, selectedWardrobeIds, isFemale, womenProducts, menProducts]);

  const isWomen = activeGender === "Women";

  // Safe Pool of Wardrobe Items: Strictly isolated by active gender to prevent cross-gender pollution
  const wardrobePool = useMemo(() => {
    const seedPieces = isWomen ? womenProducts : (menProducts?.length ? menProducts : wardrobe);
    const userItems = (added || []).filter((item) => {
      if (isWomen) {
        return (
          item.gender === "Female" ||
          item.g === "Women" ||
          ["dresses", "tops"].includes((item.cat || "").toLowerCase()) ||
          !item.gender
        );
      } else {
        return (
          item.gender === "Male" ||
          item.g === "Men" ||
          ["shirts"].includes((item.cat || "").toLowerCase()) ||
          !item.gender
        );
      }
    });
    return userItems.length > 0 ? [...userItems, ...seedPieces] : seedPieces;
  }, [added, isWomen, womenProducts, menProducts, wardrobe]);

  // Wardrobe categories adapted to target gender (Dresses for Women, Shirts for Men)
  const wardrobeCategories = useMemo(() => {
    return isWomen
      ? ["All", "Dresses", "Tops", "Pants", "Footwear", "Accessories", "Jewelry"]
      : ["All", "Shirts", "Pants", "Footwear", "Accessories", "Jewelry"];
  }, [isWomen]);

  // Selected Occasion Object
  const selectedOccasion = useMemo(() => {
    return occasionList.find((o) => o.id === selectedOccId) || occasionList[0];
  }, [selectedOccId]);

  // Step navigation helper & loading state
  const [stepLoading, setStepLoading] = useState(false);

  const goToStep = (newStep) => {
    setStep(newStep);
    setMaxStepReached((prev) => Math.max(prev, newStep));
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const handleNextStep = (newStep) => {
    if (stepLoading) return;
    setStepLoading(true);
    setTimeout(() => {
      goToStep(newStep);
      setStepLoading(false);
    }, 280);
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

  // ── 4-Set Shuffled Outfit Generation Engine ──
  const generateOutfits = () => {
    setIsGenerating(true);
    setGenerationPhase(1);

    setTimeout(() => setGenerationPhase(2), 350);
    setTimeout(() => setGenerationPhase(3), 750);
    setTimeout(() => setGenerationPhase(4), 1150);

    setTimeout(() => {
      setIsGenerating(false);

      const occName = selectedOccasion.name;
      const primaryColor = selectedColors.includes("Any") ? "Neutral and Balanced" : selectedColors.join(" + ");

      // 1. Selected gender determines image collection:
      // Male -> boy 1–boy 12 | Female -> girl 1–girl 12
      const baseCollection = isWomen ? GIRL_OUTFIT_COLLECTION : BOY_OUTFIT_COLLECTION;

      // 2. For every generation session, shuffle the 12 images first
      const shuffled = shuffleArray(baseCollection);

      // 3. Divide them into 4 sets: Set 1 (3), Set 2 (3), Set 3 (3), Set 4 (3)
      const sessionTimestamp = Date.now();
      const userSelectedPieces = selectedWardrobeIds
        .map((id) => wardrobePool.find((w) => w.id === id))
        .filter(Boolean);

      const sets = [0, 1, 2, 3].map((setIdx) => {
        const chunk = shuffled.slice(setIdx * 3, setIdx * 3 + 3);
        return chunk.map((item, idx) => {
          let lookPieces = wardrobePool.slice(idx * 2, idx * 2 + 4);
          if (userSelectedPieces.length > 0) {
            lookPieces = [
              ...userSelectedPieces,
              ...lookPieces.filter((p) => !userSelectedPieces.some((u) => u.id === p.id)),
            ].slice(0, 5);
          }
          return {
            id: `outfit-${sessionTimestamp}-${setIdx}-${idx + 1}`,
            title: item.title,
            style: item.style,
            colorPalette: primaryColor,
            matchScore: item.matchScore || (isWomen ? 94 : 95),
            summary: `${item.summary} Personalized for ${occName}.`,
            whyItWorks: item.whyItWorks,
            img: item.img,
            pieces: lookPieces.length > 0 ? lookPieces : wardrobePool.slice(0, 3),
            gender: activeGender,
            setIndex: setIdx,
          };
        });
      });

      // Initially show Set 1
      setSessionSets(sets);
      setCurrentSetIndex(0);
      setGeneratedLooks(sets[0]);
      goToStep(4);
      triggerToast("✨ AI generated 3 outfit recommendations (Set 1 of 4)!");
    }, 1400);
  };

  // ── "Generate Another Set" Handler (Sets 1 -> 2 -> 3 -> 4) ──
  const [isSetTransitioning, setIsSetTransitioning] = useState(false);

  const handleNextSet = () => {
    if (currentSetIndex < 3 && sessionSets.length > currentSetIndex + 1 && !isSetTransitioning) {
      setIsSetTransitioning(true);
      setTimeout(() => {
        const nextIdx = currentSetIndex + 1;
        setCurrentSetIndex(nextIdx);
        setGeneratedLooks(sessionSets[nextIdx]);
        setIsSetTransitioning(false);
        triggerToast(`✨ Showing Set ${nextIdx + 1} of 4 (${(nextIdx + 1) * 3}/12 recommendations)`);
        window.scrollTo({ top: 380, behavior: "smooth" });
      }, 350);
    }
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
      <Stepper
        currentStep={step}
        onStepClick={goToStep}
        maxStepReached={maxStepReached}
        isGenerated={Boolean(step === 4 && generatedLooks.length > 0 && !isGenerating)}
      />

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
                disabled={!selectedOccId || stepLoading}
                onClick={() => handleNextStep(2)}
                className="btn-p h-11 px-8 text-sm text-black font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition-transform disabled:opacity-40 cursor-pointer"
              >
                {stepLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </>
                )}
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
                      src={occ.image || occ.img || "/BackGround Images/Occasions BackGround Image.png"}
                      alt={occ.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/BackGround Images/Occasions BackGround Image.png";
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
              disabled={!selectedOccId || stepLoading}
              onClick={() => handleNextStep(2)}
              className="btn-p h-13 px-10 text-base text-black font-bold flex items-center gap-2.5 shadow-xl shadow-amber-500/35 hover:scale-[1.02] transition-transform disabled:opacity-40 cursor-pointer"
            >
              {stepLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-black" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={18} />
                </>
              )}
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

          {/* Style Profile & Target Gender Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-white">Target Wardrobe & Gender</label>
              <span className="text-xs text-amber-400 font-medium">Currently styling for: {activeGender}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGenderChoice("Men")}
                className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                  activeGender === "Men"
                    ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-[#161616] border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                }`}
              >
                <span>👔 Men's Collection (boy 1–12)</span>
              </button>
              <button
                type="button"
                onClick={() => setGenderChoice("Women")}
                className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                  activeGender === "Women"
                    ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-[#161616] border-white/10 text-stone-300 hover:text-white hover:border-white/20"
                }`}
              >
                <span>👗 Women's Collection (girl 1–12)</span>
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
              disabled={stepLoading}
              onClick={() => handleNextStep(3)}
              className="btn-p h-11 px-7 text-xs text-black font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50"
            >
              {stepLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-black" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={14} />
                </>
              )}
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
              className="btn-p h-13 sm:h-14 px-8 sm:px-10 text-sm sm:text-base text-black font-bold flex items-center gap-2.5 shadow-xl shadow-amber-500/30 hover:scale-[1.03] transition-all cursor-pointer"
            >
              <Sparkles size={18} />
              <span>Generate My Outfit</span>
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
                  {wardrobeCategories.map(
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
                          src={item.img || item.image || "/BackGround Images/Wardrobe BackGround Image.png"}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
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
              className="btn-s h-11 px-5 text-xs text-stone-300 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Preferences</span>
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

                  {currentSetIndex < 3 ? (
                    <button
                      type="button"
                      disabled={isSetTransitioning}
                      onClick={handleNextSet}
                      className="btn-p h-10 px-4 text-xs text-black font-semibold flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-60"
                    >
                      {isSetTransitioning ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-black" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>Generate Another Set ({currentSetIndex + 2}/4)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      ✓ All 12 Recommendations Shown
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={generateOutfits}
                    className="btn-s h-10 px-4 text-xs text-stone-300 hover:text-white flex items-center gap-1.5"
                    title="Generate more outfits"
                  >
                    <RefreshCw size={13} />
                    <span>Generate More Outfits</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="btn-s h-10 px-4 text-xs text-stone-300 hover:text-white flex items-center gap-1.5"
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
                              e.currentTarget.src = selectedOccasion?.image || selectedOccasion?.img || "/BackGround Images/Create Outfit BackGround Image.png";
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                          {/* Match Score Badge (Only visible on Women's recommendations) */}
                          {isWomen && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-600/90 text-white shadow-md">
                              {look.matchScore}% Match
                            </span>
                          )}

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

              {/* ── Session Progression Controls & Indicators ── */}
              <div className="p-5 rounded-3xl bg-[#141414] border border-white/[.08] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((setNum) => (
                      <span
                        key={setNum}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          currentSetIndex === setNum
                            ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold"
                            : setNum < currentSetIndex
                            ? "bg-white/10 text-stone-300 line-through opacity-60"
                            : "bg-white/5 text-stone-400 border border-white/10"
                        }`}
                      >
                        Set {setNum + 1}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-stone-400">
                    Showing {(currentSetIndex + 1) * 3} of 12 {activeGender.toLowerCase()} recommendations (no repeats)
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  {currentSetIndex < 3 ? (
                    <button
                      type="button"
                      disabled={isSetTransitioning}
                      onClick={handleNextSet}
                      className="btn-p h-11 px-5 text-xs text-black font-semibold flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-60"
                    >
                      {isSetTransitioning ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-black" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Generate Another Set ({currentSetIndex + 2} of 4)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ✓ All 12 recommendations have been displayed
                      </span>
                      <button
                        type="button"
                        onClick={generateOutfits}
                        className="btn-p h-11 px-5 text-xs text-black font-semibold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <RefreshCw size={13} />
                        <span>Generate More Outfits</span>
                      </button>
                    </div>
                  )}
                </div>
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
                <img
                  src={modalLook.img}
                  alt={modalLook.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = selectedOccasion?.image || "/BackGround Images/Create Outfit BackGround Image.png";
                  }}
                  className="w-full h-full object-cover"
                />
                {isWomen && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {modalLook.matchScore}% Match
                  </span>
                )}
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
                            src={p.img || p.image || "/BackGround Images/Wardrobe BackGround Image.png"}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
                            }}
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
                      src={piece.img || piece.image || "/BackGround Images/Wardrobe BackGround Image.png"}
                      alt={piece.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
                      }}
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
                          src={replacement.img || replacement.image || "/BackGround Images/Wardrobe BackGround Image.png"}
                          alt={replacement.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
                          }}
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
                      src={acc.img || acc.image || "/BackGround Images/Wardrobe BackGround Image.png"}
                      alt={acc.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
                      }}
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
