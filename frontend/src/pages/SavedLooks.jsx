import { useState } from "react";
import { Hero, Tabs } from "../ui.jsx";
import LookCard from "./LookCard.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";
const m = {
  Casual: "Casual",
  Formal: "Formal",
  Party: "Party",
  Traditional: "Traditional",
  Travel: "Travel",
  Seasonal: ["Winter", "Summer", "Monsoon"],
};
export default function SavedLooks() {
  const { saved, catalog } = useStore();
  const { looks, lookTabs } = catalog;
  const [t, setT] = useState("All Looks");
  const [sort, setSort] = useState("Recently Saved");
  let list = looks
    .filter((l) => saved.includes(l.id))
    .filter(
      (l) =>
        t === "All Looks" || [].concat(m[t]).some((x) => l.tags.includes(x)),
    );
  if (sort === "A–Z")
    list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <div>
      <Hero
        img={IMG["hero-wardrobe"]}
        kicker="SAVED LOOKS"
        script={
          <>
            Saved Today.
            <br />
            Styled Tomorrow.
          </>
        }
      >
        <h1 className="h1">
          Your Favourite{" "}
          <span className="text-acc block">Looks, Always Here.</span>
        </h1>
        <p className="text-mute mt-3">
          All your saved outfits in one place. Revisit, edit or wear them
          anytime.
        </p>
      </Hero>
      <div className="mt-6">
        <Tabs items={lookTabs} value={t} onChange={setT} />
      </div>
      <div className="flex justify-between items-center mt-8 mb-5">
        <h2 className="font-serif font-semibold">{list.length} Saved Looks</h2>
        <select
          aria-label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-transparent text-sm text-mute"
        >
          <option>Recently Saved</option>
          <option>A–Z</option>
        </select>
      </div>
      {list.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((l) => (
            <LookCard key={l.id} l={l} saved />
          ))}
        </div>
      ) : (
        <p className="text-mute text-center py-20">
          No saved looks here yet. Save looks from Recommendations or Create
          Outfit.
        </p>
      )}
    </div>
  );
}
