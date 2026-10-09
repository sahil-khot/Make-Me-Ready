import { env } from "../config/env.js";

const CANDIDATE_MODELS = [
  env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-1.5-flash",
];

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
 * Built-in intelligent styling response engine
 * Active whenever Gemini API key is unconfigured, expired, or unavailable
 */
export function generateFashionAdvice(userMessage) {
  const msg = String(userMessage || "").toLowerCase().trim();

  // Greetings
  if (/^(hi|hii|hello|hey|greetings|good\s*(morning|afternoon|evening)|sup)\b/i.test(msg)) {
    return `Hello! 👋 I'm your **Make Me Ready** personal fashion stylist.

How can I help elevate your look today? Here are a few things we can explore:
- 👔 **Occasion Styling:** Outfits for interviews, college, parties, dates, or weddings
- 🎨 **Color Coordination:** Finding complementary tones for your skin tone and aesthetic
- 🧥 **Layering & Silhouette:** Pro tips on jackets, proportions, and footwear
- 🛍️ **Wardrobe Advice:** How to style pieces you already own

Where are you heading, or what pieces are you looking to style?`;
  }

  // Wedding / Traditional / Festive
  if (/wedding|marriage|reception|festive|diwali|eid|traditional|ethnic|sherwani|kurta|saree|lehenga|puja|sangeet/i.test(msg)) {
    return `Here is a curated high-fashion styling guide for a **Wedding / Festive Occasion**:

### 🌟 Recommended Outfit
- **For Men:** A structured **Bandhgala** or raw-silk **Kurta with an embroidered Nehru Jacket** in rich jewel tones (Navy, Emerald Green, or Wine Burgundy), paired with tapered ivory churidar or silk trousers. Finish with polished mojaris or monk-strap shoes.
- **For Women:** An embroidered **Anarkali suit** or contemporary **draped saree/lehenga** with metallic zari accents. Pair with statement jhumkas and block heels for all-night comfort.

### 🎨 Color Palette
- Deep Royal Tones: **Emerald Green**, **Midnight Navy**, **Rich Wine**, with **Gold/Champagne accents**.

### ✨ Stylist Tips
- **Grooming:** Clean, structured hairstyle with a subtle woody or amber fragrance.
- **Accessories:** A minimalist analog watch with a leather or metallic strap elevates traditional attire instantly.`;
  }

  // Interview / Formal / Office / Business
  if (/interview|office|work|formal|business|corporate|meeting|presentation/i.test(msg)) {
    return `Here is your executive styling breakdown for **Professional & Interview Wear**:

### 💼 Recommended Outfit
- **The Power Look:** A tailored **Charcoal Grey or Navy Blazer** over a crisp **Egyptian cotton white or light blue button-down shirt**.
- **Bottoms:** Slim-straight flat-front tailored trousers in matte black or charcoal.
- **Footwear:** Classic leather **Oxford shoes** or sleek loafers in dark brown or polished black.
- **Belt:** Leather belt matching your shoe color exactly.

### 🎨 Color Palette
- **Navy Blue**, **Slate Grey**, **Crisp White**, and **Mocha Brown**. Avoid neon or overly bright colors for interviews.

### ✨ Stylist Pro-Tip
- **Fit over Brand:** Ensure shoulders fit square without hanging over. Your sleeves should show approximately 1/4 inch of shirt cuff.`;
  }

  // College / Casual / Streetwear
  if (/college|casual|everyday|streetwear|hangout|friends|cafe|sneaker|daily/i.test(msg)) {
    return `Here is a fresh, modern everyday look for **College & Casual Outings**:

### 👕 Recommended Outfit
- **Top:** An **Oversized heavy-weight Boxy T-Shirt** (240+ GSM) in Off-White, Sage Green, or Washed Charcoal, or an open relaxed linen overshirt.
- **Bottoms:** Relaxed-fit **straight-leg blue or washed grey denim**, or pleated relaxed chinos.
- **Footwear:** Clean minimalist **white leather sneakers** (e.g. Stan Smiths, retro runners, or chunky trainers).

### 🎨 Color Palette
- **Off-White**, **Sage Green**, **Vintage Denim Blue**, and **Earthy Tan**.

### ✨ Stylist Pro-Tip
- Use the **"Sandwich Dressing"** technique: match the color of your top with the color of your shoes (e.g., white tee + white sneakers) to make the outfit look naturally cohesive!`;
  }

  // Date Night / Dinner / Party
  if (/date|dinner|party|club|night|evening|bar/i.test(msg)) {
    return `Here is an alluring, sophisticated outfit for a **Date Night or Evening Party**:

### 🌙 Recommended Outfit
- **Top:** A well-fitted **Black knitted polo**, dark satin resort shirt, or a textured charcoal mock-neck shirt.
- **Layer:** A tailored **unstructured black/charcoal blazer** or a suede bomber jacket.
- **Bottoms:** Slim-tapered tailored trousers or dark rinse indigo denim with zero distressing.
- **Footwear:** Suede Chelsea boots or sleek minimalist black leather loafers.

### 🎨 Color Palette
- **Monochrome & Moody:** Jet Black, Charcoal, Deep Burgundy, and Warm Cream.

### ✨ Stylist Pro-Tip
- Focus on texture contrast (e.g. knitwear + smooth trousers + suede boots). Finish with an alluring warm gourmand or smoky fragrance.`;
  }

  // Colors / Coordination
  if (/color|palette|shade|match|combination/i.test(msg)) {
    return `Here is the essential **Color Coordination Guide** for effortless styling:

### 🎨 Foolproof Color Combinations
1. **Navy & Tan/Camel:** Timeless, elegant, and works for both casual and formal settings.
2. **Olive Green & Black/White:** Modern earthy aesthetic that suits all skin tones.
3. **Monochrome (All Black or Tonal Grey):** Instantly makes you look taller and slimmer.
4. **Burgundy & Charcoal Grey:** Sophisticated and premium for evening wear.

### 💡 The 60-30-10 Rule
- **60% Base Color:** Your dominant piece (e.g., trousers or coat).
- **30% Secondary Color:** Your secondary piece (e.g., shirt or knitwear).
- **10% Accent Color:** Accessories, pocket square, socks, or jewelry.`;
  }

  // General Fashion / Catch-all response
  return `Here is my personalized styling advice for you:

### ✨ Curated Recommendation
- **Silhouette & Balance:** Pair looser tops with structured bottoms, or fitted tops with relaxed-leg trousers to create balanced visual proportions.
- **Layering Essentials:** A neutral overshirt (linen in summer, corduroy or wool in winter) instantly adds depth to any basic T-shirt and denim pairing.
- **Footwear Foundation:** Keep your shoes pristine. Clean footwear elevates even the simplest outfit by 10x.
- **Accessories:** Add a classic analog watch, minimal signet ring, or subtle chain to show intentional detail.

Would you like specific recommendations for a particular event, weather, or clothing piece in your wardrobe? Just let me know!`;
}

/**
 * Handle Fashion Assistant Chat requests via server-side Gemini API with smart fallback
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
    const isValidKey =
      apiKey &&
      apiKey.length > 20 &&
      !apiKey.includes("your_gemini") &&
      !apiKey.includes("<");

    if (isValidKey) {
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
              return res.json({
                success: true,
                reply: text,
                model,
              });
            }
          }
        } catch (networkErr) {
          console.warn(`[Assistant] Network error with ${model}:`, networkErr.message);
        }
      }
    }

    // Always succeed with intelligent built-in stylist engine
    const reply = generateFashionAdvice(message);
    return res.json({
      success: true,
      reply,
      model: "mmr-fashion-engine",
    });
  } catch (err) {
    console.error("[Assistant] Unexpected chat error:", err);
    const reply = generateFashionAdvice(req.body?.message || "");
    return res.json({
      success: true,
      reply,
      model: "mmr-fashion-engine",
    });
  }
};
