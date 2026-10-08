import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Hero, Tabs } from "../ui.jsx";
import { IMG, occasionList } from "../data/constants.js";

// Section heading and description mapping for each filter
const SECTION_HEADINGS = {
  All: {
    title: "Explore Occasions",
    subtitle: "Select an occasion to explore perfectly coordinated outfit ideas and styling inspiration.",
  },
  Personal: {
    title: "Personal Occasions",
    subtitle: "Curated looks for birthdays, intimate dates, family gatherings, and everyday outings.",
  },
  Professional: {
    title: "Professional Occasions",
    subtitle: "Sharp, executive, and formal attire tailored for career milestones and meetings.",
  },
  Social: {
    title: "Social Occasions",
    subtitle: "Statement outfits for celebratory weddings, engagements, parties, and vibrant nights out.",
  },
  Travel: {
    title: "Travel Occasions",
    subtitle: "Comfortable, versatile, and stylish pieces for getaways, beach resorts, and adventures.",
  },
  Seasonal: {
    title: "Seasonal Occasions",
    subtitle: "Weather-ready and festival-inspired palettes for summer, monsoon, winter, and Diwali.",
  },
  Traditional: {
    title: "Traditional Occasions",
    subtitle: "Rich, celebratory ethnic ensembles for grand cultural events and auspicious festivals.",
  },
};

export default function Occasions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  // Filter 20 occasions by category
  const filteredOccasions = useMemo(() => {
    switch (filter) {
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
  }, [filter]);

  const headingInfo = SECTION_HEADINGS[filter] || SECTION_HEADINGS.All;

  const handleOccasionClick = (occ) => {
    navigate("/create-outfit", {
      state: {
        occasion: occ.id,
        occasionName: occ.name,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* ── Hero Banner ── */}
      <Hero
        img={IMG["hero-wardrobe"] || "/img/hero-wardrobe-luxury.jpg"}
        kicker="OCCASIONS"
        script={
          <>
            Different Occasions.
            <br />
            Better Outfits.
          </>
        }
      >
        <h1 className="h1">
          Every Occasion <span className="text-acc block">A Better You.</span>
        </h1>
        <p className="text-mute mt-3 max-w-lg leading-relaxed">
          Discover outfit ideas for every moment in your life — from everyday
          essentials to once-in-a-lifetime events.
        </p>
      </Hero>

      {/* ── Top Category Filter Structure (Existing Tabs Preserved) ── */}
      <div className="mt-6">
        <Tabs
          items={[
            "All",
            "Personal",
            "Professional",
            "Social",
            "Travel",
            "Seasonal",
            "Traditional",
          ]}
          icons={[
            "LayoutGrid",
            "Heart",
            "Briefcase",
            "Users",
            "Plane",
            "Sun",
            "Landmark",
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* ── Section Heading Below Filter Bar ── */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[.08] pb-4">
        <div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-wide">
            {headingInfo.title}
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            {headingInfo.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 shrink-0">
            {filteredOccasions.length} {filteredOccasions.length === 1 ? "Occasion" : "Occasions"}
          </span>
        </div>
      </div>

      {/* ── Premium Occasion Cards Grid: 4 columns on desktop, 2 on tablet, 1 on mobile ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredOccasions.map((occ) => (
          <div
            key={occ.id}
            onClick={() => handleOccasionClick(occ)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#131313] border border-white/[.08] hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            {/* Large Occasion Image Container */}
            <div className="relative aspect-[3/3.8] sm:aspect-[3/3.7] w-full overflow-hidden bg-black/40">
              <img
                src={occ.image}
                alt={occ.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Category Pill Tag on Image Top-Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  {occ.category}
                </span>
              </div>

              {/* Interactive Arrow Button Top-Right */}
              <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-stone-300 group-hover:text-amber-400 group-hover:border-amber-500/50 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Occasion Information Below the Image */}
            <div className="p-4 flex items-center justify-between gap-3 bg-[#131313] border-t border-white/[.04]">
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors duration-200 truncate">
                  {occ.name}
                </h3>
                {occ.sub && (
                  <p className="text-xs text-stone-400 font-sans mt-0.5 truncate">
                    {occ.sub}
                  </p>
                )}
              </div>

              <span className="text-[11px] font-semibold text-amber-400/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                <span>Style</span>
                <ArrowRight size={11} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
