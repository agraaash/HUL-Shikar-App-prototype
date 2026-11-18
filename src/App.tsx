import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { TrendRadar } from './components/AdStudio/TrendRadar';
import { AdEditor } from './components/AdStudio/AdEditor';
import { ProductCatalog } from './components/WholesaleOrders/ProductCatalog';
import { CampaignTracker } from './components/Campaigns/CampaignTracker';
import { ShopSettingsModal } from './components/Profile/ShopSettingsModal';
import {
  KiranaShopProfile,
  TrendItem,
  GeneratedAd,
  CustomAdIdea,
} from './types';
import { DEFAULT_TRENDS } from './data/defaultTrends';
import {
  fetchLiveTrends,
  generateKiranaAd,
  generateCustomIdeas,
} from './services/geminiService';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

const DEFAULT_PROFILE: KiranaShopProfile = {
  shopName: 'Shree Ganesh Kirana & Superstore',
  ownerName: 'Ramesh Kumar Gupta',
  retailerCode: 'HUL-RET-40921',
  phone: '+91 98765 43210',
  whatsappNumber: '+91 98765 43210',
  address: 'Shop No. 12, Main Market, Subhash Chowk',
  city: 'Kanpur, UP',
  pincode: '208001',
  upiId: 'ganeshkirana@okaxis',
  freeDeliveryRadius: '2.5 km (Within 30 mins)',
  minOrderValue: 199,
  shikharCoins: 1850,
  tier: 'Gold Shikhar Partner',
  tagline: 'असली माल, बाज़ार से कम दाम!',
  preferredLanguage: 'Hinglish',
};

export default function App() {
  // Store Profile State
  const [profile, setProfile] = useState<KiranaShopProfile>(() => {
    try {
      const saved = localStorage.getItem('shikhar_kirana_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Trends & AI Ad Studio State
  const [trends, setTrends] = useState<TrendItem[]>(DEFAULT_TRENDS);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [customIdeas, setCustomIdeas] = useState<CustomAdIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Active Ad Editing State
  const [activeAd, setActiveAd] = useState<GeneratedAd | null>(null);
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);
  const [adGenerationStatus, setAdGenerationStatus] = useState<string>('');

  // Wholesale filtered products
  const [wholesaleFilterProducts, setWholesaleFilterProducts] = useState<string[]>([]);

  // Saved Campaigns State
  const [campaigns, setCampaigns] = useState<GeneratedAd[]>(() => {
    try {
      const saved = localStorage.getItem('shikhar_kirana_campaigns');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default sample campaign
    return [
      {
        id: 'camp-1',
        trendTitle: 'Cricket Match Day Chai & Munchies Rush 🏏',
        category: 'Cricket & Sports',
        mainHeadline: 'मैच का मज़ा, कड़क चाय के साथ! 🏏☕',
        subHeadline: 'Brooke Bond Red Label & Bru Coffee पर स्पेशल किराना छूट!',
        regionalTagline: 'चौके-छक्के का जोश, बचत का संतोष!',
        offerBadgeText: '💥 FLAT ₹25 OFF',
        bodyPoints: [
          '100% असली फ्रेश HUL चाय और कॉफ़ी',
          'मुफ़्त 30 मिनट में होम डिलीवरी',
          'दुकान पर आइए या WhatsApp पर आर्डर करें',
        ],
        whatsappBroadcastCopy:
          '🏏 *मैच डे स्पेशल ऑफर - Shree Ganesh Kirana Store* 🏏\n\nआज के धमाकेदार मैच में पाइए:\n🔥 *Brooke Bond Red Label 500g पर ₹25 की छूट!*\n\n📞 *ऑर्डर करें:* +91 98765 43210\n🛵 _मुफ़्त होम डिलीवरी!_',
        audioJingleScript:
          'नमस्ते भाइयों और बहनों! आज के मैच डे पर आपके अपने श्री गणेश किराना स्टोर में रेड लेबल चाय पर मिल रहा है स्पेशल डिस्काउंट! अभी आर्डर करें!',
        marketingTip: 'मैच शुरू होने से 2 घंटे पहले WhatsApp पर स्टेटस लगाएं!',
        recommendedVisualTheme: 'cricket-neon',
        ctaButtonText: 'Order on WhatsApp 📲',
        selectedProducts: ['Brooke Bond Red Label Tea Pouch', 'Bru Instant Coffee Jar'],
        format: 'whatsapp_story',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        sharesCount: 14,
        viewsEstimate: 340,
      },
    ];
  });

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem('shikhar_kirana_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Persist Campaigns
  useEffect(() => {
    try {
      localStorage.setItem('shikhar_kirana_campaigns', JSON.stringify(campaigns));
    } catch {}
  }, [campaigns]);

  // Load latest trends on mount
  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const data = await fetchLiveTrends();
      setTrends(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const handleUpdateProfile = (updated: Partial<KiranaShopProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Generate Ad from Trend or Custom Concept
  const handleSelectTrend = async (trend: TrendItem) => {
    setIsGeneratingAd(true);
    setAdGenerationStatus(`Analyzing trend "${trend.title}"...`);
    setActiveTab('adstudio');

    try {
      setTimeout(() => {
        setAdGenerationStatus(`Designing localized ad copy for ${profile.shopName}...`);
      }, 700);

      const generated = await generateKiranaAd({
        trendTitle: trend.title,
        category: trend.category,
        products: trend.suggestedHULProducts,
        customOffer: trend.defaultOffer,
        shopName: profile.shopName,
        ownerName: profile.ownerName,
        shopAddress: profile.address,
        shopPhone: profile.whatsappNumber || profile.phone,
        language: profile.preferredLanguage,
        targetGoal: 'Boost Local WhatsApp Orders',
      });

      setActiveAd(generated);
    } catch (err) {
      console.error('Ad generation failed:', err);
    } finally {
      setIsGeneratingAd(false);
      setAdGenerationStatus('');
    }
  };

  // Generate custom ideas
  const handleGenerateCustomIdea = async (promptText: string) => {
    setIsGeneratingIdeas(true);
    try {
      const ideas = await generateCustomIdeas(promptText, profile.shopName);
      setCustomIdeas(ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // Save campaign to list
  const handleSaveCampaign = (savedAd: GeneratedAd) => {
    setCampaigns((prev) => [savedAd, ...prev]);
  };

  // Delete campaign
  const handleDeleteCampaign = (index: number) => {
    setCampaigns((prev) => prev.filter((_, i) => i !== index));
  };

  // Link to wholesale from ad
  const handleOrderWholesaleStock = (productNames: string[]) => {
    setWholesaleFilterProducts(productNames);
    setActiveTab('wholesale');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-gray-900 font-sans flex flex-col selection:bg-amber-400 selection:text-blue-950">
      {/* Shikhar Official Header */}
      <Header
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdStudio={() => {
          setActiveAd(null);
          setActiveTab('adstudio');
        }}
      />

      {/* Navigation Bar (Desktop & Mobile) */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'adstudio' && activeAd) {
            // keep ad editor or reset if requested
          }
          if (tab === 'profile') {
            setIsSettingsOpen(true);
            return;
          }
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Loading Overlay when AI generates ad */}
        {isGeneratingAd && (
          <div className="fixed inset-0 z-50 bg-blue-950/70 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white animate-in fade-in">
            <div className="bg-white/10 border border-white/20 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-blue-950 shadow-lg">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-xl font-black text-white">
                Shikhar AI Crafting Your Ad...
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                {adGenerationStatus || 'Generating localized copy & visuals...'}
              </p>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '70%' }} />
              </div>
              <p className="text-[11px] text-blue-200">
                Customizing for <strong>{profile.shopName}</strong> with genuine HUL trade schemes
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Home Dashboard */}
        {activeTab === 'home' && (
          <HomeDashboard
            profile={profile}
            trends={trends}
            onSelectTrend={handleSelectTrend}
            onOpenAdStudio={() => {
              setActiveAd(null);
              setActiveTab('adstudio');
            }}
            onOpenWholesale={() => {
              setWholesaleFilterProducts([]);
              setActiveTab('wholesale');
            }}
            onOpenCampaigns={() => setActiveTab('campaigns')}
            onOpenCustomIdea={() => {
              setActiveAd(null);
              setActiveTab('adstudio');
            }}
          />
        )}

        {/* Tab 2: Trend Ad Studio (Radar or Active Editor) */}
        {activeTab === 'adstudio' && (
          <>
            {activeAd ? (
              <AdEditor
                initialAd={activeAd}
                profile={profile}
                onBack={() => setActiveAd(null)}
                onSaveCampaign={handleSaveCampaign}
                onOrderWholesaleStock={handleOrderWholesaleStock}
              />
            ) : (
              <TrendRadar
                trends={trends}
                isLoading={isLoadingTrends}
                onRefreshTrends={loadTrends}
                onSelectTrend={handleSelectTrend}
                onGenerateCustomIdea={handleGenerateCustomIdea}
                customIdeas={customIdeas}
                isGeneratingIdeas={isGeneratingIdeas}
              />
            )}
          </>
        )}

        {/* Tab 3: HUL Wholesale Ordering & Margins */}
        {activeTab === 'wholesale' && (
          <ProductCatalog
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onLaunchAdForProduct={handleSelectTrend}
            initialFilterProducts={wholesaleFilterProducts}
          />
        )}

        {/* Tab 4: My Campaigns Gallery */}
        {activeTab === 'campaigns' && (
          <CampaignTracker
            campaigns={campaigns}
            profile={profile}
            onSelectCampaign={(ad) => {
              setActiveAd(ad);
              setActiveTab('adstudio');
            }}
            onDeleteCampaign={handleDeleteCampaign}
            onCreateNew={() => {
              setActiveAd(null);
              setActiveTab('adstudio');
            }}
          />
        )}
      </main>

      {/* Shop Profile & Settings Modal */}
      <ShopSettingsModal
        profile={profile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(updated) => {
          setProfile(updated);
        }}
      />
    </div>
  );
}
