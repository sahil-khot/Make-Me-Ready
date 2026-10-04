import { useState, useRef, useEffect } from "react";
import { Send, ImageIcon, Info, ArrowRight, Sparkles, X } from "lucide-react";
import { useStore } from "../store.jsx";

// ─── Gemini API ───────────────────────────────────────────────────────────────
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`;

const SYSTEM_PROMPT = `You are a helpful Fashion Assistant for "Make Me Ready", an AI-powered personal stylist app built for Indian users.
You can answer ANY question the user asks — fashion-related or general knowledge.

For fashion topics you specialise in:
- Outfit ideas and combinations for any occasion (wedding, college, office, date, party, travel, gym, etc.)
- Color combination and palette suggestions
- Accessory and footwear recommendations
- Wardrobe building, capsule wardrobe tips
- Shopping and brand suggestions (Indian and international)
- Style tips, grooming, and personal styling
- Seasonal and occasion-based dressing

For non-fashion questions, answer helpfully and naturally as a knowledgeable AI.

Be friendly, warm, and concise. Use bullet points for lists. Bold key items with **text**. Keep responses clear and easy to read.`;

async function askGemini(history, newMessage) {
  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Got it! I am your Fashion Assistant, ready to help with style advice, outfit ideas, and any other questions you have." }] },
    ...history
      .filter(m => !m.loading && m.id !== "greeting")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    { role: "user", parts: [{ text: newMessage }] },
  ];

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error ${res.status}`);
  }
  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I could not generate a response. Please try again."
  );
}

// ─── Quick prompts ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Suggest an outfit for a wedding",
  "What should I wear for an interview?",
  "Help me style a denim jacket",
  "Recommend matching shoes for chinos",
  "Suggest accessories for a date night",
  "Give me color combination ideas",
  "Create a party look from basics",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderMarkdown(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Render **bold**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p
    );
    const isBullet = /^[\-\*•]\s/.test(line.trim());
    if (isBullet) {
      const stripped = line.trim().replace(/^[\-\*•]\s/, "");
      const bParts = stripped.split(/\*\*(.*?)\*\*/g);
      const bRendered = bParts.map((p, j) =>
        j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p
      );
      return (
        <div key={i} className="flex gap-2.5 mt-1 first:mt-0">
          <span className="text-amber-400 mt-[3px] shrink-0 text-xs leading-5">◆</span>
          <span className="flex-1">{bRendered}</span>
        </div>
      );
    }
    if (!line.trim()) return <div key={i} className="h-2" />;
    return (
      <p key={i} className={`leading-relaxed ${i > 0 ? "mt-1.5" : ""}`}>
        {rendered}
      </p>
    );
  });
}

// ─── How it works modal ───────────────────────────────────────────────────────
function HowItWorksModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#111009] border border-amber-500/20 rounded-2xl p-7 max-w-[440px] w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-serif font-semibold text-xl flex items-center gap-2.5">
            <Sparkles size={18} className="text-amber-400" />
            How it works
          </h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition">
            <X size={18} />
          </button>
        </div>
        <ul className="space-y-4">
          {[
            ["Ask anything", "Type any fashion or general question — outfits, occasions, colors, accessories, and more."],
            ["Quick Prompts", "Click the suggestions on the right panel to explore ideas instantly."],
            ["Powered by Gemini", "Uses Google Gemini AI for intelligent, personalised fashion guidance."],
            ["Contextual memory", "The assistant remembers your conversation for follow-up questions."],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <div>
                <div className="text-white font-medium text-sm">{title}</div>
                <div className="text-stone-400 text-sm mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full h-11 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:brightness-110 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── Message bubble ──────────────────────────────────────────────────────────
function MessageBubble({ msg, userName, userAvatar }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2.5">
        <div className="max-w-[65%] bg-[#1e1b12] border border-amber-500/15 rounded-2xl rounded-br-sm px-4 py-3 text-sm text-stone-100 leading-relaxed">
          {renderMarkdown(msg.content)}
        </div>
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 uppercase">
            {userName?.[0] || "U"}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/25 shrink-0">
        <img src="/img/logo.jpg" alt="AI" className="w-full h-full object-cover" />
      </div>
      <div className="max-w-[72%] bg-[#111009] border border-white/[.06] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-stone-200 leading-relaxed">
        {msg.loading ? (
          <div className="flex items-center gap-1.5 py-0.5">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-bounce"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
            <span className="text-xs text-stone-500 ml-1.5">Thinking…</span>
          </div>
        ) : (
          renderMarkdown(msg.content)
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FashionAssistant() {
  const { user } = useStore();
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const greeting = {
    role: "assistant",
    id: "greeting",
    content: `Hi ${firstName}! 👋\nI'm your Fashion Assistant, powered by Gemini.\nI can help you with outfit ideas, styling tips, color combinations, occasion-based looks, shopping suggestions and more.\nWhat would you like to explore today?`,
  };

  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = (typeof text === "string" ? text : input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg, id: `u-${Date.now()}` };
    const thinkId = `a-${Date.now()}`;
    const thinking = { role: "assistant", content: "", loading: true, id: thinkId };

    setMessages(prev => [...prev, userMsg, thinking]);
    setLoading(true);

    try {
      const history = messages.filter(m => !m.loading);
      const reply = await askGemini(history, msg);
      setMessages(prev =>
        prev.map(m => m.id === thinkId ? { role: "assistant", content: reply, id: thinkId } : m)
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === thinkId
            ? { role: "assistant", content: `⚠️ ${err.message || "Something went wrong. Please try again."}`, id: thinkId }
            : m
        )
      );
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 68px - 2.5rem)" }}>

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L16.2 11.5L25 14L16.2 16.5L14 26L11.8 16.5L3 14L11.8 11.5Z" fill="#f59e0b" />
            </svg>
            <h1 className="font-serif font-semibold text-[1.75rem] text-white leading-tight">
              Fashion Assistant
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-widest">
              BETA
            </span>
          </div>
          <p className="text-[13px] text-stone-400 mt-0.5 ml-[38px] flex items-center gap-1.5">
            Your personal AI stylist powered by&nbsp;
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L16.2 11.5L25 14L16.2 16.5L14 26L11.8 16.5L3 14L11.8 11.5Z" fill="#4285f4" />
              </svg>
              Gemini
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowInfo(true)}
          className="flex items-center gap-2 px-4 h-9 rounded-xl border border-white/[.08] bg-white/[.02] text-stone-400 hover:text-white hover:border-white/[.15] text-xs font-medium transition"
        >
          <Info size={13} />
          How it works
        </button>
      </div>

      {/* ── Body: Chat + Sidebar ── */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* ── Chat panel ── */}
        <div className="flex-1 flex flex-col min-w-0 border border-white/[.06] rounded-2xl bg-[#0c0b09] overflow-hidden">

          {/* Messages scroll area */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2520 transparent" }}
          >
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                userName={user?.name || "You"}
                userAvatar={user?.avatar}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ── */}
          <div className="shrink-0 border-t border-white/[.06] bg-[#0e0d0b] px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              title="Attach image (coming soon)"
              className="text-stone-600 hover:text-stone-400 transition shrink-0"
            >
              <ImageIcon size={18} />
            </button>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              autoFocus
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask me anything about fashion…"
              className="flex-1 bg-transparent text-[13.5px] text-white placeholder:text-stone-600 outline-none resize-none leading-[1.6] overflow-hidden"
              style={{ minHeight: "24px", maxHeight: "120px" }}
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0 hover:bg-amber-400 transition disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <Send size={13} />
            </button>
          </div>
        </div>

        {/* ── Try asking sidebar ── */}
        <aside className="w-[240px] shrink-0 hidden lg:flex flex-col gap-3">
          <div className="border border-white/[.06] bg-[#0c0b09] rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <span className="text-base leading-none">💡</span>
              <span className="text-sm font-semibold text-white">Try asking…</span>
            </div>
            <div className="space-y-1.5 flex-1">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  disabled={loading}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-white/[.06] bg-white/[.02] hover:bg-amber-500/10 hover:border-amber-500/30 text-left leading-snug transition group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-[12.5px] text-stone-300 group-hover:text-white transition flex-1">
                    {p}
                  </span>
                  <ArrowRight
                    size={12}
                    className="text-stone-600 group-hover:text-amber-400 shrink-0 transition"
                  />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showInfo && <HowItWorksModal onClose={() => setShowInfo(false)} />}
    </div>
  );
}
