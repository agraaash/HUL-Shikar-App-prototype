import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Search,
  RefreshCw,
  Trophy,
  CloudRain,
  Sun,
  HeartPulse,
  Tag,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { TrendItem, CustomAdIdea } from '../../types';

interface TrendRadarProps {
  trends: TrendItem[];
  isLoading: boolean;
  onRefreshTrends: () => void;
  onSelectTrend: (trend: TrendItem) => void;
  onGenerateCustomIdea: (prompt: string) => void;
  customIdeas: CustomAdIdea[];
  isGeneratingIdeas: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Trends', icon: Flame },
  { id: 'Cricket & Sports', label: '🏏 Cricket & Match', icon: Trophy },
  { id: 'Weather & Season', label: '🌧️ Monsoon & Weather', icon: CloudRain },
  { id: 'Festivals & Culture', label: '🪔 Festivals & Puja', icon: Sparkles },
  { id: 'Health & Kids', label: '🥛 Health & Kids', icon: HeartPulse },
  { id: 'Bachat & Offers', label: '🏷️ Mahabachat & Deals', icon: Tag },
];

const SAMPLE_PROMPTS = [
  '🏏 India match today: Hot Red Label Chai & munchies combo',
  '🌧️ Heavy rain alert: Surf Excel mud stain detergent discount',
  '☀️ Summer heat: Dove soap & Pond\'s cooling talc offer',
  '📦 Clear 40 excess packs of Sunsilk shampoo and Vim bar',
  '🥛 Back-to-school: Horlicks 1kg with free water bottle scheme',
  '🪔 Weekend deep clean: Vim gel + Rin soap family pack ₹149',
];

export const TrendRadar: React.FC<TrendRadarProps> = ({
  trends,
  isLoading,
  onRefreshTrends,
  onSelectTrend,
  onGenerateCustomIdea,
  customIdeas,
  isGeneratingIdeas,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const filteredTrends = trends.filter((trend) => {
    const matchesCat =
      selectedCategory === 'all' ||
      trend.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory.includes('Cricket') && trend.category.includes('Cricket')) ||
      (selectedCategory.includes('Weather') && (trend.category.includes('Weather') || trend.category.includes('Season')));

    const matchesSearch =
      !searchQuery ||
      trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.suggestedHULProducts.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      trend.viralHookHindi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onGenerateCustomIdea(customPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003B73] via-[#004B91] to-[#002855] text-white p-6 md:p-8 rounded-2xl shadow-md border border-blue-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-blue-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time AI Trend Intelligence
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Discover Today's Viral Kirana Sales Opportunities
            </h2>
            <p className="text-sm text-blue-100 mt-1 max-w-2xl">
              Shikhar AI continuously monitors consumer events, weather forecasts, festivals, and cricket matches across India.
              Select a trend to generate ready-to-share WhatsApp ads, banners, and audio scripts in seconds!
            </p>
          </div>

          <button
            onClick={onRefreshTrends}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 backdrop-blur-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isLoading ? 'Scanning Trends...' : 'Scan New Trends'}</span>
          </button>
        </div>

        {/* Custom Stock Clearance / Idea Box */}
        <div className="mt-6 pt-6 border-t border-blue-700/60">
          <form onSubmit={handleCustomSubmit} className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Or type any product/dead stock to clear (e.g., 'Have 25 Dove soaps & Vim bars, create monsoon offer')..."
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-xs md:text-sm px-4 py-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner font-medium"
              />
              <Zap className="w-4 h-4 text-amber-500 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={isGeneratingIdeas || !customPrompt.trim()}
              className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-blue-950 font-black text-xs md:text-sm px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingIdeas ? 'Generating Ideas...' : 'Generate AI Ad Ideas'}</span>
            </button>
          </form>

          {/* Quick Click Prompts */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-blue-200 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-300" />
              Try popular hooks:
            </span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomPrompt(prompt);
                  onGenerateCustomIdea(prompt);
                }}
                className="text-[11px] bg-blue-900/80 hover:bg-blue-800 text-blue-100 hover:text-white px-2.5 py-1 rounded-lg border border-blue-700/50 transition truncate max-w-[260px]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Custom Ideas (If any) */}
      {customIdeas && customIdeas.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-gray-900 text-sm md:text-base">
                AI Suggested Campaign Concepts for Your Prompt
              </h3>
            </div>
            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              3 Custom Ideas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {customIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Custom Concept
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{idea.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{idea.trendHook}</p>

                  <div className="mt-2 bg-amber-50/60 p-2 rounded-lg text-xs">
                    <p className="font-bold text-amber-900">Offer: {idea.offerFormula}</p>
                    <p className="text-[11px] text-amber-800 italic mt-0.5">"{idea.catchyTagline}"</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onSelectTrend({
                      id: idea.id,
                      title: idea.title,
                      category: 'Custom Clearance',
                      trendContext: idea.trendHook,
                      suggestedHULProducts: idea.recommendedProducts,
                      defaultOffer: idea.offerFormula,
                      viralHookHindi: idea.catchyTagline,
                      viralHookEnglish: idea.title,
                      urgencyBadge: '⚡ Flash Offer',
                      targetAudience: 'Neighborhood buyers',
                    })
                  }
                  className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Build Ad from this Idea</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trend or HUL brand..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrends.map((trend) => (
          <div
            key={trend.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-400 transition-all flex flex-col justify-between group"
          >
            {/* Card Header with Category Bar */}
            <div className="p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {trend.urgencyBadge}
                </span>
                <span className="text-[11px] font-bold text-gray-500">{trend.category}</span>
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-black text-gray-900 group-hover:text-blue-900 transition leading-snug">
                {trend.title}
              </h3>

              {/* Context */}
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{trend.trendContext}</p>

              {/* Offer Formula Box */}
              <div className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-start gap-1.5 font-bold text-amber-950">
                  <Tag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{trend.defaultOffer}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200/60">
                  <p className="text-[11px] text-amber-900 font-medium italic">
                    "{trend.viralHookHindi}"
                  </p>
                </div>
              </div>

              {/* Suggested HUL Products */}
              <div className="mt-4">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                  Featured HUL FMCG Brands:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {trend.suggestedHULProducts.map((prod, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-blue-50 text-blue-900 font-semibold px-2 py-0.5 rounded-md border border-blue-100"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div className="mt-3 text-[11px] text-gray-500">
                <span>Target: <strong>{trend.targetAudience}</strong></span>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified HUL Scheme
              </span>

              <button
                onClick={() => onSelectTrend(trend)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md group-hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Create Kirana Ad</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
