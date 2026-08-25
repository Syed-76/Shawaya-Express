import React, { useState } from 'react';
import { 
  Image as ImageIcon, Upload, Check, Sparkles, 
  RefreshCw, Layout, Eye, Save 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const AdminMediaTab: React.FC = () => {
  const { restaurantInfo, updateRestaurantInfo } = useRestaurant();

  const [heroImage, setHeroImage] = useState(restaurantInfo.heroImage || 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop');
  const [heroHeadlineMain, setHeroHeadlineMain] = useState(restaurantInfo.heroHeadlineMain || 'Roasted');
  const [heroHeadlineAccent, setHeroHeadlineAccent] = useState(restaurantInfo.heroHeadlineAccent || 'to Perfection.');
  const [heroSubtitle, setHeroSubtitle] = useState(restaurantInfo.heroSubtitle || 'Experience the authentic taste of succulent roasted chicken served with aromatic rice. Open daily from 12:00 PM to 12:00 AM.');
  const [heroBadge, setHeroBadge] = useState(restaurantInfo.heroBadge || 'Lalamusa, Pakistan');
  const [savedToast, setSavedToast] = useState(false);

  // Preset Curated High Quality Shawaya, Mandi & BBQ Photos
  const presetPhotos = [
    {
      title: 'Golden Whole Rotisserie Chicken on Mandi Platter',
      url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Flame Grilled BBQ Platter with Sauces',
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Succulent Roast Chicken Feast with Tortillas & Dips',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Fragrant Arabian Mandi Rice Platter with Spices',
      url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Golden Fried Crispy Chicken & Sides',
      url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Ice Cold Mint Margarita & Fresh Drinks',
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setHeroImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantInfo({
      heroImage,
      heroHeadlineMain,
      heroHeadlineAccent,
      heroSubtitle,
      heroBadge,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-700 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-emerald-200" />
          <div>
            <h5 className="font-bold text-xs">Pictures & Headlines Saved!</h5>
            <p className="text-[11px] text-emerald-100 font-light">Hero banner and visuals updated live on the site.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveMedia} className="space-y-6">
        {/* Card: Hero Banner Media & Headlines */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Hero Banner Image & Display Copy</h3>
              <p className="text-xs text-gray-500 font-light">Customise the main banner image, headline, and subtext</p>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 text-white p-6 sm:p-8 min-h-[220px] flex flex-col justify-end">
            <img
              src={heroImage}
              alt="Hero Preview"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />

            <div className="relative z-10 space-y-2 max-w-lg">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#D97706] uppercase block">
                {heroBadge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-light leading-tight">
                {heroHeadlineMain} <span className="font-bold italic text-[#D97706]">{heroHeadlineAccent}</span>
              </h2>
              <p className="text-xs text-gray-300 font-light line-clamp-2">
                {heroSubtitle}
              </p>
            </div>
          </div>

          {/* Headlines Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Headline Main Text</label>
              <input
                type="text"
                required
                value={heroHeadlineMain}
                onChange={(e) => setHeroHeadlineMain(e.target.value)}
                placeholder="e.g. Roasted"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Headline Highlight Accent</label>
              <input
                type="text"
                required
                value={heroHeadlineAccent}
                onChange={(e) => setHeroHeadlineAccent(e.target.value)}
                placeholder="e.g. to Perfection."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Top City / Tag Badge</label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="e.g. Lalamusa, Pakistan"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Hero Subtitle Story</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="e.g. Experience the authentic taste of succulent roasted chicken..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>

          {/* Hero Banner Image Controls */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Hero Banner Photo (URL or Upload)</label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="Paste direct image URL (https://...)"
                className="w-full flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
              <label className="cursor-pointer py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Preset Photo Selection */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2.5">
              Or Select from Curated Restaurant Photography Presets:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presetPhotos.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setHeroImage(preset.url)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                    heroImage === preset.url ? 'border-[#D97706] ring-2 ring-amber-400' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="h-24 bg-gray-100">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-1.5 bg-white text-[10px] text-gray-700 font-medium truncate">
                    {preset.title}
                  </div>
                  {heroImage === preset.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#D97706] text-white rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Media Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-8 bg-[#D97706] hover:bg-amber-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Pictures & Visuals</span>
          </button>
        </div>
      </form>
    </div>
  );
};
