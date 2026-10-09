import { useMemo, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Sun,
  Shuffle,
  Eye,
  Check,
  Heart as HeartIcon,
  Search,
  Filter,
  Wand2,
  Calendar,
  Layers,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Hero, Section, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

export const boyRecommendations = [
  {
    id: "rec-boy-1",
    title: "Camel Blazer Smart Casual",
    occ: "casual",
    tags: ["Casual", "Smart", "Autumn", "Everyday"],
    img: "/Recommendations/boy 1.png",
    gender: "Men",
    matchScore: 95,
  },
  {
    id: "rec-boy-2",
    title: "Romantic Candlelight Dinner",
    occ: "date",
    tags: ["Date", "Evening", "Minimal", "Night"],
    img: "/Recommendations/boy 2.png",
    gender: "Men",
    matchScore: 88,
  },
  {
    id: "rec-boy-3",
    title: "Urban Cafe Stroll",
    occ: "casual",
    tags: ["Casual", "Street", "Coffee", "Minimal"],
    img: "/Recommendations/boy 3.png",
    gender: "Men",
    matchScore: 90,
  },
  {
    id: "rec-boy-4",
    title: "Ivory Chikankari Festive Kurta",
    occ: "festive",
    tags: ["Festive", "Traditional", "Diwali", "Ethnic"],
    img: "/Recommendations/boy 4.png",
    gender: "Men",
    matchScore: 93,
  },
  {
    id: "rec-boy-5",
    title: "Athleisure Training Silhouette",
    occ: "gym",
    tags: ["Gym", "Athleisure", "Sporty", "Workout"],
    img: "/Recommendations/boy 5.png",
    gender: "Men",
    matchScore: 92,
  },
  {
    id: "rec-boy-6",
    title: "Airport Ready Jetsetter",
    occ: "travel",
    tags: ["Travel", "Airport", "Transit", "Modern"],
    img: "/Recommendations/boy 6.png",
    gender: "Men",
    matchScore: 91,
  },
  {
    id: "rec-boy-7",
    title: "Nightclub Lounge Athleisure",
    occ: "party",
    tags: ["Party", "Nightlife", "Lounge", "Urban"],
    img: "/Recommendations/boy 7.png",
    gender: "Men",
    matchScore: 98,
  },
  {
    id: "rec-boy-8",
    title: "Executive Boardroom Power Suit",
    occ: "office",
    tags: ["Office", "Formal", "Corporate", "Tailored"],
    img: "/Recommendations/boy 8.png",
    gender: "Men",
    matchScore: 92,
  },
  {
    id: "rec-boy-9",
    title: "Mediterranean Beach Resort",
    occ: "beach",
    tags: ["Beach", "Summer", "Resort", "Vacation"],
    img: "/Recommendations/boy 9.png",
    gender: "Men",
    matchScore: 93,
  },
  {
    id: "rec-boy-10",
    title: "Urban Crossbody Streetwear",
    occ: "casual",
    tags: ["Casual", "Streetwear", "Sporty", "Youth"],
    img: "/Recommendations/boy 10.png",
    gender: "Men",
    matchScore: 98,
  },
  {
    id: "rec-boy-11",
    title: "Imperial Ivory Groom Sherwani",
    occ: "wedding",
    tags: ["Wedding", "Royal", "Traditional", "Grand"],
    img: "/Recommendations/boy 11.png",
    gender: "Men",
    matchScore: 95,
  },
  {
    id: "rec-boy-12",
    title: "Emerald 3-Piece Tuxedo",
    occ: "wedding",
    tags: ["Wedding", "Reception", "Luxury", "Black Tie"],
    img: "/Recommendations/boy 12.png",
    gender: "Men",
    matchScore: 93,
  },
];

export const girlRecommendations = [
  {
    id: "rec-girl-1",
    title: "Glam Black Night-Out Mini",
    occ: "party",
    tags: ["Party", "Evening", "Glam", "Nightlife"],
    img: "/Recommendations/girl 1.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-2",
    title: "Cozy Loungewear Pastel Set",
    occ: "casual",
    tags: ["Casual", "Loungewear", "Everyday", "Comfort"],
    img: "/Recommendations/girl 2.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-3",
    title: "Sky Blue Flowy Romance Maxi",
    occ: "date",
    tags: ["Date", "Romantic", "Elegant", "Evening"],
    img: "/Recommendations/girl 3.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-4",
    title: "Brown Ribbed Top & Vintage Jeans",
    occ: "casual",
    tags: ["Casual", "Everyday", "Street", "Denim"],
    img: "/Recommendations/girl 4.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-5",
    title: "Blush Floral Festive Lehenga",
    occ: "wedding",
    tags: ["Wedding", "Traditional", "Festive", "Royal"],
    img: "/Recommendations/girl 5.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-6",
    title: "Emerald Royal Velvet Lehenga",
    occ: "wedding",
    tags: ["Wedding", "Traditional", "Royal", "Grand"],
    img: "/Recommendations/girl 6.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-7",
    title: "Modern Ivory Blazer & Trousers",
    occ: "office",
    tags: ["Office", "Formal", "Corporate", "Chic"],
    img: "/Recommendations/girl 7.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-8",
    title: "Boho Sunset Resort Maxi Dress",
    occ: "beach",
    tags: ["Beach", "Summer", "Vacation", "Resort"],
    img: "/Recommendations/girl 8.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-9",
    title: "Varsity Streetwear Oversized Fit",
    occ: "casual",
    tags: ["Casual", "Streetwear", "Trendy", "Everyday"],
    img: "/Recommendations/girl 9.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-10",
    title: "Satin Slip Date Night Gown",
    occ: "date",
    tags: ["Date", "Glamour", "Evening", "Romantic"],
    img: "/Recommendations/girl 10.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-11",
    title: "Cozy Cashmere Winter Layering",
    occ: "winter",
    tags: ["Winter", "Warmth", "Layered", "Autumn"],
    img: "/Recommendations/girl 11.png",
    gender: "Women",
    matchScore: 94,
  },
  {
    id: "rec-girl-12",
    title: "Festive Banarasi Silk Saree",
    occ: "festive",
    tags: ["Festive", "Traditional", "Celebration", "Ethnic"],
    img: "/Recommendations/girl 12.png",
    gender: "Women",
    matchScore: 94,
  },
];

const occasionFilters = [
  { id: "all", label: "All Occasions" },
  { id: "casual", label: "Casual & Everyday" },
  { id: "office", label: "Office & Formal" },
  { id: "wedding", label: "Wedding & Grand" },
  { id: "festive", label: "Festive & Traditional" },
  { id: "date", label: "Date & Evening" },
  { id: "party", label: "Party & Nightlife" },
  { id: "travel", label: "Travel & Airport" },
  { id: "gym", label: "Gym & Athleisure" },
  { id: "beach", label: "Beach & Summer" },
  { id: "winter", label: "Winter & Autumn" },
];

export default function Recommendations() {
  const { toggleSave, saved = [], catalog, user, isFemale: storeIsFemale } = useStore();
  const { wardrobe = [] } = catalog || {};
  const by = Object.fromEntries(wardrobe.map((w) => [w.id, w]));
  const nv = useNavigate();

  // Determine logged-in user gender for smart ordering and recommendations
  const userGender = user?.profile?.gender || user?.gender || "";
  const isFemale = storeIsFemale || userGender.toLowerCase() === "female" || userGender.toLowerCase() === "f";
  const isMale   = !isFemale;

  const [genderFilter, setGenderFilter] = useState("All");
  const [occFilter, setOccFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalLook, setModalLook] = useState(null);
  const [aiModal, setAiModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [savingId, setSavingId] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleSaveRecommendation = (l) => {
    if (!l) return;
    // Check if already saved to prevent duplicate saves
    if (saved.includes(l.id)) {
      triggerToast(`"${l.title}" is already in your Saved Looks`);
      return;
    }

    setSavingId(l.id);

    try {
      // 1. Package complete outfit object with all details
      const lookToSave = {
        id: l.id,
        title: l.title,
        img: l.img,
        image: l.img,
        occ: l.occ || "Casual",
        category: l.occ || "Casual",
        tags: l.tags || [],
        matchScore: l.matchScore || 94,
        matchPercentage: l.matchScore || 94,
        style: l.tags?.[0] || "Curated",
        summary: l.desc || `${l.title} - curated style recommendation.`,
        gender: (l.gender || (isWomenLook(l) ? "Women" : "Men")),
        pieces: l.pieces || [],
        savedAt: new Date().toISOString(),
      };

      // 2. Persist to mmr_custom_looks in localStorage for SavedLooks page
      const existing = JSON.parse(localStorage.getItem("mmr_custom_looks") || "[]");
      const updated = [lookToSave, ...existing.filter((item) => item.id !== l.id)];
      localStorage.setItem("mmr_custom_looks", JSON.stringify(updated.slice(0, 60)));
      window.dispatchEvent(new Event("storage"));

      // 3. Save ID in StoreContext
      toggleSave(l.id);
      triggerToast(`✓ "${l.title}" saved to your Saved Looks!`);
    } catch (err) {
      console.warn("Error saving recommendation look:", err);
      triggerToast(`Could not save "${l.title}"`);
    } finally {
      setTimeout(() => setSavingId(null), 300);
    }
  };

  const isMenLook = (l) => {
    if (!l) return false;
    const g = (l.gender || "").toLowerCase();
    return g === "men" || g === "male";
  };

  const isWomenLook = (l) => {
    if (!l) return false;
    const g = (l.gender || "").toLowerCase();
    return g === "women" || g === "female";
  };

  // Determine active pool based on selected tab and user profile:
  // Male users -> show the 12 boy images
  // Female users -> show the 12 girl images
  const activePool = useMemo(() => {
    if (genderFilter === "Men") return boyRecommendations;
    if (genderFilter === "Women") return girlRecommendations;
    return isFemale ? girlRecommendations : boyRecommendations;
  }, [genderFilter, isFemale]);

  // Master lists for tab badge counts
  const masterAiLooks = boyRecommendations;
  const womenLooks = girlRecommendations;

  // Filter recommendations based on occasion and search query
  const filteredLooks = useMemo(() => {
    return activePool.filter((l) => {
      // Occasion filter
      if (occFilter !== "all") {
        const targetOcc = occFilter.toLowerCase();
        const matchOcc = (l.occ || "").toLowerCase() === targetOcc;
        const matchTags = l.tags?.some((t) => t.toLowerCase() === targetOcc);
        if (!matchOcc && !matchTags) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = l.title?.toLowerCase().includes(q);
        const matchOcc = l.occ?.toLowerCase().includes(q);
        const matchTags = l.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchOcc && !matchTags) return false;
      }
      return true;
    });
  }, [activePool, occFilter, searchQuery]);

  // Curated Trending picks from active recommendations
  const trendingLooks = useMemo(() => {
    return activePool.slice(0, 5);
  }, [activePool]);

  // Curated Seasonal picks from active recommendations
  const seasonalPicks = useMemo(() => {
    return [
      { label: "Summer Resort", look: activePool.find((l) => l.occ === "beach") || activePool[0] },
      { label: "Winter & Autumn", look: activePool.find((l) => l.occ === "winter" || l.occ === "casual") || activePool[1] },
      { label: "Festive Season", look: activePool.find((l) => l.occ === "festive" || l.occ === "wedding") || activePool[3] },
      { label: "Urban & Evening", look: activePool.find((l) => l.occ === "party" || l.occ === "date") || activePool[2] },
    ].filter((item) => item.look);
  }, [activePool]);

  return (
    <div className="space-y-12 pb-16">
      {/* ── Hero Banner ── */}
      <Hero
        img={IMG["hero-recommendations"] || "/BackGround Images/Recommendations BackGround Image.png"}
        kicker="AI-POWERED RECOMMENDATIONS"
        script={
          <>
            Curated
            <br />
            Just for You.
          </>
        }
        h="min-h-[320px]"
      >
        <h1 className="h1">
          Looks You’ll <span className="text-acc">Love</span>
        </h1>
        <p className="text-mute mt-3 max-w-xl text-sm md:text-base leading-relaxed">
          Explore complete outfit recommendations engineered with precision by AI.
          Featuring 20 master coordinated looks with perfectly matched tops, bottoms,
          accessories, and footwear ready to save or try in your outfit studio.
        </p>

        {/* Quick Launch AI Banner */}
        <div className="mt-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setAiModal(true)}
            className="btn-p px-5 py-3 flex items-center gap-2.5 shadow-lg shadow-acc/20 hover:scale-105 transition"
          >
            <Sparkles size={18} />
            <span>Generate Custom Look with AI</span>
          </button>
          <button
            onClick={() => nv("/create-outfit")}
            className="btn-o px-5 py-3 flex items-center gap-2 text-sm"
          >
            <Wand2 size={16} />
            <span>Open Outfit Studio</span>
          </button>
        </div>
      </Hero>

      {/* ── Filter & Search Toolbar ── */}
      <div className="card p-5 space-y-4 border-line bg-card/60 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Gender Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-line w-fit">
            {[
              { id: "All", label: isFemale ? "My Looks (Women)" : "My Looks (Men)", count: 12 },
              { id: "Men", label: "Men's Looks", count: 12 },
              { id: "Women", label: "Women's Looks", count: 12 },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGenderFilter(g.id)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-2 ${
                  genderFilter === g.id
                    ? "bg-acc text-black shadow-md font-semibold"
                    : "text-mute hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{g.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    genderFilter === g.id
                      ? "bg-black/20 text-black font-bold"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {g.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-mute"
            />
            <input
              type="text"
              placeholder="Search style, occasion, tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-line rounded-xl text-xs md:text-sm text-white placeholder-mute focus:outline-none focus:border-acc"
            />
          </div>
        </div>

        {/* Occasion Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-mute flex items-center gap-1 shrink-0 mr-1">
            <Filter size={13} />
            <span>Occasion:</span>
          </span>
          {occasionFilters.map((occ) => (
            <button
              key={occ.id}
              onClick={() => setOccFilter(occ.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition border ${
                occFilter === occ.id
                  ? "bg-acc/15 text-acc border-acc/60 font-semibold"
                  : "bg-white/5 text-mute border-line hover:text-white hover:border-line"
              }`}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Gender-Smart Banner ── */}
      {userGender && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-acc/30 bg-gradient-to-r from-acc/10 to-transparent backdrop-blur-md">
          <span className="text-2xl">{isFemale ? "👗" : "👔"}</span>
          <div>
            <p className="text-sm font-semibold text-white">
              {isFemale
                ? "Showing 12 Curated Women's Outfit Recommendations"
                : "Showing 12 AI Engineered Men's Outfit Recommendations"}
            </p>
            <p className="text-xs text-mute mt-0.5">
              Personalised based on your profile · All looks sourced from verified models
            </p>
          </div>
        </div>
      )}

      {/* ── Master AI Recommendations Section ── */}
      <Section
        title={
          genderFilter === "Men" || (!isFemale && genderFilter === "All")
            ? "AI Generated Outfits for Men (12 Master Looks)"
            : "Curated Fashion Outfits for Women (12 Master Looks)"
        }
        icon="Sparkles"
        sub={`Showing ${filteredLooks.length} verified looks · Curated for ${
          genderFilter === "Men" || (!isFemale && genderFilter === "All") ? "Men" : "Women"
        }`}
      >
        {filteredLooks.length === 0 ? (
          <div className="card p-12 text-center border-line">
            <p className="text-mute text-sm">No outfits found matching your filters.</p>
            <button
              onClick={() => {
                setGenderFilter("All");
                setOccFilter("all");
                setSearchQuery("");
              }}
              className="btn-o mt-4 text-xs px-4 py-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredLooks.map((l) => {
              const isSaved = saved.includes(l.id);
              const matchScore = l.matchScore || 94;

              return (
                <div
                  key={l.id}
                  className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-[#141414] border border-white/[.08] hover:border-amber-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_18px_40px_rgba(0,0,0,0.8)] cursor-pointer"
                >
                  {/* Full Outfit Image Card with Consistent Dimensions & Zero Awkward Cropping */}
                  <div
                    className="relative aspect-[4/4.6] w-full overflow-hidden rounded-xl bg-black/60 cursor-pointer flex items-center justify-center"
                    onClick={() => setModalLook(l)}
                  >
                    <img
                      src={l.img}
                      alt={l.title}
                      loading="lazy"
                      className="w-full h-full object-contain p-2 group-hover:scale-104 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/BackGround Images/Recommendations BackGround Image.png";
                      }}
                    />
                    {/* Subtle top vignette for readable badges */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      {isWomenLook(l) && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                          {matchScore}% Match
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-black/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                        {l.occ}
                      </span>
                    </div>

                    {/* Top Right Save Button */}
                    <button
                      type="button"
                      aria-label={isSaved ? "Saved to your looks" : "Save this Look"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveRecommendation(l);
                      }}
                      className={`absolute top-2.5 right-2.5 grid place-items-center w-8 h-8 rounded-full backdrop-blur-md transition-all z-10 ${
                        isSaved
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 cursor-default"
                          : "bg-black/70 text-white/80 hover:text-amber-400 hover:bg-black/90 border border-white/10 cursor-pointer"
                      }`}
                    >
                      {isSaved ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <HeartIcon
                          size={15}
                          className="text-white"
                        />
                      )}
                    </button>

                    {/* Hover Quick View Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="btn-p text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-auto cursor-pointer">
                        <Eye size={14} />
                        <span>Quick View</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Information & Action Bar */}
                  <div className="pt-3.5 pb-1 px-1 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif font-semibold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {l.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-stone-300 border border-white/10 shrink-0 font-medium">
                          {l.gender || "Men"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(l.tags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-white/[.06] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={isSaved || savingId === l.id}
                        onClick={() => handleSaveRecommendation(l)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                          isSaved
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default font-bold"
                            : savingId === l.id
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-wait"
                            : "bg-white/5 hover:bg-amber-500 hover:text-black text-stone-300 hover:font-bold border border-transparent cursor-pointer"
                        }`}
                        title={isSaved ? "Saved to your Saved Looks" : "Save this Look to Saved Looks"}
                      >
                        {isSaved ? (
                          <>
                            <Check size={13} className="text-emerald-400" />
                            <span>Saved</span>
                          </>
                        ) : savingId === l.id ? (
                          <>
                            <Loader2 size={13} className="animate-spin text-amber-400" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <HeartIcon size={13} />
                            <span>Save this Look</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveRecommendation(l)}
                        disabled={isSaved}
                        className={`p-2 rounded-xl border transition ${
                          isSaved
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 cursor-default"
                            : "border-white/10 text-stone-400 hover:text-white hover:border-white/20 cursor-pointer"
                        }`}
                        title={isSaved ? "Saved to your looks" : "Save look"}
                      >
                        {isSaved ? <Check size={14} className="text-emerald-400" /> : <HeartIcon size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── Trending Looks Section (Real Database Looks) ── */}
      <Section
        title="Trending Looks"
        icon="Flame"
        sub="The most favorited luxury combinations styled by MMR members this week"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {trendingLooks.map((l) => (
            <div
              key={l.id}
              onClick={() => setModalLook(l)}
              className="group tile relative aspect-[3/4.2] rounded-2xl overflow-hidden border border-line hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-lg bg-black/60"
            >
              <img
                src={l.img}
                alt={l.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = IMG["hero-wardrobe"];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Heart */}
              <button
                type="button"
                aria-label="Save look"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(l.id);
                }}
                className="absolute top-2.5 right-2.5 grid place-items-center w-8 h-8 rounded-full bg-black/60 backdrop-blur text-white hover:text-acc transition"
              >
                <HeartIcon
                  size={14}
                  className={saved.includes(l.id) ? "fill-acc text-acc" : "text-white"}
                />
              </button>

              {isWomenLook(l) && (
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/90 text-white font-bold">
                    {l.matchScore || 94}% Match
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 p-3.5 w-full">
                <div className="font-serif font-semibold text-xs md:text-sm text-white line-clamp-1">
                  {l.title}
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-mute">
                  <span className="capitalize">{l.occ} Look</span>
                  <span className="text-acc font-medium">Trending 🔥</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Mix & Match Recommendations ── */}
      <Section
        title="Mix & Match Recommendations"
        icon="Shuffle"
        sub="Create completely new looks using staple items directly from your wardrobe."
      >
        <div className="flex flex-wrap items-center gap-3 text-acc">
          {["w-shirt-1", "w-pant-1", "w-other-2", "w-acc-1"].map(
            (x, i) => (
              <span key={x} className="flex items-center gap-3">
                <div className="card w-28 overflow-hidden rounded-xl border border-line bg-card/70">
                  <img
                    src={by[x]?.img || IMG["hero-wardrobe"]}
                    alt={by[x]?.name || "Item"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/BackGround Images/Wardrobe BackGround Image.png";
                    }}
                    className="aspect-square object-cover"
                  />
                  <div className="text-[11px] text-white p-2 font-medium truncate">
                    {by[x]?.name || "Item"}
                  </div>
                </div>
                {i < 3 ? (
                  <span className="text-lg font-bold text-acc">+</span>
                ) : (
                  <span className="text-lg font-bold text-acc">=</span>
                )}
              </span>
            ),
          )}

          <div className="card flex items-center gap-4 p-3 flex-1 min-w-[280px] rounded-xl border border-acc/40 bg-gradient-to-r from-acc/10 to-card">
            <img
              src={isFemale ? "/Recommendations/girl 1.png" : "/Recommendations/boy 1.png"}
              alt="Result Look"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/BackGround Images/Recommendations BackGround Image.png";
              }}
              className="w-24 h-28 rounded-xl object-cover border border-line"
            />
            <div className="text-white flex-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/90 text-white font-bold">
                98% Synergy
              </span>
              <div className="font-serif font-semibold mt-1">
                {activePool[0]?.title || "Smart Casual Set"}
              </div>
              <div className="text-xs text-mute mb-2">
                Versatile, clean & effortlessly coordinated
              </div>
            </div>
            <button
              onClick={() => nv("/create-outfit")}
              className="grid place-items-center w-10 h-10 rounded-full bg-acc text-black hover:scale-105 transition"
              title="Open Outfit Studio"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Section>

      {/* ── Seasonal Picks (Real Database Looks) ── */}
      <Section
        title="Seasonal Picks for You"
        icon="Sun"
        sub="Climate-tailored ensembles curated from our fashion database"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {seasonalPicks.map(({ label, look }) => (
            <div
              key={look.id}
              onClick={() => setModalLook(look)}
              className="group tile relative aspect-[4/3.2] rounded-2xl overflow-hidden border border-line hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-lg bg-black/60"
            >
              <img
                src={look.img}
                alt={look.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/BackGround Images/Recommendations BackGround Image.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-acc text-black shadow-md">
                  {label}
                </span>
              </div>

              <button
                type="button"
                aria-label="Save look"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(look.id);
                }}
                className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-black/60 backdrop-blur text-white hover:text-acc transition"
              >
                <HeartIcon
                  size={14}
                  className={saved.includes(look.id) ? "fill-acc text-acc" : "text-white"}
                />
              </button>

              <div className="absolute bottom-0 p-4 w-full">
                <div className="font-serif font-semibold text-sm text-white">
                  {look.title}
                </div>
                <div className="text-xs text-mute mt-1 flex items-center justify-between">
                  <span>{look.tags?.join(" • ")}</span>
                  {isWomenLook(look) && (
                    <span className="text-acc font-medium">{look.matchScore || 94}% Match</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── AI Callout Footer ── */}
      <div className="card mt-12 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-acc/20 via-card to-card border-acc/40 rounded-2xl shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-serif text-2xl text-white font-semibold">
            Want a Bespoke Look for an Upcoming Event?
          </div>
          <p className="text-sm text-mute max-w-xl">
            Let our AI fashion stylist compose an outfit crafted specifically from your
            wardrobe pieces, color preferences, and occasion dress codes.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAiModal(true)}
            className="btn-p px-6 py-3 flex items-center gap-2 shadow-lg"
          >
            <Sparkles size={16} />
            <span>Generate with AI</span>
          </button>
          <button
            onClick={() => nv("/create-outfit")}
            className="btn-o px-5 py-3 text-sm"
          >
            Open Studio
          </button>
        </div>
      </div>

      {/* ── Quick View Look Modal ── */}
      {modalLook && (
        <Modal
          open={!!modalLook}
          onClose={() => setModalLook(null)}
          title={modalLook.title}
        >
          <div className="space-y-5">
            <div className="relative aspect-[4/4.6] rounded-xl overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center">
              <img
                src={modalLook.img}
                alt={modalLook.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/BackGround Images/Recommendations BackGround Image.png";
                }}
                className="w-full h-full object-contain p-2"
              />
              {isWomenLook(modalLook) && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-md">
                  {modalLook.matchScore || 94}% Match Score
                </span>
              )}
              <span className="absolute top-3 right-3 px-3 py-1 rounded-md text-xs font-semibold uppercase bg-black/70 text-acc border border-acc/30">
                {modalLook.occ}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {modalLook.title}
                  </h4>
                  <p className="text-xs text-mute capitalize">
                    {modalLook.occ} Ensemble • Styled for {modalLook.gender || "Men"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveRecommendation(modalLook)}
                  disabled={saved.includes(modalLook.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    saved.includes(modalLook.id)
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default font-bold"
                      : "btn-o cursor-pointer"
                  }`}
                >
                  {saved.includes(modalLook.id) ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <HeartIcon size={14} className="text-acc" />
                      <span>Save this Look</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-mute block mb-1.5">
                  Style Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(modalLook.tags || []).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-line text-white/80"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setModalLook(null);
                    nv(`/create-outfit?occ=${modalLook.occ}`);
                  }}
                  className="btn-p flex-1 py-3 text-xs md:text-sm flex items-center justify-center gap-2"
                >
                  <Wand2 size={16} />
                  <span>Customize in Outfit Studio</span>
                </button>
                <button
                  onClick={() => setModalLook(null)}
                  className="btn-o px-4 py-3 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── AI Look Generation Modal ── */}
      <Modal
        open={aiModal}
        onClose={() => setAiModal(false)}
        title="AI Style Engine"
      >
        <div className="space-y-4">
          <p className="text-sm text-mute leading-relaxed">
            Our AI analysis evaluated your saved aesthetic preferences and verified all 20
            outfit variations. To mix, match, and tailor live cuts with your personal
            wardrobe, head to the Create Outfit studio!
          </p>
          <div className="p-4 rounded-xl bg-acc/10 border border-acc/30 flex items-center gap-3">
            <Sparkles className="text-acc shrink-0" size={24} />
            <div className="text-xs text-white">
              <b>20 Master Looks Ready:</b> All AI generated models, coordinates, and
              matching accessories are primed and saved to your catalog.
            </div>
          </div>
          <button
            onClick={() => {
              setAiModal(false);
              nv("/create-outfit");
            }}
            className="btn-p w-full py-3 flex items-center justify-center gap-2"
          >
            <Wand2 size={16} />
            <span>Launch Create Outfit Studio</span>
          </button>
        </div>
      </Modal>

      {/* ── Toast Alert Banner ── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/40 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
