import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  Store,
  Phone,
  MapPin,
  Sparkles,
  QrCode,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { GeneratedAd, KiranaShopProfile, VisualTheme, AdFormat } from '../../types';
import { HUL_PRODUCTS } from '../../data/hulProducts';

export interface PosterCanvasRef {
  downloadAsImage: () => Promise<void>;
  printPoster: () => void;
}

interface PosterPreviewCanvasProps {
  ad: GeneratedAd;
  profile: KiranaShopProfile;
  theme: VisualTheme;
  format: AdFormat;
  showQrCode: boolean;
  showDeliveryBadge: boolean;
  showAddress: boolean;
  showPhone: boolean;
}

const THEME_STYLES: Record<
  VisualTheme,
  {
    bgGradient: string;
    headerBg: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    badgeBg: string;
    badgeText: string;
    accentBorder: string;
    taglineBg: string;
    footerBg: string;
  }
> = {
  'royal-blue': {
    bgGradient: 'from-[#002D62] via-[#0047AB] to-[#001D4A]',
    headerBg: 'bg-blue-950/80',
    cardBg: 'bg-white/95 text-gray-900',
    textPrimary: 'text-white',
    textSecondary: 'text-blue-100',
    badgeBg: 'bg-amber-400 text-blue-950',
    badgeText: 'text-blue-950',
    accentBorder: 'border-amber-400/50',
    taglineBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    footerBg: 'bg-[#001A38]',
  },
  'monsoon-green': {
    bgGradient: 'from-[#064E3B] via-[#047857] to-[#022C22]',
    headerBg: 'bg-emerald-950/80',
    cardBg: 'bg-white/95 text-gray-900',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-100',
    badgeBg: 'bg-amber-400 text-emerald-950',
    badgeText: 'text-emerald-950',
    accentBorder: 'border-emerald-300/50',
    taglineBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40',
    footerBg: 'bg-[#022018]',
  },
  'festive-gold': {
    bgGradient: 'from-[#78350F] via-[#B45309] to-[#451A03]',
    headerBg: 'bg-amber-950/80',
    cardBg: 'bg-white/95 text-gray-900',
    textPrimary: 'text-white',
    textSecondary: 'text-amber-100',
    badgeBg: 'bg-yellow-300 text-amber-950',
    badgeText: 'text-amber-950',
    accentBorder: 'border-yellow-400/60',
    taglineBg: 'bg-yellow-400/25 text-yellow-200 border-yellow-400/50',
    footerBg: 'bg-[#2E1102]',
  },
  'cricket-neon': {
    bgGradient: 'from-[#1E1B4B] via-[#2E1065] to-[#0F172A]',
    headerBg: 'bg-indigo-950/80',
    cardBg: 'bg-white/95 text-gray-900',
    textPrimary: 'text-white',
    textSecondary: 'text-indigo-200',
    badgeBg: 'bg-lime-400 text-indigo-950',
    badgeText: 'text-indigo-950',
    accentBorder: 'border-lime-400/60',
    taglineBg: 'bg-lime-400/20 text-lime-300 border-lime-400/40',
    footerBg: 'bg-[#0A051E]',
  },
  'fresh-orange': {
    bgGradient: 'from-[#991B1B] via-[#C2410C] to-[#7C2D12]',
    headerBg: 'bg-orange-950/80',
    cardBg: 'bg-white/95 text-gray-900',
    textPrimary: 'text-white',
    textSecondary: 'text-orange-100',
    badgeBg: 'bg-amber-300 text-red-950',
    badgeText: 'text-red-950',
    accentBorder: 'border-amber-400/60',
    taglineBg: 'bg-amber-400/20 text-amber-200 border-amber-300/40',
    footerBg: 'bg-[#431407]',
  },
  'clean-white': {
    bgGradient: 'from-blue-50 via-white to-gray-100',
    headerBg: 'bg-[#0047AB] text-white',
    cardBg: 'bg-white text-gray-900 border border-gray-200 shadow-md',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    badgeBg: 'bg-[#0047AB] text-white',
    badgeText: 'text-white',
    accentBorder: 'border-blue-300',
    taglineBg: 'bg-blue-100 text-blue-900 border-blue-200',
    footerBg: 'bg-[#002D62] text-white',
  },
};

export const PosterPreviewCanvas = forwardRef<PosterCanvasRef, PosterPreviewCanvasProps>(
  (
    {
      ad,
      profile,
      theme,
      format,
      showQrCode,
      showDeliveryBadge,
      showAddress,
      showPhone,
    },
    ref
  ) => {
    const posterContainerRef = useRef<HTMLDivElement>(null);
    const styles = THEME_STYLES[theme] || THEME_STYLES['royal-blue'];

    // Find matched products for images & pricing
    const matchedProducts = (ad.selectedProducts || [])
      .map((pName) =>
        HUL_PRODUCTS.find((p) =>
          p.name.toLowerCase().includes(pName.toLowerCase()) ||
          pName.toLowerCase().includes(p.brand.toLowerCase())
        )
      )
      .filter(Boolean) as typeof HUL_PRODUCTS;

    // Fallback if none matched
    const displayProducts =
      matchedProducts.length > 0 ? matchedProducts.slice(0, 3) : HUL_PRODUCTS.slice(0, 2);

    // Export high-resolution image using canvas rasterization
    const downloadAsImage = async () => {
      if (!posterContainerRef.current) return;

      const element = posterContainerRef.current;
      const width = element.offsetWidth * 2;
      const height = element.offsetHeight * 2;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw SVG foreignObject wrapper to convert HTML to crisp image
      const data = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="transform: scale(2); transform-origin: top left; width: ${element.offsetWidth}px; height: ${element.offsetHeight}px;">
              ${new XMLSerializer().serializeToString(element)}
            </div>
          </foreignObject>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${profile.shopName.replace(/\s+/g, '_')}_${ad.category}_Poster.png`;
        downloadLink.href = pngUrl;
        downloadLink.click();
      };
      img.src = url;
    };

    const printPoster = () => {
      window.print();
    };

    useImperativeHandle(ref, () => ({
      downloadAsImage,
      printPoster,
    }));

    // Determine dimensions based on format
    const aspectClass =
      format === 'whatsapp_story'
        ? 'aspect-[9/16] max-w-[360px]'
        : format === 'square_post'
        ? 'aspect-square max-w-[420px]'
        : 'aspect-[3/4] max-w-[420px]'; // A4 print style

    return (
      <div className="w-full flex justify-center items-center p-2 select-none">
        <div
          ref={posterContainerRef}
          className={`w-full ${aspectClass} rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b ${styles.bgGradient} flex flex-col justify-between relative border-2 ${styles.accentBorder} print:border-none print:shadow-none`}
          style={{ minHeight: format === 'whatsapp_story' ? '580px' : '480px' }}
        >
          {/* Decorative Background Accents */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

          {/* TOP HEADER: Store Name & Shikhar Verified Badge */}
          <div className={`p-3 md:p-3.5 ${styles.headerBg} border-b ${styles.accentBorder} backdrop-blur-xs flex items-center justify-between gap-2 z-10`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                🏪
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-white text-xs md:text-sm tracking-tight truncate">
                  {profile.shopName}
                </h3>
                <p className="text-[10px] text-amber-300 font-medium flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  Verified HUL Shikhar Retailer
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                {ad.category || 'Special Deal'}
              </span>
            </div>
          </div>

          {/* MAIN POSTER BODY */}
          <div className="p-3 md:p-4 flex-1 flex flex-col justify-between z-10 space-y-2.5">
            {/* Trend Hook Ribbon */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white border border-white/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {ad.trendTitle}
              </span>
            </div>

            {/* Big Bold Localized Headline */}
            <div className="text-center px-1">
              <h2 className="text-lg md:text-xl font-black text-white leading-tight drop-shadow-md">
                {ad.mainHeadline}
              </h2>
              <p className={`text-xs ${styles.textSecondary} font-semibold mt-0.5`}>
                {ad.subHeadline}
              </p>
            </div>

            {/* GIANT OFFER STICKER / BADGE */}
            <div className="flex justify-center my-1">
              <div className="relative group">
                <div className={`px-4 py-2 rounded-2xl ${styles.badgeBg} font-black text-sm md:text-base tracking-wide shadow-xl border-2 border-white transform -rotate-1 flex items-center gap-2`}>
                  <Tag className="w-4 h-4 shrink-0" />
                  <span>{ad.offerBadgeText || ad.customOfferText || 'SPECIAL FESTIVE OFFER'}</span>
                </div>
              </div>
            </div>

            {/* Regional Tagline / Rhyme Banner */}
            {ad.regionalTagline && (
              <div className={`p-2 rounded-xl border text-center ${styles.taglineBg} text-xs font-bold leading-snug`}>
                "{ad.regionalTagline}"
              </div>
            )}

            {/* HUL Product Showcase Packshots */}
            <div className="grid grid-cols-2 gap-2 my-1">
              {displayProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl ${styles.cardBg} flex items-center gap-2 shadow-md relative overflow-hidden`}
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-12 h-12 object-contain shrink-0 bg-gray-50 rounded-lg p-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider block">
                      {prod.brand}
                    </span>
                    <p className="text-[11px] font-bold text-gray-900 leading-tight truncate">
                      {prod.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-extrabold text-emerald-700">
                        ₹{prod.wholesalePrice + 10}
                      </span>
                      <span className="text-[9px] text-gray-400 line-through">
                        ₹{prod.mrp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Bullets & Free Delivery */}
            <div className="space-y-1 bg-black/20 p-2 rounded-xl backdrop-blur-xs text-[11px] text-white">
              {ad.bodyPoints?.slice(0, 2).map((pt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{pt}</span>
                </div>
              ))}

              {showDeliveryBadge && (
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>🛵 30-Min Free Home Delivery in {profile.freeDeliveryRadius || '2 km'}</span>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM FOOTER: Contact, Address, QR & WhatsApp CTA */}
          <div className={`p-3 ${styles.footerBg} text-white border-t ${styles.accentBorder} z-10`}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 space-y-0.5 flex-1">
                {showPhone && (
                  <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                    <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>WhatsApp: {profile.whatsappNumber || profile.phone}</span>
                  </div>
                )}
                {showAddress && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-300 truncate">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{profile.address}</span>
                  </div>
                )}
              </div>

              {/* QR Code / Action Stamp */}
              {showQrCode && (
                <div className="bg-white p-1 rounded-lg text-gray-900 text-center shrink-0 shadow-md">
                  <QrCode className="w-8 h-8 mx-auto" />
                  <span className="text-[7px] font-black uppercase tracking-tighter block leading-none mt-0.5">
                    SCAN TO ORDER
                  </span>
                </div>
              )}
            </div>

            {/* Prominent CTA Pill */}
            <div className="mt-2 text-center">
              <div className="inline-block w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-lg shadow-md uppercase tracking-wider text-center">
                {ad.ctaButtonText || '📲 Order on WhatsApp Now!'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
