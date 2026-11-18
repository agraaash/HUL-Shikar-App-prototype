import { GoogleGenAI, Type } from "@google/genai";
import express from "express";

export const apiRouter = express.Router();
apiRouter.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client securely on server side
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment variables. Using fallback mode.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Fetch real-time or curated trending topics with Kirana sales hooks
apiRouter.get("/trends", async (req, res) => {
  try {
    const ai = getAiClient();
    const prompt = `You are the AI Trend Intelligence Engine for HUL Shikhar (Hindustan Unilever's B2B Kirana app in India).
Identify 6 exciting, real-time ongoing or seasonal trends in India right now that local Kirana (neighborhood grocery) stores can capitalize on to sell HUL products (e.g., Surf Excel, Vim, Lifebuoy, Dove, Brooke Bond Red Label Tea, Bru Coffee, Knorr Soups, Horlicks, Glow & Lovely, Sunsilk, Closeup, etc.).

Categories to cover:
1. Cricket / Sports fever (Match day munching, hot chai, family snacks)
2. Weather / Season (Monsoon mud/laundry, summer heatwaves, winter care, sudden rain)
3. Festive / Cultural (Upcoming festivals, fasts, wedding season, regional celebrations)
4. Neighborhood / Morning & Evening Habits (Morning Chai routine, Sunday deep clean, evening snacks)
5. Health & Immunity / Kids nutrition (Back-to-school breakfast, exam season energy, Horlicks/Boost)
6. Weekend Bachat / Pocket-friendly clearance deal (Mass savings, multi-buy combos)

For each trend, return:
- id: string slug
- title: catchy headline (English with Hinglish punch)
- category: one of 'Cricket & Sports', 'Weather & Season', 'Festivals & Culture', 'Daily Habits', 'Health & Kids', 'Bachat & Offers'
- trendContext: 1-2 sentence explanation of why this is trending right now in India
- suggestedHULProducts: array of 2-3 HUL products (e.g. ["Surf Excel Easy Wash", "Vim Liquid"])
- defaultOffer: a killer retail discount hook (e.g. "Buy 2kg Surf Excel, get Vim Bar Free!" or "Flat ₹25 OFF on Family Pack")
- viralHookHindi: Catchy one-liner in Hindi / Hinglish (e.g. "बारिश की मिट्टी से मत डरो, जब घर में हो सर्फ एक्सेल का दम!")
- viralHookEnglish: Catchy English equivalent
- urgencyBadge: e.g. "🔥 Trending Today", "🌧️ Monsoon Special", "🏏 Match Day Deal", "⚡ Weekend Flash"
- targetAudience: e.g. "Housewives & Mothers", "Cricket Fans & Youth", "Working Families"
- iconName: Lucide icon idea like 'Trophy', 'CloudRain', 'Sparkles', 'Coffee', 'HeartPulse', 'Tag'
- gradientColors: array of 2 tailwind gradient color strings e.g. ["#1e3a8a", "#3b82f6"] or ["#047857", "#10b981"]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              trendContext: { type: Type.STRING },
              suggestedHULProducts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              defaultOffer: { type: Type.STRING },
              viralHookHindi: { type: Type.STRING },
              viralHookEnglish: { type: Type.STRING },
              urgencyBadge: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              iconName: { type: Type.STRING },
              gradientColors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "id",
              "title",
              "category",
              "trendContext",
              "suggestedHULProducts",
              "defaultOffer",
              "viralHookHindi",
              "viralHookEnglish",
              "urgencyBadge",
              "targetAudience",
            ],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    return res.json({ success: true, trends: data });
  } catch (error: any) {
    console.error("Error fetching AI trends:", error);
    // Fallback default rich trends in case of network issue
    return res.json({
      success: true,
      trends: getFallbackTrends(),
    });
  }
});

// 2. Generate customized Kirana Ad Creative based on trend + shop details
apiRouter.post("/generate-ad", async (req, res) => {
  try {
    const {
      trendTitle,
      category,
      products,
      customOffer,
      shopName,
      ownerName,
      shopAddress,
      shopPhone,
      language, // 'Hindi' | 'English' | 'Hinglish' | 'Marathi' | 'Tamil' | 'Telugu' | 'Bengali' | 'Gujarati'
      targetGoal, // 'clear_stock' | 'boost_weekend_sales' | 'new_customers' | 'festival_rush'
      specialNotes,
    } = req.body;

    const ai = getAiClient();
    const prompt = `You are the Master Kirana Advertising Genius inside HUL Shikhar App.
Generate a complete, high-converting, hyper-localized advertisement campaign kit for a local Indian Kirana shop owner.

Store Details:
- Shop Name: "${shopName || "Gupta Super General Store"}"
- Owner Name: "${ownerName || "Ramesh Gupta"}"
- Address/Locality: "${shopAddress || "Main Market, Sector 14"}"
- Phone/WhatsApp: "${shopPhone || "+91 98765 43210"}"
- Chosen Trend/Topic: "${trendTitle || "Monsoon Rain Laundry & Chai Season"}"
- Product(s) Promoted: "${Array.isArray(products) ? products.join(", ") : products || "Surf Excel Easy Wash & Red Label Tea"}"
- Special Offer / Deal: "${customOffer || "Buy 2kg Surf Excel, get ₹25 Instant Discount + Free Vim Bar"}"
- Preferred Language: "${language || "Hinglish"}"
- Campaign Goal: "${targetGoal || "Boost Footfall & WhatsApp Orders"}"
- Additional context: "${specialNotes || "Deliver within 30 minutes in neighborhood"}"

Provide output in JSON with:
1. mainHeadline: Big, eye-catching title in selected language with rhyming or punchy flavor.
2. subHeadline: Clear value proposition.
3. regionalTagline: A memorable 1-line slogan in chosen language (if Hindi/Hinglish/Regional, write in both Devanagari/Regional script and Romanized English script).
4. offerBadgeText: Short sticker text (e.g. "💥 FLAT ₹25 OFF", "🎁 1 FREE GIFT", "⚡ LIMITED STOCK").
5. bodyPoints: 3 bullet points highlighting convenience, freshness, genuine HUL quality, and free home delivery.
6. whatsappBroadcastCopy: A perfectly formatted WhatsApp message with appropriate emojis, bold text (*text*), bullets, shop address, call to action ("Reply to order now or call...").
7. audioJingleScript: A 15-20 second lively voice announcement script (like a friendly shopkeeper speaking on loudspeaker or WhatsApp voice note).
8. marketingTip: 1 practical tip for the retailer (e.g., "Post this on your WhatsApp Status at 8:00 AM before homemakers start morning chores").
9. recommendedVisualTheme: Color palette suggestion ('royal-blue' | 'monsoon-green' | 'festive-gold' | 'cricket-neon' | 'fresh-orange').
10. ctaButtonText: e.g., "Order on WhatsApp 📲" or "Visit Store Today 🏃"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainHeadline: { type: Type.STRING },
            subHeadline: { type: Type.STRING },
            regionalTagline: { type: Type.STRING },
            regionalTaglineDevanagari: { type: Type.STRING },
            offerBadgeText: { type: Type.STRING },
            bodyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            whatsappBroadcastCopy: { type: Type.STRING },
            audioJingleScript: { type: Type.STRING },
            marketingTip: { type: Type.STRING },
            recommendedVisualTheme: { type: Type.STRING },
            ctaButtonText: { type: Type.STRING },
          },
          required: [
            "mainHeadline",
            "subHeadline",
            "regionalTagline",
            "offerBadgeText",
            "bodyPoints",
            "whatsappBroadcastCopy",
            "audioJingleScript",
            "marketingTip",
            "ctaButtonText",
          ],
        },
      },
    });

    const adData = JSON.parse(response.text || "{}");
    return res.json({ success: true, ad: adData });
  } catch (error: any) {
    console.error("Error generating AI ad:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate ad. Please try again.",
    });
  }
});

// 3. Generate instant ad ideas when shopkeeper types custom products or excess stock
apiRouter.post("/custom-ideas", async (req, res) => {
  try {
    const { userPrompt, shopType } = req.body;
    const ai = getAiClient();

    const prompt = `A Kirana shopkeeper using HUL Shikhar wants creative advertisement ideas.
User input: "${userPrompt}"
Shop Type: "${shopType || "Neighborhood Kirana & General Store"}"

Generate 3 distinct, high-impact advertisement hooks linking this to popular HUL FMCG products, ongoing Indian consumer trends, and attractive bundle discounts.

Return JSON array of 3 ideas with:
- id: string
- title: catchy concept title
- trendHook: why this works now
- recommendedProducts: array of 2-3 HUL products
- offerFormula: discount formula (e.g. "Buy X get Y free", "Combo Saver ₹99")
- catchyTagline: punchy Hindi/Hinglish line
- expectedBenefit: e.g. "Fast inventory clearance", "Higher average bill value"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              trendHook: { type: Type.STRING },
              recommendedProducts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              offerFormula: { type: Type.STRING },
              catchyTagline: { type: Type.STRING },
              expectedBenefit: { type: Type.STRING },
            },
            required: [
              "id",
              "title",
              "trendHook",
              "recommendedProducts",
              "offerFormula",
              "catchyTagline",
              "expectedBenefit",
            ],
          },
        },
      },
    });

    const ideas = JSON.parse(response.text || "[]");
    return res.json({ success: true, ideas });
  } catch (error: any) {
    console.error("Error generating custom ideas:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback trend collection
function getFallbackTrends() {
  return [
    {
      id: "cricket-match-fever",
      title: "Match Day Chai & Munching Rush 🏏",
      category: "Cricket & Sports",
      trendContext:
        "High-voltage cricket match evenings create peak demand for hot tea, coffee, and quick snacks across all neighborhoods.",
      suggestedHULProducts: [
        "Brooke Bond Red Label Tea",
        "Bru Instant Coffee",
        "Knorr Soups",
      ],
      defaultOffer: "Match Day Combo: Buy Red Label 500g + Get ₹20 Off on Biscuits!",
      viralHookHindi: "चौके-छक्के का मज़ा और कड़क चाय की चुस्की! मैच डे पर स्पेशल छूट!",
      viralHookEnglish: "Every Sixer deserves a Kadak Chai! Special Match Day Kirana discount!",
      urgencyBadge: "🔥 Match Day Live",
      targetAudience: "Families, youth, cricket enthusiasts",
      iconName: "Trophy",
      gradientColors: ["#1e3a8a", "#0284c7"],
    },
    {
      id: "monsoon-stain-challenge",
      title: "Monsoon Mud & Deep Wash Season 🌧️",
      category: "Weather & Season",
      trendContext:
        "Rainy season brings muddy school uniforms, damp clothes, and heavy demand for powerful stain-removal detergents.",
      suggestedHULProducts: [
        "Surf Excel Easy Wash",
        "Rin Liquid Detergent",
        "Comfort Fabric Conditioner",
      ],
      defaultOffer: "Monsoon Special: Buy 2kg Surf Excel & Get 1 Free Vim Bar + ₹30 Off!",
      viralHookHindi: "बारिश के कीचड़ की नो टेंशन! जब आपके पास है सर्फ एक्सेल का सुपर पावर!",
      viralHookEnglish: "Rainy mud stains gone in 1 wash! Grab the Monsoon Wash Saver pack.",
      urgencyBadge: "🌧️ Monsoon Saver",
      targetAudience: "Mothers, homemakers, families",
      iconName: "CloudRain",
      gradientColors: ["#047857", "#10b981"],
    },
    {
      id: "summer-heat-glow",
      title: "Summer Freshness & Cool Bath Blast ☀️",
      category: "Weather & Season",
      trendContext:
        "Rising temperatures drive surge in cooling soaps, face wash, shampoos, and talcum powder.",
      suggestedHULProducts: [
        "Lifebuoy Neem Soap",
        "Dove Deep Moisture Bar",
        "Pond's Cold Cream & Talc",
        "Sunsilk Refresh Shampoo",
      ],
      defaultOffer: "Summer Chill Saver: Buy 4 Soaps & Get 1 Shampoo Sachet Strip Free!",
      viralHookHindi: "गर्मी में भी रहे फ्रेश और खुशबूदार! पाइए बेस्ट पर्सनल केयर डील्स!",
      viralHookEnglish: "Beat the Indian heat with 100% cooling freshness at your nearest Kirana!",
      urgencyBadge: "☀️ Beat The Heat",
      targetAudience: "Daily commuters, college students, families",
      iconName: "Sparkles",
      gradientColors: ["#d97706", "#f59e0b"],
    },
    {
      id: "festive-mithai-cleaning",
      title: "Tyohar & Kitchen Deep Clean Mahotsav 🪔",
      category: "Festivals & Culture",
      trendContext:
        "Pre-festival home preparation and oily cooking require grease-cutting dishwash bars and liquids.",
      suggestedHULProducts: [
        "Vim Liquid Dishwash Gel",
        "Vim Bar Anti-Bacterial",
        "Domex Disinfectant",
      ],
      defaultOffer: "Tyohar Clean Combo: Buy 1L Vim Gel & Get Free Scrub Pad + ₹15 Off!",
      viralHookHindi: "त्योहार की पकवान की चिकनाई झटपट साफ, विम के साथ चमक उठेगा किचन!",
      viralHookEnglish: "Shine your festive kitchen in seconds with Vim Power Gel savings.",
      urgencyBadge: "✨ Festive Deal",
      targetAudience: "Homemakers, sweet makers, party hosts",
      iconName: "Sparkles",
      gradientColors: ["#b45309", "#d97706"],
    },
    {
      id: "kids-exam-energy",
      title: "Kids Morning Nutrition & Exam Boost 🥛",
      category: "Health & Kids",
      trendContext:
        "Parents focus on children's morning breakfast, growth, and focus with health food drinks.",
      suggestedHULProducts: [
        "Horlicks Classic Malt",
        "Boost Health Drink",
        "Kissan Mixed Fruit Jam",
      ],
      defaultOffer: "Kids Power Pack: Horlicks 1kg Refill with Free Sipper Bottle!",
      viralHookHindi: "सुबह का पौष्टिक नाश्ता, बच्चों की पढ़ाई और खेल में जीत पक्की!",
      viralHookEnglish: "Fuel your champ's day with trusted nutrition & sweet Kirana savings!",
      urgencyBadge: "💪 Nutrition Week",
      targetAudience: "Parents with school-going children",
      iconName: "HeartPulse",
      gradientColors: ["#7c3aed", "#a855f7"],
    },
    {
      id: "weekend-kirana-bachat",
      title: "Mahabachat Weekend Grocery Mela 🏷️",
      category: "Bachat & Offers",
      trendContext:
        "Weekends trigger 40% of total weekly grocery basket buying as families stock up on essentials.",
      suggestedHULProducts: [
        "Surf Excel 4kg",
        "Closeup Triple Fresh Toothpaste",
        "Dove Hair Fall Rescue",
        "Red Label 1kg",
      ],
      defaultOffer: "Weekend Mahabachat: Flat ₹100 Off on Shopping above ₹999 + Free Delivery!",
      viralHookHindi: "सुपर वीकेंड किराना बचत मेला! बाज़ार से भी कम दाम, सीधा आपके घर!",
      viralHookEnglish: "Super Weekend Kirana Mela: Unbeatable savings on your favorite HUL brands!",
      urgencyBadge: "⚡ Weekend Special",
      targetAudience: "Monthly ration buyers, bulk grocery shoppers",
      iconName: "Tag",
      gradientColors: ["#dc2626", "#ea580c"],
    },
  ];
}
