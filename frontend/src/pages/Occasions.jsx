import { useState } from "react";
import { Hero, Section, OccCard, Tabs } from "../ui.jsx";
import { useStore } from "../store.jsx";
const map = {
  Personal: "Personal",
  Professional: "Special",
  Social: "Popular",
  Travel: "Travel",
  Seasonal: "Seasonal",
  Traditional: "Personal",
};
export default function Occasions() {
  const { catalog } = useStore();
  const { occasions } = catalog;
  const [t, setT] = useState("All");
  const groups = ["Popular", "Personal", "Travel", "Seasonal", "Special"];
  const show = t === "All" ? groups : [map[t]];
  return (
    <div>
      <Hero
        img="/img/hero-wardrobe.jpg"
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
        <p className="text-mute mt-3">
          Discover outfit ideas for every moment in your life — from everyday
          essentials to once-in-a-lifetime events.
        </p>
      </Hero>
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
          value={t}
          onChange={setT}
        />
      </div>
      {show.map((g) => (
        <Section key={g} title={g + " Occasions"} to="#">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {occasions
              .filter((o) => o.group === g)
              .map((o) => (
                <OccCard key={o.id} o={o} />
              ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
