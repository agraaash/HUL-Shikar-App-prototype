import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Minus,
  Sparkles,
  Percent,
  Coins,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Tag,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { HULProduct, KiranaShopProfile, TrendItem } from '../../types';
import { HUL_PRODUCTS } from '../../data/hulProducts';
import confetti from 'canvas-confetti';

interface ProductCatalogProps {
  profile: KiranaShopProfile;
  onUpdateProfile: (updated: Partial<KiranaShopProfile>) => void;
  onLaunchAdForProduct: (trend: TrendItem) => void;
  initialFilterProducts?: string[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  profile,
  onUpdateProfile,
  onLaunchAdForProduct,
  initialFilterProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState(
    initialFilterProducts && initialFilterProducts.length > 0 ? initialFilterProducts[0] : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = ['All', 'Home Care', 'Beauty & Personal Care', 'Foods & Refreshment', 'Health & Nutrition'];

  const filteredProducts = HUL_PRODUCTS.filter((product) => {
    const matchesCat = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  // Calculate cart totals
  const totalItems = Object.values(cart).reduce<number>((acc, qty) => acc + Number(qty), 0);
  const totalWholesaleValue = Object.entries(cart).reduce<number>((acc, [pId, qty]) => {
    const prod = HUL_PRODUCTS.find((p) => p.id === pId);
    return acc + (prod ? prod.wholesalePrice * Number(qty) : 0);
  }, 0);

  const totalMrpValue = Object.entries(cart).reduce<number>((acc, [pId, qty]) => {
    const prod = HUL_PRODUCTS.find((p) => p.id === pId);
    return acc + (prod ? prod.mrp * Number(qty) : 0);
  }, 0);

  const totalProfit = totalMrpValue - totalWholesaleValue;
  const totalCoinsEarned = Object.entries(cart).reduce<number>((acc, [pId, qty]) => {
    const prod = HUL_PRODUCTS.find((p) => p.id === pId);
    return acc + (prod ? prod.shikharCoins * Number(qty) : 0);
  }, 0);

  const handlePlaceOrder = () => {
    if (totalItems === 0) return;

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    // Add Shikhar coins to profile
    onUpdateProfile({
      shikharCoins: profile.shikharCoins + totalCoinsEarned,
    });

    setOrderSuccess(true);
    setCart({});
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#002D62] via-[#0047AB] to-[#002244] text-white p-6 md:p-8 rounded-2xl shadow-md border border-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              Official HUL Wholesale Portal
            </span>
            <span className="text-blue-200 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Genuine HUL Supply
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            HUL Trade Catalog & Scheme Margin Calculator
          </h2>
          <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
            Order fast-selling promotional stocks directly to your Kirana store. Earn direct wholesale margins up to 17.5% and earn Shikhar Coins!
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-xs flex items-center gap-3">
          <Truck className="w-8 h-8 text-amber-300 shrink-0" />
          <div>
            <p className="text-xs text-blue-200">Next Distributor Dispatch</p>
            <p className="text-sm font-black text-white">Tomorrow by 11:00 AM</p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {orderSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-950 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">
                Wholesale Order Placed Successfully! (Ref: #HUL-{Math.floor(100000 + Math.random() * 900000)})
              </p>
              <p className="text-xs text-emerald-800">
                Your distributor will deliver tomorrow morning. You earned <strong>+{totalCoinsEarned} Shikhar Coins</strong>!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-lg">
            Confirmed
          </span>
        </div>
      )}

      {/* Category Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Surf Excel, Dove, Vim..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const qty = cart[product.id] || 0;
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 shadow-xs hover:shadow-md border border-gray-200 transition flex flex-col justify-between"
            >
              <div>
                {/* Image & Scheme Tag */}
                <div className="relative h-40 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {product.brand}
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                    {product.marginPercent}% Margin
                  </div>
                </div>

                {/* Name & Pack */}
                <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{product.packSize}</p>

                {/* Scheme Offer Box */}
                <div className="mt-2.5 p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <p className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                    <Tag className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{product.schemeTag}</span>
                  </p>
                </div>

                {/* Pricing & Margin Breakdown */}
                <div className="mt-3 grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">Wholesale</span>
                    <span className="text-xs font-black text-gray-900">₹{product.wholesalePrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">MRP</span>
                    <span className="text-xs font-black text-gray-500">₹{product.mrp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 block uppercase font-bold">Your Profit</span>
                    <span className="text-xs font-black text-emerald-700">
                      ₹{(product.mrp - product.wholesalePrice).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart + Create Ad */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {qty === 0 ? (
                    <button
                      onClick={() => handleUpdateQuantity(product.id, 1)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-between bg-blue-50 border border-blue-300 rounded-xl p-1">
                      <button
                        onClick={() => handleUpdateQuantity(product.id, -1)}
                        className="w-7 h-7 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold shadow-xs hover:bg-blue-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-xs text-blue-950">
                        {qty} {qty === 1 ? 'Pack' : 'Packs'}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(product.id, 1)}
                        className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold shadow-xs hover:bg-blue-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Create AI Ad for this Product button */}
                  <button
                    onClick={() => {
                      onLaunchAdForProduct({
                        id: `promo-${product.id}`,
                        title: `${product.brand} Special Discount Rush 🛒`,
                        category: product.category,
                        trendContext: `Exclusive neighborhood discount on genuine ${product.name}!`,
                        suggestedHULProducts: [product.name],
                        defaultOffer: `Special Price: MRP ₹${product.mrp}, now only ₹${product.wholesalePrice + 8}!`,
                        viralHookHindi: `${product.brand} का असली क्वालिटी माल, बाज़ार से कम दाम में!`,
                        viralHookEnglish: `Grab authentic ${product.brand} at special Kirana discount today!`,
                        urgencyBadge: '⚡ Best Offer',
                        targetAudience: 'Neighborhood families',
                      });
                    }}
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                    title="Create AI Ad for this Product"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Create Ad</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Wholesale Order Summary Bar (Sticky when cart has items) */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-3xl mx-auto z-40 bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 font-black flex items-center justify-center text-sm shrink-0">
              {totalItems}
            </div>
            <div>
              <p className="text-xs text-blue-200">
                {totalItems} items • Total Wholesale: <strong className="text-white">₹{totalWholesaleValue}</strong>
              </p>
              <p className="text-xs text-emerald-400 font-bold">
                Your Margin: ₹{totalProfit.toFixed(0)} • +{totalCoinsEarned} Shikhar Coins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePlaceOrder}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-black text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Confirm Wholesale Order</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
