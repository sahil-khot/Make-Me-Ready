import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
  Shirt, CalendarCheck, Briefcase, Heart, ShoppingBag,
  Sparkles, Check, Zap,
} from "lucide-react";
import { Logo } from "../ui.jsx";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components — defined at MODULE LEVEL so React never remounts them
// on re-render. Defining them inside a function component would cause React to
// treat them as brand-new component types on every render, which unmounts the
// input and loses focus after each keystroke.
// ─────────────────────────────────────────────────────────────────────────────

const Pw = ({ id, ph, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
      <input
        id={id}
        aria-label={ph}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={ph}
        className="inp pl-11 pr-11"
        autoComplete="current-password"
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-mute hover:text-white transition"
      >
        {show ? <Eye size={17} /> : <EyeOff size={17} />}
      </button>
    </div>
  );
};

const Err = ({ m }) =>
  m ? <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">{m}</p> : null;

const Feat = ({ i: I, t, s }) => (
  <div className="flex items-center gap-4">
    <span className="grid place-items-center w-12 h-12 shrink-0 rounded-full border border-acc/40 bg-acc/10 text-acc">
      <I size={20} />
    </span>
    <div>
      <div className="font-serif font-semibold leading-tight">{t}</div>
      {s && <div className="text-xs text-mute mt-0.5">{s}</div>}
    </div>
  </div>
);

/** Section header inside Register form — MUST be at module level to keep focus */
const FormSection = ({ icon: I, title }) => (
  <h3 className="font-serif font-semibold flex items-center gap-2.5 mt-7 mb-4 text-white/90">
    <I size={18} className="text-acc" />
    {title}
  </h3>
);

/** Form field label wrapper — MUST be at module level to keep focus */
const FormField = ({ label, children, err }) => (
  <label className="block text-sm">
    <span className="block mb-2 text-white/85 font-medium">{label}</span>
    {children}
    <Err m={err} />
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// Login Form
// ─────────────────────────────────────────────────────────────────────────────

// Quick-login credentials for fast dev/demo access
const QUICK_CREDENTIALS = { email: "alex@makemeready.in", password: "Alex@123" };

function Login() {
  const nv = useNavigate();
  const { login, quickLogin: storeQuickLogin } = useStore();
  const [f, setF] = useState({ email: "", pw: "" });
  const [e, setE] = useState({});
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  // Use functional state update to avoid stale closure on fast typing
  const setEmail = useCallback((ev) => setF((p) => ({ ...p, email: ev.target.value })), []);
  const setPw    = useCallback((ev) => setF((p) => ({ ...p, pw:    ev.target.value })), []);

  const doLogin = async (credentials) => {
    try {
      await login(credentials);
      nv("/home");
    } catch (err) {
      setE({ form: err.message });
    }
  };

  const go = async (ev) => {
    ev.preventDefault();
    const x = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Enter a valid email address";
    if (!f.pw) x.pw = "Enter your password";
    setE(x);
    if (!Object.keys(x).length) {
      setLoading(true);
      await doLogin({ email: f.email, password: f.pw });
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setE({});
    setQuickLoading(true);
    setF({ email: QUICK_CREDENTIALS.email, pw: QUICK_CREDENTIALS.password });
    try {
      if (typeof storeQuickLogin === "function") {
        await storeQuickLogin();
      } else {
        await login(QUICK_CREDENTIALS);
      }
      nv("/home");
    } catch (err) {
      setE({ form: err.message || "Failed to log in" });
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <form onSubmit={go} noValidate className="space-y-4">
      {/* Tab toggle */}
      <div className="flex p-1 rounded-xl border border-line2 bg-white/[.02]">
        <span className="flex-1 h-11 grid place-items-center rounded-lg bg-acc text-black text-sm font-medium">
          Login
        </span>
        <Link
          to="/register"
          className="flex-1 h-11 grid place-items-center text-sm text-mute hover:text-white transition"
        >
          Sign Up
        </Link>
      </div>

      {/* ⚡ Quick Login Banner */}
      <button
        type="button"
        onClick={handleQuickLogin}
        disabled={quickLoading}
        className="w-full flex items-center justify-between gap-3 px-4 h-12 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500/70 transition group disabled:opacity-60"
      >
        <span className="flex items-center gap-2.5">
          <Zap size={16} className="text-amber-400 group-hover:text-amber-300" fill="currentColor" />
          <span className="text-sm font-medium text-amber-300">
            {quickLoading ? "Logging in…" : "Quick Login"}
          </span>
          <span className="text-xs text-amber-500/70 hidden sm:inline">— jump straight in</span>
        </span>
        <ArrowRight size={14} className="text-amber-500/60 group-hover:text-amber-400 transition" />
      </button>

      {/* Email */}
      <div>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input
            id="login-email"
            aria-label="Email"
            type="email"
            value={f.email}
            onChange={setEmail}
            placeholder="Enter your email"
            className="inp pl-11"
            autoComplete="email"
            autoFocus
          />
        </div>
        <Err m={e.email} />
      </div>

      {/* Password */}
      <div>
        <Pw id="login-pw" ph="Enter your password" value={f.pw} onChange={setPw} />
        <Err m={e.pw} />
      </div>

      {/* Remember / Forgot */}
      <div className="flex justify-between text-sm items-center">
        <label className="flex items-center gap-2 text-mute cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-orange-400 w-4 h-4 rounded" />
          Remember me
        </label>
        <button type="button" className="text-acc font-medium hover:underline">
          Forgot password?
        </button>
      </div>

      {e.form && <Err m={e.form} />}

      <button
        className="btn-p w-full h-12 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in…" : <>Login <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Register Form
// ─────────────────────────────────────────────────────────────────────────────
function Register() {
  const nv = useNavigate();
  const { register } = useStore();

  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    pw: "",
    gender: "Male",
    dob: "",
  });
  const [e, setE] = useState({});
  const [loading, setLoading] = useState(false);

  // Stable onChange handlers — avoids stale closure issues on fast typing
  const set = useCallback(
    (k) => (ev) => setF((prev) => ({ ...prev, [k]: ev.target.value })),
    [],
  );

  const go = async (ev) => {
    ev.preventDefault();
    const x = {};
    if (!f.name.trim())                          x.name  = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email))        x.email = "Enter a valid email address";
    if (f.phone.replace(/\D/g, "").length < 10) x.phone = "Enter a valid 10-digit phone number";
    if (f.pw.length < 8)                         x.pw    = "Password must be at least 8 characters";
    if (!f.dob)                                  x.dob   = "Date of birth is required";
    setE(x);

    if (!Object.keys(x).length) {
      setLoading(true);
      try {
        await register({
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          password: f.pw,
          gender: f.gender,
          dob: f.dob,
        });
        // Direct the user to complete their Style Profile
        nv("/profile");
      } catch (err) {
        setE({ form: err.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={go} noValidate className="space-y-5">
      {/* Tab toggle */}
      <div className="flex p-1 rounded-xl border border-line2 bg-white/[.02] mb-6">
        <Link
          to="/auth"
          className="flex-1 py-2 text-center text-sm font-medium rounded-lg text-mute hover:text-white transition"
        >
          Sign In
        </Link>
        <div className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-acc text-black font-semibold shadow-md">
          Create Account
        </div>
      </div>

      <div className="mb-2">
        <h2 className="font-serif font-bold text-2xl text-white">Create Your Account</h2>
        <p className="text-xs text-stone-400 mt-1">
          Sign up with your basic details. You can complete your measurements and style preferences anytime in your Profile.
        </p>
      </div>

      {/* ── 1. Full Name ── */}
      <FormField label="Full Name" err={e.name}>
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input
            id="reg-name"
            className="inp pl-11"
            value={f.name}
            onChange={set("name")}
            placeholder="e.g. Sahil Khot"
            autoFocus
            autoComplete="name"
          />
        </div>
      </FormField>

      {/* ── 2. Email Address ── */}
      <FormField label="Email Address" err={e.email}>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input
            id="reg-email"
            type="email"
            className="inp pl-11"
            value={f.email}
            onChange={set("email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </FormField>

      {/* ── 3. Phone Number ── */}
      <FormField label="Phone Number" err={e.phone}>
        <div className="flex gap-2.5">
          <span className="inp w-16 grid place-items-center text-mute shrink-0 text-sm font-medium">+91</span>
          <div className="relative flex-1">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
            <input
              id="reg-phone"
              type="tel"
              className="inp pl-11 w-full"
              value={f.phone}
              onChange={set("phone")}
              placeholder="9876543210"
              autoComplete="tel"
            />
          </div>
        </div>
      </FormField>

      {/* ── 4. Password ── */}
      <FormField label="Password" err={e.pw}>
        <Pw id="reg-pw" ph="Create a password (min. 8 characters)" value={f.pw} onChange={set("pw")} />
      </FormField>

      {/* ── 5. Gender & 6. Date of Birth ── */}
      <div className="grid sm:grid-cols-2 gap-4 pt-1">
        <div>
          <span className="block mb-2 text-white/85 font-medium text-sm">Gender</span>
          <div className="grid grid-cols-3 gap-1.5">
            {["Male", "Female", "Prefer not to say"].map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setF((p) => ({ ...p, gender: g }))}
                className={`chip justify-center px-1.5 text-[11px] h-10 ${f.gender === g ? "chip-on font-semibold" : ""}`}
              >
                {g === "Prefer not to say" ? "Other" : g}
              </button>
            ))}
          </div>
        </div>

        <FormField label="Date of Birth" err={e.dob}>
          <input
            id="reg-dob"
            type="date"
            className="inp h-10"
            value={f.dob}
            onChange={set("dob")}
          />
        </FormField>
      </div>

      {e.form && <div className="mt-2"><Err m={e.form} /></div>}

      <button
        type="submit"
        className="btn-p w-full h-12 mt-4 font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Creating Account…" : <>Create Account <ArrowRight size={16} /></>}
      </button>

      <p className="text-center text-xs text-mute mt-4">
        Already have an account?{" "}
        <Link to="/auth" className="text-acc font-semibold hover:underline">
          Sign In
        </Link>
      </p>

      <p className="text-center text-[11px] text-stone-500 mt-2">
        By creating an account, you agree to Make Me Ready's{" "}
        <span className="text-stone-400 cursor-pointer hover:underline">Terms</span> and{" "}
        <span className="text-stone-400 cursor-pointer hover:underline">Privacy Policy</span>.
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth page wrapper
// ─────────────────────────────────────────────────────────────────────────────
export default function Auth({ mode }) {
  const reg = mode === "register";
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,.9fr)_1fr]">
      {/* Left panel — decorative hero image */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
        <img
          src={
            reg
              ? (IMG["auth-signup"] || "/BackGround Images/Create Account BG.png")
              : (IMG["auth-login"] || "/BackGround Images/Login BG.png")
          }
          alt="Fashion hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />

        <div className="relative">
          <Logo size={52} big />
        </div>

        <div className="relative max-w-lg">
          <div className="text-xs tracking-[.3em] text-acc leading-7 mb-4">
            {reg ? (
              <>STYLE THAT<br />COMPLETES YOU.</>
            ) : (
              <>STYLE THAT<br />COMPLETES YOU.</>
            )}
          </div>
          <h1 className="font-serif font-semibold text-6xl leading-[1.05]">
            {reg ? (
              <>Better<br />Outfits.<br /><span className="text-acc">Brighter You.</span></>
            ) : (
              <>Outfits for{" "}<span className="text-acc block">Every Occasion.</span></>
            )}
          </h1>
          <p className="text-mute mt-5 max-w-sm">
            {reg
              ? "Create your account and start building a smarter, more stylish wardrobe."
              : "Organize your wardrobe, get personalized outfit recommendations and be ready for every moment."}
          </p>
          <div className="space-y-5 mt-8">
            {reg ? (
              <>
                <Feat i={Shirt}        t="Personalized Outfit Recommendations" />
                <Feat i={CalendarCheck} t="Looks For Every Occasion" />
                <Feat i={Briefcase}    t="Organize Your Wardrobe" />
                <Feat i={Heart}        t="Style That Truly Fits You" />
              </>
            ) : (
              <>
                <Feat i={Shirt}        t="AI-Powered Outfit Recommendations"  s="Looks tailored to you" />
                <Feat i={CalendarCheck} t="Outfits for Every Occasion"         s="From casual to wedding" />
                <Feat i={Briefcase}    t="Your Personal Wardrobe"              s="Organize, manage and style" />
                <Feat i={ShoppingBag}  t="Shop What You Need"                  s="Clothes, shoes, accessories & more" />
              </>
            )}
          </div>
        </div>

        <div className="relative">
          {reg ? (
            <div className="font-serif italic text-2xl">
              "Your wardrobe,<br />Your story."
              <i className="block w-10 h-px bg-acc mt-4" />
            </div>
          ) : (
            <div className="flex gap-8">
              {[["10K+", "Happy Users"], ["50+", "Premium Brands"], ["100+", "Occasions Covered"]].map(([a, b]) => (
                <div key={b}>
                  <div className="font-serif text-3xl text-acc">{a}</div>
                  <div className="text-sm text-mute">{b}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="relative p-4 md:p-8 flex flex-col min-h-screen overflow-y-auto">
        <div className="self-end card rounded-full px-5 py-2.5 text-sm shrink-0">
          <span className="text-mute">
            {reg ? "Already have an account? " : "Need an account? "}
          </span>
          <Link to={reg ? "/login" : "/register"} className="text-acc font-medium hover:underline">
            {reg ? "Login" : "Sign Up"} →
          </Link>
        </div>

        <div className="m-auto w-full max-w-[560px] card p-6 md:p-10 bg-card/80 mt-6 mb-6 animate-up">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <Logo text={!reg} big size={reg ? 48 : 56} />
            </div>
            {reg ? (
              <>
                <h1 className="font-serif font-semibold text-3xl mt-3">
                  Create Your <span className="text-acc">Account</span>
                </h1>
                <p className="text-sm text-mute mt-2">
                  Join Make Me Ready and start your style journey.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-serif font-semibold text-3xl mt-3">
                  Welcome <span className="text-acc">Back</span>
                </h1>
                <p className="text-xs tracking-[.3em] text-mute mt-2">
                  STYLE THAT COMPLETES YOU.
                </p>
              </>
            )}
          </div>
          {reg ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  );
}
