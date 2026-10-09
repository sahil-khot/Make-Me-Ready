import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Pencil,
  MapPin,
  Bookmark,
  Wand2,
  Heart,
  Star,
  ArrowRight,
  Plus,
  Check,
  X,
  ShieldCheck,
  Lock,
  User,
  Ruler,
  Shirt,
  Footprints,
  Sparkles,
  Trash2,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Zap,
} from "lucide-react";
import { Tabs, Section, Modal, Heart as Fav } from "../ui.jsx";
import { useStore } from "../store.jsx";
import {
  IMG,
  getImg,
  getUserAvatar,
  colors as defaultColorList,
  styles as defaultStylesList,
  brands as defaultBrandsList,
  occasions as defaultOccasionsList,
} from "../data/constants.js";

// ─────────────────────────────────────────────────────────────────────────────
// Circular Progress Component (Animated SVG Ring Gauge)
// ─────────────────────────────────────────────────────────────────────────────
const CircularProgress = ({
  percentage = 0,
  size = 80,
  strokeWidth = 7,
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;
  const strokeColor = isComplete ? "#10b981" : "#f59e0b";

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
          {isComplete ? (
            <div className="flex flex-col items-center justify-center">
              <Check
                size={size > 80 ? 26 : 18}
                className="text-emerald-400 stroke-[3]"
              />
              <span
                className="text-emerald-400 font-bold leading-none mt-0.5"
                style={{ fontSize: size > 80 ? "13px" : "10px" }}
              >
                100%
              </span>
            </div>
          ) : (
            <>
              <span
                className="font-bold text-white leading-none tracking-tight"
                style={{ fontSize: size > 80 ? "20px" : "14px" }}
              >
                {Math.round(progress)}%
              </span>
              <span
                className="text-stone-400 mt-0.5 leading-none font-medium"
                style={{ fontSize: size > 80 ? "10px" : "9px" }}
              >
                Complete
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Success Toast Notification ("Payment Successful" Style Confirmation)
// ─────────────────────────────────────────────────────────────────────────────
const SuccessToast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-[#0a1a12] border-2 border-emerald-500/80 text-white shadow-[0_12px_45px_rgba(16,185,129,0.45)] backdrop-blur-md animate-up max-w-md w-[92%]"
    >
      <div className="grid place-items-center w-10 h-10 rounded-full bg-emerald-500 text-black shrink-0 font-bold shadow-md shadow-emerald-500/40">
        <Check size={22} className="stroke-[3]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-emerald-400 text-sm leading-tight flex items-center gap-1.5">
          {message}
        </div>
        <div className="text-xs text-stone-300 mt-0.5 truncate">
          Your style profile settings are saved and active.
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-stone-400 hover:text-white p-1 rounded-lg transition"
        title="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Reusable UI Pieces
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ title, subtitle, onEdit, editLabel = "Edit", right, children }) => (
  <div className="card p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="font-serif font-semibold text-lg text-white">{title}</h2>
        {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="btn-s h-8 px-4 text-xs border-acc/40 text-acc hover:border-acc"
        >
          {editLabel}
        </button>
      ) : (
        right
      )}
    </div>
    {children}
  </div>
);

const Row = ({ label, value, isOptional = false }) => (
  <div className="flex py-3 border-b border-line last:border-0 text-sm items-center justify-between">
    <span className="w-40 text-mute shrink-0 flex items-center gap-1.5">
      {label}
      {isOptional && (
        <span className="text-[10px] text-stone-500 font-normal">(Optional)</span>
      )}
    </span>
    <span className="flex-1 text-right sm:text-left text-white/90 font-medium">
      {value ? (
        value
      ) : (
        <span className="text-stone-500 font-normal italic">Not provided</span>
      )}
    </span>
  </div>
);

const Tag = ({ text, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-line text-stone-200">
    {text}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="text-stone-400 hover:text-white"
      >
        <X size={12} />
      </button>
    )}
  </span>
);

const AVATAR_PRESETS = [
  IMG.avatar,
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
];

const BODY_TYPES = ["Slim", "Athletic", "Average", "Muscular", "Plus Size"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const PANTS_SIZES = ["28", "30", "32", "34", "36", "38", "40"];
const SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];
const FIT_PREFERENCES = ["Slim Fit", "Regular Tailored", "Relaxed / Oversized"];

// ─────────────────────────────────────────────────────────────────────────────
// Profile Completion Helper (Calculates percentage dynamically based on all meaningful saved fields)
// ─────────────────────────────────────────────────────────────────────────────
function calculateProfileCompletion(user, added = []) {
  if (!user) return { percentage: 0, missing: [], completed: [], isComplete: false };

  const criteria = [
    // 1. Personal Information (7 fields)
    {
      id: "name",
      label: "Full Name",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean(user.name && String(user.name).trim().length > 0),
    },
    {
      id: "email",
      label: "Email Address",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean(user.email && String(user.email).trim().length > 0),
    },
    {
      id: "gender",
      label: "Gender",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean(user.gender && String(user.gender).trim().length > 0 && user.gender !== "Prefer not to say"),
    },
    {
      id: "phone",
      label: "Phone Number",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean(user.phone && String(user.phone).trim().length >= 10),
    },
    {
      id: "dob",
      label: "Date of Birth",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean(user.dob && String(user.dob).trim().length > 0),
    },
    {
      id: "city",
      label: "City / Location",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean((user.city || user.location) && String(user.city || user.location).trim().length > 0),
    },
    {
      id: "avatar",
      label: "Profile Picture",
      tab: "Personal Information",
      weight: 6.25,
      isDone: Boolean(user.avatar && String(user.avatar).trim().length > 0),
    },

    // 2. Measurements & Sizes (6 fields)
    {
      id: "height",
      label: "Height",
      tab: "Measurements & Sizes",
      weight: 6.25,
      isDone: Boolean(user.height && String(user.height).trim().length > 0),
    },
    {
      id: "weight",
      label: "Weight",
      tab: "Measurements & Sizes",
      weight: 6.25,
      isDone: Boolean(user.weight && String(user.weight).trim().length > 0),
    },
    {
      id: "body",
      label: "Body Type",
      tab: "Measurements & Sizes",
      weight: 6.25,
      isDone: Boolean(user.body && String(user.body).trim().length > 0),
    },
    {
      id: "shirtSize",
      label: "Shirt / Top Size",
      tab: "Measurements & Sizes",
      weight: 6.25,
      isDone: Boolean(user.shirtSize && String(user.shirtSize).trim().length > 0),
    },
    {
      id: "pantsSize",
      label: "Pants Size",
      tab: "Measurements & Sizes",
      weight: 6.25,
      isDone: Boolean(user.pantsSize && String(user.pantsSize).trim().length > 0),
    },
    {
      id: "shoeSize",
      label: "Shoe Size",
      tab: "Measurements & Sizes",
      weight: 6.25,
      isDone: Boolean(user.shoeSize && String(user.shoeSize).trim().length > 0),
    },

    // 3. Style Preferences (3 fields)
    {
      id: "styles",
      label: "Preferred Styles",
      tab: "Style Preferences",
      weight: 6.25,
      isDone: Array.isArray(user.styles) && user.styles.length > 0,
    },
    {
      id: "colors",
      label: "Favourite Colors",
      tab: "Style Preferences",
      weight: 6.25,
      isDone: Array.isArray(user.colors) && user.colors.length > 0,
    },
    {
      id: "brands",
      label: "Favourite Brands",
      tab: "Style Preferences",
      weight: 6.25,
      isDone: Array.isArray(user.brands) && user.brands.length > 0,
    },
  ];

  let completedWeight = 0;
  const missing = [];
  const completed = [];

  for (const item of criteria) {
    if (item.isDone) {
      completedWeight += item.weight;
      completed.push(item);
    } else {
      missing.push(item);
    }
  }

  const percentage = Math.min(100, Math.round(completedWeight));
  return {
    percentage,
    missing,
    completed,
    isComplete: percentage === 100,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Style Calibration Score (Calculated dynamically from user's actual preferences)
// ─────────────────────────────────────────────────────────────────────────────
function calculateStyleCalibrationScore(user, added = []) {
  if (!user) return "0.0";

  let score = 0;

  // 1. Style Preferences Depth (up to 1.0)
  const stylesCount = Array.isArray(user.styles) ? user.styles.length : 0;
  if (stylesCount >= 3) score += 1.0;
  else if (stylesCount === 2) score += 0.8;
  else if (stylesCount === 1) score += 0.5;

  // 2. Color Palette Depth (up to 0.8)
  const colorsCount = Array.isArray(user.colors) ? user.colors.length : 0;
  if (colorsCount >= 3) score += 0.8;
  else if (colorsCount === 2) score += 0.6;
  else if (colorsCount === 1) score += 0.4;

  // 3. Favourite Brands Alignment (up to 0.8)
  const brandsCount = Array.isArray(user.brands) ? user.brands.length : 0;
  if (brandsCount >= 3) score += 0.8;
  else if (brandsCount === 2) score += 0.6;
  else if (brandsCount === 1) score += 0.4;

  // 4. Fit & Sizing Precision (up to 1.0)
  let fitScore = 0;
  if (user.shirtSize) fitScore += 0.25;
  if (user.pantsSize) fitScore += 0.25;
  if (user.shoeSize) fitScore += 0.25;
  if (user.body || user.height) fitScore += 0.25;
  score += fitScore;

  // 5. Wardrobe Inventory (up to 0.8)
  const wardrobeCount = Array.isArray(added) ? added.length : 0;
  if (wardrobeCount >= 5) score += 0.8;
  else if (wardrobeCount >= 2) score += 0.5;
  else if (wardrobeCount >= 1) score += 0.3;

  // 6. Occasions & Notes (up to 0.6)
  if (Array.isArray(user.occasions) && user.occasions.length > 0) score += 0.3;
  if (user.fashionPreferences && String(user.fashionPreferences).trim().length > 0) score += 0.3;

  return Math.min(5.0, score).toFixed(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PROFILE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, saved = [], updateProfile, changePassword, logout, catalog, added = [] } = useStore();
  const { looks = [], colors = defaultColorList, wardrobe = [] } = catalog || {};
  const navigate = useNavigate();

  // Navigation tab
  const [tab, setTab] = useState("Overview");

  // Dynamic Profile completion metrics based on real user & wardrobe data
  const completion = useMemo(() => calculateProfileCompletion(user, added), [user, added]);

  // Dynamic Style Calibration Score based on user's real preferences
  const styleScore = useMemo(() => calculateStyleCalibrationScore(user, added), [user, added]);

  // Real Custom Looks / Outfits Created from localStorage
  const customLooks = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("mmr_custom_looks") || "[]");
    } catch {
      return [];
    }
  }, []);

  const outfitsCreatedCount = customLooks.length;
  const savedLooksCount = saved.length;
  const favouriteBrandsCount = Array.isArray(user?.brands) ? user.brands.length : 0;

  // Global success toast message
  const [toastMessage, setToastMessage] = useState("");
  const triggerSuccessToast = (msg = "✓ Your profile is updated successfully.") => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // ── Form States per section ──
  // 1. Personal & Appearance
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [dob, setDob] = useState(user?.dob || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [bodyType, setBodyType] = useState(user?.body || "");
  const [city, setCity] = useState(user?.city || user?.location || "");
  const [tagline, setTagline] = useState(user?.tagline || "");
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalError, setPersonalError] = useState("");

  // 2. Style Preferences
  const [selectedColors, setSelectedColors] = useState(
    Array.isArray(user?.colors) ? user.colors : []
  );
  const [selectedStyles, setSelectedStyles] = useState(
    Array.isArray(user?.styles) ? user.styles : []
  );
  const [selectedBrands, setSelectedBrands] = useState(
    Array.isArray(user?.brands) ? user.brands : []
  );
  const [selectedOccasions, setSelectedOccasions] = useState(
    Array.isArray(user?.occasions) ? user.occasions : []
  );
  const [fashionNotes, setFashionNotes] = useState(user?.fashionPreferences || "");
  const [newBrandInput, setNewBrandInput] = useState("");
  const [stylesSaving, setStylesSaving] = useState(false);
  const [stylesError, setStylesError] = useState("");

  // 3. Measurements & Sizes
  const [shirtSize, setShirtSize] = useState(user?.shirtSize || "");
  const [pantsSize, setPantsSize] = useState(user?.pantsSize || "");
  const [shoeSize, setShoeSize] = useState(user?.shoeSize || "");
  const [fitPreference, setFitPreference] = useState(user?.fitPreference || "");
  const [otherMeasurements, setOtherMeasurements] = useState(user?.otherMeasurements || "");
  const [measurementsSaving, setMeasurementsSaving] = useState(false);
  const [measurementsError, setMeasurementsError] = useState("");

  // 4. Addresses
  const [addresses, setAddresses] = useState(Array.isArray(user?.addresses) ? user.addresses : []);
  const [addressModal, setAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);

  // 5. Security (Password change)
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");

  // 6. Photo upload / modal
  const fileInputRef = useRef(null);
  const [photoModal, setPhotoModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Sync state when user updates
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.gender) setGender(user.gender);
      if (user.dob) setDob(user.dob);
      if (user.height) setHeight(user.height);
      if (user.weight) setWeight(user.weight);
      if (user.body) setBodyType(user.body);
      if (user.city || user.location) setCity(user.city || user.location);
      if (user.tagline) setTagline(user.tagline);
      if (Array.isArray(user.colors)) setSelectedColors(user.colors);
      if (Array.isArray(user.styles)) setSelectedStyles(user.styles);
      if (Array.isArray(user.brands)) setSelectedBrands(user.brands);
      if (Array.isArray(user.occasions)) setSelectedOccasions(user.occasions);
      if (user.fashionPreferences) setFashionNotes(user.fashionPreferences);
      if (user.shirtSize) setShirtSize(user.shirtSize);
      if (user.pantsSize) setPantsSize(user.pantsSize);
      if (user.shoeSize) setShoeSize(user.shoeSize);
      if (user.fitPreference) setFitPreference(user.fitPreference);
      if (user.otherMeasurements) setOtherMeasurements(user.otherMeasurements);
      if (Array.isArray(user.addresses)) setAddresses(user.addresses);
    }
  }, [user]);

  // Color lookup helper
  const colorMap = useMemo(
    () => Object.fromEntries((colors || defaultColorList).map(([n, h]) => [n, h])),
    [colors]
  );

  // Handlers for Save actions
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setPersonalError("");
    if (!name.trim()) {
      setPersonalError("Full Name cannot be empty.");
      return;
    }
    setPersonalSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        gender,
        dob,
        height: height ? String(height).trim() : "",
        weight: weight ? String(weight).trim() : "",
        body: bodyType,
        city: city.trim(),
        location: city.trim(),
        tagline: tagline.trim(),
      });
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      setPersonalError(err.message || "Failed to update personal information.");
    } finally {
      setPersonalSaving(false);
    }
  };

  const handleSaveStyles = async (e) => {
    e?.preventDefault();
    setStylesError("");
    setStylesSaving(true);
    try {
      await updateProfile({
        colors: selectedColors,
        styles: selectedStyles,
        brands: selectedBrands,
        occasions: selectedOccasions,
        fashionPreferences: fashionNotes.trim(),
      });
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      setStylesError(err.message || "Failed to save style preferences.");
    } finally {
      setStylesSaving(false);
    }
  };

  const handleSaveMeasurements = async (e) => {
    e?.preventDefault();
    setMeasurementsError("");
    setMeasurementsSaving(true);
    try {
      await updateProfile({
        shirtSize,
        pantsSize,
        shoeSize,
        fitPreference,
        otherMeasurements: otherMeasurements.trim(),
      });
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      setMeasurementsError(err.message || "Failed to save measurements.");
    } finally {
      setMeasurementsSaving(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street.trim() || !addressForm.city.trim() || !addressForm.pincode.trim()) {
      return;
    }
    setAddressSaving(true);
    try {
      const newAddr = {
        ...addressForm,
        id: "addr-" + Date.now(),
      };
      let nextAddresses = [...addresses];
      if (addressForm.isDefault) {
        nextAddresses = nextAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      nextAddresses.push(newAddr);
      await updateProfile({ addresses: nextAddresses });
      setAddresses(nextAddresses);
      setAddressModal(false);
      setAddressForm({
        label: "Home",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    const next = addresses.filter((a) => a.id !== id);
    try {
      await updateProfile({ addresses: next });
      setAddresses(next);
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const next = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    try {
      await updateProfile({ addresses: next });
      setAddresses(next);
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (!currentPw) {
      setPwError("Current password is required.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      if (typeof changePassword === "function") {
        await changePassword({ currentPassword: currentPw, newPassword: newPw });
      }
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      triggerSuccessToast("✓ Your profile is updated successfully.");
    } catch (err) {
      setPwError(err.message || "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
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
            320
          );
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          await updateProfile({ avatar: dataUrl });
          triggerSuccessToast("✓ Your profile is updated successfully.");
          setPhotoModal(false);
          setUploadingPhoto(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setPersonalError("Failed to upload photo: " + err.message);
      setUploadingPhoto(false);
    }
  };

  const handleSelectPreset = async (url) => {
    setUploadingPhoto(true);
    try {
      await updateProfile({ avatar: url });
      triggerSuccessToast("✓ Your profile is updated successfully.");
      setPhotoModal(false);
    } catch (err) {
      setPersonalError("Failed to set avatar.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Helper to guide user to missing profile items
  const handleCompleteProfileClick = () => {
    if (completion.missing.length > 0) {
      setTab(completion.missing[0].tab);
    } else {
      setTab("Personal Information");
    }
  };

  // Dynamic Wardrobe category summary counts from actual added wardrobe pieces
  const wardrobeSummary = useMemo(() => {
    const isFem = user?.gender === "Female" || user?.profile?.gender === "Female";
    const baseCats = isFem
      ? [
          { cat: "Dress", img: "/wardrobe/d1.png" },
          { cat: "Top", img: "/wardrobe/shirt 1.png" },
          { cat: "Pants", img: "/wardrobe/pant 1.png" },
          { cat: "Footwear", img: "/wardrobe/shoe 1.png" },
          { cat: "Jewelry", img: "/wardrobe/j1.png" },
          { cat: "Accessories", img: "/wardrobe/a1.png" },
        ]
      : [
          { cat: "Shirts", img: "/wardrobe/shirt 1.png" },
          { cat: "Pants", img: "/wardrobe/pant 1.png" },
          { cat: "Shoes", img: "/wardrobe/shoe 1.png" },
          { cat: "Accessories", img: "/wardrobe/a1.png" },
          { cat: "Jewelry", img: "/wardrobe/j1.png" },
          { cat: "Other", img: "/wardrobe/shirt 2.png" },
        ];

    return baseCats.map((item) => {
      const count = (added || []).filter((w) => {
        const itemCat = (w.cat || w.category || "").toLowerCase();
        const target = item.cat.toLowerCase();
        return itemCat.includes(target) || target.includes(itemCat);
      }).length;
      return {
        ...item,
        count,
      };
    });
  }, [user, added]);

  // Dynamic Recent Styling Activities from real created outfits and added items
  const recentActivities = useMemo(() => {
    const list = [];
    if (Array.isArray(customLooks)) {
      customLooks.slice(0, 3).forEach((l) => {
        list.push({
          id: l.id,
          title: l.title || "Custom Styled Outfit",
          sub: `${l.occ || l.style || "AI Outfit"} · Created`,
          time: l.savedAt ? new Date(l.savedAt).toLocaleDateString() : "Recently",
          img: l.img || "/img/hero-wardrobe-luxury.jpg",
        });
      });
    }
    if (Array.isArray(added)) {
      added.slice(0, 3).forEach((w) => {
        list.push({
          id: w.id,
          title: w.name || "Wardrobe Piece",
          sub: `${w.cat || "Clothing"} · Added to closet`,
          time: w.addedAt ? new Date(w.addedAt).toLocaleDateString() : "Recently",
          img: w.img || "/img/hero-wardrobe-luxury.jpg",
        });
      });
    }
    return list.slice(0, 4);
  }, [customLooks, added]);

  return (
    <div className="space-y-7 animate-up">
      {/* ── Payment-style green success toast (Requirement 6) ── */}
      <SuccessToast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      {/* ── Top Header Banner (Requirement 5) ── */}
      <div className="card overflow-hidden relative">
        {/* Luxury Background Overlay */}
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <img
            src={IMG["hero-profile"] || "/BackGround Images/Profile BG.png"}
            alt="Profile cover"
            className="absolute inset-y-0 right-0 w-2/3 h-full object-cover opacity-60 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/95 md:via-[#121212]/85 to-transparent pointer-events-none" />

          {/* Left: Avatar + Identity */}
          <div className="relative flex items-center gap-5 z-10">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => setPhotoModal(true)}
              title="Click to change profile picture"
            >
              <img
                src={getUserAvatar(user)}
                alt={name || "User Avatar"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-acc shadow-[0_0_25px_rgba(245,158,11,0.25)] group-hover:brightness-90 transition"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoModal(true);
                }}
                className="absolute bottom-0 right-0 grid place-items-center w-8 h-8 rounded-full bg-acc text-black border-2 border-bg shadow hover:scale-110 transition"
                title="Change Photo"
              >
                <Camera size={15} />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                  {name || "Your Style"}
                </h1>
                {completion.isComplete ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <Check size={11} className="stroke-[3]" /> Verified Profile
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/40">
                    Style Profile Incomplete
                  </span>
                )}
              </div>

              <p className="text-stone-300 text-sm mt-1">
                {tagline || "Better Outfits. Brighter You."}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-mute">
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-acc" />
                  {gender || "Member"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-acc" />
                  {city || "India"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-acc" />
                  {user?.email || "Account Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Circular Progress Gauge & Primary Action Button */}
          <div className="relative z-10 flex items-center gap-5 self-start md:self-center bg-black/40 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-white/[.08]">
            <CircularProgress
              percentage={completion.percentage}
              size={76}
              strokeWidth={7}
            />
            <div>
              <div className="text-xs text-stone-400">Profile Status</div>
              <div className="font-bold text-white text-base leading-tight mt-0.5">
                {completion.isComplete ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    100% Complete ✓
                  </span>
                ) : (
                  `${completion.percentage}% Complete`
                )}
              </div>
              <button
                type="button"
                onClick={handleCompleteProfileClick}
                className={`mt-2 h-8 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                  completion.isComplete
                    ? "btn-s border-acc/50 text-acc hover:border-acc"
                    : "btn-p text-black shadow-md shadow-amber-500/20"
                }`}
              >
                {completion.isComplete ? (
                  <>
                    <Pencil size={12} /> Edit Profile
                  </>
                ) : (
                  <>
                    <Sparkles size={12} /> Complete Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-line bg-black/25">
          <div className="flex items-center gap-3.5 p-4 sm:p-5">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 text-acc">
              <Bookmark size={18} />
            </span>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {savedLooksCount}
              </div>
              <div className="text-xs text-mute">Looks Saved</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 sm:p-5 border-l border-line/40">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 text-acc">
              <Wand2 size={18} />
            </span>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {outfitsCreatedCount}
              </div>
              <div className="text-xs text-mute">Outfits Created</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 sm:p-5 border-l border-line/40">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 text-acc">
              <Heart size={18} />
            </span>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {favouriteBrandsCount}
              </div>
              <div className="text-xs text-mute">Favourite Brands</div>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 sm:p-5 border-l border-line/40">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 text-acc">
              <Star size={18} />
            </span>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-semibold text-white">
                {styleScore}
              </div>
              <div className="text-xs text-mute">Style Calibration Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prominent Completion Card (Requirement 2 & 4) ── */}
      {/* If Incomplete: Prominent call to action with missing items */}
      {!completion.isComplete ? (
        <div className="card p-6 sm:p-7 border-amber-500/40 bg-gradient-to-r from-[#201407] via-[#16120e] to-[#121212] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <CircularProgress
                percentage={completion.percentage}
                size={94}
                strokeWidth={8}
              />
              <div>
                <span className="text-[11px] font-bold tracking-widest text-acc uppercase block mb-1">
                  Style Calibration
                </span>
                <h2 className="font-serif font-bold text-2xl text-white">
                  Complete Your Profile
                </h2>
                <p className="text-sm text-stone-300 mt-1 max-w-xl">
                  Complete your style profile to get better outfit recommendations.
                  Adding your body type, clothing sizes and favorite styles unlocks AI-driven styling precision.
                </p>
                {completion.missing.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3.5">
                    <span className="text-xs text-stone-400 font-medium">
                      Missing fields:
                    </span>
                    {completion.missing.slice(0, 4).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTab(m.tab)}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
                      >
                        + {m.label}
                      </button>
                    ))}
                    {completion.missing.length > 4 && (
                      <span className="text-xs text-stone-500">
                        +{completion.missing.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteProfileClick}
              className="btn-p h-12 px-7 text-sm font-semibold text-black shadow-[0_0_25px_rgba(245,158,11,0.35)] shrink-0 self-start md:self-center"
            >
              Complete Profile <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* If 100% Complete: Rewarding, celebratory luxury confirmation */
        <div className="card p-6 sm:p-7 border-emerald-500/40 bg-gradient-to-r from-[#0a1a12] via-[#0d1c16] to-[#121212] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <CircularProgress
                percentage={100}
                size={94}
                strokeWidth={8}
              />
              <div>
                <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase block mb-1">
                  100% Calibrated · Fashion Profile Active
                </span>
                <h2 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
                  Your Style Profile is Complete ✓
                </h2>
                <p className="text-sm text-stone-300 mt-1 max-w-xl">
                  Your fashion profile is fully calibrated. The Make Me Ready AI styling engine is now delivering tailored outfit recommendations tailored specifically to your measurements, body shape, and aesthetic preferences.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-medium flex items-center gap-1.5">
                    <Check size={12} className="stroke-[3]" /> AI Recommendations Active
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-line text-stone-300">
                    Sizes: {shirtSize ? `Size ${shirtSize} Shirt` : "Not provided"} · {pantsSize ? `Waist ${pantsSize} Pants` : "Not provided"} · {shoeSize ? `${shoeSize} Shoe` : "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTab("Personal Information")}
              className="btn-s h-11 px-6 text-sm border-emerald-500/50 text-emerald-400 hover:border-emerald-400 shrink-0 self-start md:self-center"
            >
              <Pencil size={14} /> Update Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── Profile Navigation Tabs (Requirement 5) ── */}
      <div>
        <Tabs
          items={[
            "Overview",
            "Personal Information",
            "Style Preferences",
            "Measurements & Sizes",
            "Wardrobe",
            "Addresses",
            "Security",
          ]}
          icons={[
            "LayoutDashboard",
            "User",
            "Sparkles",
            "Ruler",
            "Shirt",
            "MapPin",
            "ShieldCheck",
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: OVERVIEW */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Overview" && (
        <div className="space-y-8 animate-up">
          {/* Quick Summary Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* 1. Personal & Appearance Card */}
            <Card
              title="Personal & Appearance"
              subtitle="Basic details & body type"
              onEdit={() => setTab("Personal Information")}
            >
              <Row label="Full Name" value={name} />
              <Row label="Email" value={user?.email} />
              <Row label="Phone" value={phone ? "+91 " + phone : undefined} />
              <Row label="Gender" value={gender} />
              <Row label="Date of Birth" value={dob} />
              <Row label="Height" value={height ? `${height} cm` : undefined} />
              <Row label="Weight" value={weight ? `${weight} kg` : undefined} isOptional />
              <Row label="Body Type" value={bodyType} />
              <Row label="City / Location" value={city} isOptional />
            </Card>

            {/* 2. Measurements & Sizes Card */}
            <Card
              title="Measurements & Sizes"
              subtitle="Your fit calibration"
              onEdit={() => setTab("Measurements & Sizes")}
            >
              <Row label="Shirt / T-Shirt" value={shirtSize ? `Size ${shirtSize}` : undefined} />
              <Row label="Pants / Trousers" value={pantsSize ? `Waist ${pantsSize}` : undefined} />
              <Row label="Shoe Size" value={shoeSize ? shoeSize : undefined} />
              <Row label="Fit Preference" value={fitPreference || user?.fitPreference} isOptional />
              <Row label="Other Notes" value={otherMeasurements} isOptional />
            </Card>

            {/* 3. Style Preferences Card */}
            <Card
              title="Style Preferences"
              subtitle="Colors, styles & brands"
              onEdit={() => setTab("Style Preferences")}
            >
              <div className="space-y-4 text-sm pt-1">
                <div>
                  <div className="text-xs text-mute mb-2">Preferred Styles</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStyles.length > 0 ? (
                      selectedStyles.map((s) => <Tag key={s} text={s} />)
                    ) : (
                      <span className="text-xs text-stone-500 italic">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-mute mb-2">Preferred Colors</div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedColors.length > 0 ? (
                      selectedColors.map((colorName) => (
                        <span
                          key={colorName}
                          title={colorName}
                          className="w-7 h-7 rounded-full border border-line2 inline-block shadow-sm"
                          style={{ background: colorMap[colorName] || "#888" }}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-stone-500 italic">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-mute mb-2">Favourite Brands</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBrands.length > 0 ? (
                      selectedBrands.map((b) => <Tag key={b} text={b} />)
                    ) : (
                      <span className="text-xs text-stone-500 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Wardrobe Summary Section across categories (Requirement) */}
          <Section
            title="My Wardrobe Summary"
            sub={`${(added || []).length} luxury pieces in your personal closet`}
            to="/wardrobe"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {wardrobeSummary.map((item) => (
                <Link
                  to="/wardrobe"
                  key={item.cat}
                  className="group relative aspect-[3/3.8] rounded-2xl overflow-hidden border border-line hover:border-acc/60 hover:-translate-y-1 transition duration-300"
                >
                  <img
                    src={item.img}
                    alt={item.cat}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                  <div className="absolute bottom-0 p-3 w-full">
                    <div className="font-serif font-semibold text-sm text-white">
                      {item.cat}
                    </div>
                    <div className="text-[11px] text-acc">{item.count} items</div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          {/* Recent Activity + Favorite Looks */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card
              title="Recent Styling Activity"
              subtitle="Latest looks & wardrobe additions"
              right={
                <Link to="/saved-looks" className="text-xs text-acc hover:underline">
                  View All →
                </Link>
              }
            >
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/[.02] transition border-b border-line last:border-0"
                    >
                      <img
                        src={act.img}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-line"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {act.title}
                        </div>
                        <div className="text-xs text-stone-400 truncate">{act.sub}</div>
                      </div>
                      <span className="text-xs text-stone-500 shrink-0">{act.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-stone-400 space-y-2">
                  <Sparkles size={24} className="mx-auto text-amber-500/30" />
                  <p className="font-medium text-stone-300">No recent styling activity</p>
                  <p className="text-stone-500 max-w-xs mx-auto">
                    Generate an outfit in Create Outfit or add pieces to your wardrobe to see your activity timeline.
                  </p>
                </div>
              )}
            </Card>

            <Card
              title="Account & Security Snapshot"
              subtitle="Authentication status"
              onEdit={() => setTab("Security")}
              editLabel="Manage"
            >
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[.02] border border-line flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Password Protected
                      </div>
                      <div className="text-xs text-stone-400">
                        Secure bcrypt encrypted password
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[.02] border border-line flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-acc/10 text-acc">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Saved Shipping Addresses
                      </div>
                      <div className="text-xs text-stone-400">
                        {addresses.length} saved destination{addresses.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("Addresses")}
                    className="text-xs text-acc hover:underline font-medium"
                  >
                    View →
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: PERSONAL INFORMATION */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Personal Information" && (
        <div className="card p-6 sm:p-8 animate-up max-w-3xl mx-auto">
          <div className="border-b border-line pb-4 mb-6">
            <h2 className="font-serif font-bold text-2xl text-white">
              Personal Information
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Update your personal details, physical appearance and body profile.
            </p>
          </div>

          <form onSubmit={handleSavePersonal} className="space-y-5">
            {/* Profile Picture Bar */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[.02] border border-line">
              <img
                src={getUserAvatar(user)}
                alt="Profile avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-acc"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Profile Photo</div>
                <div className="text-xs text-mute mt-0.5">
                  Pick a luxury avatar preset or upload a custom portrait
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoModal(true)}
                className="btn-s h-9 px-4 text-xs border-acc/40 text-acc hover:border-acc"
              >
                Change Photo
              </button>
            </div>

            {/* Full Name & Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium">
                  Full Name <span className="text-red-400">*</span>
                </span>
                <input
                  className="inp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sahil Khot"
                  required
                />
              </label>

              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium">
                  Email Address <span className="text-xs text-stone-500 font-normal">(Account Login)</span>
                </span>
                <input
                  className="inp opacity-70 cursor-not-allowed bg-black/40"
                  value={user?.email || ""}
                  disabled
                  readOnly
                />
              </label>
            </div>

            {/* Phone & Date of Birth */}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium">
                  Phone Number
                </span>
                <input
                  className="inp"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>

              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium">
                  Date of Birth
                </span>
                <input
                  className="inp"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </label>
            </div>

            {/* Gender */}
            <div>
              <span className="block mb-2 text-white/85 font-medium text-sm">
                Gender
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Male", "Female", "Prefer not to say"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={`h-11 rounded-xl text-xs font-medium border transition ${
                      gender === g
                        ? "bg-acc text-black font-semibold border-acc shadow-md shadow-amber-500/20"
                        : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium flex items-center justify-between">
                  <span>Height (cm)</span>
                  <span className="text-xs text-acc font-normal">Required for calibration</span>
                </span>
                <input
                  className="inp"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 178"
                />
              </label>

              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium flex items-center justify-between">
                  <span>Weight (kg)</span>
                  <span className="text-xs text-stone-500 font-normal">(Optional)</span>
                </span>
                <input
                  className="inp"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 72"
                />
              </label>
            </div>

            {/* Body Type */}
            <div>
              <span className="block mb-2 text-white/85 font-medium text-sm flex items-center justify-between">
                <span>Body Type</span>
                <span className="text-xs text-acc font-normal">Required for fit</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BODY_TYPES.map((bt) => (
                  <button
                    type="button"
                    key={bt}
                    onClick={() => setBodyType(bt)}
                    className={`h-10 rounded-xl text-xs font-medium border transition ${
                      bodyType === bt
                        ? "bg-acc text-black font-semibold border-acc shadow-md shadow-amber-500/20"
                        : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {/* City & Tagline */}
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium flex items-center justify-between">
                  <span>City / Location</span>
                  <span className="text-xs text-stone-500 font-normal">(Optional)</span>
                </span>
                <input
                  className="inp"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, India"
                />
              </label>

              <label className="block text-sm">
                <span className="block mb-1.5 text-white/85 font-medium flex items-center justify-between">
                  <span>Personal Style Tagline</span>
                  <span className="text-xs text-stone-500 font-normal">(Optional)</span>
                </span>
                <input
                  className="inp"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Better Outfits. Brighter You."
                />
              </label>
            </div>

            {personalError && (
              <p role="alert" className="text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={15} /> {personalError}
              </p>
            )}

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={personalSaving}
                className="btn-p h-12 px-8 font-semibold text-black shadow-lg shadow-amber-500/20 disabled:opacity-60"
              >
                {personalSaving ? "Saving…" : "Save Personal Information"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: STYLE PREFERENCES */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Style Preferences" && (
        <div className="card p-6 sm:p-8 animate-up max-w-3xl mx-auto space-y-7">
          <div className="border-b border-line pb-4">
            <h2 className="font-serif font-bold text-2xl text-white">
              Style & Fashion Preferences
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select the colors, aesthetics and brands that define your personal fashion identity.
            </p>
          </div>

          <form onSubmit={handleSaveStyles} className="space-y-6">
            {/* 1. Favourite Colors */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-semibold text-white">
                  Favourite Colors <span className="text-acc">*</span>
                </span>
                <span className="text-xs text-stone-400">
                  {selectedColors.length} selected
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {(colors || defaultColorList).map(([name, hex]) => {
                  const isChecked = selectedColors.includes(name);
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => {
                        setSelectedColors((prev) =>
                          isChecked
                            ? prev.filter((c) => c !== name)
                            : [...prev, name]
                        );
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition ${
                        isChecked
                          ? "border-acc bg-amber-500/10 text-white"
                          : "border-line bg-white/[.02] text-stone-400 hover:text-white"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-line2 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: hex }}
                      >
                        {isChecked && (
                          <Check
                            size={12}
                            className={hex === "#000000" ? "text-white" : "text-black"}
                          />
                        )}
                      </span>
                      <span className="text-xs truncate">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Preferred Styles */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-semibold text-white">
                  Preferred Styles <span className="text-acc">*</span>
                </span>
                <span className="text-xs text-stone-400">
                  {selectedStyles.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Casual",
                  "Formal",
                  "Streetwear",
                  "Traditional",
                  "Minimal",
                  "Sporty",
                  "Trendy",
                  "Old Money",
                  "Vintage",
                  "Party",
                ].map((st) => {
                  const isSelected = selectedStyles.includes(st);
                  return (
                    <button
                      type="button"
                      key={st}
                      onClick={() => {
                        setSelectedStyles((prev) =>
                          isSelected
                            ? prev.filter((s) => s !== st)
                            : [...prev, st]
                        );
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                        isSelected
                          ? "bg-acc text-black font-semibold border-acc shadow-md shadow-amber-500/20"
                          : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                      }`}
                    >
                      {st} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Favourite Brands (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Favourite Brands <span className="text-xs text-stone-500 font-normal">(Optional)</span>
                </span>
                <span className="text-xs text-stone-400">
                  {selectedBrands.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "ZARA",
                  "H&M",
                  "NIKE",
                  "adidas",
                  "PUMA",
                  "Tommy Hilfiger",
                  "Massimo Dutti",
                  "Levi's",
                  "Ralph Lauren",
                  "Clarks",
                  "Titan",
                  "Fossil",
                ].map((brand) => {
                  const isBrand = selectedBrands.includes(brand);
                  return (
                    <button
                      type="button"
                      key={brand}
                      onClick={() => {
                        setSelectedBrands((prev) =>
                          isBrand
                            ? prev.filter((b) => b !== brand)
                            : [...prev, brand]
                        );
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                        isBrand
                          ? "bg-white text-black font-semibold border-white"
                          : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
              {/* Add custom brand */}
              <div className="flex gap-2">
                <input
                  className="inp h-9 text-xs"
                  placeholder="Add another brand (e.g. Gucci, Uniqlo)"
                  value={newBrandInput}
                  onChange={(e) => setNewBrandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newBrandInput.trim() && !selectedBrands.includes(newBrandInput.trim())) {
                        setSelectedBrands([...selectedBrands, newBrandInput.trim()]);
                        setNewBrandInput("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newBrandInput.trim() && !selectedBrands.includes(newBrandInput.trim())) {
                      setSelectedBrands([...selectedBrands, newBrandInput.trim()]);
                      setNewBrandInput("");
                    }
                  }}
                  className="btn-s h-9 px-4 text-xs shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* 4. Preferred Occasions (Optional) */}
            <div>
              <span className="block mb-2 text-white font-semibold text-sm flex items-center justify-between">
                <span>Preferred Occasions</span>
                <span className="text-xs text-stone-500 font-normal">(Optional)</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "College",
                  "Office / Work",
                  "Party",
                  "Date Night",
                  "Wedding",
                  "Travel",
                  "Gym / Athletic",
                  "Brunch",
                  "Festive",
                ].map((occ) => {
                  const isOcc = selectedOccasions.includes(occ);
                  return (
                    <button
                      type="button"
                      key={occ}
                      onClick={() => {
                        setSelectedOccasions((prev) =>
                          isOcc ? prev.filter((o) => o !== occ) : [...prev, occ]
                        );
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs border transition ${
                        isOcc
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : "bg-white/[.02] border-line text-stone-400 hover:text-white"
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Additional Fashion Notes (Optional) */}
            <div>
              <span className="block mb-1.5 text-white font-semibold text-sm flex items-center justify-between">
                <span>Other Fashion Preferences</span>
                <span className="text-xs text-stone-500 font-normal">(Optional)</span>
              </span>
              <textarea
                className="inp h-24 py-2.5 text-sm resize-none"
                placeholder="e.g. I prefer relaxed fits, natural fabrics like linen and cotton, and minimal patterns."
                value={fashionNotes}
                onChange={(e) => setFashionNotes(e.target.value)}
              />
            </div>

            {stylesError && (
              <p role="alert" className="text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={15} /> {stylesError}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={stylesSaving}
                className="btn-p h-12 px-8 font-semibold text-black shadow-lg shadow-amber-500/20 disabled:opacity-60"
              >
                {stylesSaving ? "Saving…" : "Save Style Preferences"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: MEASUREMENTS & SIZES */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Measurements & Sizes" && (
        <div className="card p-6 sm:p-8 animate-up max-w-3xl mx-auto space-y-7">
          <div className="border-b border-line pb-4">
            <h2 className="font-serif font-bold text-2xl text-white">
              Measurements & Sizes
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select your standard clothing sizes for seamless shopping and accurate outfit tailoring.
            </p>
          </div>

          <form onSubmit={handleSaveMeasurements} className="space-y-6">
            {/* Shirt / T-Shirt Size */}
            <div>
              <span className="block mb-2.5 text-white font-semibold text-sm flex items-center justify-between">
                <span>Shirt & T-Shirt Size <span className="text-acc">*</span></span>
                <span className="text-xs text-acc">Selected: {shirtSize || "None"}</span>
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SHIRT_SIZES.map((sz) => (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => setShirtSize(sz)}
                    className={`h-12 rounded-xl text-xs font-bold border transition ${
                      shirtSize === sz
                        ? "bg-acc text-black border-acc shadow-md shadow-amber-500/20"
                        : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Pants / Trousers Size */}
            <div>
              <span className="block mb-2.5 text-white font-semibold text-sm flex items-center justify-between">
                <span>Pants & Trousers Waist Size <span className="text-acc">*</span></span>
                <span className="text-xs text-acc">Selected: {pantsSize ? `${pantsSize} in` : "None"}</span>
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {PANTS_SIZES.map((sz) => (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => setPantsSize(sz)}
                    className={`h-12 rounded-xl text-xs font-bold border transition ${
                      pantsSize === sz
                        ? "bg-acc text-black border-acc shadow-md shadow-amber-500/20"
                        : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                    }`}
                  >
                    {sz}″
                  </button>
                ))}
              </div>
            </div>

            {/* Shoe Size */}
            <div>
              <span className="block mb-2.5 text-white font-semibold text-sm flex items-center justify-between">
                <span>Shoe Size <span className="text-acc">*</span></span>
                <span className="text-xs text-acc">Selected: {shoeSize || "None"}</span>
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {SHOE_SIZES.map((sz) => (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => setShoeSize(sz)}
                    className={`h-12 rounded-xl text-xs font-bold border transition ${
                      shoeSize === sz
                        ? "bg-acc text-black border-acc shadow-md shadow-amber-500/20"
                        : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Preference */}
            <div>
              <span className="block mb-2 text-white font-semibold text-sm flex items-center justify-between">
                <span>Fit Preference</span>
                <span className="text-xs text-acc">Selected: {fitPreference || "Not provided"}</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {FIT_PREFERENCES.map((fp) => (
                  <button
                    type="button"
                    key={fp}
                    onClick={() => setFitPreference(fitPreference === fp ? "" : fp)}
                    className={`h-11 rounded-xl text-xs font-semibold border transition ${
                      fitPreference === fp
                        ? "bg-acc text-black border-acc shadow-md shadow-amber-500/20"
                        : "bg-white/[.02] border-line text-stone-300 hover:text-white"
                    }`}
                  >
                    {fp}
                  </button>
                ))}
              </div>
            </div>

            {/* Other useful measurements (Optional) */}
            <div>
              <span className="block mb-1.5 text-white font-semibold text-sm flex items-center justify-between">
                <span>Other Measurements & Fit Notes</span>
                <span className="text-xs text-stone-500 font-normal">(Optional)</span>
              </span>
              <textarea
                className="inp h-24 py-2.5 text-sm resize-none"
                placeholder="e.g. Chest 40 inches, Inseam 32 inches, Shoulder 18 inches, prefer slim tapered leg openings."
                value={otherMeasurements}
                onChange={(e) => setOtherMeasurements(e.target.value)}
              />
            </div>

            {measurementsError && (
              <p role="alert" className="text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={15} /> {measurementsError}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={measurementsSaving}
                className="btn-p h-12 px-8 font-semibold text-black shadow-lg shadow-amber-500/20 disabled:opacity-60"
              >
                {measurementsSaving ? "Saving…" : "Save Measurements"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 5: WARDROBE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Wardrobe" && (
        <div className="card p-6 sm:p-8 animate-up space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-white">
                Wardrobe Categories
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Your luxury items organized across your personal closet ({added.length} {added.length === 1 ? "item" : "items"} total).
              </p>
            </div>
            <Link to="/wardrobe" className="btn-p h-10 px-5 text-xs font-semibold text-black">
              Open Full Wardrobe Studio →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {wardrobeSummary.map((item) => (
              <Link
                to="/wardrobe"
                key={item.cat}
                className="group card overflow-hidden border border-line hover:border-acc/70 transition duration-300"
              >
                <div className="aspect-[4/4.5] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.cat}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-3 text-center bg-black/40">
                  <div className="font-serif font-semibold text-sm text-white">
                    {item.cat}
                  </div>
                  <div className="text-xs text-acc mt-0.5">{item.count} items</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white/[.02] border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-acc/10 text-acc shrink-0">
                <Shirt size={20} />
              </span>
              <div>
                <div className="font-semibold text-white text-sm">
                  Looking to add new clothes or shoes?
                </div>
                <div className="text-xs text-stone-400">
                  Upload custom photos from your camera or select from our catalog.
                </div>
              </div>
            </div>
            <Link to="/wardrobe" className="btn-s h-10 px-5 text-xs border-acc/40 text-acc hover:border-acc">
              Manage Wardrobe
            </Link>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 6: ADDRESSES */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Addresses" && (
        <div className="card p-6 sm:p-8 animate-up max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-white">
                Saved Delivery Addresses
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Manage your home, office and vacation delivery locations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddressModal(true)}
              className="btn-p h-10 px-4 text-xs font-semibold text-black flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-white/[.02] border border-line text-stone-400">
              <MapPin size={32} className="mx-auto mb-2 text-stone-500" />
              <p className="text-sm font-medium text-white">No saved addresses yet</p>
              <p className="text-xs text-mute mt-1">
                Add an address for one-click checkout and local fashion suggestions.
              </p>
              <button
                type="button"
                onClick={() => setAddressModal(true)}
                className="btn-s mt-4 h-9 px-5 text-xs border-acc/40 text-acc"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="card p-5 border border-line hover:border-acc/40 transition relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white/10 font-semibold text-white">
                      {addr.label || "Home"}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-200 mt-2 font-medium">
                    {addr.street}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{addr.country}</p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-line text-xs">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-acc hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-400 hover:text-red-300 ml-auto flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 7: SECURITY */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {tab === "Security" && (
        <div className="card p-6 sm:p-8 animate-up max-w-2xl mx-auto space-y-6">
          <div className="border-b border-line pb-4">
            <h2 className="font-serif font-bold text-2xl text-white">
              Security & Credentials
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Manage your password, account verification and active sessions.
            </p>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock size={16} className="text-acc" /> Change Password
            </h3>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Current Password</span>
              <input
                type="password"
                className="inp"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">New Password (min 8 characters)</span>
              <input
                type="password"
                className="inp"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new strong password"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Confirm New Password</span>
              <input
                type="password"
                className="inp"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </label>

            {pwError && (
              <p role="alert" className="text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={15} /> {pwError}
              </p>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              className="btn-p h-11 px-6 text-sm font-semibold text-black shadow-md shadow-amber-500/20 disabled:opacity-60"
            >
              {pwSaving ? "Updating…" : "Update Password"}
            </button>
          </form>

          {/* Active Session & Logout */}
          <div className="pt-5 border-t border-line space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[.02] border border-line">
              <div>
                <div className="text-sm font-semibold text-white">Current Session</div>
                <div className="text-xs text-stone-400">
                  Signed in on Windows Desktop · Make Me Ready App
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                Active Now
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-stone-500">
                Need to switch accounts?
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/auth");
                }}
                className="text-xs text-red-400 hover:text-red-300 font-semibold hover:underline"
              >
                Log Out of Make Me Ready
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ADD ADDRESS MODAL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Modal
        open={addressModal}
        onClose={() => setAddressModal(false)}
        title="Add New Address"
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Address Label</span>
            <select
              className="inp"
              value={addressForm.label}
              onChange={(e) =>
                setAddressForm({ ...addressForm, label: e.target.value })
              }
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Studio">Studio</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="block mb-1 text-white/80">Street Address *</span>
            <input
              className="inp"
              placeholder="House/Flat No., Building, Street Area"
              value={addressForm.street}
              onChange={(e) =>
                setAddressForm({ ...addressForm, street: e.target.value })
              }
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block mb-1 text-white/80">City *</span>
              <input
                className="inp"
                placeholder="Mumbai"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                required
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">State</span>
              <input
                className="inp"
                placeholder="Maharashtra"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Pincode *</span>
              <input
                className="inp"
                placeholder="400001"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                required
              />
            </label>

            <label className="block text-sm">
              <span className="block mb-1 text-white/80">Country</span>
              <input
                className="inp"
                value={addressForm.country}
                disabled
                readOnly
              />
            </label>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-stone-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="w-4 h-4 rounded accent-orange-400"
            />
            Make this my default shipping address
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAddressModal(false)}
              className="btn-s flex-1 h-11"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addressSaving}
              className="btn-p flex-1 h-11 text-black font-semibold disabled:opacity-60"
            >
              {addressSaving ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PHOTO UPLOAD & PRESET PICKER MODAL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <Modal
        open={photoModal}
        onClose={() => setPhotoModal(false)}
        title="Set Profile Photo"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={getUserAvatar(user)}
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
              Upload a custom portrait or choose from our curated style avatars.
            </p>
          </div>

          <div>
            <button
              type="button"
              disabled={uploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="btn-p w-full h-12 flex items-center justify-center gap-2 font-semibold text-black"
            >
              <Camera size={18} />
              Upload Photo from Device
            </button>
          </div>

          <div>
            <div className="text-xs text-mute font-medium mb-3 text-center">
              Or pick a luxury style avatar:
            </div>
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
