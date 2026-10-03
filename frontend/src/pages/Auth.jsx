import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shirt,
  CalendarCheck,
  Briefcase,
  Heart,
  ShoppingBag,
  Sparkles,
  Check,
} from "lucide-react";
import { Logo } from "../ui.jsx";
import { useStore } from "../store.jsx";
const Pw = ({ id, ph, value, onChange }) => {
  const [s, setS] = useState(false);
  return (
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-mute"
      />
      <input
        id={id}
        aria-label={ph}
        type={s ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={ph}
        className="inp pl-11 pr-11"
      />
      <button
        type="button"
        aria-label="Toggle password"
        onClick={() => setS(!s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-mute"
      >
        {s ? <Eye size={17} /> : <EyeOff size={17} />}
      </button>
    </div>
  );
};
const Err = ({ m }) =>
  m ? <p className="text-xs text-red-400 mt-1.5">{m}</p> : null;
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
function Login() {
  const nv = useNavigate();
  const { login } = useStore();
  const [f, setF] = useState({ email: "", pw: "" });
  const [e, setE] = useState({});
  const go = async (ev) => {
    ev.preventDefault();
    const x = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email))
      x.email = "Enter a valid email address";
    if (!f.pw) x.pw = "Enter your password";
    setE(x);
    if (!Object.keys(x).length) {
      try {
        await login({ email: f.email, password: f.pw });
        nv("/home");
      } catch (err) {
        setE({ form: err.message });
      }
    }
  };
  return (
    <form onSubmit={go} noValidate className="space-y-4">
      <div className="flex p-1 rounded-xl border border-line2 bg-white/[.02]">
        <span className="flex-1 h-11 grid place-items-center rounded-lg bg-acc text-black text-sm font-medium">
          Login
        </span>
        <Link
          to="/register"
          className="flex-1 h-11 grid place-items-center text-sm text-mute hover:text-white"
        >
          Sign Up
        </Link>
      </div>
      <div>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-mute"
          />
          <input
            aria-label="Email"
            value={f.email}
            onChange={(x) => setF({ ...f, email: x.target.value })}
            placeholder="Enter your email"
            className="inp pl-11"
          />
        </div>
        <Err m={e.email} />
      </div>
      <div>
        <Pw
          ph="Enter your password"
          value={f.pw}
          onChange={(x) => setF({ ...f, pw: x.target.value })}
        />
        <Err m={e.pw} />
      </div>
      <div className="flex justify-between text-sm">
        <label className="flex items-center gap-2 text-mute">
          <input
            type="checkbox"
            defaultChecked
            className="accent-orange-400 w-4 h-4"
          />
          Remember me
        </label>
        <button type="button" className="text-acc font-medium">
          Forgot password?
        </button>
      </div>
      {e.form && <Err m={e.form} />}
      <button className="btn-p w-full h-12">
        Login <ArrowRight size={16} />
      </button>
      <div className="flex items-center gap-3 text-xs text-mute">
        <i className="flex-1 h-px bg-line2" />
        Or continue with
        <i className="flex-1 h-px bg-line2" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["Google", "Apple", "Phone"].map((s) => (
          <button
            type="button"
            key={s}
            disabled
            title="Social sign-in is not configured yet"
            className="btn-s h-12 rounded-xl text-sm opacity-50 cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}
function Register() {
  const nv = useNavigate();
  const { register, catalog } = useStore();
  const { colors, styles } = catalog;
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    pw: "",
    gender: "Male",
    dob: "",
    height: "",
    weight: "",
    body: "",
  });
  const [cl, setCl] = useState([]);
  const [st, setSt] = useState(["Casual"]);
  const [e, setE] = useState({});
  const set = (k) => (x) => setF({ ...f, [k]: x.target.value });
  const tg = (a, s, v, max) =>
    s(
      a.includes(v)
        ? a.filter((x) => x !== v)
        : max && a.length >= max
          ? a
          : [...a, v],
    );
  const go = async (ev) => {
    ev.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Enter a valid email";
    if (f.phone.replace(/\D/g, "").length < 10)
      x.phone = "Enter a 10-digit phone number";
    if (f.pw.length < 8) x.pw = "Minimum 8 characters";
    if (!f.dob) x.dob = "Required";
    if (!f.height) x.height = "Required";
    setE(x);
    if (!Object.keys(x).length) {
      const { pw, ...profile } = f;
      try {
        await register({ ...profile, password: pw, colors: cl, styles: st });
        nv("/home");
      } catch (err) {
        setE({ form: err.message });
      }
    }
  };
  const H = ({ i: I, t }) => (
    <h3 className="font-serif font-semibold flex items-center gap-2.5 mt-7 mb-4">
      <I size={18} className="text-acc" />
      {t}
    </h3>
  );
  const L = ({ t, children, err }) => (
    <label className="block text-sm">
      <span className="block mb-2 text-white/90">{t}</span>
      {children}
      <Err m={err} />
    </label>
  );
  return (
    <form onSubmit={go} noValidate>
      <div className="flex items-start justify-between max-w-md mx-auto mb-2">
        {["Basic Info", "Preferences", "Complete"].map((t, i) => (
          <div
            key={t}
            className="flex flex-col items-center gap-2 text-xs w-20"
          >
            <span
              className={`grid place-items-center w-8 h-8 rounded-full border ${i == 0 ? "bg-acc text-black border-acc" : "border-line2 text-mute"}`}
            >
              {i + 1}
            </span>
            <span className={i == 0 ? "text-acc" : "text-mute"}>{t}</span>
          </div>
        ))}
      </div>
      <H i={User} t="Personal Information" />
      <div className="space-y-4">
        <L t="Full Name" err={e.name}>
          <input
            className="inp"
            value={f.name}
            onChange={set("name")}
            placeholder="Enter your full name"
          />
        </L>
        <L t="Email Address" err={e.email}>
          <input
            className="inp"
            value={f.email}
            onChange={set("email")}
            placeholder="Enter your email"
          />
        </L>
        <L t="Phone Number" err={e.phone}>
          <div className="flex gap-3">
            <span className="inp w-24 grid place-items-center text-mute">
              +91
            </span>
            <input
              className="inp"
              value={f.phone}
              onChange={set("phone")}
              placeholder="Enter your phone number"
            />
          </div>
        </L>
        <L t="Password" err={e.pw}>
          <Pw ph="Create a password" value={f.pw} onChange={set("pw")} />
        </L>
      </div>
      <H i={Sparkles} t="Profile Details" />
      <div className="text-sm text-mute mb-3">Gender</div>
      <div className="grid grid-cols-3 gap-3">
        {["Male", "Female", "Prefer not to say"].map((g) => (
          <button
            type="button"
            key={g}
            onClick={() => setF({ ...f, gender: g })}
            className={`chip justify-center px-2 ${f.gender === g ? "chip-on" : ""}`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <L t="Date of Birth" err={e.dob}>
          <input
            type="date"
            className="inp"
            value={f.dob}
            onChange={set("dob")}
          />
        </L>
        <L t="Height" err={e.height}>
          <input
            className="inp"
            value={f.height}
            onChange={set("height")}
            placeholder="cm"
          />
        </L>
        <L t="Weight (Optional)">
          <input
            className="inp"
            value={f.weight}
            onChange={set("weight")}
            placeholder="kg"
          />
        </L>
        <L t="Body Type (Optional)">
          <select className="inp" value={f.body} onChange={set("body")}>
            <option value="">Select</option>
            {["Slim", "Athletic", "Average", "Broad"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </L>
      </div>
      <H i={Heart} t="Style Preferences" />
      <div className="text-sm mb-3">
        Favourite Colors <span className="text-mute">(Select up to 5)</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map(([n, c]) => (
          <button
            type="button"
            key={n}
            aria-label={n}
            aria-pressed={cl.includes(n)}
            onClick={() => tg(cl, setCl, n, 5)}
            className={`w-9 h-9 rounded-full grid place-items-center border-2 transition hover:scale-110 ${cl.includes(n) ? "border-acc shadow-[0_0_14px_rgba(255,159,47,.5)]" : "border-line2"}`}
            style={{ background: c }}
          >
            {cl.includes(n) && (
              <Check
                size={14}
                className={
                  n == "White" || n == "Beige" ? "text-black" : "text-white"
                }
              />
            )}
          </button>
        ))}
      </div>
      <div className="text-sm mt-6 mb-3">
        Preferred Clothing Styles{" "}
        <span className="text-mute">(Select multiple)</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {styles.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => tg(st, setSt, s)}
            className={`chip ${st.includes(s) ? "chip-on" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
      {e.form && <Err m={e.form} />}
      <button className="btn-p w-full h-12 mt-8">
        Continue <ArrowRight size={16} />
      </button>
      <p className="text-center text-xs text-mute mt-5">
        By creating an account, you agree to our{" "}
        <span className="text-acc">Terms of Service</span> and{" "}
        <span className="text-acc">Privacy Policy</span>.
      </p>
    </form>
  );
}
export default function Auth({ mode }) {
  const reg = mode === "register";
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,.9fr)_1fr]">
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
        <img
          src={reg ? "/img/auth-signup.jpg" : "/img/auth-login.jpg"}
          alt="Luxury wardrobe"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-lg">
          <div className="text-xs tracking-[.3em] text-acc leading-7 mb-4">
            {reg ? (
              <>
                YOUR PERSONAL
                <br />
                STYLE ASSISTANT
              </>
            ) : (
              <>
                YOUR WARDROBE.
                <br />
                OUR INTELLIGENCE.
                <br />A BETTER YOU.
              </>
            )}
          </div>
          <h1 className="font-serif font-semibold text-6xl leading-[1.05]">
            {reg ? (
              <>
                Better
                <br />
                Outfits.
                <br />
                <span className="text-acc">Brighter You.</span>
              </>
            ) : (
              <>
                Outfits for{" "}
                <span className="text-acc block">Every Occasion.</span>
              </>
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
                <Feat i={Shirt} t="Personalized Outfit Recommendations" />
                <Feat i={CalendarCheck} t="For Every Occasion" />
                <Feat i={Briefcase} t="Organize Your Wardrobe" />
                <Feat i={Heart} t="Style That Fits You" />
              </>
            ) : (
              <>
                <Feat
                  i={Shirt}
                  t="AI-Powered Outfit Recommendations"
                  s="Looks tailored to you"
                />
                <Feat
                  i={CalendarCheck}
                  t="Outfits for Every Occasion"
                  s="From casual to wedding"
                />
                <Feat
                  i={Briefcase}
                  t="Your Personal Wardrobe"
                  s="Organize, manage and style"
                />
                <Feat
                  i={ShoppingBag}
                  t="Shop What You Need"
                  s="Clothes, shoes, accessories & more"
                />
              </>
            )}
          </div>
        </div>
        <div className="relative">
          {reg ? (
            <div className="font-serif italic text-2xl">
              “Your wardrobe,
              <br />
              Your story.”
              <i className="block w-10 h-px bg-acc mt-4" />
            </div>
          ) : (
            <div className="flex gap-8">
              {[
                ["10K+", "Happy Users"],
                ["50+", "Premium Brands"],
                ["100+", "Occasions Covered"],
              ].map(([a, b]) => (
                <div key={b}>
                  <div className="font-serif text-3xl text-acc">{a}</div>
                  <div className="text-sm text-mute">{b}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative p-4 md:p-8 flex flex-col">
        <div className="self-end card rounded-full px-5 py-2.5 text-sm">
          <span className="text-mute">
            {reg ? "Already have an account? " : "Need an account? "}
          </span>
          <Link
            to={reg ? "/login" : "/register"}
            className="text-acc font-medium"
          >
            {reg ? "Login" : "Sign Up"} →
          </Link>
        </div>
        <div className="m-auto w-full max-w-[560px] card p-6 md:p-10 bg-card/80 mt-6 animate-up">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <Logo text={!reg} big size={reg ? 36 : 44} />
            </div>
            {reg ? (
              <>
                <h1 className="font-serif font-semibold text-3xl mt-2">
                  Create Your <span className="text-acc">Account</span>
                </h1>
                <p className="text-sm text-mute mt-2">
                  Join Make Me Ready and start your style journey.
                </p>
              </>
            ) : (
              <p className="text-xs tracking-[.3em] text-mute mt-3">
                STYLE SMARTER. LIVE BETTER.
              </p>
            )}
          </div>
          {reg ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  );
}
