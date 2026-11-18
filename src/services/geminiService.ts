import { GeneratedAd, TrendItem, CustomAdIdea, Language, VisualTheme } from '../types';
import { DEFAULT_TRENDS } from '../data/defaultTrends';

export interface GenerateAdParams {
  trendTitle: string;
  category: string;
  products: string[];
  customOffer?: string;
  shopName: string;
  ownerName: string;
  shopAddress: string;
  shopPhone: string;
  language: Language;
  targetGoal?: string;
  specialNotes?: string;
}

export async function fetchLiveTrends(): Promise<TrendItem[]> {
  try {
    const res = await fetch('/api/trends');
    if (!res.ok) throw new Error('Failed to fetch trends');
    const data = await res.json();
    if (data.trends && data.trends.length > 0) {
      return data.trends;
    }
    return DEFAULT_TRENDS;
  } catch (err) {
    console.warn('API trends fetch error, falling back to default trends:', err);
    return DEFAULT_TRENDS;
  }
}

export async function generateKiranaAd(params: GenerateAdParams): Promise<GeneratedAd> {
  try {
    const res = await fetch('/api/generate-ad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Ad generation failed');
    }

    const data = await res.json();
    const ad: GeneratedAd = {
      ...data.ad,
      trendTitle: params.trendTitle,
      category: params.category,
      selectedProducts: params.products,
      customOfferText: params.customOffer,
      recommendedVisualTheme: (data.ad.recommendedVisualTheme as VisualTheme) || 'royal-blue',
      createdAt: new Date().toISOString(),
      sharesCount: 0,
      viewsEstimate: 120 + Math.floor(Math.random() * 80),
    };

    return ad;
  } catch (err: any) {
    console.error('Error calling /api/generate-ad, building smart client fallback:', err);
    // Intelligent client-side fallback
    return buildFallbackAd(params);
  }
}

export async function generateCustomIdeas(prompt: string, shopType?: string): Promise<CustomAdIdea[]> {
  try {
    const res = await fetch('/api/custom-ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userPrompt: prompt, shopType }),
    });

    if (!res.ok) throw new Error('Failed to fetch custom ideas');
    const data = await res.json();
    return data.ideas || [];
  } catch (err) {
    console.warn('Error fetching custom ideas, returning tailored ideas:', err);
    return [
      {
        id: 'idea-1',
        title: 'Super Clearance Flash Combo 💥',
        trendHook: 'Fast clearance with irresistible bundle price',
        recommendedProducts: ['Surf Excel Easy Wash Detergent Powder', 'Vim Anti-Bacterial Dishwash Bar'],
        offerFormula: 'Buy 2 get 1 Free or Flat ₹40 Off',
        catchyTagline: 'दुकान का महा-ऑफर, सीमित समय के लिए!',
        expectedBenefit: 'Clear excess stock within 48 hours',
      },
      {
        id: 'idea-2',
        title: 'Daily Essentials Morning Pack ☀️',
        trendHook: 'Daily morning routine needs',
        recommendedProducts: ['Brooke Bond Red Label Tea Pouch', 'Dove Deep Moisture Beauty Bathing Bar'],
        offerFormula: 'Combo Saver: Save ₹35 on Pair',
        catchyTagline: 'सुबह की ताजगी, दिनभर की ऊर्जा!',
        expectedBenefit: 'Increases basket size from regular customers',
      },
      {
        id: 'idea-3',
        title: 'Family Hygiene Shield Kit 🛡️',
        trendHook: 'Health and cleanliness top-of-mind',
        recommendedProducts: ['Lifebuoy Total 10 Germ Protection Soap', 'Closeup Everfresh Red Hot Toothpaste'],
        offerFormula: 'Family Pack ₹199 Only',
        catchyTagline: 'सुरक्षित परिवार, खुशहाल घर!',
        expectedBenefit: 'Attracts mothers & bulk buyers',
      },
    ];
  }
}

function buildFallbackAd(params: GenerateAdParams): GeneratedAd {
  const prodNames = params.products.join(' & ');
  const offer = params.customOffer || 'Buy 2 Get 1 Free or Flat ₹25 OFF';

  return {
    trendTitle: params.trendTitle,
    category: params.category,
    mainHeadline: `${params.shopName} का स्पेशल धमाका ऑफर!`,
    subHeadline: `${prodNames} पर पाइए सबसे बड़ी छूट!`,
    regionalTagline: 'असली HUL क्वालिटी, सबसे किफ़ायती दाम - सिर्फ़ आपके नज़दीकी स्टोर पर!',
    regionalTaglineDevanagari: 'असली HUL क्वालिटी, सबसे किफ़ायती दाम!',
    offerBadgeText: '💥 ' + (params.customOffer ? params.customOffer.slice(0, 20) : 'विशेष छूट ₹30 तक'),
    bodyPoints: [
      '100% असली और ताज़ा हिंदुस्तान यूनिलीवर (HUL) प्रोडक्ट्स',
      'बाज़ार और ऑनलाइन ऐप्स से भी कम दाम में तुरंत उपलब्ध',
      `फ़्री होम डिलीवरी सुविधा: 30 मिनट में आपके दरवाज़े पर!`,
    ],
    whatsappBroadcastCopy: `✨ *विशेष किराना ऑफर - ${params.shopName}* ✨\n\nनमस्ते पड़ोसियों! 🌸\n\nआज आपके लिए *${params.trendTitle}* पर स्पेशल डिस्काउंट:\n\n🔥 *ऑफर:* ${offer}\n📦 *प्रोडक्ट्स:* ${prodNames}\n\n📍 *दुकान का पता:* ${params.shopAddress}\n📞 *ऑर्डर करने के लिए अभी कॉल या WhatsApp करें:* ${params.shopPhone}\n\n🛵 _मुफ़्त होम डिलीवरी (30 मिनट में)!_\n*स्टॉक सीमित है, जल्दी आर्डर करें!*`,
    audioJingleScript: `नमस्ते भाइयों और बहनों! आपके अपने ${params.shopName} में आ गया है शानदार ऑफर! ${prodNames} पर मिल रही है भारी छूट! देर न करें, आज ही पधारें या फोन करके घर बैठे मंगवाएं!`,
    marketingTip: 'इस विज्ञापन को सुबह 8 बजे या शाम 5 बजे अपने WhatsApp स्टेटस और मोहल्ले के ग्रुप में शेयर करें!',
    recommendedVisualTheme: 'royal-blue',
    ctaButtonText: 'Order on WhatsApp 📲',
    selectedProducts: params.products,
    customOfferText: params.customOffer,
    createdAt: new Date().toISOString(),
    sharesCount: 0,
    viewsEstimate: 140,
  };
}
