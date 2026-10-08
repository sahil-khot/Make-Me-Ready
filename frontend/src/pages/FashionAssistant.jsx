import { useState, useRef, useEffect } from "react";
import {
  Send,
  ImageIcon,
  Info,
  ArrowRight,
  Sparkles,
  X,
  RotateCcw,
  Palette,
  Layers,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useStore } from "../store.jsx";
import { IMG } from "../data/constants.js";

// ─── Gemini Models & Fallback ────────────────────────────────────────────────
const CANDIDATE_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
];

const SYSTEM_PROMPT = `You are the personal Fashion Assistant for "Make Me Ready", an AI-powered styling and wardrobe management platform.
You can answer ANY question the user asks — both fashion-related and general questions.

For fashion questions, you are an elite celebrity stylist:
- Recommend outfits, color palettes, and aesthetics for any event (wedding, college, interview, date, travel, party, etc.)
- Suggest accessories, footwear, grooming, and wardrobe curation tips
- Provide practical advice suitable for modern wardrobes, Indian occasions, and global trends

For general questions:
- Answer accurately, helpfully, concisely, and warmly.

Formatting:
- Use bullet points for recommendations
- Highlight key clothing items or terms in **bold**
- Keep responses readable, friendly, and structured.`;

async function askGemini(history, newMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    {
      role: "model",
      parts: [
        {
          text: "Understood! I am the Make Me Ready Fashion Assistant. I am ready to help you with outfit curation, styling advice, color combinations, and any other questions you may have.",
        },
      ],
    },
    ...history
      .filter((m) => !m.loading && m.id !== "greeting" && m.content)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    { role: "user", parts: [{ text: newMessage }] },
  ];

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const err = await res.json().catch(() => ({}));
        console.warn(`Model ${model} returned ${res.status}:`, err.error?.message);
        lastError = err.error?.message || `Status ${res.status}`;
      }
    } catch (e) {
      console.warn(`Network error with ${model}:`, e.message);
      lastError = e.message;
    }
  }

  throw new Error(lastError || "Could not connect to Gemini AI. Please try again.");
}

// ─── Quick Prompts ───────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Suggest an outfit for a wedding",
  "What should I wear for an interview?",
  "Help me style this jacket",
  "Recommend matching shoes",
  "Suggest accessories",
  "Give me color combination ideas",
  "Create a party look from my wardrobe",
];

// ─── Welcome Message (for Reset / Clear Chat) ─────────────────────────────────
function buildWelcomeMessage(userName = "Sahil") {
  return [
    {
      id: `greeting-${Date.now()}`,
      role: "assistant",
      content: `Hi ${userName}! 👋\nI'm your Fashion Assistant, powered by Gemini.\nI can help you with outfit ideas, styling tips, color combinations, occasion-based looks, shopping suggestions and more.\nWhat would you like to explore today?`,
    },
  ];
}

// ─── Initial Demo Conversation (Matching Reference Design) ───────────────────
function buildInitialMessages(userName = "Sahil") {
  return [
    {
      id: "greeting",
      role: "assistant",
      content: `Hi ${userName}! 👋\nI'm your Fashion Assistant, powered by Gemini.\nI can help you with outfit ideas, styling tips, color combinations, occasion-based looks, shopping suggestions and more.\nWhat would you like to explore today?`,
    },
    {
      id: "user-demo-1",
      role: "user",
      content:
        "Suggest a complete outfit for a college day from my wardrobe. I want something casual and trendy.",
    },
    {
      id: "ai-demo-1",
      role: "assistant",
      content:
        "Here's a casual and trendy college outfit for you from your wardrobe 👕",
      outfit: {
        items: [
          {
            title: "Oversized T-Shirt",
            subtitle: "From your wardrobe",
            image:
              IMG["tshirt-p"] ||
              "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
          },
          {
            title: "Blue Jeans",
            subtitle: "From your wardrobe",
            image:
              IMG["blue-jeans"] ||
              "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80",
          },
          {
            title: "White Sneakers",
            subtitle: "From your wardrobe",
            image:
              IMG["white-sneakers"] ||
              "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=400&q=80",
          },
          {
            title: "Analog Watch",
            subtitle: "From your wardrobe",
            image:
              IMG["watch"] ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
          },
        ],
        footerNote:
          "This look is clean, comfortable and perfect for college. You can also add a light jacket if it's a bit chilly.",
      },
    },
  ];
}

// ─── Markdown Renderer ───────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");

  return lines.map((line, i) => {
    // Check if line is a bullet
    const isBullet = /^[\-\*•]\s/.test(line.trim());
    const cleanLine = isBullet ? line.trim().replace(/^[\-\*•]\s/, "") : line;

    // Parse **bold** parts
    const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} className="text-white font-semibold">
          {part}
        </strong>
      ) : (
        part
      )
    );

    if (isBullet) {
      return (
        <div key={i} className="flex gap-2.5 mt-2 first:mt-0 text-[15px] leading-relaxed">
          <span className="text-amber-400 mt-1 shrink-0 text-xs">◆</span>
          <span className="flex-1 text-stone-200">{rendered}</span>
        </div>
      );
    }

    if (!line.trim()) {
      return <div key={i} className="h-2.5" />;
    }

    return (
      <p
        key={i}
        className={`text-[15px] leading-relaxed text-stone-200 ${
          i > 0 ? "mt-2" : ""
        }`}
      >
        {rendered}
      </p>
    );
  });
}

// ─── How It Works Modal ──────────────────────────────────────────────────────
function HowItWorksModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-[#12100d] border border-amber-500/25 rounded-2xl p-7 max-w-[460px] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-serif font-semibold text-xl text-white flex items-center gap-2.5">
            <Sparkles size={20} className="text-amber-400" />
            How it works
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition"
          >
            <X size={18} />
          </button>
        </div>
        <ul className="space-y-4">
          {[
            [
              "Ask Any Question",
              "Ask for outfit styling, wedding dress codes, color theory, footwear suggestions, or any general question.",
            ],
            [
              "Try Asking Prompts",
              "Click any suggestion on the right panel to instantly generate styled inspiration.",
            ],
            [
              "Powered by Gemini",
              "Uses Google's Gemini models with automatic multi-model fallback for guaranteed, instantaneous responses.",
            ],
            [
              "Personalized Wardrobe Integration",
              "Recommends pieces from your own Make Me Ready collection tailored to your personal taste.",
            ],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 shadow-sm shadow-amber-400/50" />
              <div>
                <div className="text-white font-medium text-sm">{title}</div>
                <div className="text-stone-400 text-sm mt-0.5 leading-relaxed">
                  {desc}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full h-11 rounded-xl bg-amber-500 text-stone-950 font-semibold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── Clear Conversation Confirmation Modal ──────────────────────────────────
function ClearConfirmModal({ onConfirm, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#12100d] border border-amber-500/30 rounded-2xl p-6 sm:p-7 max-w-[420px] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
          <Trash2 size={22} />
        </div>
        <h3 className="font-serif font-semibold text-xl text-white text-center mb-2">
          Clear this conversation?
        </h3>
        <p className="text-sm text-stone-400 text-center leading-relaxed mb-6">
          Clear this conversation? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-white/10 bg-white/[.04] hover:bg-white/[.08] text-stone-300 hover:text-white text-sm font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm transition shadow-lg shadow-red-500/20 active:scale-95 cursor-pointer"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Fashion Assistant Component ────────────────────────────────────────
export default function FashionAssistant() {
  const { user } = useStore();
  const firstName = user?.name ? user.name.split(" ")[0] : "Sahil";

  const [messages, setMessages] = useState(() => buildInitialMessages(firstName));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (textToSend) => {
    const query = (typeof textToSend === "string" ? textToSend : input).trim();
    if (!query || loading) return;
    setInput("");

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMsg = {
      id: userMessageId,
      role: "user",
      content: query,
    };

    const thinkingMsg = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setLoading(true);

    try {
      const history = messages.filter((m) => !m.loading);
      const reply = await askGemini(history, query);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { id: assistantMessageId, role: "assistant", content: reply }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                id: assistantMessageId,
                role: "assistant",
                content: `⚠️ ${
                  err.message || "Something went wrong. Please try again."
                }`,
              }
            : m
        )
      );
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const confirmClearChat = () => {
    setMessages(buildWelcomeMessage(firstName));
    setInput("");
    setShowClearConfirm(false);
  };

  return (
    <div
      className="flex flex-col w-full max-w-[1440px] mx-auto"
      style={{ height: "calc(100vh - 84px)" }}
    >
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-4 shrink-0 px-1">
        <div>
          <div className="flex items-center gap-3">
            {/* Sparkle Logo */}
            <div className="text-amber-400">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 2L16.2 11.5L25 14L16.2 16.5L14 26L11.8 16.5L3 14L11.8 11.5Z"
                  fill="#f59e0b"
                />
              </svg>
            </div>
            <h1 className="font-serif font-semibold text-2xl lg:text-[28px] text-white tracking-wide">
              Fashion Assistant
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-wider">
              BETA
            </span>
          </div>
          <p className="text-sm text-stone-400 mt-1 ml-9 flex items-center gap-1.5 font-normal">
            Your personal AI stylist powered by&nbsp;
            <span className="inline-flex items-center gap-1 text-blue-400 font-medium">
              <svg width="13" height="13" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 2L16.2 11.5L25 14L16.2 16.5L14 26L11.8 16.5L3 14L11.8 11.5Z"
                  fill="#4285f4"
                />
              </svg>
              Gemini
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            title="Clear Chat"
            aria-label="Clear this conversation"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-red-500/25 bg-red-500/[.06] hover:bg-red-500/15 hover:border-red-500/40 text-red-300 hover:text-red-200 text-xs sm:text-sm font-medium transition cursor-pointer shadow-sm"
          >
            <Trash2 size={13.5} className="text-red-400" />
            <span>Clear Chat</span>
          </button>
          <button
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-[#12110e]/70 text-stone-300 hover:text-white hover:border-amber-500/30 text-xs sm:text-sm font-medium transition shadow-sm"
          >
            <Info size={14} className="text-amber-400/90" />
            <span className="hidden sm:inline">How it works?</span>
            <span className="sm:hidden">Info</span>
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Body ── */}
      <div className="flex gap-4 sm:gap-5 flex-1 min-h-0">
        {/* Left Column: Chat Conversation Container + Centered Bounded Input Bar */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Chat Conversation Container */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0e0d0b] border border-white/[.08] rounded-2xl lg:rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl min-h-0">
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-6 min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#26221d transparent",
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              if (isUser) {
                return (
                  <div key={msg.id} className="flex items-start justify-end gap-3">
                    <div className="max-w-[80%] lg:max-w-[70%] bg-[#362414] border border-amber-600/30 rounded-2xl rounded-tr-sm px-5 py-3.5 text-[15px] text-white leading-relaxed shadow-md">
                      {msg.content}
                    </div>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-sm font-bold text-amber-400 shrink-0 uppercase">
                        {firstName[0] || "U"}
                      </div>
                    )}
                  </div>
                );
              }

              // Assistant Message
              return (
                <div key={msg.id} className="flex items-start gap-3.5">
                  {/* Brand Crown Avatar */}
                  <div className="w-10 h-10 rounded-full border border-amber-500/50 bg-[#161410] flex items-center justify-center shrink-0 p-1 shadow-md shadow-amber-500/10">
                    <img
                      src="/img/logo.jpg"
                      alt="Make Me Ready"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Bubble Container */}
                  <div className="max-w-[85%] lg:max-w-[82%] bg-[#181613] border border-white/[.07] rounded-2xl rounded-tl-sm px-5 py-4 text-[15px] text-stone-200 leading-relaxed shadow-lg">
                    {msg.loading ? (
                      <div className="flex items-center gap-2 py-1">
                        <span
                          className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                        <span className="text-xs text-stone-400 ml-2 font-medium">
                          Styling your answer…
                        </span>
                      </div>
                    ) : (
                      <div>
                        {renderMarkdown(msg.content)}

                        {/* Outfit Recommendation Cards Grid (if present) */}
                        {msg.outfit && (
                          <div className="mt-4 pt-3 border-t border-white/[.07]">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                              {msg.outfit.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#12110e] border border-white/[.06] rounded-xl p-2.5 flex flex-col items-center text-center group hover:border-amber-500/30 transition"
                                >
                                  <div className="w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-black/40 mb-2.5 flex items-center justify-center">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="text-xs sm:text-sm font-semibold text-white truncate w-full">
                                    {item.title}
                                  </div>
                                  <div className="text-[11px] text-stone-400 mt-0.5 truncate w-full">
                                    {item.subtitle}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {msg.outfit.footerNote && (
                              <p className="text-[14px] text-stone-300 mt-3 leading-relaxed">
                                {msg.outfit.footerNote}
                              </p>
                            )}

                            {/* Action Buttons Row */}
                            <div className="flex flex-wrap items-center gap-2.5 mt-4">
                              <button
                                type="button"
                                onClick={() =>
                                  send("Show me full look styling details and tips for this outfit")
                                }
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
                              >
                                View Full Look
                                <ArrowRight size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  send("Suggest a different style for this college day outfit")
                                }
                                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.08] hover:border-white/20 text-stone-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition"
                              >
                                <Sparkles size={13} className="text-amber-400" />
                                Try Different Style
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  send("Give me alternative color combination options for this look")
                                }
                                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.08] hover:border-white/20 text-stone-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition"
                              >
                                <Palette size={13} className="text-amber-400" />
                                Change Color
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  send("Recommend accessories and shoes to complete this college look")
                                }
                                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.08] hover:border-white/20 text-stone-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition"
                              >
                                <Layers size={13} className="text-amber-400" />
                                Add Accessories
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Centered Bottom Input Bar (bounded within main chat section, not stretching under sidebar) */}
        <div className="w-full flex justify-center shrink-0 mt-3 sm:mt-3.5">
          <div
            className={`w-full max-w-[860px] bg-[#12110e]/95 backdrop-blur-md rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 shadow-2xl transition-all duration-300 border ${
              isFocused
                ? "border-amber-500/70 shadow-[0_0_28px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/30"
                : "border-white/[.12] hover:border-white/20"
            }`}
          >
            <button
              type="button"
              title="Upload or attach fashion image"
              className="w-9 h-9 rounded-xl grid place-items-center text-stone-400 hover:text-amber-400 hover:bg-white/[.05] transition shrink-0 cursor-pointer"
            >
              <ImageIcon size={20} />
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              autoFocus
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask me anything about fashion..."
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-stone-400 placeholder:font-normal outline-none resize-none leading-relaxed overflow-hidden py-1.5 px-2"
              style={{ minHeight: "36px", maxHeight: "120px" }}
            />

            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-semibold flex items-center justify-center shrink-0 hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_14px_rgba(245,158,11,0.3)] active:scale-95 cursor-pointer"
              title="Send message"
            >
              <Send size={16} className="translate-x-[0.5px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: "Try asking..." Sidebar */}
      <aside className="w-[310px] xl:w-[350px] shrink-0 hidden lg:flex flex-col bg-[#0e0d0b] border border-white/[.08] rounded-2xl lg:rounded-3xl p-5 shadow-2xl">
        {/* Sidebar Title */}
        <div className="flex items-center gap-2.5 mb-4 shrink-0">
          <span className="text-lg">💡</span>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Try asking...
          </h2>
        </div>

        {/* Quick Prompts List */}
        <div
          className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#26221d transparent",
          }}
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => send(prompt)}
              disabled={loading}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-white/[.07] bg-[#161412] hover:bg-[#201d18] hover:border-amber-500/40 text-left transition duration-200 group disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="text-sm font-normal text-stone-200 group-hover:text-white transition leading-snug">
                {prompt}
              </span>
              <ArrowRight
                size={15}
                className="text-amber-500/70 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0"
              />
            </button>
          ))}
        </div>
      </aside>
    </div>

    {/* ── Modals ── */}
    {showInfo && <HowItWorksModal onClose={() => setShowInfo(false)} />}
    {showClearConfirm && (
      <ClearConfirmModal
        onConfirm={confirmClearChat}
        onClose={() => setShowClearConfirm(false)}
      />
    )}
    </div>
  );
}
