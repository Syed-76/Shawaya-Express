import React from 'react';
import { Star, MessageSquare, ArrowRight, ShieldCheck, Clock, Award, MapPin, Flame } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenWhatsApp: () => void;
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onOpenWhatsApp,
  onOpenReservation,
}) => {
  const { restaurantInfo, menuItems } = useRestaurant();
  const currency = restaurantInfo.currencySymbol || '₹';

  // Get first popular item or first menu item for showcase
  const showcaseItem = menuItems.find(m => m.isPopular) || menuItems[0];

  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#FDFCFB] text-[#1F2937] pt-8 pb-16 lg:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 space-y-8">
            
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#D97706] uppercase mb-4 block">
                {restaurantInfo.heroBadge || `${restaurantInfo.branch}, Pakistan`}
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.1] text-gray-900">
                {restaurantInfo.heroHeadlineMain || 'Roasted'} <br />
                <span className="font-bold italic text-[#D97706]">
                  {restaurantInfo.heroHeadlineAccent || 'to Perfection.'}
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-500 max-w-md leading-relaxed font-light">
              {restaurantInfo.heroSubtitle || 'Experience the authentic taste of succulent roasted chicken served with aromatic rice.'}
            </p>

            {/* Social Proof Avatars */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600 shadow-sm">
                  HM
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center font-bold text-xs text-gray-600 shadow-sm">
                  MS
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-amber-200 flex items-center justify-center font-bold text-xs text-amber-800 shadow-sm">
                  IS
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-600">
                <span className="text-gray-900 font-bold">4.8 / 5.0</span> from 150+ authentic reviews
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-order-menu-btn"
                onClick={onExploreMenu}
                className="bg-[#1F2937] text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#D97706] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-whatsapp-order-btn"
                onClick={onOpenWhatsApp}
                className="px-7 py-3.5 rounded-full bg-white text-gray-800 hover:text-[#D97706] border border-gray-200 font-bold text-xs tracking-widest uppercase shadow-sm flex items-center gap-2 transition-colors hover:border-[#D97706]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp Order</span>
              </button>

              <button
                id="hero-book-table-btn"
                onClick={onOpenReservation}
                className="px-6 py-3.5 rounded-full text-gray-600 hover:text-gray-900 font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                <span>Book Table</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>100% Fresh Halal</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>{restaurantInfo.hours ? restaurantInfo.hours.split('(')[0] : '12 PM – 12 AM'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>AC Family Dining</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span className="truncate">{restaurantInfo.branch}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Best Seller Card */}
          <div className="lg:col-span-6">
            <div className="w-full bg-gray-900 rounded-3xl relative overflow-hidden flex flex-col shadow-xl min-h-[420px]">
              {/* Background Photo */}
              <img
                src={restaurantInfo.heroImage || 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop'}
                alt="Shawaya Feast"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
              
              {/* Central Floating Feature Card */}
              {showcaseItem && (
                <div className="flex-grow flex items-center justify-center p-6 sm:p-10 z-10">
                  <div className="w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center p-6 sm:p-7 space-y-2.5 border-4 border-white/80 transition-transform duration-300 hover:scale-102">
                    <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-widest bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
                      ⭐ Chef Recommendation
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      {showcaseItem.name}
                    </h3>
                    <p className="text-gray-500 text-xs font-light max-w-[220px] line-clamp-2">
                      {showcaseItem.description}
                    </p>
                    <span className="text-2xl font-bold text-gray-900">
                      {currency} {(showcaseItem.discountPrice || showcaseItem.price).toLocaleString()}
                    </span>
                    <button
                      onClick={onExploreMenu}
                      className="mt-1 py-1.5 px-4 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white text-[11px] font-bold tracking-wider uppercase transition-colors"
                    >
                      Order Now →
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Branch Details Bar */}
              <div className="bg-gray-950/90 backdrop-blur-md p-5 sm:p-6 grid grid-cols-2 gap-4 z-10 border-t border-white/10 text-white">
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">Opening Hours</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200">{restaurantInfo.hours || '12:00 PM – 12:00 AM Daily'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">Location</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200 truncate">{restaurantInfo.address}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
