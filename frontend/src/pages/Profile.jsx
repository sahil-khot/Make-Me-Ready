import { useState, useEffect, useRef } from "react";
import { IMG } from "../data/constants.js";
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
  Check,
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
          type="button"
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
    <span className="w-36 text-mute shrink-0">{k}</span>
    <span className="flex-1">{v || "—"}</span>
  </div>
);

const AVATAR_PRESETS = [
  IMG.avatar,
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
];

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
  const [saving, setSaving] = useState(false);

  // Edit form state – synced from live user object
  const [name, setName] = useState(user?.name || "");
  const [loc, setLoc] = useState(user?.location || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef(null);
  const [photoModal, setPhotoModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Keep form in sync when user object changes (e.g. after state sync from server)
  useEffect(() => {
    if (user?.name)     setName(user.name);
    if (user?.location) setLoc(user.location);
    if (user?.phone)    setPhone(user.phone);
    if (user?.gender)   setGender(user.gender);
    if (user?.height)   setHeight(user.height);
    if (user?.weight)   setWeight(user.weight);
  }, [user]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = 320;
          canvas.height = 320;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            320,
            320,
          );
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          await updateProfile({ avatar: dataUrl });
          setSuccessMsg("Profile photo updated successfully!");
          setTimeout(() => setSuccessMsg(""), 2200);
          setPhotoModal(false);
          setUploadingPhoto(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload photo: " + err.message);
      setUploadingPhoto(false);
    }
  };

  const handleSelectPreset = async (url) => {
    setUploadingPhoto(true);
    try {
      await updateProfile({ avatar: url });
      setSuccessMsg("Profile photo updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2200);
      setPhotoModal(false);
    } catch (err) {
      setError("Failed to set avatar.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Resolve user's favourite colors: user.colors is ["Black","White",...],
  // catalog.colors is [["Black","#000"],["White","#d8d8d8"],...]. Cross-reference to get hex.
  const colorMap = Object.fromEntries(colors.map(([n, h]) => [n, h]));
  const userColors =
    Array.isArray(user?.colors) && user.colors.length > 0
      ? user.colors.slice(0, 5)
      : colors.slice(0, 5).map(([n]) => n);

  const userStyles =
    Array.isArray(user?.styles) && user.styles.length > 0
      ? user.styles
      : ["Casual", "Minimal", "Streetwear", "Formal"];

  const stats = [
    [Bookmark, saved.length, "Looks Saved"],
    [Wand2, 12, "Outfits Created"],
    [Heart, 8, "Favourite Brands"],
    [Star, "4.8", "Style Score"],
  ];

  const wsum = ["Shirts", "Pants", "Accessories", "Jewelry", "Others"];
  const wcount = [5, 5, 5, 5, 5];

  // Safe recent activity – guard against looks not yet loaded
  const recentActivity = [
    ["Created a new outfit", "Office Professional Look", "2 days ago", looks[1]],
    ["Saved a look", "Casual College Look", "3 days ago", looks[0]],
    ["Updated wardrobe", "Added 3 new items", "5 days ago", looks[6]],
    ["Generated recommendations", "Party Night Outfits", "1 week ago", looks[2]],
  ].filter(([, , , l]) => l != null);  // drop any entry whose look isn't loaded yet

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        location: loc.trim(),
        phone: phone.trim(),
        gender,
        height,
        weight,
      });
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        setEd(false);
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="h1 !text-4xl">My Profile</h1>
          <p className="text-mute mt-1 text-sm">
            Manage your profile, preferences and style settings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEd(true)}
          className="btn-s h-11 border-acc/50 text-acc"
        >
          <Pencil size={14} />
          Edit Profile
        </button>
      </div>

      {/* Profile Banner */}
      <div className="card mt-6 overflow-hidden">
        <div className="relative p-6 flex items-center gap-6">
          <img
            src={IMG["hero-profile"]}
            alt=""
            className="absolute inset-y-0 right-0 w-2/3 h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent" />
          <div className="relative group cursor-pointer" onClick={() => setPhotoModal(true)}>
            <img
              src={user?.avatar || IMG.avatar}
              alt={name || "User"}
              className="w-28 h-28 rounded-full object-cover border-2 border-acc shadow-[0_0_24px_rgba(255,159,47,.25)] group-hover:brightness-90 transition"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPhotoModal(true);
              }}
              title="Set Profile Photo"
              className="absolute bottom-0 right-0 grid place-items-center w-9 h-9 rounded-full bg-acc text-black border-2 border-bg shadow hover:scale-110 transition cursor-pointer"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="relative">
            <h2 className="font-serif font-semibold text-3xl">{name || "Your Style"}</h2>
            <p className="text-mute mb-3">Better Outfits. Brighter You.</p>
            <p className="text-sm flex items-center gap-2 mb-1">
              <GraduationCap size={15} className="text-mute" />
              Computer Engineering Student
            </p>
            <p className="text-sm flex items-center gap-2">
              <MapPin size={15} className="text-mute" />
              {loc || "India"}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
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

      {/* Tabs */}
      <div className="mt-6">
        <Tabs
          items={["Overview", "Wardrobe", "Preferences", "Measurements", "Addresses", "Security"]}
          icons={["LayoutDashboard", "Shirt", "Gem", "Ruler", "MapPin", "ShieldCheck"]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {/* Tab content */}
      {tab !== "Overview" ? (
        <div className="card p-10 mt-6 text-center text-mute animate-up">
          <p className="text-lg font-serif mb-2">{tab}</p>
          <p className="text-sm">Click <span className="text-acc font-medium">Edit Profile</span> to update your {tab.toLowerCase()} details.</p>
        </div>
      ) : (
        <>
          {/* About + Style Prefs */}
          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            <Card t="About Me" onEdit={() => setEd(true)}>
              <Row k="Full Name" v={name} />
              <Row k="Email" v={user?.email} />
              <Row k="Phone" v={user?.phone ? "+91 " + user.phone : undefined} />
              <Row k="Date of Birth" v={user?.dob} />
              <Row k="Location" v={loc} />
              <Row k="Gender" v={user?.gender} />
            </Card>

            <Card t="Style Preferences" onEdit={() => setEd(true)}>
              <div className="space-y-6 text-sm">
                {/* Styles */}
                <div className="flex gap-6">
                  <span className="w-32 text-mute shrink-0">Preferred Styles</span>
                  <div className="flex flex-wrap gap-2">
                    {userStyles.map((s) => (
                      <Tag key={s} t={s} />
                    ))}
                  </div>
                </div>

                {/* Colors — look up hex from catalog colorMap */}
                <div className="flex gap-6 items-center">
                  <span className="w-32 text-mute shrink-0">Preferred Colors</span>
                  <div className="flex flex-wrap gap-2">
                    {userColors.map((colorName) => (
                      <i
                        key={colorName}
                        title={colorName}
                        className="w-8 h-8 rounded-full border border-line2 inline-block"
                        style={{ background: colorMap[colorName] || "#888" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Favourite Brands */}
                <div className="flex gap-6">
                  <span className="w-32 text-mute shrink-0">Favourite Brands</span>
                  <div className="flex flex-wrap gap-2">
                    {["Zara", "H&M", "Nike", "Adidas", "Fossil"].map((s) => (
                      <Tag key={s} t={s} />
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div className="flex gap-6">
                  <span className="w-32 text-mute shrink-0">Occasions I Shop For</span>
                  <div className="flex flex-wrap gap-2">
                    {["College", "Travel", "Party", "Formal", "Casual", "Gym"].map((s) => (
                      <Tag key={s} t={s} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Wardrobe Summary */}
          <Section title="My Wardrobe Summary" sub="Total items in your wardrobe" to="/wardrobe">
            <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
              {wsum.map((c, i) => (
                <Link
                  to="/wardrobe"
                  key={c}
                  className="group tile relative aspect-[4/4.3] rounded-2xl overflow-hidden border border-line hover:-translate-y-1 transition"
                >
                  <img
                    src={wardrobe.find((w) => w.cat === c)?.img || IMG["hero-wardrobe"]}
                    alt={c}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
                  <div className="absolute bottom-0 p-3">
                    <div className="font-serif font-semibold">{c}</div>
                    <div className="text-xs text-mute">{wcount[i]} items</div>
                  </div>
                </Link>
              ))}
              <Link
                to="/wardrobe"
                className="card grid place-items-center text-acc text-sm hover:border-acc/50 aspect-[4/4.3] rounded-2xl"
              >
                <span className="text-center">
                  <Plus className="mx-auto mb-1" />
                  Add Items
                </span>
              </Link>
            </div>
          </Section>

          {/* Measurements + Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-5 mt-12">
            <Card t="Measurements" onEdit={() => setEd(true)}>
              <Row k="Height" v={user?.height ? user.height + " cm" : undefined} />
              <Row k="Weight" v={user?.weight ? user.weight + " kg" : undefined} />
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
              {recentActivity.length === 0 ? (
                <p className="text-mute text-sm py-4">No recent activity yet.</p>
              ) : (
                recentActivity.map(([a, b, c, l]) => (
                  <div key={a} className="flex items-center gap-3 py-2.5 text-sm border-b border-line last:border-0">
                    <img
                      src={l?.img || IMG["hero-wardrobe"]}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{a}</div>
                      <div className="text-xs text-mute truncate">{b}</div>
                    </div>
                    <span className="text-xs text-mute shrink-0">{c}</span>
                  </div>
                ))
              )}
            </Card>
          </div>

          {/* Favourite Looks */}
          <Section title="Favourite Looks" to="/saved-looks">
            {looks.length === 0 ? (
              <p className="text-mute text-sm py-4">Loading looks…</p>
            ) : (
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
            )}
          </Section>
        </>
      )}

      {/* Edit Profile Modal — full fields */}
      <Modal open={ed} onClose={() => { setEd(false); setError(""); setSuccessMsg(""); }} title="Edit Profile">
        <form onSubmit={handleSave} className="space-y-3">
          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Full Name <span className="text-red-400">*</span></span>
            <input
              className="inp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Location</span>
            <input
              className="inp"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="e.g. Mumbai, India"
            />
          </label>

          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Phone Number</span>
            <input
              className="inp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Gender</span>
              <select
                className="inp"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Height (cm)</span>
              <input
                className="inp"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Weight (kg)</span>
              <input
                className="inp"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 68"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400 flex items-center gap-2">
              {error}
            </p>
          )}
          {successMsg && (
            <p role="status" className="text-sm text-green-400 flex items-center gap-2">
              <Check size={14} /> {successMsg}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setEd(false); setError(""); setSuccessMsg(""); }}
              className="btn-s flex-1 h-11"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-p flex-1 h-11 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Set Profile Photo Modal */}
      <Modal
        open={photoModal}
        onClose={() => setPhotoModal(false)}
        title="Set Profile Photo"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={user?.avatar || IMG.avatar}
                alt="Current profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-acc shadow-lg mx-auto"
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 rounded-full bg-black/70 grid place-items-center text-xs text-acc font-medium">
                  Updating…
                </div>
              )}
            </div>
            <p className="text-xs text-mute mt-3">
              Upload a custom photo or pick a luxury style avatar
            </p>
          </div>

          <div>
            <button
              type="button"
              disabled={uploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="btn-p w-full h-12 flex items-center justify-center gap-2"
            >
              <Camera size={18} />
              Upload Photo from Device
            </button>
          </div>

          <div>
            <div className="text-xs text-mute font-medium mb-3">Or choose a style avatar:</div>
            <div className="flex justify-center gap-3">
              {AVATAR_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="relative group p-0.5 rounded-full hover:scale-110 transition border-2 hover:border-acc border-transparent"
                >
                  <img
                    src={p}
                    alt={`Avatar ${idx + 1}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
