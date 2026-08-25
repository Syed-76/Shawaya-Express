import React from 'react';
import { Flame, Phone, MapPin, Clock, Star, Navigation, ExternalLink, Lock } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const Footer: React.FC = () => {
  const { restaurantInfo, openAdminLogin } = useRestaurant();
  const currency = restaurantInfo.currencySymbol || '₹';

  return (
    <footer className="bg-[#FAF9F6] text-gray-600 text-xs border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-white shadow-sm">
                <Flame className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-900 tracking-tight block">
                  {restaurantInfo.name}
                </span>
                {restaurantInfo.urduName && (
                  <span className="text-[11px] text-gray-400 font-serif">{restaurantInfo.urduName}</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              {restaurantInfo.tagline} • Serving from {restaurantInfo.hours || '12:00 PM to 12:00 AM'}.
            </p>
            <div className="flex items-center gap-1.5 text-[#D97706] font-bold text-xs">
              <Star className="w-4 h-4 fill-[#D97706]" />
              <span>4.8 ★ (150+ Verified Reviews)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 font-light">
              <li>
                <a href="#menu" className="hover:text-[#D97706] transition-colors">Dishes & Menu</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#D97706] transition-colors">Customer Reviews</a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#D97706] transition-colors">Branch Locator & Map</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#D97706] transition-colors">Frequently Asked Questions</a>
              </li>
              <li>
                <button
                  onClick={openAdminLogin}
                  className="hover:text-[#D97706] transition-colors flex items-center gap-1.5 text-gray-500 font-medium pt-1"
                >
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Branch Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Branch Details</h4>
            <div className="space-y-3 font-light text-gray-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <span>{restaurantInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Navigation className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span className="font-mono text-gray-800">Plus Code: {restaurantInfo.plusCode || 'PWGP+63'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-emerald-700 font-semibold">{restaurantInfo.hours || '12:00 PM – 12:00 AM'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <a href={`tel:${restaurantInfo.phone}`} className="hover:text-gray-900 font-mono font-medium">
                  {restaurantInfo.displayPhone || restaurantInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Service Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Service Options</h4>
            <div className="space-y-2.5">
              <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
                <p className="font-bold text-gray-900 text-xs">Fully AC Family Hall</p>
                <p className="text-[11px] text-gray-400 font-light mt-0.5">Private, comfortable dining for families.</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
                <p className="font-bold text-gray-900 text-xs">Doorstep Delivery</p>
                <p className="text-[11px] text-gray-400 font-light mt-0.5">
                  Free delivery on orders over {currency} {restaurantInfo.freeDeliveryThreshold.toLocaleString()}.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
                <p className="font-bold text-gray-900 text-xs">Takeaway & Pickup</p>
                <p className="text-[11px] text-gray-400 font-light mt-0.5">Quick takeaway from {restaurantInfo.hours ? restaurantInfo.hours.split('(')[0] : '12 PM to 12 AM'}.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-gray-400 font-light">
          <p>
            © {new Date().getFullYear()} {restaurantInfo.name} ({restaurantInfo.branch}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Dine-in • Takeout • Delivery</span>
            <span>•</span>
            <a href={restaurantInfo.mapsUrl || 'https://maps.google.com'} target="_blank" rel="noopener noreferrer" className="hover:text-[#D97706] flex items-center gap-1 font-medium text-gray-600">
              <span>Google Maps Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
