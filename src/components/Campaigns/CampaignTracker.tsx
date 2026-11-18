import React from 'react';
import {
  Megaphone,
  Share2,
  Download,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Eye,
  Plus,
  CheckCircle,
  Tag,
  Phone,
} from 'lucide-react';
import { GeneratedAd, KiranaShopProfile } from '../../types';

interface CampaignTrackerProps {
  campaigns: GeneratedAd[];
  profile: KiranaShopProfile;
  onSelectCampaign: (ad: GeneratedAd) => void;
  onDeleteCampaign: (index: number) => void;
  onCreateNew: () => void;
}

export const CampaignTracker: React.FC<CampaignTrackerProps> = ({
  campaigns,
  profile,
  onSelectCampaign,
  onDeleteCampaign,
  onCreateNew,
}) => {
  const totalShares = campaigns.reduce((acc, c) => acc + (c.sharesCount || 0), 0);
  const totalViews = campaigns.reduce((acc, c) => acc + (c.viewsEstimate || 150), 0);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#003B73] to-[#002244] text-white p-6 md:p-8 rounded-2xl shadow-md border border-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-blue-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            Kirana Local Marketing Dashboard
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            My Active Ads & Customer Campaigns
          </h2>
          <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
            Track and re-broadcast your neighborhood WhatsApp posters, flyers, and audio promos for {profile.shopName}.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs md:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Trend Ad</span>
        </button>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase">Active Campaigns</p>
          <p className="text-xl md:text-2xl font-black text-blue-900 mt-1">{campaigns.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <CheckCircle className="w-3 h-3" /> Live in Locality
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase">WhatsApp Broadcasts</p>
          <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1">{totalShares}</p>
          <span className="text-[10px] text-gray-500 mt-0.5">Total shared messages</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase">Estimated Reach</p>
          <p className="text-xl md:text-2xl font-black text-purple-700 mt-1">{totalViews.toLocaleString()}</p>
          <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> Neighborhood viewers
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase">Store Loyalty Tier</p>
          <p className="text-base md:text-lg font-black text-amber-600 mt-1 truncate">{profile.tier}</p>
          <span className="text-[10px] text-amber-700 font-semibold mt-0.5">
            🪙 {profile.shikharCoins.toLocaleString()} Shikhar Coins
          </span>
        </div>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-300 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-gray-900">No Saved Campaigns Yet</h3>
          <p className="text-xs text-gray-500">
            Pick today's weather or cricket match trend from the Trend AdStudio to create and save your first Kirana promo!
          </p>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Trend Ad Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((ad, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg border border-gray-200 hover:border-blue-300 transition flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {ad.category || 'Promo'}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                  {ad.mainHeadline}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.subHeadline}</p>

                {/* Offer tag */}
                <div className="mt-3 p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <p className="font-bold text-amber-950 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{ad.offerBadgeText || ad.customOfferText}</span>
                  </p>
                </div>

                {/* Products */}
                <div className="mt-3">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                    Promoted Brands:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ad.selectedProducts?.map((p, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded"
                      >
                        {p.split(' ')[0]} {p.split(' ')[1] || ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <strong>{ad.sharesCount || 0}</strong> Shares
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <strong>~{ad.viewsEstimate || 120}</strong> Views
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onDeleteCampaign(idx)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectCampaign(ad)}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open in Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
