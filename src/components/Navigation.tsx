import React from 'react';
import {
  Home,
  Sparkles,
  ShoppingBag,
  Megaphone,
  Store,
  Flame,
} from 'lucide-react';

export type ActiveTab = 'home' | 'adstudio' | 'wholesale' | 'campaigns' | 'profile';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      hindi: 'होम',
      icon: Home,
      badge: null,
    },
    {
      id: 'adstudio' as ActiveTab,
      label: 'Trend AdStudio',
      hindi: 'ट्रेंड विज्ञापन',
      icon: Sparkles,
      badge: '🔥 HOT',
      highlight: true,
    },
    {
      id: 'wholesale' as ActiveTab,
      label: 'HUL Orders',
      hindi: 'होलसेल आर्डर',
      icon: ShoppingBag,
      badge: '15% Margin',
    },
    {
      id: 'campaigns' as ActiveTab,
      label: 'My Campaigns',
      hindi: 'विज्ञापन गैलरी',
      icon: Megaphone,
      badge: null,
    },
    {
      id: 'profile' as ActiveTab,
      label: 'My Kirana',
      hindi: 'मेरी दुकान',
      icon: Store,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Top Tab Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200 shadow-xs sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? tab.highlight
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                        : 'bg-blue-50 text-[#004B91] border border-blue-200'
                      : tab.highlight
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100/70 border border-amber-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive && !tab.highlight
                        ? 'text-[#004B91]'
                        : isActive && tab.highlight
                        ? 'text-white animate-bounce'
                        : tab.highlight
                        ? 'text-amber-600'
                        : 'text-gray-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isActive && tab.highlight
                          ? 'bg-white text-orange-700'
                          : tab.highlight
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-medium text-emerald-700">Shikhar AI Engine Active</span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-2 py-1.5">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  isActive
                    ? tab.highlight
                      ? 'text-amber-600 font-bold'
                      : 'text-[#004B91] font-bold'
                    : 'text-gray-500 font-medium'
                }`}
              >
                {tab.badge && (
                  <span className="absolute -top-1.5 right-0 bg-red-500 text-white text-[9px] font-black px-1 rounded-full animate-pulse">
                    {tab.badge === '🔥 HOT' ? 'HOT' : '%'}
                  </span>
                )}
                <div
                  className={`p-1 rounded-lg ${
                    isActive
                      ? tab.highlight
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-[#004B91]'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 leading-none">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
