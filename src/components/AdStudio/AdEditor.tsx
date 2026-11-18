import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Download,
  Share2,
  Printer,
  Smartphone,
  Square,
  FileText,
  MessageSquare,
  Volume2,
  RefreshCw,
  ShoppingBag,
  Check,
  Save,
  Tag,
  Palette,
  Eye,
  Sliders,
  Store,
} from 'lucide-react';
import { GeneratedAd, KiranaShopProfile, VisualTheme, AdFormat } from '../../types';
import { PosterPreviewCanvas, PosterCanvasRef } from './PosterPreviewCanvas';
import { AudioJinglePlayer } from './AudioJinglePlayer';
import { WhatsAppShareModal } from './WhatsAppShareModal';
import { HUL_PRODUCTS } from '../../data/hulProducts';

interface AdEditorProps {
  initialAd: GeneratedAd;
  profile: KiranaShopProfile;
  onBack: () => void;
  onSaveCampaign: (ad: GeneratedAd) => void;
  onOrderWholesaleStock: (productNames: string[]) => void;
}

const THEMES: { id: VisualTheme; name: string; color: string }[] = [
  { id: 'royal-blue', name: 'Royal HUL Blue', color: 'bg-blue-600' },
  { id: 'monsoon-green', name: 'Monsoon Emerald', color: 'bg-emerald-600' },
  { id: 'festive-gold', name: 'Festive Gold', color: 'bg-amber-600' },
  { id: 'fresh-orange', name: 'Super Bachat Red', color: 'bg-red-600' },
  { id: 'cricket-neon', name: 'Cricket Neon', color: 'bg-purple-600' },
  { id: 'clean-white', name: 'Print White', color: 'bg-gray-300' },
];

const FORMATS: { id: AdFormat; label: string; icon: any }[] = [
  { id: 'whatsapp_story', label: 'WhatsApp Status (9:16)', icon: Smartphone },
  { id: 'square_post', label: 'Social Square (1:1)', icon: Square },
  { id: 'print_poster', label: 'Shop Poster (A4)', icon: FileText },
  { id: 'audio_jingle', label: 'Audio Voice Jingle', icon: Volume2 },
  { id: 'text_broadcast', label: 'Text Broadcast', icon: MessageSquare },
];

export const AdEditor: React.FC<AdEditorProps> = ({
  initialAd,
  profile,
  onBack,
  onSaveCampaign,
  onOrderWholesaleStock,
}) => {
  const [ad, setAd] = useState<GeneratedAd>({
    ...initialAd,
    format: initialAd.format || 'whatsapp_story',
    recommendedVisualTheme: initialAd.recommendedVisualTheme || 'royal-blue',
  });

  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>(
    ad.recommendedVisualTheme || 'royal-blue'
  );
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>(ad.format || 'whatsapp_story');
  const [showQrCode, setShowQrCode] = useState(true);
  const [showDeliveryBadge, setShowDeliveryBadge] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showPhone, setShowPhone] = useState(true);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<PosterCanvasRef>(null);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      await canvasRef.current.downloadAsImage();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (canvasRef.current) {
      canvasRef.current.printPoster();
    }
  };

  const handleSave = () => {
    const updated = {
      ...ad,
      recommendedVisualTheme: selectedTheme,
      format: selectedFormat,
    };
    onSaveCampaign(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRhymeAI = () => {
    // Instant witty rhyming variants
    const rhymes = [
      'दाम कम, क्वालिटी नंबर वन - सिर्फ़ आपके नज़दीकी स्टोर पर!',
      'किफ़ायत ऐसी जो दिल जीत ले, असली HUL प्रोडक्ट्स हर घर चमकाएं!',
      'बाज़ार से सस्ता, घर के पास - बचत का सुपर अहसास!',
      'मुस्कान आपके चेहरे पर, बचत आपकी जेब में!',
      'चौके-छक्के की रफ़्तार, किराना बचत की बहार!',
    ];
    const randomRhyme = rhymes[Math.floor(Math.random() * rhymes.length)];
    setAd((prev) => ({
      ...prev,
      regionalTagline: randomRhyme,
    }));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            title="Back to Trends"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-[#004B91] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {ad.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">Shikhar AI Creative Studio</span>
            </div>
            <h2 className="text-base md:text-lg font-extrabold text-gray-900 truncate max-w-md">
              {ad.trendTitle}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved!' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#004B91] rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-blue-200"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download HD PNG</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Customizer & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Format, Theme & Content Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Format Tabs */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2.5">
              1. Select Ad Output Format:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="truncate">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Palette Selector */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-600" />
              2. Visual Color Theme:
            </label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setSelectedTheme(th.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    selectedTheme === th.id
                      ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${th.color} shadow-xs`} />
                  <span>{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ad Copy Customization Form */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                3. Customize Ad Headline & Offer
              </h3>
              <button
                onClick={handleRhymeAI}
                className="text-xs text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 font-bold flex items-center gap-1 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Rhyme Tagline</span>
              </button>
            </div>

            {/* Main Headline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Main Catchy Headline:
              </label>
              <input
                type="text"
                value={ad.mainHeadline}
                onChange={(e) => setAd({ ...ad, mainHeadline: e.target.value })}
                className="w-full text-xs md:text-sm bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-900"
              />
            </div>

            {/* Sub-headline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Sub-Headline / Value Offer:
              </label>
              <input
                type="text"
                value={ad.subHeadline}
                onChange={(e) => setAd({ ...ad, subHeadline: e.target.value })}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            {/* Offer Sticker Badge */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Offer Sticker Badge (e.g. FLAT ₹25 OFF, BUY 2 GET 1):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ad.offerBadgeText}
                  onChange={(e) => setAd({ ...ad, offerBadgeText: e.target.value })}
                  className="w-full text-xs font-bold bg-amber-50 border border-amber-300 rounded-xl px-3.5 py-2.5 pl-8 focus:ring-2 focus:ring-amber-500 focus:outline-none text-amber-950"
                />
                <Tag className="w-3.5 h-3.5 text-amber-600 absolute left-3 top-3" />
              </div>
            </div>

            {/* Regional Slogan / Tagline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Regional Tagline (Devanagari / Vernacular):
              </label>
              <input
                type="text"
                value={ad.regionalTagline}
                onChange={(e) => setAd({ ...ad, regionalTagline: e.target.value })}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-gray-800"
              />
            </div>

            {/* Store Branding Toggles */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                Store Elements & Badges:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDeliveryBadge}
                    onChange={(e) => setShowDeliveryBadge(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-700">🛵 Free Delivery</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-700">📱 UPI QR Code</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-700">📞 WhatsApp #</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAddress}
                    onChange={(e) => setShowAddress(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-700">📍 Shop Address</span>
                </label>
              </div>
            </div>
          </div>

          {/* Wholesale Stock Linker Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-sm border border-blue-700 flex items-center justify-between gap-4">
            <div>
              <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Stock Up on Shikhar
              </span>
              <h4 className="font-bold text-sm mt-1 text-white">
                Need Promotional Stock for this Campaign?
              </h4>
              <p className="text-xs text-blue-200 mt-0.5">
                Order {ad.selectedProducts?.slice(0, 2).join(' & ')} at wholesale rates with 15% margin
              </p>
            </div>

            <button
              onClick={() => onOrderWholesaleStock(ad.selectedProducts || [])}
              className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Stock</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live Visual Poster / Audio Player Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="font-extrabold text-sm text-gray-900">Live Ad Preview</h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrint}
                  className="p-1.5 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  title="Print A4 Poster"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="p-1.5 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>HD PNG</span>
                </button>
              </div>
            </div>

            {/* Poster Canvas Renderer */}
            <div className="bg-gray-100 p-2 rounded-2xl overflow-hidden flex justify-center border border-gray-200/80">
              <PosterPreviewCanvas
                ref={canvasRef}
                ad={ad}
                profile={profile}
                theme={selectedTheme}
                format={selectedFormat}
                showQrCode={showQrCode}
                showDeliveryBadge={showDeliveryBadge}
                showAddress={showAddress}
                showPhone={showPhone}
              />
            </div>
          </div>

          {/* Audio Voice Announcement Component */}
          {ad.audioJingleScript && (
            <AudioJinglePlayer
              script={ad.audioJingleScript}
              shopName={profile.shopName}
              language={profile.preferredLanguage}
            />
          )}
        </div>
      </div>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        ad={ad}
        profile={profile}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onRecordedShare={() => {
          setAd((prev) => ({
            ...prev,
            sharesCount: (prev.sharesCount || 0) + 1,
          }));
        }}
      />
    </div>
  );
};
