import React, { useState } from 'react';
import { Camera, Eye, X } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const gallery = [
    {
      url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
      title: 'Full Rotisserie Shawaya Chicken with Aromatic Mandi Rice',
      category: 'Signature Roast'
    },
    {
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
      title: 'Golden Spiced Chicken on Long-Grain Basmati',
      category: 'Platters'
    },
    {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
      title: 'Charcoal Grilled Seekh Kababs & Boti',
      category: 'Live BBQ'
    },
    {
      url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop',
      title: 'Succulent Flame-Turned Rotisserie Spit',
      category: 'Live Kitchen'
    },
    {
      url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
      title: 'Arabian Chicken Shawarma with Garlic Toum Dip',
      category: 'Fastfood'
    },
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      title: 'Comfortable Air-Conditioned Family Dining Hall',
      category: 'Ambience'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-[#FAF9F6] text-[#1F2937] relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D97706] uppercase block">
            Visual Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
            Kitchen & <span className="font-bold italic text-[#D97706]">Dining Atmosphere</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light">
            Take a look at our juicy rotisserie chicken, fragrant rice cauldrons, and clean family seating.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(photo.url)}
              className="relative h-60 sm:h-72 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-sm hover:shadow-md cursor-pointer group"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              
              {/* Category pill */}
              <div className="absolute top-4 left-4 bg-white/95 text-gray-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                {photo.category}
              </div>

              {/* Eye zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                  <Eye className="w-5 h-5 text-[#D97706]" />
                </div>
              </div>

              {/* Title caption */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-semibold text-white line-clamp-1">{photo.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div 
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activePhoto}
                alt="Enlarged photo"
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
