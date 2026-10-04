import { useState, useRef, useEffect } from "react";
import { Send, Image, Info, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../store.jsx";

// Gemini API
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT = `You are a Fashion Assistant for "Make Me Ready", an AI-powered personal stylist app.
You help users with:
- Outfit ideas and combinations for any occasion
- Color combination suggestions
- Accessory recommendations
- Wardrobe building tips
- Shopping suggestions
- Style tips tailored to Indian fashion sensibilities

Be friendly, concise, and helpful. When suggesting outfits, be specific about clothing items, colors, and combinations.
Always give practical, wearable advice. Keep responses clear and well-structured using bullet points where helpful.`;

async function askGemini(history, newMessage) {
  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Understood! I am ready to help as your Fashion Assistant for Make Me Ready." }] },
    ...history.filter(m => !m.loading).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: newMessage }] },
  ];

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response. Please try again.";
}

const QUICK_PROMPTS = [
  "Suggest an outfit for a wedding",
  "What should I wear for an interview?",
  "Help me style this jacket",
  "Recommend matching shoes",
  "Suggest accessories",
  "Give me color combination ideas",
  "Create a party look from my wardrobe",
];

function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111009] border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-serif font-semibold text-xl mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-acc" />
          How Fashion Assistant Works
        </h2>
        <ul className="space-y-3 text-sm text-stone-300">
          {[
            ["Ask anything", "Type your style question and get instant AI-powered advice."],
            ["Quick Prompts", "Use the Try asking suggestions on the right to get started fast."],
            ["Powered by Gemini", "Our AI uses Google Gemini for accurate, up-to-date fashion guidance."],
            ["Personalized advice", "Get recommendations tailored to your wardrobe and preferences."],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-acc mt-1.5 shrink-0" />
              <div>
                <div className="text-white font-medium mb-0.5">{title}</div>
                <div className="text-stone-400">{desc}</div>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-5 w-full h-11 rounded-xl bg-acc text-black font-semibold text-sm hover:brightness-110 transition">
          Got it
        </button>
      </div>
    </div>
  );
}

function renderText(text) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p);
    const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
    const content = isBullet ? rendered.join("").slice(2) : rendered;
    if (isBullet) {
      return (
        <div key={i} className="flex gap-2 mt-1">
          <span className="text-acc mt-1 shrink-0 text-xs">•</span>
          <span>{rendered}</span>
        </div>
      );
    }
    return line.trim() ? <p key={i} className={i > 0 ? "mt-1.5" : ""}>{rendered}</p> : <div key={i} className="h-1" />;
  });
}

function MessageBubble({ msg, userName, userAvatar }) {
  const isUser = msg.role === "user";
  if (isUser) {
    return (
      <div className="flex items-end gap-3 justify-end">
        <div className="max-w-[72%] bg-[#1c1a14] border border-white/[.08] rounded-2xl rounded-br-sm px-5 py-3.5 text-sm leading-relaxed text-stone-100">
          {renderText(msg.content)}
        </div>
        {userAvatar ? (
          <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-acc/20 border border-acc/40 flex items-center justify-center text-xs font-semibold text-acc shrink-0">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-500/30 shrink-0 bg-[#1a1508]">
        <img src="/img/logo.jpg" alt="Fashion Assistant" className="w-full h-full object-cover" />
      </div>
      <div className="max-w-[78%] bg-[#131210] border border-white/[.07] rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed text-stone-200">
        {msg.loading ? (
          <div className="flex items-center gap-2 text-stone-400">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-acc/60 inline-block animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
            <span className="text-xs ml-1">Thinking...</span>
          </div>
        ) : renderText(msg.content)}
      </div>
    </div>
  );
}

export default function FashionAssistant() {
  const { user } = useStore();
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const GREETING = {
    role: "assistant",
    content: `Hi ${firstName}! ??\nI'm your Fashion Assistant, powered by Gemini.\nI can help you with outfit ideas, styling tips, color combinations,\noccasion-based looks, shopping suggestions and more.\nWhat would you like to explore today?`,
    id: "greeting",
  };

  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    const thinkingId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      { role: "user", content: msg, id: Date.now() },
      { role: "assistant", content: "", loading: true, id: thinkingId },
    ]);
    setLoading(true);
    try {
      const history = messages.filter(m => !m.loading);
      const reply = await askGemini(history, msg);
      setMessages(prev => prev.map(m => m.id === thinkingId ? { role: "assistant", content: reply, id: thinkingId } : m));
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === thinkingId ? { role: "assistant", content: `Sorry, something went wrong: ${err.message}`, id: thinkingId } : m));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="flex gap-5" style={{ height: "calc(100vh - 68px - 4rem)" }}>
      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2 L16 11.5 L25 14 L16 16.5 L14 26 L12 16.5 L3 14 L12 11.5 Z" fill="#f59e0b" />
              </svg>
              <h1 className="font-serif font-semibold text-3xl text-white">Fashion Assistant</h1>
              <span className="px-2.5 py-0.5 rounded-full border border-acc/50 bg-acc/10 text-acc text-[11px] font-bold tracking-wider">BETA</span>
            </div>
            <p className="text-sm text-stone-400 mt-1 ml-[44px] flex items-center gap-1.5">
              Your personal AI stylist powered by{" "}
              <span className="flex items-center gap-1 text-blue-400 font-medium">
                <svg width="13" height="13" viewBox="0 0 28 28" fill="none"><path d="M14 2 L16 11.5 L25 14 L16 16.5 L14 26 L12 16.5 L3 14 L12 11.5 Z" fill="#4285f4" /></svg>
                Gemini
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl border border-white/[.08] bg-white/[.02] text-stone-400 hover:text-white hover:border-white/20 text-sm transition"
          >
            <Info size={14} /> How it works
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1 pb-3">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} userName={user?.name || "You"} userAvatar={user?.avatar} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 mt-3 border border-white/[.08] bg-[#0e0d0b] rounded-2xl flex items-center gap-3 px-4 py-3">
          <button type="button" title="Attach image (coming soon)" className="text-stone-500 hover:text-stone-300 transition shrink-0">
            <Image size={20} />
          </button>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask me anything about fashion..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-stone-500 outline-none resize-none leading-relaxed max-h-32"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            type="button"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-acc text-black flex items-center justify-center shrink-0 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col">
        <div className="border border-white/[.07] bg-[#0e0d0b]/80 rounded-2xl p-4 h-full">
          <div className="flex items-center gap-2 mb-4">
            <span>??</span>
            <span className="font-semibold text-sm text-white">Try asking...</span>
          </div>
          <div className="space-y-2">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                disabled={loading}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-white/[.07] bg-white/[.02] hover:bg-white/[.05] hover:border-white/20 text-left text-sm text-stone-300 hover:text-white transition group disabled:opacity-50"
              >
                <span className="leading-snug">{p}</span>
                <ArrowRight size={13} className="text-stone-500 group-hover:text-acc shrink-0 transition" />
              </button>
            ))}
          </div>
        </div>
      </aside>

      {showInfo && <HowItWorksModal onClose={() => setShowInfo(false)} />}
    </div>
  );
}
