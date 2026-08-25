import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Phone, MessageSquare } from 'lucide-react';
import { FAQ_LIST, RESTAURANT_INFO } from '../data/restaurantData';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#FDFCFB] text-[#1F2937] relative border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Title */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D97706] uppercase block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
            Frequently Asked <span className="font-bold italic text-[#D97706]">Questions</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light">
            Everything you need to know about our dining, 12:00 PM – 12:00 AM timings, delivery, and menu in Lalamusa.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-gray-900">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-700 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#1F2937] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 font-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support bar */}
        <div className="mt-12 bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left">
            <h4 className="text-sm font-bold text-gray-900">Still have questions or catering inquiries?</h4>
            <p className="text-xs text-gray-500 font-light mt-0.5">Our branch team at Mor Lalamusa is active daily from 12:00 PM to 12:00 AM.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#D97706] text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{RESTAURANT_INFO.displayPhone}</span>
            </a>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#1F2937] hover:bg-[#D97706] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
