import React, { useState, useMemo } from 'react';
import { 
  Search, Flame, Star, Users, Plus, Check, Filter, 
  ChevronRight, X, Info, Sparkles, MessageSquare, GlassWater, AlertCircle
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem } from '../types';
import { TangyChickenDishGraphic } from './TangyChickenDishGraphic';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, quantity?: number, selectedOptions?: { [key: string]: string }) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const { menuItems, restaurantInfo } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [modalOptions, setModalOptions] = useState<{ [key: string]: string }>({});
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [showAddedToast, setShowAddedToast] = useState<string | null>(null);

  const currency = restaurantInfo.currencySymbol || '₹';

  const categories = [
    { id: 'all', label: 'All Specials', icon: '🍽️' },
    { id: 'shawaya', label: 'Tangy & Shawaya', icon: '🍗' },
    { id: 'rice', label: 'Royal Mandi Rice', icon: '🍚' },
    { id: 'beverages', label: 'Frosty Chillers & Drinks', icon: '🥤' },
    { id: 'sides', label: 'Extra Add-Ons & Sauces', icon: '🥣' },
    { id: 'deals', label: 'Deals & Combos', icon: '⭐' },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.urduName && item.urduName.includes(searchQuery)) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const handleOpenCustomizeModal = (item: MenuItem) => {
    if (item.isAvailable === false) return;
    setSelectedItemForModal(item);
    setModalQuantity(1);
    const initialOpts: { [key: string]: string } = {};
    if (item.options) {
      item.options.forEach((opt) => {
        if (opt.choices.length > 0) {
          initialOpts[opt.name] = opt.choices[0].name;
        }
      });
    }
    setModalOptions(initialOpts);
  };

  const calculateModalPrice = () => {
    if (!selectedItemForModal) return 0;
    let base = selectedItemForModal.discountPrice || selectedItemForModal.price;
    if (selectedItemForModal.options) {
      selectedItemForModal.options.forEach((opt) => {
        const chosen = opt.choices.find((c) => c.name === modalOptions[opt.name]);
        if (chosen && chosen.extraPrice) {
          base += chosen.extraPrice;
        }
      });
    }
    return base * modalQuantity;
  };

  const handleConfirmModalAdd = () => {
    if (!selectedItemForModal || selectedItemForModal.isAvailable === false) return;
    onAddToCart(selectedItemForModal, modalQuantity, modalOptions);
    setShowAddedToast(selectedItemForModal.name);
    setTimeout(() => setShowAddedToast(null), 2500);
    setSelectedItemForModal(null);
  };

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isAvailable === false) return;
    if (item.options && item.options.length > 0) {
      handleOpenCustomizeModal(item);
    } else {
      onAddToCart(item, 1);
      setShowAddedToast(item.name);
      setTimeout(() => setShowAddedToast(null), 2500);
    }
  };

  const handleDirectWhatsAppItem = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemPrice = item.discountPrice || item.price;
    const text = `Hello ${restaurantInfo.name}! I want to order *${item.name}* (${currency} ${itemPrice.toLocaleString()}). Please confirm my order for delivery / takeaway.`;
    window.open(`https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="menu" className="py-20 bg-[#FDFCFB] text-[#1F2937] relative border-b border-gray-100">
      {/* Toast notification */}
      {showAddedToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1F2937] text-white px-5 py-3 rounded-full shadow-2xl font-semibold text-xs tracking-wider uppercase flex items-center gap-2 border border-gray-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added "{showAddedToast}" to Order</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-gray-100">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mouth-Watering & Freshly Prepared</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
              Tangy Chicken, Royal Mandi <span className="font-bold italic text-[#D97706]">& Frosty Chillers</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-xl font-light">
              Explore our chef-signature Tangy Glazed Chicken with fresh tortilla breads & sauces, royal nuts Mandi rice, ice-cold Mint Margaritas, and fresh sides.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tangy, mandi, chiller..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3 shadow-sm">
            <Info className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No menu items found</h3>
            <p className="text-xs text-gray-500 font-light">Try searching for something else or reset your filter.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#1F2937] text-white font-bold rounded-full text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const isOut = item.isAvailable === false;
              return (
                <div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  onClick={() => !isOut && handleOpenCustomizeModal(item)}
                  className={`bg-white rounded-3xl border border-gray-100 hover:border-gray-300 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between transition-all duration-200 group ${
                    isOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {/* Image + tags */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {item.id === 'tangy-chicken-full' ? (
                      <TangyChickenDishGraphic type="full" />
                    ) : item.id === 'tangy-chicken-half' ? (
                      <TangyChickenDishGraphic type="half" />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    {isOut ? (
                      <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        Sold Out Today
                      </span>
                    ) : item.category === 'beverages' ? (
                      <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        ❄️ Ice Chilled
                      </span>
                    ) : item.isPopular ? (
                      <span className="absolute top-4 left-4 bg-[#D97706] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        ★ Yummy Best Seller
                      </span>
                    ) : null}

                    {item.spiceLevel && (
                      <span className="absolute top-4 right-4 bg-white/95 text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        🌶️ {item.spiceLevel}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      Serves: {item.serves}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#D97706] transition-colors">
                          {item.name}
                        </h3>
                        {item.urduName && (
                          <p className="text-xs text-[#D97706] font-serif mt-0.5">{item.urduName}</p>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">
                        {item.description}
                      </p>

                      {/* Includes Pill tags */}
                      {item.includes && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.includes.slice(0, 3).map((inc, i) => (
                            <span key={i} className="text-[10px] bg-amber-50/80 text-gray-700 px-2 py-0.5 rounded-md border border-amber-100 font-medium">
                              ✓ {inc}
                            </span>
                          ))}
                          {item.includes.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-medium self-center">
                              +{item.includes.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pricing and Actions */}
                    <div className="pt-3 flex items-center justify-between border-t border-gray-100 gap-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {currency} {(item.discountPrice || item.price).toLocaleString()}
                        </span>
                        {item.discountPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            {currency} {item.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          title="WhatsApp Order"
                          onClick={(e) => handleDirectWhatsAppItem(item, e)}
                          className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`quick-add-btn-${item.id}`}
                          disabled={isOut}
                          onClick={(e) => handleQuickAdd(item, e)}
                          className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm ${
                            isOut
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#1F2937] hover:bg-[#D97706] text-white'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isOut ? 'Sold Out' : item.options ? 'Customize' : 'Add'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Item Details / Customization */}
        {selectedItemForModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div 
              id="item-customize-modal"
              className="bg-white border border-gray-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-[#1F2937]"
            >
              {/* Modal Image Header */}
              <div className="relative h-56 bg-gray-100 flex-shrink-0">
                {selectedItemForModal.id === 'tangy-chicken-full' ? (
                  <TangyChickenDishGraphic type="full" />
                ) : selectedItemForModal.id === 'tangy-chicken-half' ? (
                  <TangyChickenDishGraphic type="half" />
                ) : (
                  <img
                    src={selectedItemForModal.image}
                    alt={selectedItemForModal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={() => setSelectedItemForModal(null)}
                  className="absolute top-4 right-4 bg-white/90 text-gray-800 hover:text-black p-2 rounded-full shadow-md z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 rounded-full text-gray-900 text-xs font-bold shadow-sm z-10">
                  {currency} {(selectedItemForModal.discountPrice || selectedItemForModal.price).toLocaleString()}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedItemForModal.name}</h3>
                  {selectedItemForModal.urduName && (
                    <p className="text-xs text-[#D97706] font-serif mt-0.5">{selectedItemForModal.urduName}</p>
                  )}
                  <p className="text-xs text-gray-500 font-light mt-1.5">{selectedItemForModal.description}</p>
                </div>

                {/* Included Items Pill List */}
                {selectedItemForModal.includes && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Included In This Item:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedItemForModal.includes.map((inc, i) => (
                        <span key={i} className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Options */}
                {selectedItemForModal.options?.map((opt) => (
                  <div key={opt.name} className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                      {opt.name}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {opt.choices.map((choice) => (
                        <button
                          key={choice.name}
                          type="button"
                          onClick={() => setModalOptions({ ...modalOptions, [opt.name]: choice.name })}
                          className={`p-3 rounded-2xl text-xs text-left border flex items-center justify-between transition-colors ${
                            modalOptions[opt.name] === choice.name
                              ? 'bg-amber-50 border-[#D97706] text-[#D97706] font-bold'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <span>{choice.name}</span>
                          {choice.extraPrice ? (
                            <span className="text-[10px] text-[#D97706]">+{currency} {choice.extraPrice}</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quantity selector */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-7 h-7 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold text-sm shadow-sm hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-bold text-gray-900 min-w-[20px] text-center text-sm">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-7 h-7 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold text-sm shadow-sm hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 flex-shrink-0">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">Total</span>
                  <span className="text-xl font-bold text-gray-900">{currency} {calculateModalPrice().toLocaleString()}</span>
                </div>
                <button
                  id="confirm-modal-add-btn"
                  onClick={handleConfirmModalAdd}
                  className="flex-1 py-3 px-6 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add To Order</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
