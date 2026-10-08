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

  // Resolve active target gender: respects user profile/isFemale, explicit prompts, and wardrobe selection
  const activeGender = useMemo(() => {
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
  }, [aiPrompt, selectedWardrobeIds, isFemale, womenProducts, menProducts]);

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

      const occId = selectedOccasion.id;
      const occName = selectedOccasion.name;
      const occCat = (selectedOccasion.category || "").toLowerCase();
      const promptLower = (aiPrompt || "").toLowerCase();
      const primaryStyle = selectedStyles[0] || "Smart Casual";
      const primaryColor = selectedColors.includes("Any") ? "Neutral & Balanced" : selectedColors.join(" + ");

      // Helper to find a specific product from available pool
      const findPiece = (id) => {
        return (
          wardrobePool.find((w) => w.id === id) ||
          (womenProducts || []).find((w) => w.id === id) ||
          (menProducts || []).find((m) => m.id === id) ||
          null
        );
      };

      // Check if user specifically requested a Dress or if wardrobe selection has a dress
      const wantsDress = isWomen && (
        /\b(dress|gown|frock|maxi|midi|slip dress|anarkali|sundress)\b/i.test(promptLower) ||
        selectedStyles.some((s) => ["Formal", "Elegant", "Party"].includes(s) && /\bdress\b/i.test(promptLower)) ||
        selectedWardrobeIds.some((id) => {
          const item = wardrobePool.find((w) => w.id === id);
          return item && ((item.cat || item.category) === "Dresses" || /dress|gown/i.test(item.name));
        }) ||
        (/\bdress\b/i.test(promptLower))
      );

      // Determine occasion group classification
      const isProfessional =
        occCat === "professional" ||
        ["job-interview", "office-work", "formal-event", "business-networking"].includes(occId) ||
        selectedStyles.includes("Formal") ||
        (selectedStyles.includes("Smart Casual") && occCat === "professional") ||
        /\b(professional|interview|office|corporate|business|work|formal)\b/i.test(promptLower);

      const isWeddingOrFestive =
        occCat === "traditional" ||
        ["wedding", "engagement", "family-gathering", "festive-diwali"].includes(occId) ||
        selectedStyles.includes("Traditional") ||
        /\b(wedding|sangeet|reception|festive|diwali|traditional|ethnic)\b/i.test(promptLower);

      const isPartyOrNightOut =
        ["party", "concert-night-out", "birthday"].includes(occId) ||
        selectedStyles.includes("Party") ||
        /\b(party|club|cocktail|night out|gala|concert)\b/i.test(promptLower);

      const isDateNight =
        occId === "date-night" ||
        selectedStyles.includes("Romantic") ||
        /\b(date|dinner|candlelight|romantic)\b/i.test(promptLower);

      const isTravelOrResort =
        occCat === "travel" ||
        ["travel-vacation", "beach-resort", "outdoor-adventure"].includes(occId) ||
        selectedWeather === "Hot" ||
        /\b(travel|airport|beach|resort|vacation)\b/i.test(promptLower);

      const isWinter =
        occId === "winter" ||
        ["Cold", "Cool"].includes(selectedWeather) ||
        /\b(winter|cold|fleece|knit|coat)\b/i.test(promptLower);

      // Template definitions for all combinations
      let templates = [];

      if (isWomen) {
        if (isProfessional) {
          if (wantsDress) {
            templates = [
              {
                title: "Executive Blazer & Midi Slip Dress",
                style: "Formal",
                matchScore: 98,
                summary: `Sculpted professional silhouette pairing a structured blazer aesthetic with a satin midi slip dress for ${occName}.`,
                whyItWorks: `Harmonizes authoritative executive drape with fluid silk luster. Block heels and a structured leather bag ensure all-day comfort with boardroom credibility.`,
                img: "/img/outfits/outfit-w7.png",
                pieceIds: ["women-dress-4", "women-shoe-2", "women-acc-1", "women-acc-3"],
              },
              {
                title: "Modern Minimalist Sheath Dress",
                style: "Minimal",
                matchScore: 96,
                summary: `Streamlined corporate dress with clean architectural drape, tailored for presentations and client meetings.`,
                whyItWorks: `Zero visual clutter, maximum polish. Paired with Italian leather mules and a refined gold pendant for effortless high-fashion authority.`,
                img: "/img/outfits/outfit-w16.png",
                pieceIds: ["women-dress-1", "women-shoe-3", "women-jewel-1", "women-acc-5"],
              },
              {
                title: "Tailored Velvet Midi Ensemble",
                style: "Smart Casual",
                matchScore: 94,
                summary: `Sophisticated business cocktail dress balancing rich texture with executive accessories for ${occName}.`,
                whyItWorks: `Velvet cocktail dress provides rich, dignified presence suitable for corporate networking dinners and evening summits.`,
                img: "/img/outfits/outfit-w10.png",
                pieceIds: ["women-dress-2", "women-shoe-2", "women-jewel-4", "women-acc-1"],
              },
            ];
          } else {
            templates = [
              {
                title: "Executive Tailored Suit & Satin Shirt",
                style: "Formal",
                matchScore: 98,
                summary: `High-waist wide-leg tailored trousers paired with a pure satin button-down shirt for commanding authority.`,
                whyItWorks: `Sharp vertical creases elongate the frame, while the lustrous satin top provides high-end contrast suitable for high-stakes professional settings.`,
                img: "/img/outfits/outfit-w16.png",
                pieceIds: ["women-top-4", "women-pant-1", "women-shoe-2", "women-acc-3", "women-acc-1"],
              },
              {
                title: "Smart Casual Linen & Cigarette Pants",
                style: "Smart Casual",
                matchScore: 95,
                summary: `Crisp oversized linen shirt styled with slim ankle trousers and minimalist mules for modern agility.`,
                whyItWorks: `Balances European corporate ease with precise tailoring. Breathable fabrics keep you composed throughout packed schedules.`,
                img: "/img/outfits/outfit-w7.png",
                pieceIds: ["women-top-3", "women-pant-4", "women-shoe-3", "women-acc-1", "women-jewel-1"],
              },
              {
                title: "Contemporary Monochrome Knit & Palazzos",
                style: "Minimal",
                matchScore: 93,
                summary: `High-neck ribbed knit tucked into fluid pleated palazzos with rose gold accents.`,
                whyItWorks: `Delivers modern creative director energy. Clean proportion between slim knit and voluminous trouser lines.`,
                img: "/img/outfits/outfit-w4.png",
                pieceIds: ["women-top-1", "women-pant-2", "women-shoe-2", "women-jewel-1", "women-acc-3"],
              },
            ];
          }
        } else if (isWeddingOrFestive) {
          templates = [
            {
              title: "Blush Floral Royal Lehenga",
              style: "Traditional",
              matchScore: 99,
              summary: `Handcrafted festive ensemble featuring intricate embroidery and royal gold ornaments for ${occName}.`,
              whyItWorks: `Rich celebratory hues paired with authentic kundan choker and ethnic juttis deliver majestic festive sophistication.`,
              img: "/img/outfits/outfit-w5.png",
              pieceIds: ["women-dress-5", "women-shoe-5", "women-jewel-2", "women-jewel-3"],
            },
            {
              title: "Emerald Royal Velvet Lehenga",
              style: "Royal",
              matchScore: 97,
              summary: `Opulent deep jewel-toned celebration gown designed for wedding celebrations and receptions.`,
              whyItWorks: `Heavy velvet drape combined with sparkling polki jewelry creates an unforgettable regal entrance.`,
              img: "/img/outfits/outfit-w6.png",
              pieceIds: ["women-dress-5", "women-shoe-5", "women-jewel-2", "women-jewel-4"],
            },
            {
              title: "Festive Banarasi Silk Saree",
              style: "Festive",
              matchScore: 96,
              summary: `Timeless pure silk traditional drape styled with handcrafted drop earrings and embroidered juttis.`,
              whyItWorks: `Embodies grace and heritage luxury, perfectly attuned to celebration rituals and family gatherings.`,
              img: "/img/outfits/outfit-w12.png",
              pieceIds: ["women-top-5", "women-pant-2", "women-shoe-5", "women-jewel-1"],
            },
          ];
        } else if (isPartyOrNightOut) {
          templates = [
            {
              title: "Glam Black Night-Out Mini",
              style: "Party",
              matchScore: 98,
              summary: `Show-stopping mini dress with stiletto heels and statement diamond jewelry for ${occName}.`,
              whyItWorks: `High-octane glamour balanced with sleek monochrome lines. Designed to shine under party lighting.`,
              img: "/img/outfits/outfit-w1.png",
              pieceIds: ["women-dress-2", "women-shoe-1", "women-jewel-3", "women-jewel-4"],
            },
            {
              title: "Burgundy Velvet Evening Gown",
              style: "Glamour",
              matchScore: 96,
              summary: `Rich jewel-toned velvet maxi with dramatic drape and gold tennis bracelet.`,
              whyItWorks: `Plush texture captures depth beautifully, giving you instant red-carpet presence.`,
              img: "/img/outfits/outfit-w20.png",
              pieceIds: ["women-dress-4", "women-shoe-1", "women-jewel-1", "women-acc-1"],
            },
            {
              title: "Sangeet Sequin & Organza Chic",
              style: "Trendy",
              matchScore: 94,
              summary: `Luxe puff-sleeve organza blouse paired with wide-leg evening pants and heels.`,
              whyItWorks: `Modern two-piece party coordination with high visual movement and effortless dancing comfort.`,
              img: "/img/outfits/outfit-w17.png",
              pieceIds: ["women-top-2", "women-pant-1", "women-shoe-1", "women-jewel-2"],
            },
          ];
        } else if (isDateNight) {
          templates = [
            {
              title: "Satin Slip Date Night Gown",
              style: "Romantic",
              matchScore: 98,
              summary: `Luminous satin midi slip dress with stiletto heels and layered 18K gold pendant for ${occName}.`,
              whyItWorks: `Subtle sheen reflects candlelight softly. Minimalist jewelry keeps attention on an elegant neckline.`,
              img: "/img/outfits/outfit-w10.png",
              pieceIds: ["women-dress-4", "women-shoe-1", "women-jewel-1", "women-acc-1"],
            },
            {
              title: "Sky Blue Flowy Maxi Gown",
              style: "Elegant",
              matchScore: 96,
              summary: `Ethereal silk maxi dress with gentle movement, tennis bracelet, and luxury watch.`,
              whyItWorks: `Romantic, dreamy silhouette designed for effortless charm from cocktail hours to quiet dinners.`,
              img: "/img/outfits/outfit-w3.png",
              pieceIds: ["women-dress-1", "women-shoe-1", "women-jewel-4", "women-acc-3"],
            },
            {
              title: "Organza Peplum & Tailored Pants",
              style: "Chic",
              matchScore: 93,
              summary: `Puff-sleeve blouse paired with sleek high-waist trousers and kitten heels.`,
              whyItWorks: `Delivers feminine charm with tailored discipline. Striking yet approachable for intimate dinner settings.`,
              img: "/img/outfits/outfit-w4.png",
              pieceIds: ["women-top-2", "women-pant-1", "women-shoe-2", "women-jewel-1"],
            },
          ];
        } else if (isTravelOrResort) {
          templates = [
            {
              title: "Boho Sunset Resort Maxi Dress",
              style: "Resort",
              matchScore: 97,
              summary: `Tiered breathable sundress with leather slides, straw beach tote, and designer sunglasses for ${occName}.`,
              whyItWorks: `Lightweight cotton drape guarantees cooling comfort under the sun while keeping resort style on point.`,
              img: "/img/outfits/outfit-w8.png",
              pieceIds: ["women-dress-3", "women-shoe-3", "women-acc-2", "women-other-2"],
            },
            {
              title: "Luxe Airport Travel Co-ord",
              style: "Travel",
              matchScore: 95,
              summary: `Breezy linen shirt paired with flared palazzo pants, designer sneakers, and crossbody bag.`,
              whyItWorks: `Engineered for long flights and transition hours. Unmatched comfort without sacrificing elevated aesthetic.`,
              img: "/img/outfits/outfit-w19.png",
              pieceIds: ["women-top-3", "women-pant-2", "women-shoe-4", "women-acc-1"],
            },
            {
              title: "Pastel Summer Sundress",
              style: "Casual",
              matchScore: 93,
              summary: `Charming silk floral dress with leather mules and UV protective cat-eye sunglasses.`,
              whyItWorks: `Effortless daywear that transitions smoothly from sightseeing to seaside dining.`,
              img: "/img/outfits/outfit-w14.png",
              pieceIds: ["women-dress-1", "women-shoe-3", "women-acc-2", "women-jewel-1"],
            },
          ];
        } else if (isWinter) {
          templates = [
            {
              title: "Cashmere Winter Layering",
              style: "Layered",
              matchScore: 98,
              summary: `High-neck ribbed knit paired with cigarette ankle trousers, block heels, and mulberry silk scarf.`,
              whyItWorks: `Retains cozy body warmth while keeping clean European silhouettes without excess bulk.`,
              img: "/img/outfits/outfit-w11.png",
              pieceIds: ["women-top-1", "women-pant-4", "women-shoe-2", "women-acc-4"],
            },
            {
              title: "Chic Trench Coat Silhouette",
              style: "Formal",
              matchScore: 95,
              summary: `Tailored satin button-down, wide-leg trousers, block heels, and fleece touchscreen gloves.`,
              whyItWorks: `Timeless cold-weather sophistication built for city strolls and chilly work mornings.`,
              img: "/img/outfits/outfit-w16.png",
              pieceIds: ["women-top-4", "women-pant-1", "women-shoe-2", "women-other-3"],
            },
            {
              title: "Cozy Knit & Vintage Denim",
              style: "Casual",
              matchScore: 92,
              summary: `Warm textured knit paired with sturdy vintage denim jeans and chunky designer sneakers.`,
              whyItWorks: `Casual winter staple that feels relaxed, snug, and effortlessly stylish.`,
              img: "/img/outfits/outfit-w4.png",
              pieceIds: ["women-top-1", "women-pant-3", "women-shoe-4", "women-acc-1"],
            },
          ];
        } else {
          // General Casual / Everyday Women
          templates = [
            {
              title: "Vintage Denim & Ribbed Knit Top",
              style: "Casual",
              matchScore: 97,
              summary: `High-neck ribbed crop top paired with vintage straight-leg denim and designer sneakers for ${occName}.`,
              whyItWorks: `Everyday gold standard: clean fit, premium denim structure, and all-day walking comfort.`,
              img: "/img/outfits/outfit-w4.png",
              pieceIds: ["women-top-1", "women-pant-3", "women-shoe-4", "women-acc-1"],
            },
            {
              title: "Smart Casual Linen & Culottes",
              style: "Smart Casual",
              matchScore: 95,
              summary: `Breezy linen shirt with paperbag waist culottes, leather slides, and cat-eye sunglasses.`,
              whyItWorks: `Airy and laid-back yet carefully tailored, keeping you fresh across city outings and coffee runs.`,
              img: "/img/outfits/outfit-w22.png",
              pieceIds: ["women-top-3", "women-pant-5", "women-shoe-3", "women-acc-2"],
            },
            {
              title: "Cream Minimalist Kurti Palazzo",
              style: "Minimal",
              matchScore: 92,
              summary: `Ethnic tunic top with fluid linen palazzo pants, ethnic juttis, and gold pendant.`,
              whyItWorks: `Understated fusion elegance that combines traditional comfort with modern minimalist lines.`,
              img: "/img/outfits/outfit-w18.png",
              pieceIds: ["women-top-5", "women-pant-2", "women-shoe-5", "women-jewel-1"],
            },
          ];
        }
      } else {
        // MEN
        if (isProfessional) {
          templates = [
            {
              title: "Executive Power Suit",
              style: "Formal",
              matchScore: 98,
              summary: `Crisp tailored white shirt with charcoal wool trousers, Italian derby shoes, and chronograph watch for ${occName}.`,
              whyItWorks: `Commanding boardroom presence with razor-sharp shoulders and tailored trouser break. Conveys supreme authority and confidence.`,
              img: "/img/outfits/outfit-8.png",
              pieceIds: ["w-shirt-1", "w-pant-3", "w-shoe-1", "w-acc-1", "w-acc-2"],
            },
            {
              title: "Gallery Art Curator Chic",
              style: "Smart Casual",
              matchScore: 96,
              summary: `Navy oxford slim dress shirt paired with slate pleated trousers and monk strap brogues.`,
              whyItWorks: `Modern creative-executive tailoring. Balances professional dignity with understated artistic refinement.`,
              img: "/img/outfits/outfit-14.jpg",
              pieceIds: ["w-shirt-3", "w-pant-1", "w-shoe-2", "w-acc-1"],
            },
            {
              title: "Modern Tailored Oxford & Chinos",
              style: "Smart Casual",
              matchScore: 94,
              summary: `Charcoal luxury linen shirt paired with slim Italian chinos, suede chelsea boots, and leather belt.`,
              whyItWorks: `Versatile day-to-evening corporate look suitable for agile work environments and business dinners.`,
              img: "/img/outfits/outfit-1.png",
              pieceIds: ["w-shirt-2", "w-pant-2", "w-shoe-4", "w-acc-2"],
            },
          ];
        } else if (isWeddingOrFestive) {
          templates = [
            {
              title: "Imperial Ivory Groom Sherwani",
              style: "Traditional",
              matchScore: 99,
              summary: `Majestic tailored festive sherwani ensemble with artisan velvet evening slippers and gold chain for ${occName}.`,
              whyItWorks: `Royal festive opulence tailored to perfection. Conveys tradition, grandeur, and celebration joy.`,
              img: "/img/outfits/outfit-11.png",
              pieceIds: ["w-shirt-1", "w-pant-1", "w-shoe-5", "w-jewel-1"],
            },
            {
              title: "Emerald 3-Piece Reception Tuxedo",
              style: "Luxury",
              matchScore: 97,
              summary: `Rich emerald silk party shirt paired with slate formal trousers, derby shoes, and steel watch.`,
              whyItWorks: `Sartorial excellence for evening celebrations and gala events. Striking color depth in any lighting.`,
              img: "/img/outfits/outfit-12.png",
              pieceIds: ["w-shirt-4", "w-pant-1", "w-shoe-1", "w-acc-1"],
            },
            {
              title: "Ivory Chikankari Festive Kurta",
              style: "Festive",
              matchScore: 95,
              summary: `Handcrafted chikankari kurta with pleated trousers, handcrafted cuff bracelet, and velvet slippers.`,
              whyItWorks: `Pure celebratory grace with rich artisanal heritage, ideal for Diwali and family occasions.`,
              img: "/img/outfits/outfit-4.png",
              pieceIds: ["w-shirt-1", "w-pant-1", "w-shoe-5", "w-jewel-3"],
            },
          ];
        } else if (isPartyOrNightOut) {
          templates = [
            {
              title: "Midnight Navy Satin Shawl Tuxedo",
              style: "Party",
              matchScore: 98,
              summary: `Navy dress shirt with tailored dress trousers, Italian derby shoes, and chronograph watch for ${occName}.`,
              whyItWorks: `Refined black-tie aesthetic tailored for evening galas, VIP celebrations, and nightlife events.`,
              img: "/img/outfits/outfit-17.png",
              pieceIds: ["w-shirt-3", "w-pant-1", "w-shoe-1", "w-acc-1"],
            },
            {
              title: "Emerald Silk Party Shirt & Trousers",
              style: "Luxury",
              matchScore: 96,
              summary: `Lustrous silk party shirt with slate trousers, velvet slippers, and gold link chain.`,
              whyItWorks: `Deep jewel tones inject magnetic charisma into high-energy social gatherings.`,
              img: "/img/outfits/outfit-12.png",
              pieceIds: ["w-shirt-4", "w-pant-1", "w-shoe-5", "w-jewel-1"],
            },
            {
              title: "Urban Nightclub Athleisure & Leather",
              style: "Trendy",
              matchScore: 94,
              summary: `Charcoal linen shirt paired with modern cargo pants, court sneakers, and steel watch.`,
              whyItWorks: `Contemporary streetwear fusion providing effortless dance-floor ease and sharp silhouette.`,
              img: "/img/outfits/outfit-10.jpg",
              pieceIds: ["w-shirt-2", "w-pant-5", "w-shoe-3", "w-acc-1"],
            },
          ];
        } else if (isDateNight) {
          templates = [
            {
              title: "Romantic Candlelight Dinner",
              style: "Minimal",
              matchScore: 98,
              summary: `Tailored white dress shirt with slate dress trousers, derby leather shoes, and chronograph watch for ${occName}.`,
              whyItWorks: `Classic, timeless elegance that conveys careful preparation and respectful poise.`,
              img: "/img/outfits/outfit-2.png",
              pieceIds: ["w-shirt-1", "w-pant-1", "w-shoe-1", "w-acc-1"],
            },
            {
              title: "Mocha Linen Minimalist Cafe",
              style: "Smart Casual",
              matchScore: 95,
              summary: `Charcoal linen shirt with Italian chinos, suede chelsea boots, and leather accessories.`,
              whyItWorks: `Approachable yet sophisticated. The matte linen texture adds subtle tactile depth.`,
              img: "/img/outfits/outfit-19.png",
              pieceIds: ["w-shirt-2", "w-pant-2", "w-shoe-4", "w-acc-1"],
            },
            {
              title: "Camel Blazer Evening Tailoring",
              style: "Chic",
              matchScore: 93,
              summary: `Navy oxford shirt paired with slate trousers, monk strap brogues, and steel watch.`,
              whyItWorks: `Smart contrast between navy and slate creates structured, trustworthy romantic style.`,
              img: "/img/outfits/outfit-1.png",
              pieceIds: ["w-shirt-3", "w-pant-1", "w-shoe-2", "w-acc-1"],
            },
          ];
        } else if (isTravelOrResort) {
          templates = [
            {
              title: "Mediterranean Beach Resort",
              style: "Resort",
              matchScore: 97,
              summary: `Textured breathable casual shirt with cotton tapered pants, white sneakers, and polarized sunglasses for ${occName}.`,
              whyItWorks: `Light, breezy fabrics maximize heat dissipation while maintaining polished holiday luxury.`,
              img: "/img/outfits/outfit-9.png",
              pieceIds: ["w-shirt-5", "w-pant-4", "w-shoe-3", "w-acc-3"],
            },
            {
              title: "Airport Ready Jetsetter",
              style: "Travel",
              matchScore: 95,
              summary: `Navy oxford shirt with tapered relaxed pants, white sneakers, and leather travel duffle.`,
              whyItWorks: `Built for frictionless transit and lounge comfort without dressing down.`,
              img: "/img/outfits/outfit-6.png",
              pieceIds: ["w-shirt-3", "w-pant-4", "w-shoe-3", "w-other-1"],
            },
            {
              title: "Olive Utility Overshirt & Cargos",
              style: "Casual",
              matchScore: 93,
              summary: `Linen casual shirt with minimalist cargo pants, court sneakers, and polarized sunglasses.`,
              whyItWorks: `Rugged functional utility matched with clean contemporary proportions.`,
              img: "/img/outfits/outfit-18.png",
              pieceIds: ["w-shirt-2", "w-pant-5", "w-shoe-3", "w-acc-3"],
            },
          ];
        } else if (isWinter) {
          templates = [
            {
              title: "Autumn Quarter-Zip Knitwear",
              style: "Layered",
              matchScore: 98,
              summary: `Oxford shirt layered with tapered cotton pants, suede chelsea boots, and cashmere scarf for ${occName}.`,
              whyItWorks: `Thermal layering engineered to look structured, warm, and sophisticated.`,
              img: "/img/outfits/outfit-20.png",
              pieceIds: ["w-shirt-3", "w-pant-4", "w-shoe-4", "w-other-3"],
            },
            {
              title: "Executive Power Suit Layering",
              style: "Formal",
              matchScore: 95,
              summary: `Tailored white shirt with charcoal wool trousers, derby shoes, and chronograph watch.`,
              whyItWorks: `Heavy wool texture insulates while maintaining razor-sharp silhouette against cold breezes.`,
              img: "/img/outfits/outfit-8.png",
              pieceIds: ["w-shirt-1", "w-pant-3", "w-shoe-1", "w-acc-1"],
            },
            {
              title: "Utility Overshirt & Cargo Layer",
              style: "Casual",
              matchScore: 92,
              summary: `Textured shirt paired with modern cargo pants, white sneakers, and chronograph watch.`,
              whyItWorks: `Casual cold-weather protection with relaxed weekend proportions.`,
              img: "/img/outfits/outfit-18.png",
              pieceIds: ["w-shirt-5", "w-pant-5", "w-shoe-3", "w-acc-1"],
            },
          ];
        } else {
          // General Casual / Everyday Men
          templates = [
            {
              title: "Urban Cafe Stroll",
              style: "Casual",
              matchScore: 97,
              summary: `Charcoal linen shirt with cotton tapered pants, classic white sneakers, and polarized sunglasses for ${occName}.`,
              whyItWorks: `Effortless day-off dressing with clean monochrome tones and relaxed walking comfort.`,
              img: "/img/outfits/outfit-3.png",
              pieceIds: ["w-shirt-2", "w-pant-4", "w-shoe-3", "w-acc-3"],
            },
            {
              title: "Olive Utility Overshirt & Cargos",
              style: "Streetwear",
              matchScore: 95,
              summary: `Textured shirt with minimalist cargo pants, white sneakers, and steel watch.`,
              whyItWorks: `Contemporary streetwear aesthetic built for comfort, utility, and sharp silhouette.`,
              img: "/img/outfits/outfit-18.png",
              pieceIds: ["w-shirt-5", "w-pant-5", "w-shoe-3", "w-acc-1"],
            },
            {
              title: "Camel Blazer Smart Casual",
              style: "Smart Casual",
              matchScore: 93,
              summary: `Tailored white shirt with Italian chinos, court sneakers, and reversible belt.`,
              whyItWorks: `Elevated smart casual that looks crisp at brunch, casual meetings, and gallery strolls.`,
              img: "/img/outfits/outfit-1.png",
              pieceIds: ["w-shirt-1", "w-pant-2", "w-shoe-3", "w-acc-2"],
            },
          ];
        }
      }

      // Map piece IDs into real objects and prioritize user's selected wardrobe pieces
      const userSelectedPieces = selectedWardrobeIds
        .map((id) => wardrobePool.find((w) => w.id === id))
        .filter(Boolean);

      const generated = templates.map((tmpl, idx) => {
        let lookPieces = tmpl.pieceIds.map(findPiece).filter(Boolean);

        // If user manually chose specific items in Step 3, incorporate them seamlessly
        if (userSelectedPieces.length > 0) {
          const combined = [...userSelectedPieces];
          lookPieces.forEach((p) => {
            const sameCat = combined.some(
              (u) => (u.cat || u.category || "").toLowerCase() === (p.cat || p.category || "").toLowerCase()
            );
            if (!sameCat && !combined.some((u) => u.id === p.id)) {
              combined.push(p);
            }
          });
          lookPieces = combined;
        }

        return {
          id: `outfit-${Date.now()}-${idx + 1}`,
          title: tmpl.title,
          style: tmpl.style,
          colorPalette: primaryColor,
          matchScore: tmpl.matchScore,
          summary: tmpl.summary,
          whyItWorks: tmpl.whyItWorks,
          img: tmpl.img,
          pieces: lookPieces,
        };
      });

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
                            src={p.img || p.image || "/BackGround Images/Wardrobe BackGround Image.png"}
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
                      src={piece.img || piece.image || "/BackGround Images/Wardrobe BackGround Image.png"}
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
                          src={replacement.img || replacement.image || "/BackGround Images/Wardrobe BackGround Image.png"}
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
                      src={acc.img || acc.image || "/BackGround Images/Wardrobe BackGround Image.png"}
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
