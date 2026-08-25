import React from 'react';
import { Sparkles, Users, CheckCircle2, ShoppingBag, Tag } from 'lucide-react';
import { FAMILY_DEALS, RESTAURANT_INFO } from '../data/restaurantData';
import { FamilyDeal } from '../types';

interface FamilyDealsProps {
  onAddDealToCart: (deal: FamilyDeal) => void;
  onDirectWhatsAppDeal: (deal: FamilyDeal) => void;
}

export const FamilyDeals: React.FC<FamilyDealsProps> = ({
  onAddDealToCart,
  onDirectWhatsAppDeal,
}) => {
  return (
    <section id="deals" className="py-20 bg-[#FAF9F6] text-[#1F2937] relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D97706] uppercase block">
            Value Bundles & Combos
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
            Family Feasts <span className="font-bold italic text-[#D97706]">& Deals</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light">
            Generous portions designed for families, traveler pitstops, and gatherings in Lalamusa. Made fresh to order.
          </p>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8">
          {FAMILY_DEALS.map((deal) => {
            const savings = deal.originalPrice - deal.price;
            return (
              <div
                key={deal.id}
                id={`deal-card-${deal.id}`}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden flex flex-col transition-all duration-300 group"
              >
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-[#D97706] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {deal.badge}
                  </div>

                  {/* Serves Pill */}
                  <div className="absolute top-4 right-4 bg-white/95 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <Users className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{deal.serves}</span>
                  </div>

                  {/* Pricing tag over image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">Rs {deal.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-300 line-through ml-2">Rs {deal.originalPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] bg-[#059669] text-white font-bold px-2.5 py-0.5 rounded-full">
                      Save Rs {savings}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#D97706] transition-colors">
                        {deal.title}
                      </h3>
                      {deal.urduTitle && (
                        <p className="text-xs text-[#D97706] font-serif mt-0.5">{deal.urduTitle}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      {deal.description}
                    </p>

                    {/* Items List */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Included In Deal:</p>
                      <ul className="space-y-1.5">
                        {deal.itemsIncluded.map((item, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      id={`btn-add-deal-${deal.id}`}
                      onClick={() => onAddDealToCart(deal)}
                      className="w-full py-3 px-4 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-white" />
                      <span>Add To Order</span>
                    </button>
                    
                    <button
                      onClick={() => onDirectWhatsAppDeal(deal)}
                      className="w-full py-2.5 px-3 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors hover:border-gray-400"
                    >
                      <span>WhatsApp Order</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Group Order Note */}
        <div className="mt-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center flex-shrink-0 border border-amber-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">
                Planning a Large Daawat, Party, or Travel Group?
              </h4>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                We cater customized Mandi Rice & Shawaya bulk platters in Mor Lalamusa. Call {RESTAURANT_INFO.displayPhone}.
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Shawaya Express Lalamusa! I want to inquire about custom catering / bulk group platters.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#1F2937] hover:bg-[#D97706] text-white text-xs font-bold tracking-widest uppercase rounded-full whitespace-nowrap transition-colors flex items-center gap-2"
          >
            <span>Inquire Catering</span>
          </a>
        </div>

      </div>
    </section>
  );
};
