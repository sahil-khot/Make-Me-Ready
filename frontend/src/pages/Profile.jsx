import { useState } from "react";
import {
  Camera,
  Pencil,
  GraduationCap,
  MapPin,
  Bookmark,
  Wand2,
  Heart,
  Star,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, Section, Modal, Heart as Fav } from "../ui.jsx";
import { useStore } from "../store.jsx";
const Card = ({ t, onEdit, children, right }) => (
  <div className="card p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-serif font-semibold text-lg">{t}</h2>
      {onEdit ? (
        <button
          onClick={onEdit}
          className="btn-s h-8 px-4 text-xs border-acc/40 text-acc"
        >
          Edit
        </button>
      ) : (
        right
      )}
    </div>
    {children}
  </div>
);
const Row = ({ k, v }) => (
  <div className="flex py-3 border-b border-line last:border-0 text-sm">
    <span className="w-36 text-mute">{k}</span>
    <span>{v}</span>
  </div>
);
const Tag = ({ t }) => (
  <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-line">
    {t}
  </span>
);
export default function Profile() {
  const { user, saved = [], updateProfile, catalog } = useStore();
  const { looks = [], colors = [], wardrobe = [] } = catalog || {};
  const [tab, setTab] = useState("Overview");
  const [ed, setEd] = useState(false);
  const [name, setName] = useState(user?.name || "Your Style");
  const [loc, setLoc] = useState(user?.location || "India");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.location) setLoc(user.location);
  }, [user]);

  const stats = [
    [Bookmark, saved.length, "Looks Saved"],
    [Wand2, 12, "Outfits Created"],
    [Heart, 8, "Favourite Brands"],
    [Star, "4.8", "Style Score"],
  ];
  const wsum = ["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"];
  const n = [18, 12, 6, 8, 10];
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="h1 !text-4xl">My Profile</h1>
          <p className="text-mute mt-1 text-sm">
            Manage your profile, preferences and style settings.
          </p>
        </div>
        <button
          onClick={() => setEd(true)}
          className="btn-s h-11 border-acc/50 text-acc"
        >
          <Pencil size={14} />
          Edit Profile
        </button>
      </div>
      <div className="card mt-6 overflow-hidden">
        <div className="relative p-6 flex items-center gap-6">
          <img
            src="/img/hero-profile.jpg"
            alt=""
            className="absolute inset-y-0 right-0 w-2/3 h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent" />
          <div className="relative">
            <img
              src="/img/avatar.jpg"
              alt={name}
              className="w-28 h-28 rounded-full object-cover border-2 border-acc"
            />
            <span className="absolute bottom-0 right-0 grid place-items-center w-8 h-8 rounded-full bg-card2 border border-line2">
              <Camera size={14} />
            </span>
          </div>
          <div className="relative">
            <h2 className="font-serif font-semibold text-3xl">{name}</h2>
            <p className="text-mute mb-3">Better Outfits. Brighter You.</p>
            <p className="text-sm flex items-center gap-2 mb-1">
              <GraduationCap size={15} className="text-mute" />
              4th Year, Computer Engineering
            </p>
            <p className="text-sm flex items-center gap-2">
              <MapPin size={15} className="text-mute" />
              {loc}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 border-t border-line">
          {stats.map(([I, a, b]) => (
            <div key={b} className="flex items-center gap-4 p-5">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/5 text-acc">
                <I size={20} />
              </span>
              <div>
                <div className="font-serif text-2xl">{a}</div>
                <div className="text-xs text-mute">{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Tabs
          items={[
            "Overview",
            "Wardrobe",
            "Preferences",
            "Measurements",
            "Addresses",
            "Security",
          ]}
          icons={[
            "LayoutDashboard",
            "Shirt",
            "Gem",
            "Ruler",
            "MapPin",
            "ShieldCheck",
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>
      {tab !== "Overview" ? (
        <div className="card p-10 mt-6 text-center text-mute animate-up">
          {tab} settings — use Edit Profile to update your details.
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            <Card t="About Me" onEdit={() => setEd(true)}>
              <Row k="Full Name" v={name} />
              <Row k="Email" v={user.email} />
              <Row
                k="Phone"
                v={user.phone ? "+91 " + user.phone : "+91 98765 43210"}
              />
              <Row k="Date of Birth" v={user.dob || "12 March 2003"} />
              <Row k="Location" v={loc} />
              <Row
                k="College"
                v="Kamalnayan Bajaj Institute of Engineering & Technology"
              />
              <Row k="Gender" v={user.gender || "Male"} />
            </Card>
            <Card t="Style Preferences" onEdit={() => setEd(true)}>
              <div className="space-y-6 text-sm">
                <div className="flex gap-6">
                  <span className="w-32 text-mute shrink-0">
                    Preferred Styles
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      user.styles || [
                        "Casual",
                        "Minimal",
                        "Streetwear",
                        "Formal",
                      ]
                    ).map((s) => (
                      <Tag key={s} t={s} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 items-center">
                  <span className="w-32 text-mute shrink-0">
                    Preferred Colors
                  </span>
                  <div className="flex gap-3">
                    {colors.slice(0, 5).map(([c, h]) => (
                      <i
                        key={c}
                        title={c}
                        className="w-8 h-8 rounded-full border border-line2"
                        style={{ background: h }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="w-32 text-mute shrink-0">
                    Favourite Brands
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Zara", "H&M", "Nike", "Adidas", "Fossil"].map((s) => (
                      <Tag key={s} t={s} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="w-32 text-mute shrink-0">
                    Occasions I Shop For
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "College",
                      "Travel",
                      "Party",
                      "Formal",
                      "Casual",
                      "Gym",
                    ].map((s) => (
                      <Tag key={s} t={s} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <Section
            title="My Wardrobe Summary"
            sub="Total items in your wardrobe"
            to="/wardrobe"
          >
            <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
              {wsum.map((c, i) => (
                <Link
                  to="/wardrobe"
                  key={c}
                  className="group tile relative aspect-[4/4.3] rounded-2xl overflow-hidden border border-line hover:-translate-y-1 transition"
                >
                  <img
                    src={wardrobe.find((w) => w.cat === c)?.img || "/img/hero-wardrobe.jpg"}
                    alt={c}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
                  <div className="absolute bottom-0 p-3">
                    <div className="font-serif font-semibold">{c}</div>
                    <div className="text-xs text-mute">{n[i]} items</div>
                  </div>
                </Link>
              ))}
              <Link
                to="/wardrobe"
                className="card grid place-items-center text-acc text-sm hover:border-acc/50"
              >
                <span className="text-center">
                  <Plus className="mx-auto mb-1" />
                  Add Items
                </span>
              </Link>
            </div>
          </Section>
          <div className="grid lg:grid-cols-2 gap-5 mt-12">
            <Card t="Measurements" onEdit={() => setEd(true)}>
              <Row k="Height" v={(user.height || 176) + " cm"} />
              <Row k="Weight" v={(user.weight || 62) + " kg"} />
              <Row k="Shirt Size" v="M" />
              <Row k="Pant Size" v="32" />
              <Row k="Shoe Size" v="9 (UK)" />
            </Card>
            <Card
              t="Recent Activity"
              right={
                <Link to="/saved-looks" className="text-sm text-acc">
                  View All →
                </Link>
              }
            >
              {[
                [
                  "Created a new outfit",
                  "Office Professional Look",
                  "2 days ago",
                  looks[1],
                ],
                ["Saved a look", "Casual College Look", "3 days ago", looks[0]],
                [
                  "Updated wardrobe",
                  "Added 3 new items",
                  "5 days ago",
                  looks[6],
                ],
                [
                  "Generated recommendations",
                  "Party Night Outfits",
                  "1 week ago",
                  looks[2],
                ],
              ].map(([a, b, c, l]) => (
                <div key={a} className="flex items-center gap-3 py-2.5 text-sm">
                  <img
                    src={l.img}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div>{a}</div>
                    <div className="text-xs text-mute">{b}</div>
                  </div>
                  <span className="text-xs text-mute">{c}</span>
                </div>
              ))}
            </Card>
          </div>
          <Section title="Favourite Looks" to="/saved-looks">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {looks.slice(0, 4).map((l) => (
                <div
                  key={l.id}
                  className="group tile relative aspect-[4/3] rounded-2xl overflow-hidden border border-line"
                >
                  <img
                    src={l.img}
                    alt={l.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
                  <Fav id={"look-" + l.id} cls="absolute bottom-2 right-2" />
                  <div className="absolute bottom-3 left-3 font-serif font-semibold text-sm">
                    {l.title}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
      <Modal open={ed} onClose={() => setEd(false)} title="Edit Profile">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              await updateProfile({ name, location: loc });
              setEd(false);
            } catch (err) {
              setError(err.message);
            }
          }}
          className="space-y-3"
        >
          <label className="block text-sm">
            Full name
            <input
              className="inp mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Location
            <input
              className="inp mt-2"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <button className="btn-p w-full">Save Changes</button>
        </form>
      </Modal>
    </div>
  );
}
