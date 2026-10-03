import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Hero, Icon, OccCard } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

const popularOccasionIds = [
  "wedding",
  "college",
  "office",
  "date",
  "party",
  "travel",
];

const qa = [
  {
    title: "Upload Clothes",
    sub: "To My Wardrobe",
    icon: "Shirt",
    to: "/wardrobe",
    featured: true,
  },
  {
    title: "Get Outfit",
    sub: "For an Occasion",
    icon: "Shirt",
    to: "/create-outfit",
  },
  {
    title: "Explore",
    sub: "Recommendations",
    icon: "Sparkles",
    to: "/recommendations",
  },
  {
    title: "View",
    sub: "Saved Looks",
    icon: "Bookmark",
    to: "/saved-looks",
  },
];

export default function Home() {
  const { user, catalog } = useStore();
  const { occasions = [] } = catalog || {};
  const navigate = useNavigate();

  const firstName = user?.name ? user.name.split(" ")[0] : "Sahil";

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <Hero
        img={IMG["hero-home"] || "/img/hero-luxury.jpg"}
        script={
          <>
            Your Wardrobe.
            <br />
            Better Outfits.
            <br />
            Every Occasion.
          </>
        }
        h="min-h-[380px] md:min-h-[420px]"
      >
        <p className="text-lg md:text-xl text-stone-300 font-sans mb-1.5">
          Hey {firstName},
        </p>
        <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-[58px] leading-[1.08] text-white">
          What’s the occasion{" "}
          <span className="text-[#f59e0b] block mt-1">today?</span>
        </h1>
        <p className="text-stone-300 mt-4 mb-7 text-base md:text-lg max-w-md leading-relaxed font-sans">
          Get personalized outfits from your wardrobe for any occasion —
          complete look, in seconds.
        </p>
        <button
          type="button"
          onClick={() => navigate("/create-outfit")}
          className="btn-p h-12 px-7 text-base bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-semibold shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 hover:brightness-110 transition"
        >
          Create Outfit <ArrowRight size={18} />
        </button>
      </Hero>

      {/* Popular Occasions */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif font-semibold text-2xl md:text-[28px] text-white tracking-wide">
            Popular Occasions
          </h2>
          <Link
            to="/occasions"
            className="text-sm font-medium text-amber-500 hover:text-amber-400 transition flex items-center gap-1.5"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {popularOccasionIds.map((id) => {
            const found = occasions.find((o) => o.id === id);
            const o = found || {
              id,
              title: id.charAt(0).toUpperCase() + id.slice(1),
              sub: "Outfit Ready",
              img: `/img/occ-${id}.jpg`,
            };
            return <OccCard key={o.id} o={o} />;
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-serif font-semibold text-2xl md:text-[28px] text-white tracking-wide mb-5">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {qa.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition duration-200 hover:-translate-y-1 ${
                item.featured
                  ? "bg-gradient-to-r from-[#2a1a0f] via-[#22150c] to-[#150d07] border-amber-600/50 shadow-[0_0_22px_rgba(217,119,6,0.18)] hover:border-amber-500"
                  : "bg-[#121212]/90 border-white/[.08] hover:border-amber-500/40 hover:bg-[#161616]"
              }`}
            >
              <span
                className={`grid place-items-center w-14 h-14 rounded-2xl shrink-0 transition ${
                  item.featured
                    ? "bg-[#3d2413] border border-amber-600/40 text-amber-400"
                    : "bg-white/[.04] border border-white/[.08] text-amber-400"
                }`}
              >
                <Icon n={item.icon} size={24} />
              </span>
              <div className="min-w-0">
                <div className="font-medium text-white text-[15px]">{item.title}</div>
                <div className="text-xs text-stone-400 mt-0.5">{item.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
