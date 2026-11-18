import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Users,
  Sparkles,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedAd, KiranaShopProfile } from '../../types';

interface WhatsAppShareModalProps {
  ad: GeneratedAd;
  profile: KiranaShopProfile;
  isOpen: boolean;
  onClose: () => void;
  onRecordedShare: () => void;
}

const SAMPLE_CUSTOMER_GROUPS = [
  { id: 'all', name: '👥 All Neighborhood Customers Broadcast', count: '340 contacts' },
  { id: 'society', name: '🏢 Shanti Heights Apartment Group', count: '85 families' },
  { id: 'morning', name: '☕ Morning Walkers & Chai Club', count: '45 members' },
  { id: 'custom', name: '📱 Send to Specific WhatsApp Number', count: 'Direct 1-on-1' },
];

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  ad,
  profile,
  isOpen,
  onClose,
  onRecordedShare,
}) => {
  const [broadcastText, setBroadcastText] = useState(ad.whatsappBroadcastCopy || '');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [targetNumber, setTargetNumber] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShareToWhatsApp = () => {
    // Trigger celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    onRecordedShare();

    const encodedText = encodeURIComponent(broadcastText);
    let url = `https://api.whatsapp.com/send?text=${encodedText}`;

    if (selectedGroup === 'custom' && targetNumber.trim()) {
      const cleanNum = targetNumber.replace(/[^0-9]/g, '');
      url = `https://api.whatsapp.com/send?phone=${cleanNum}&text=${encodedText}`;
    }

    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(broadcastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Share Promo to WhatsApp Customers
              </h3>
              <p className="text-xs text-emerald-100">
                1-Click broadcast for {profile.shopName}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Target Group Selector */}
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
              Select WhatsApp Broadcast Target:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_CUSTOMER_GROUPS.map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setSelectedGroup(grp.id)}
                  className={`p-3 rounded-xl text-left border transition text-xs font-semibold ${
                    selectedGroup === grp.id
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="font-bold truncate">{grp.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{grp.count}</p>
                </button>
              ))}
            </div>

            {selectedGroup === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={targetNumber}
                  onChange={(e) => setTargetNumber(e.target.value)}
                  placeholder="Enter 10-digit mobile (e.g., 9876543210)"
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Editable Broadcast Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                WhatsApp Message Preview & Editor:
              </label>
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-3.5 text-xs text-gray-800 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed shadow-inner"
            />
          </div>

          {/* Marketing Tip */}
          {ad.marketingTip && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Shikhar AI Recommendation: </span>
                <span>{ad.marketingTip}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleShareToWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast to WhatsApp Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
