import React, { useState } from 'react';
import {
  X,
  Store,
  User,
  Phone,
  MapPin,
  QrCode,
  Truck,
  Globe,
  Save,
  Check,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { KiranaShopProfile, Language } from '../../types';

interface ShopSettingsModalProps {
  profile: KiranaShopProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: KiranaShopProfile) => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Hinglish', label: 'Hinglish (हिंग्लिश)' },
  { code: 'Marathi', label: 'मराठी (Marathi)' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)' },
  { code: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
];

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<KiranaShopProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003B73] via-[#004B91] to-[#002D62] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                My Kirana Store Settings & Branding
              </h3>
              <p className="text-xs text-blue-200">
                These details appear on your AI posters and WhatsApp promos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Shop Name & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                Shop / Store Name:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Store className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                Owner / Contact Person:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                WhatsApp Order Mobile Number:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Customers will WhatsApp here</p>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                UPI ID for QR Code Payments:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="storename@okaxis"
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <QrCode className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Generates QR code on posters</p>
            </div>
          </div>

          {/* Address & City */}
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
              Shop Address & Landmark:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop 12, Main Market, Near Subhash Chowk"
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* City & Pincode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                City / Town:
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                Pincode:
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery Radius & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                Free Home Delivery Radius:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.freeDeliveryRadius}
                  onChange={(e) => setFormData({ ...formData, freeDeliveryRadius: e.target.value })}
                  placeholder="2 km or 30 mins"
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Truck className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                Default Ad Language:
              </label>
              <div className="relative">
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredLanguage: e.target.value as Language })
                  }
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pl-8 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <Globe className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* HUL Verification Card */}
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-extrabold text-blue-950">Shikhar Retailer ID: {formData.retailerCode}</p>
                <p className="text-blue-800 text-[11px]">{formData.tier}</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved Successfully!' : 'Save Store Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
