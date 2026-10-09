import { env } from "../config/env.js";

const CANDIDATE_MODELS = [
  env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-lite-latest",
];

// Deduplicate candidate models
const UNIQUE_MODELS = [...new Set(CANDIDATE_MODELS.filter(Boolean))];

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

/**
 * Handle Fashion Assistant Chat requests via server-side Gemini API
 */
export const chatWithAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be non-empty.",
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error:
          "Gemini API key is not configured on the server. Please set GEMINI_API_KEY in the environment.",
      });
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
        .filter((m) => m && !m.loading && m.id !== "greeting" && m.content)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      { role: "user", parts: [{ text: message.trim() }] },
    ];

    let lastError = null;
    let successfulReply = null;
    let modelUsed = null;

    for (const model of UNIQUE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
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

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            successfulReply = text;
            modelUsed = model;
            break;
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `Status ${response.status}`;
          console.warn(`[Assistant] Model ${model} returned error:`, errMsg);
          lastError = errMsg;
        }
      } catch (networkErr) {
        console.warn(`[Assistant] Network error with ${model}:`, networkErr.message);
        lastError = networkErr.message;
      }
    }

    if (successfulReply) {
      return res.json({
        success: true,
        reply: successfulReply,
        model: modelUsed,
      });
    }

    return res.status(502).json({
      success: false,
      error:
        lastError ||
        "Could not connect to Gemini AI. Please check network connection and try again.",
    });
  } catch (err) {
    console.error("[Assistant] Unexpected chat error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error while processing styling request.",
    });
  }
};
