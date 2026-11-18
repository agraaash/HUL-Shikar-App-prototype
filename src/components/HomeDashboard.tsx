import React from 'react';
import {
  Sparkles,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Coins,
  Flame,
  Zap,
  Tag,
  Share2,
  Trophy,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { KiranaShopProfile, TrendItem, HULProduct } from '../types';
import { HUL_PRODUCTS } from '../data/hulProducts';

interface HomeDashboardProps {
  profile: KiranaShopProfile;
  trends: TrendItem[];
  onSelectTrend: (trend: TrendItem) => void;
  onOpenAdStudio: () => void;
  onOpenWholesale: () => void;
  onOpenCampaigns: () => void;
  onOpenCustomIdea: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  trends,
  onSelectTrend,
  onOpenAdStudio,
  onOpenWholesale,
  onOpenCampaigns,
  onOpenCustomIdea,
}) => {
  const topFeaturedTrends = trends.slice(0, 3);
  const featuredProducts = HUL_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Welcome Bar with Shop Name & Tier */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Namaste, {profile.ownerName.split(' ')[0]} Ji! 🙏
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300">
              {profile.tier}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Store: <strong className="text-gray-800">{profile.shopName}</strong> • {profile.city || profile.address}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <Coins className="w-6 h-6 text-amber-500 fill-amber-400" />
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Shikhar Coins</p>
              <p className="text-base font-extrabold text-blue-950 leading-tight">
                {profile.shikharCoins.toLocaleString()}{' '}
                <span className="text-xs text-emerald-600 font-semibold">(₹{Math.floor(profile.shikharCoins * 0.5)} Value)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWholesale}
            className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Order Wholesale</span>
          </button>
        </div>
      </div>

      {/* FEATURE HERO: AI Trend AdStudio Spotlight Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002D62] via-[#0047AB] to-[#0A1172] text-white p-6 md:p-8 shadow-xl border border-blue-700/60">
        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-pink-500/20 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-blue-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            NEW FEATURE: SHIKHAR AI ADSTUDIO
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Turn Today’s Viral Trends into{' '}
            <span className="bg-gradient-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent underline decoration-amber-400">
              2x Kirana Store Sales!
            </span>
          </h2>

          <p className="mt-2 text-sm md:text-base text-blue-100/90 leading-relaxed">
            HUL AI automatically catches live weather alerts, cricket fever, and festive trends in your locality.
            Generate professional WhatsApp posters, printable shop banners, and rhyming Hindi audio announcements in 5 seconds!
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAdStudio}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-black text-sm md:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Flame className="w-5 h-5 text-red-600 fill-red-500 animate-bounce" />
              <span>Launch Trend Ad Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenCustomIdea}
              className="bg-blue-950/60 hover:bg-blue-900 text-white font-semibold text-xs md:text-sm px-4 py-3 rounded-xl border border-blue-400/30 transition flex items-center gap-2 backdrop-blur-xs"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Clear Dead Stock / Custom Idea</span>
            </button>
          </div>

          {/* Mini Highlights */}
          <div className="mt-6 pt-4 border-t border-blue-700/50 flex flex-wrap gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1-Click WhatsApp Broadcast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hindi, Marathi, Tamil + 8 Languages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>High-Res Printable Shop Posters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Trend Radar Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">
                🔥 Hot Trends Today in Your City
              </h3>
              <span className="bg-red-100 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                Live Radar
              </span>
            </div>
            <p className="text-xs text-gray-500">Pick any ongoing trend to build your customized Kirana advertisement</p>
          </div>

          <button
            onClick={onOpenAdStudio}
            className="text-xs md:text-sm font-bold text-[#004B91] hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>View All Trends ({trends.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topFeaturedTrends.map((trend) => (
            <div
              key={trend.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-200 transition-all flex flex-col justify-between group hover:border-blue-400"
            >
              <div>
                {/* Badge & Category */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {trend.urgencyBadge}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">{trend.category}</span>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-900 transition">
                  {trend.title}
                </h4>

                {/* Context */}
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{trend.trendContext}</p>

                {/* Offer Highlight */}
                <div className="mt-3 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs">
                  <p className="font-semibold text-amber-950 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{trend.defaultOffer}</span>
                  </p>
                  <p className="text-[11px] text-amber-800 mt-1 italic line-clamp-1">
                    "{trend.viralHookHindi}"
                  </p>
                </div>

                {/* Suggested Products */}
                <div className="mt-3">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Recommended HUL Brands:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trend.suggestedHULProducts.map((prod, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-md"
                      >
                        {prod.split(' ')[0]} {prod.split(' ')[1] || ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> High Demand
                </span>

                <button
                  onClick={() => onSelectTrend(trend)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Create Ad Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HUL Wholesale Scheme Highlights Bar */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Trade Schemes Active
              </span>
              <span className="text-xs text-emerald-200">Shikhar Direct Margin</span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">
              Stock Up on Surf Excel, Vim & Red Label: Earn up to 17.5% Retailer Margin + Extra Coins
            </h4>
          </div>
        </div>

        <button
          onClick={onOpenWholesale}
          className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View All Schemes & Order</span>
        </button>
      </div>

      {/* Top HUL FMCG Brands to Promote */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Top Selling HUL Brands in Your Locality
            </h3>
            <p className="text-xs text-gray-500">Highest margin products to feature on your WhatsApp ads</p>
          </div>
          <button
            onClick={onOpenWholesale}
            className="text-xs font-bold text-[#004B91] hover:underline flex items-center gap-1"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-28 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded">
                    {product.marginPercent}% Margin
                  </span>
                </div>

                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h5 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                  {product.name}
                </h5>
                <p className="text-[11px] text-gray-500 mt-0.5">{product.packSize}</p>

                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-gray-900">₹{product.wholesalePrice}</span>
                    <span className="text-[10px] text-gray-400 line-through ml-1.5">MRP ₹{product.mrp}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    Profit ₹{(product.mrp - product.wholesalePrice).toFixed(1)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTrend({
                    id: `promo-${product.id}`,
                    title: `${product.name} Special Kirana Deal`,
                    category: product.category,
                    trendContext: `High demand for ${product.brand} in neighborhood stores!`,
                    suggestedHULProducts: [product.name],
                    defaultOffer: `Special Price: MRP ₹${product.mrp}, now only ₹${product.wholesalePrice + 5}!`,
                    viralHookHindi: `${product.brand} पर आज पाइए सबसे बड़ा डिस्काउंट!`,
                    viralHookEnglish: `Grab authentic ${product.brand} at unbeatable prices!`,
                    urgencyBadge: '⚡ Super Deal',
                    targetAudience: 'Neighborhood buyers',
                  });
                }}
                className="mt-3 w-full py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Create Ad for this</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Retailer Testimonial / Growth Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center font-black text-blue-950 shrink-0 text-xl shadow-xs">
          🏆
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-sm font-bold text-amber-950">
            "Shikhar WhatsApp posters helped my shop get 42 extra home delivery orders during the India match!"
          </h4>
          <p className="text-xs text-amber-800 mt-0.5">
            — <strong>Rajesh Aggarwal</strong>, Aggarwal Daily Needs (Shikhar Diamond Partner, Jaipur)
          </p>
        </div>
        <button
          onClick={onOpenAdStudio}
          className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
        >
          Create Today’s Ad 🚀
        </button>
      </div>
    </div>
  );
};
