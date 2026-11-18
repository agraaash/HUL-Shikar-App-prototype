export type Language =
  | 'English'
  | 'Hindi'
  | 'Hinglish'
  | 'Marathi'
  | 'Tamil'
  | 'Telugu'
  | 'Bengali'
  | 'Gujarati';

export type AdFormat = 'whatsapp_story' | 'square_post' | 'print_poster' | 'text_broadcast' | 'audio_jingle';

export type VisualTheme = 'royal-blue' | 'monsoon-green' | 'festive-gold' | 'cricket-neon' | 'fresh-orange' | 'clean-white';

export interface TrendItem {
  id: string;
  title: string;
  category: string;
  trendContext: string;
  suggestedHULProducts: string[];
  defaultOffer: string;
  viralHookHindi: string;
  viralHookEnglish: string;
  urgencyBadge: string;
  targetAudience: string;
  iconName?: string;
  gradientColors?: string[];
}

export interface HULProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Home Care' | 'Beauty & Personal Care' | 'Foods & Refreshment' | 'Health & Nutrition';
  packSize: string;
  mrp: number;
  wholesalePrice: number;
  marginPercent: number;
  schemeTag: string;
  imageUrl: string;
  popularComboWith?: string;
  description: string;
  shikharCoins: number;
}

export interface KiranaShopProfile {
  shopName: string;
  ownerName: string;
  retailerCode: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  pincode: string;
  upiId: string;
  freeDeliveryRadius: string;
  minOrderValue: number;
  shikharCoins: number;
  tier: 'Gold Shikhar Partner' | 'Platinum Shikhar Partner' | 'Diamond Club';
  tagline: string;
  preferredLanguage: Language;
}

export interface GeneratedAd {
  id?: string;
  trendTitle: string;
  category: string;
  mainHeadline: string;
  subHeadline: string;
  regionalTagline: string;
  regionalTaglineDevanagari?: string;
  offerBadgeText: string;
  bodyPoints: string[];
  whatsappBroadcastCopy: string;
  audioJingleScript: string;
  marketingTip: string;
  recommendedVisualTheme: VisualTheme;
  ctaButtonText: string;
  selectedProducts: string[];
  customOfferText?: string;
  format?: AdFormat;
  createdAt?: string;
  sharesCount?: number;
  viewsEstimate?: number;
}

export interface CustomAdIdea {
  id: string;
  title: string;
  trendHook: string;
  recommendedProducts: string[];
  offerFormula: string;
  catchyTagline: string;
  expectedBenefit: string;
}
