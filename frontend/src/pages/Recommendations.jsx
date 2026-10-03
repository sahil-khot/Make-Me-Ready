import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Hero, Section, Heart, Tabs, Modal } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";
const match = [95, 92, 90, 88];
const tabs = [
  "For You",
  "Trending",
  "Seasonal",
  "Similar Styles",
  "From Your Wardrobe",
  "Recently Viewed",
];
const filt = {
  "For You": () => true,
  Trending: (l) =>
    ["street", "festive-trad", "winter-layers", "summer-ess"].includes(l.id),
  Seasonal: (l) => ["winter", "summer", "monsoon", "festive"].includes(l.occ),
  "Similar Styles": (l) =>
    l.tags.includes("Casual") || l.tags.includes("Trendy"),
  "From Your Wardrobe": (l) => l.items.length >= 5,
  "Recently Viewed": (l) => l.id.length % 2 === 0,
};
export default function Recommendations() {
  const [t, setT] = useState("For You");
  const [m, setM] = useState(false);
  const { toggleSave, saved, catalog } = useStore();
  const { looks, wardrobe } = catalog;
  const by = Object.fromEntries(wardrobe.map((w) => [w.id, w]));
  const nv = useNavigate();
  const list = looks.filter(filt[t]);
  const top = (list.length >= 4 ? list : looks).slice(0, 4);
  return (
    <div>
      <Hero
        img={IMG["hero-wardrobe"]}
        kicker="RECOMMENDATIONS"
        script={
          <>
            Curated
            <br />
            Just for You.
          </>
        }
        h="min-h-[300px]"
      >
        <h1 className="h1">
          Looks You’ll <span className="text-acc">Love</span>
        </h1>
        <p className="text-mute mt-3">
          Personalized outfit ideas based on your wardrobe, style preferences
          and upcoming occasions.
        </p>
        <button
          onClick={() => setM(true)}
          className="card flex items-center gap-4 p-3 pr-4 mt-5 w-full text-left hover:border-acc/50"
        >
          <span className="grid place-items-center w-12 h-12 rounded-xl bg-acc/15 text-acc">
            <Sparkles />
          </span>
          <span className="flex-1 text-sm">
            <b className="block">AI Powered Recommendations</b>
            <span className="text-mute text-xs">
              Get outfits tailored to your style, wardrobe and occasion.
            </span>
          </span>
          <span className="grid place-items-center w-9 h-9 rounded-full bg-acc text-black">
            <ArrowRight size={16} />
          </span>
        </button>
      </Hero>
      <div className="mt-6">
        <Tabs items={tabs} value={t} onChange={setT} />
      </div>
      <Section title="Recommended for You" icon="Sparkles">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {top.map((l, i) => (
            <div
              key={l.id}
              className="card p-3 hover:-translate-y-1 animate-up"
            >
              <div className="relative aspect-[4/4.4] rounded-xl overflow-hidden">
                <img
                  src={l.img}
                  alt={l.title}
                  className="absolute inset-0 w-[72%] h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded-md bg-green-700/90">
                  {match[i]}% Match
                </span>
                <div className="absolute right-0 inset-y-0 w-[28%] bg-black/40 p-1.5 flex flex-col gap-1.5">
                  {l.items.slice(0, 4).map((x) => (
                    <img
                      key={x}
                      src={by[x]?.img}
                      alt=""
                      className="flex-1 min-h-0 rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-3 px-1">
                <div>
                  <h3 className="font-serif font-semibold">{l.title}</h3>
                  <p className="text-xs text-mute">
                    {l.occ[0].toUpperCase() + l.occ.slice(1)} look
                  </p>
                </div>
                <Heart id={"look-" + l.id} cls="!bg-transparent" />
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex gap-2">
                  {l.tags.map((g) => (
                    <span
                      key={g}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-mute"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <button
                  aria-label="Save look"
                  onClick={() => toggleSave(l.id)}
                  className={`grid place-items-center w-9 h-9 rounded-full border ${saved.includes(l.id) ? "bg-acc text-black border-acc" : "border-acc/60 text-acc"}`}
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Trending Looks" icon="Flame">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {looks.slice(5, 10).map((l) => (
            <div
              key={l.id}
              className="group tile relative aspect-[4/4.6] rounded-2xl overflow-hidden border border-line hover:-translate-y-1 transition"
            >
              <img
                src={l.img}
                alt={l.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
              <Heart id={"look-" + l.id} cls="absolute top-2 right-2" />
              <div className="absolute bottom-0 p-3">
                <div className="font-serif font-semibold text-sm">
                  {l.title}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">
                  {l.tags[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Mix & Match Recommendations"
        icon="Shuffle"
        sub="Create new looks using items from your wardrobe."
      >
        <div className="flex flex-wrap items-center gap-3 text-acc">
          {["white-shirt", "black-trousers", "white-sneakers", "watch"].map(
            (x, i) => (
              <span key={x} className="flex items-center gap-3">
                <div className="card w-28 overflow-hidden">
                  <img
                    src={by[x]?.img || IMG["hero-wardrobe"]}
                    alt={by[x]?.name || "Item"}
                    className="aspect-square object-cover"
                  />
                  <div className="text-[11px] text-white p-2">{by[x]?.name || "Item"}</div>
                </div>
                {i < 3 ? "+" : "="}
              </span>
            ),
          )}
          <div className="card flex items-center gap-4 p-3 flex-1 min-w-[260px]">
            <img
              src={looks[0].img}
              alt=""
              className="w-24 h-28 rounded-xl object-cover"
            />
            <div className="text-white flex-1">
              <div className="font-serif font-semibold">Modern Classic</div>
              <div className="text-xs text-mute mb-2">
                Versatile and stylish
              </div>
            </div>
            <button
              onClick={() => nv("/create-outfit")}
              className="grid place-items-center w-9 h-9 rounded-full border border-acc/60"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </Section>
      <Section title="Seasonal Picks for You" icon="Sun">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {looks
            .filter((l) =>
              [
                "monsoon-ready",
                "summer-ess",
                "winter-layers",
                "festive-trad",
              ].includes(l.id),
            )
            .map((l) => (
              <div
                key={l.id}
                className="group tile relative aspect-[4/3] rounded-2xl overflow-hidden border border-line"
              >
                <img
                  src={l.img}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
                <Heart id={"look-" + l.id} cls="absolute top-2 right-2" />
                <div className="absolute bottom-0 p-3 font-serif font-semibold text-sm">
                  {l.title}
                </div>
              </div>
            ))}
        </div>
      </Section>
      <div className="card mt-12 p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-acc/20 via-card to-card border-acc/30">
        <div>
          <div className="font-serif text-xl">Not finding the right look?</div>
          <p className="text-sm text-mute">
            Let AI create a personalized outfit just for you based on your
            wardrobe items.
          </p>
        </div>
        <button onClick={() => setM(true)} className="btn-p h-12">
          <Sparkles size={16} />
          Generate with AI
        </button>
      </div>
      <Modal open={m} onClose={() => setM(false)} title="Generating your looks">
        <p className="text-sm text-mute mb-4">
          We matched your wardrobe to your style preferences. Check the Create
          Outfit studio for the full flow.
        </p>
        <button onClick={() => nv("/create-outfit")} className="btn-p w-full">
          Open Create Outfit
        </button>
      </Modal>
    </div>
  );
}
