import React, { useState } from 'react';
import { 
  MapPin, Clock, Phone, Navigation, Share2, Copy, Check, 
  ExternalLink, Sparkles 
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const BranchLocation: React.FC = () => {
  const { restaurantInfo } = useRestaurant();
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyPlusCode = () => {
    navigator.clipboard.writeText(restaurantInfo.plusCode || 'PWGP+63');
    setCopiedPlusCode(true);
    setTimeout(() => setCopiedPlusCode(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(restaurantInfo.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <section id="location" className="py-20 bg-[#FAF9F6] text-[#1F2937] relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D97706] uppercase block">
            Prime GT Road Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
            Find Us At <span className="font-bold italic text-[#D97706]">{restaurantInfo.branch}</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light">
            Conveniently situated right near the {restaurantInfo.branch} intersection with easy vehicle access and dedicated parking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Branch Details & Quick Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Info Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-amber-50 text-[#D97706] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                    Official Branch
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{restaurantInfo.name} - {restaurantInfo.branch}</h3>
                  {restaurantInfo.urduName && (
                    <p className="text-xs text-[#D97706] font-serif mt-0.5">{restaurantInfo.urduName}</p>
                  )}
                </div>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {restaurantInfo.hours ? restaurantInfo.hours.split('(')[0] : '12 PM – 12 AM'}
                </div>
              </div>

              {/* Address detail */}
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block text-xs uppercase tracking-wider">Full Address</span>
                    <p className="text-xs text-gray-600 font-light mt-0.5">{restaurantInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 block text-xs uppercase tracking-wider">Google Maps Plus Code</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-gray-50 px-2.5 py-1 rounded-lg text-gray-800 border border-gray-200 font-mono">
                        {restaurantInfo.plusCode || 'PWGP+63'}
                      </code>
                      <button
                        onClick={handleCopyPlusCode}
                        className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg transition-colors font-medium"
                      >
                        {copiedPlusCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPlusCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block text-xs uppercase tracking-wider">Operating Hours</span>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">{restaurantInfo.hours || '12:00 PM – 12:00 AM Daily'}</p>
                    <p className="text-[11px] text-gray-400 font-light mt-0.5">Fresh rotisserie batches prepared daily from noon to midnight.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block text-xs uppercase tracking-wider">Contact & Hotline</span>
                    <a
                      href={`tel:${restaurantInfo.phone}`}
                      className="text-xs font-mono font-bold text-[#D97706] hover:underline block mt-0.5"
                    >
                      {restaurantInfo.displayPhone || restaurantInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  id="get-directions-maps-btn"
                  href={restaurantInfo.mapsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(`Hello ${restaurantInfo.name}, please share live location pin on WhatsApp.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>WhatsApp Pin</span>
                </a>
              </div>

            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Branch Facilities & Amenities
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                {(restaurantInfo.amenities || [
                  'Fully Air-Conditioned Family Dining Hall',
                  'Fresh Rotisserie Charcoal Oven On Display',
                  'Dedicated Free Customer Parking Front & Rear',
                  'High-Speed Takeaway Dispatch Counter',
                  'Home Delivery Fleet (City Wide)',
                  'Wheelchair Accessible Ground Floor Seating'
                ]).map((am, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Visual Interactive Map Simulator & Landmark Guide */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Interactive Map Visual Representation */}
            <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
              
              {/* Map Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">Live Location Preview • {restaurantInfo.branch}</span>
                </div>
                <a
                  href={restaurantInfo.mapsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D97706] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Styled Clean Map Canvas */}
              <div className="relative h-72 sm:h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#E5E7EB] opacity-60">
                  <div className="w-full h-full bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
                
                {/* Simulated Road Lines */}
                <div className="absolute w-full h-10 bg-amber-200/40 rotate-12 transform -translate-y-4" />
                <div className="absolute w-8 h-full bg-gray-300 -rotate-45 transform translate-x-12" />

                {/* Animated Central Branch Pin */}
                <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                  <div className="bg-[#1F2937] text-white p-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-[#D97706]">
                    <div className="w-6 h-6 rounded-full bg-[#D97706] flex items-center justify-center text-white text-xs font-bold">
                      🍗
                    </div>
                    <div>
                      <p className="font-bold text-xs leading-none">{restaurantInfo.name}</p>
                      <p className="text-[10px] text-amber-300 font-light mt-0.5">{restaurantInfo.branch}</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-[#1F2937] rotate-45 transform -translate-y-1.5 border-r-2 border-b-2 border-[#D97706]" />
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] text-gray-600 font-medium border border-gray-200 shadow-sm">
                  📍 {restaurantInfo.plusCode || 'PWGP+63 Lalamusa'}
                </div>
              </div>

              {/* Map Footer Route Info */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#D97706]" />
                  <span>Direct GT Road Intersection Access</span>
                </div>
                <span className="text-emerald-700 font-semibold">Free Customer Parking Available</span>
              </div>
            </div>

            {/* Landmarks Guide */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Nearby Landmarks & Distance
              </h4>
              <div className="space-y-2.5 text-xs text-gray-600 font-light">
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                  <span>Mor Lalamusa GT Road Crossing</span>
                  <span className="font-semibold text-gray-900">0.2 km (~1 min drive)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                  <span>Thikrian Village Entrance</span>
                  <span className="font-semibold text-gray-900">Adjacent (0.1 km)</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Lalamusa City Center & Main Bazaar</span>
                  <span className="font-semibold text-gray-900">2.5 km (~5 mins drive)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
