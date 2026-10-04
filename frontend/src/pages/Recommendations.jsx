import { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Hero, Section, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

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
  const [genderFilter, setGenderFilter] = useState("All");
  const [occFilter, setOccFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalLook, setModalLook] = useState(null);
  const [aiModal, setAiModal] = useState(false);

  const { toggleSave, saved = [], catalog } = useStore();
  const { looks = [], wardrobe = [] } = catalog || {};
  const by = Object.fromEntries(wardrobe.map((w) => [w.id, w]));
  const nv = useNavigate();

  // Filter recommendations based on gender, occasion, and search query
  const filteredLooks = looks.filter((l) => {
    // Gender filter
    if (genderFilter !== "All" && l.gender && l.gender !== genderFilter) {
      return false;
    }
    // Occasion filter
    if (occFilter !== "all" && l.occ !== occFilter) {
      return false;
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

  // Master AI looks (Top 20 AI generated images)
  const masterAiLooks = looks.filter((l) => l.id.startsWith("outfit-") && !l.id.includes("-w"));
  const womenLooks = looks.filter((l) => l.gender === "Women" || l.id.includes("-w"));

  // Curated Trending picks from real database looks
  const trendingLooks = looks.filter((l) =>
    ["outfit-17", "outfit-12", "outfit-15", "outfit-8", "outfit-14"].includes(l.id)
  );

  // Curated Seasonal picks from real database looks
  const seasonalPicks = [
    { label: "Summer Resort", look: looks.find((l) => l.id === "outfit-9") },
    { label: "Winter & Autumn", look: looks.find((l) => l.id === "outfit-20") },
    { label: "Festive Season", look: looks.find((l) => l.id === "outfit-4") },
    { label: "Monsoon & Urban", look: looks.find((l) => l.id === "outfit-18") },
  ].filter((item) => item.look);

  return (
    <div className="space-y-12 pb-16">
      {/* ── Hero Banner ── */}
      <Hero
        img={IMG["hero-wardrobe"]}
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
              { id: "All", label: "All Looks", count: looks.length },
              { id: "Men", label: "Men's Looks", count: masterAiLooks.length },
              { id: "Women", label: "Women's Looks", count: womenLooks.length },
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

      {/* ── Master AI Recommendations Section (4 in each row, 20 images = 5 rows) ── */}
      <Section
        title={
          genderFilter === "Men"
            ? "AI Generated Outfits for Men (20 Master Looks)"
            : genderFilter === "Women"
            ? "Curated Fashion Outfits for Women"
            : "Recommended Outfits for You"
        }
        icon="Sparkles"
        sub={`Showing ${filteredLooks.length} verified looks with matched accessories & footwear`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLooks.map((l) => {
              const isSaved = saved.includes(l.id);
              const matchScore = l.matchScore || 95;

              return (
                <div
                  key={l.id}
                  className="card group relative flex flex-col rounded-2xl overflow-hidden border border-line hover:border-acc/60 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-acc/10 bg-card/90"
                >
                  {/* Full Outfit Image Card */}
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden bg-black/60 cursor-pointer"
                    onClick={() => setModalLook(l)}
                  >
                    <img
                      src={l.img}
                      alt={l.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = IMG["hero-wardrobe"];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                        {matchScore}% Match
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/70 text-acc border border-acc/30 backdrop-blur-md w-fit">
                        {l.occ}
                      </span>
                    </div>

                    {/* Top Right Save Button */}
                    <button
                      type="button"
                      aria-label="Save Look"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(l.id);
                      }}
                      className={`absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full backdrop-blur-md transition-all z-10 ${
                        isSaved
                          ? "bg-acc text-black shadow-lg shadow-acc/30 scale-110"
                          : "bg-black/60 text-white/80 hover:text-acc hover:bg-black/80"
                      }`}
                    >
                      <HeartIcon
                        size={16}
                        className={isSaved ? "fill-black text-black" : "text-white"}
                      />
                    </button>

                    {/* Hover Quick View Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                      <span className="btn-p text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-xl">
                        <Eye size={14} />
                        <span>Quick View</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Information & Action Bar */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif font-semibold text-sm text-white group-hover:text-acc transition-colors line-clamp-1">
                          {l.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-mute border border-white/10 shrink-0">
                          {l.gender || "Men"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(l.tags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-mute border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => nv(`/create-outfit?occ=${l.occ}`)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-acc hover:text-black text-xs font-medium text-mute transition flex items-center justify-center gap-1.5"
                      >
                        <Wand2 size={13} />
                        <span>Try in Studio</span>
                      </button>
                      <button
                        onClick={() => toggleSave(l.id)}
                        className={`p-2 rounded-xl border transition ${
                          isSaved
                            ? "bg-acc/15 text-acc border-acc/40"
                            : "border-line text-mute hover:text-white hover:border-line/80"
                        }`}
                        title={isSaved ? "Saved to your looks" : "Save look"}
                      >
                        {isSaved ? <Check size={14} /> : <HeartIcon size={14} />}
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

              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/90 text-white font-bold">
                  {l.matchScore || 95}% Match
                </span>
              </div>

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
          {["white-shirt", "black-trousers", "white-sneakers", "watch"].map(
            (x, i) => (
              <span key={x} className="flex items-center gap-3">
                <div className="card w-28 overflow-hidden rounded-xl border border-line bg-card/70">
                  <img
                    src={by[x]?.img || IMG["hero-wardrobe"]}
                    alt={by[x]?.name || "Item"}
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
              src={looks[0]?.img || "/img/outfits/outfit-1.png"}
              alt="Result Look"
              className="w-24 h-28 rounded-xl object-cover border border-line"
            />
            <div className="text-white flex-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/90 text-white font-bold">
                98% Synergy
              </span>
              <div className="font-serif font-semibold mt-1">
                {looks[0]?.title || "Smart Casual Set"}
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
                  e.target.src = IMG["hero-wardrobe"];
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
                  <span className="text-acc font-medium">{look.matchScore || 95}% Match</span>
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
            <div className="relative aspect-[3/3.8] rounded-xl overflow-hidden bg-black/70 border border-line">
              <img
                src={modalLook.img}
                alt={modalLook.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-md">
                {modalLook.matchScore || 95}% Match Score
              </span>
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
                  onClick={() => toggleSave(modalLook.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    saved.includes(modalLook.id)
                      ? "bg-acc text-black shadow-md"
                      : "btn-o"
                  }`}
                >
                  <HeartIcon
                    size={14}
                    className={
                      saved.includes(modalLook.id) ? "fill-black" : "text-acc"
                    }
                  />
                  <span>
                    {saved.includes(modalLook.id) ? "Saved in Wardrobe" : "Save Look"}
                  </span>
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
    </div>
  );
}
