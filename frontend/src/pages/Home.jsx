import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Hero, Section, OccCard, Icon } from "../ui.jsx";
import { useStore } from "../store.jsx";
const qa = [
  ["Upload Clothes", "To My Wardrobe", "Shirt", "/wardrobe"],
  ["Get Outfit", "For an Occasion", "Shirt", "/create-outfit"],
  ["Explore", "Recommendations", "Sparkles", "/recommendations"],
  ["View", "Saved Looks", "Bookmark", "/saved-looks"],
];
export default function Home() {
  const { user, catalog } = useStore();
  const { occasions } = catalog;
  const nv = useNavigate();
  return (
    <div>
      <Hero
        img="/img/hero-home.jpg"
        script={
          <>
            Your Wardrobe.
            <br />
            Better Outfits.
            <br />
            Every Occasion.
          </>
        }
        h="min-h-[340px]"
      >
        <p className="text-xl text-mute mb-1">
          Hey {(user?.name || "there").split(" ")[0]},
        </p>
        <h1 className="h1">
          What’s the occasion <span className="text-acc block">today?</span>
        </h1>
        <p className="text-mute mt-4 mb-6 text-lg">
          Get personalized outfits from your wardrobe for any occasion —
          complete look, in seconds.
        </p>
        <button
          onClick={() => nv("/create-outfit")}
          className="btn-p h-14 px-8 text-base"
        >
          Create Outfit <ArrowRight size={18} />
        </button>
      </Hero>
      <Section title="Popular Occasions" to="/occasions">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {occasions
            .filter((o) =>
              [
                "wedding",
                "college",
                "office",
                "date",
                "party",
                "mountain",
              ].includes(o.id),
            )
            .map((o) => (
              <OccCard key={o.id} o={o} />
            ))}
        </div>
      </Section>
      <Section title="Quick Actions" right={<i />}>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {qa.map(([a, b, ic, to], i) => (
            <Link
              key={to}
              to={to}
              className={`card flex items-center gap-4 p-4 hover:-translate-y-1 hover:border-acc/50 ${i == 0 ? "bg-gradient-to-br from-acc/25 to-card border-acc/30" : ""}`}
            >
              <span className="grid place-items-center w-14 h-14 rounded-xl bg-white/5 border border-line2 text-acc">
                <Icon n={ic} size={26} />
              </span>
              <div className="text-sm">
                <div>{a}</div>
                <div className="text-mute">{b}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
