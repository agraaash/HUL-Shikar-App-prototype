import React, { useState } from 'react';
import {
  Store,
  Coins,
  Globe,
  Bell,
  Sparkles,
  ChevronDown,
  Check,
  ShieldCheck,
  Flame,
  User,
  Settings,
} from 'lucide-react';
import { KiranaShopProfile, Language } from '../types';

interface HeaderProps {
  profile: KiranaShopProfile;
  onUpdateProfile: (updated: Partial<KiranaShopProfile>) => void;
  onOpenSettings: () => void;
  onOpenAdStudio: () => void;
}

const SAMPLE_SHOPS: { name: string; city: string; address: string; phone: string }[] = [
  {
    name: 'Shree Ganesh Kirana & Superstore',
    city: 'Kanpur, UP',
    address: 'Shop 12, Subhash Chowk, Kanpur',
    phone: '+91 98765 43210',
  },
  {
    name: 'Gupta Daily Needs & Provisions',
    city: 'Rohini, Delhi',
    address: 'Plot 45, Sector 9, Rohini, Delhi',
    phone: '+91 98112 34567',
  },
  {
    name: 'Maha Laxmi Super Mart',
    city: 'Pune, Maharashtra',
    address: 'Near Gandhi Park, Kothrud, Pune',
    phone: '+91 98220 98765',
  },
  {
    name: 'Sri Krishna Kirana & General Store',
    city: 'T. Nagar, Chennai',
    address: '32 Ranganathan Street, Chennai',
    phone: '+91 98401 23456',
  },
];

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Hinglish', label: 'Hinglish', native: 'हिंग्लिश' },
  { code: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'Bengali', label: 'Bengali', native: 'বাংলা' },
  { code: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
];

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  onOpenSettings,
  onOpenAdStudio,
}) => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#003B73] via-[#004B91] to-[#002D62] text-white shadow-lg border-b border-blue-800">
      {/* Top micro-bar */}
      <div className="bg-[#002244] px-4 py-1 text-xs flex items-center justify-between text-blue-200 border-b border-blue-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">Hindustan Unilever Limited</span>
          <span className="text-blue-400">|</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Shikhar Official Retailer Network
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdStudio}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium bg-amber-500/20 px-2 py-0.5 rounded-full text-[11px] animate-pulse"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>AI AdStudio: 3 Hot Trends Today</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Shikhar Logo + Shop Selector */}
        <div className="flex items-center gap-3">
          {/* Logo Badge */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenAdStudio}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shadow-md flex items-center justify-center font-black tracking-wider text-xl text-white border border-blue-300/30">
              <span className="tracking-tighter bg-gradient-to-br from-white to-amber-200 bg-clip-text text-transparent">
                शिखर
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                  SHIKHAR
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400 text-blue-950 px-1.5 py-0.2 rounded-sm ml-1">
                    AI PRO
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-blue-200 -mt-0.5">HUL Retailer Growth App</p>
            </div>
          </div>

          <div className="hidden sm:block h-7 w-[1px] bg-blue-700/60 mx-1" />

          {/* Shop Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowShopDropdown(!showShopDropdown)}
              className="flex items-center gap-2 bg-blue-900/60 hover:bg-blue-800/80 px-3 py-1.5 rounded-lg text-left transition border border-blue-700/50"
            >
              <Store className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="max-w-[140px] md:max-w-[200px] truncate">
                <p className="text-xs font-semibold text-white truncate">{profile.shopName}</p>
                <p className="text-[10px] text-blue-300 truncate">{profile.city || profile.address}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
            </button>

            {showShopDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-500 flex justify-between items-center">
                  <span>SELECT RETAILER STORE</span>
                  <span className="text-blue-600 cursor-pointer" onClick={onOpenSettings}>
                    Edit Details
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {SAMPLE_SHOPS.map((shop, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onUpdateProfile({
                          shopName: shop.name,
                          city: shop.city,
                          address: shop.address,
                          phone: shop.phone,
                          whatsappNumber: shop.phone,
                        });
                        setShowShopDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-start gap-2 transition"
                    >
                      <Store className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{shop.name}</p>
                        <p className="text-gray-500 text-[11px] truncate">{shop.address}</p>
                      </div>
                      {profile.shopName === shop.name && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50/70">
                  <button
                    onClick={() => {
                      setShowShopDropdown(false);
                      onOpenSettings();
                    }}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Customize My Kirana Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Coins, Tier, Language, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Shikhar Coins Balance */}
          <div className="flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/40 text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold shadow-inner">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            <span>{profile.shikharCoins.toLocaleString()}</span>
            <span className="hidden sm:inline text-[10px] text-amber-200/80 font-normal">Coins</span>
          </div>

          {/* Tier Badge */}
          <div className="hidden lg:flex items-center gap-1 bg-blue-800/70 border border-blue-600/50 px-2.5 py-1 rounded-full text-xs text-blue-100">
            <span className="text-amber-400">★</span>
            <span className="font-medium text-[11px]">{profile.tier}</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 bg-blue-900/60 hover:bg-blue-800/80 px-2.5 py-1.5 rounded-lg text-xs text-blue-100 border border-blue-700/50 transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-medium">{profile.preferredLanguage}</span>
              <ChevronDown className="w-3 h-3 text-blue-300" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 border-b border-gray-100">
                  SELECT LANGUAGE
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onUpdateProfile({ preferredLanguage: lang.code });
                      setShowLangDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 flex items-center justify-between transition"
                  >
                    <span className="font-medium text-gray-800">{lang.native}</span>
                    <span className="text-gray-400 text-[11px]">{lang.label}</span>
                    {profile.preferredLanguage === lang.code && (
                      <Check className="w-3.5 h-3.5 text-blue-600 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-blue-200 hover:text-white bg-blue-900/60 hover:bg-blue-800/80 rounded-lg border border-blue-700/50 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#003B73]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-bold text-xs text-gray-900">Shikhar Alerts</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                    3 New
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-xs">
                    <p className="font-semibold text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Trending: Cricket Match Tonight!
                    </p>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Create Red Label Tea & Munchies WhatsApp poster now to boost sales.
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50/80 rounded-lg border border-blue-200 text-xs">
                    <p className="font-semibold text-blue-900">🌧️ Monsoon Wash Scheme</p>
                    <p className="text-blue-800 text-[11px] mt-0.5">
                      Buy 12 Surf Excel packs and claim extra ₹120 wholesale cashback.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile / Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-semibold rounded-lg transition flex items-center gap-1 text-xs shadow-sm"
            title="Shop Settings & Delivery Details"
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline font-bold">My Shop</span>
          </button>
        </div>
      </div>
    </header>
  );
};
