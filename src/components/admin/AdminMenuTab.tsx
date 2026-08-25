import React, { useState } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Check, AlertCircle, 
  X, Image as ImageIcon, Sparkles, Tag, Eye, EyeOff, Upload 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem } from '../../types';

export const AdminMenuTab: React.FC = () => {
  const { 
    menuItems, 
    restaurantInfo, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleItemAvailability 
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formUrduName, setFormUrduName] = useState('');
  const [formCategory, setFormCategory] = useState<MenuItem['category']>('shawaya');
  const [formPrice, setFormPrice] = useState<number>(1000);
  const [formDiscountPrice, setFormDiscountPrice] = useState<string>('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formServes, setFormServes] = useState('1-2 Persons');
  const [formSpiceLevel, setFormSpiceLevel] = useState<MenuItem['spiceLevel']>('Medium');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIncludes, setFormIncludes] = useState('');

  const currency = restaurantInfo.currencySymbol || '₹';

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'shawaya', label: 'Tangy & Shawaya Chicken' },
    { id: 'rice', label: 'Mandi Basmati Rice' },
    { id: 'beverages', label: 'Chillers & Beverages' },
    { id: 'sides', label: 'Sauces & Sides' },
    { id: 'deals', label: 'Deals & Combos' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.urduName && item.urduName.includes(searchQuery)) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormUrduName('');
    setFormCategory('shawaya');
    setFormPrice(1500);
    setFormDiscountPrice('');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop');
    setFormServes('1-2 Persons');
    setFormSpiceLevel('Medium');
    setFormIsPopular(false);
    setFormIncludes('1x Whole Chicken, 2x Tortilla Breads, Garlic Sauce, Salad');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormUrduName(item.urduName || '');
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormDiscountPrice(item.discountPrice ? item.discountPrice.toString() : '');
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormServes(item.serves);
    setFormSpiceLevel(item.spiceLevel || 'Medium');
    setFormIsPopular(!!item.isPopular);
    setFormIncludes(item.includes ? item.includes.join(', ') : '');
    setIsFormModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a dish name.');
      return;
    }

    const includesArray = formIncludes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const itemData = {
      name: formName.trim(),
      urduName: formUrduName.trim() || undefined,
      category: formCategory,
      price: Number(formPrice) || 0,
      discountPrice: formDiscountPrice ? Number(formDiscountPrice) : undefined,
      description: formDescription.trim(),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
      serves: formServes.trim() || '1-2 Persons',
      spiceLevel: formSpiceLevel,
      isPopular: formIsPopular,
      includes: includesArray.length > 0 ? includesArray : undefined,
      rating: editingItem?.rating || 4.9,
      reviewsCount: editingItem?.reviewsCount || 12,
      isAvailable: editingItem?.isAvailable !== false,
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
    } else {
      addMenuItem(itemData);
    }

    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Menu Catalog Management</h3>
          <p className="text-xs text-gray-500 font-light mt-0.5">
            Add new dishes, adjust prices, edit descriptions, change pictures, or remove items.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleOpenAdd}
            className="w-full md:w-auto py-2.5 px-5 bg-[#D97706] hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish title, urdu, or ingredients..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isOut = item.isAvailable === false;
          return (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                isOut ? 'opacity-65' : ''
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category & Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                      {item.category}
                    </span>
                    {item.isPopular && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D97706] text-white shadow-sm">
                        ⭐ Special
                      </span>
                    )}
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1 shadow-sm ${
                        isOut 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isOut ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isOut ? 'Out of Stock' : 'In Stock'}</span>
                    </button>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-white text-lg font-bold drop-shadow-md">
                        {currency} {(item.discountPrice || item.price).toLocaleString()}
                      </span>
                      {item.discountPrice && (
                        <span className="text-gray-300 text-xs line-through ml-2">
                          {currency} {item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-200 text-xs font-medium">
                      Serves: {item.serves}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    {item.urduName && (
                      <span className="text-xs text-[#D97706] font-serif shrink-0">{item.urduName}</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {item.includes && item.includes.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1">
                      {item.includes.slice(0, 3).map((inc, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                          {inc}
                        </span>
                      ))}
                      {item.includes.length > 3 && (
                        <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">
                          +{item.includes.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className="text-xs text-gray-500 hover:text-gray-900 font-medium py-1.5 px-2 rounded-lg hover:bg-gray-50"
                >
                  {isOut ? 'Mark Available' : 'Mark Sold Out'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-[#D97706] hover:text-white text-gray-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove "${item.name}" from the menu?`)) {
                        deleteMenuItem(item.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT DISH MODAL */}
      {/* ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-white font-bold">
                  {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingItem ? `Edit "${editingItem.name}"` : 'Add New Menu Dish'}
                  </h3>
                  <p className="text-xs text-gray-300">Set pricing, descriptions, images and options</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItemSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Dish Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sultan Tangy Shawaya Platter"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Urdu Name (Optional)</label>
                  <input
                    type="text"
                    value={formUrduName}
                    onChange={(e) => setFormUrduName(e.target.value)}
                    placeholder="e.g. سلطان ٹینگی شواية پلیٹر"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706] font-serif text-right"
                  />
                </div>
              </div>

              {/* Category & Spice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  >
                    <option value="shawaya">Tangy & Shawaya Chicken</option>
                    <option value="rice">Royal Mandi Rice</option>
                    <option value="beverages">Chillers & Beverages</option>
                    <option value="sides">Sides & Dips</option>
                    <option value="deals">Deals & Combos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Price ({currency}) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Discount Price ({currency})</label>
                  <input
                    type="number"
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(e.target.value)}
                    placeholder="Optional promo price"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              {/* Serves & Spice & Popular */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Servings</label>
                  <input
                    type="text"
                    value={formServes}
                    onChange={(e) => setFormServes(e.target.value)}
                    placeholder="e.g. 2-3 Persons"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Spice Level</label>
                  <select
                    value={formSpiceLevel}
                    onChange={(e) => setFormSpiceLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Extra Spicy">Extra Spicy</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="w-4 h-4 text-[#D97706] rounded focus:ring-[#D97706]"
                    />
                    <span>Highlight as Chef Special ⭐</span>
                  </label>
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Dish Picture (URL or File Upload)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>
                  <label className="cursor-pointer py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview Image */}
                {formImage && (
                  <div className="mt-2 relative w-32 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={formImage} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1 rounded">Preview</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe taste, cooking style, tenderness and garnishes..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              {/* Included Items */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Included Items (comma-separated)</label>
                <input
                  type="text"
                  value={formIncludes}
                  onChange={(e) => setFormIncludes(e.target.value)}
                  placeholder="e.g. 1x Roasted Chicken, 2x Tortillas, 1x Toum Sauce, Salad"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-[#D97706] hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
