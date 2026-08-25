import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Phone, MessageSquare, Flame, Clock, 
  MapPin, Star, ArrowUp, Sparkles, Shield
} from 'lucide-react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BranchLocation } from './components/BranchLocation';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ReservationModal } from './components/ReservationModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerChatWidget } from './components/CustomerChatWidget';
import { CartItem, MenuItem } from './types';

function MainAppContent() {
  const { 
    currentView, 
    isAdmin, 
    restaurantInfo,
    openAdminLogin,
    setCurrentView 
  } = useRestaurant();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shawaya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currency = restaurantInfo.currencySymbol || '₹';

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('shawaya_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Handlers
  const handleAddToCart = (
    item: MenuItem, 
    quantity = 1, 
    selectedOptions?: { [key: string]: string }
  ) => {
    let extra = 0;
    if (selectedOptions && item.options) {
      item.options.forEach((opt) => {
        const choice = opt.choices.find((c) => c.name === selectedOptions[opt.name]);
        if (choice && choice.extraPrice) extra += choice.extraPrice;
      });
    }

    const customPrice = (item.discountPrice || item.price) + extra;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((ci) => {
        if (ci.item.id !== item.id) return false;
        if (JSON.stringify(ci.selectedOptions || {}) !== JSON.stringify(selectedOptions || {})) return false;
        return true;
      });

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            item,
            quantity,
            selectedOptions,
            customPrice,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCart((prev) => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.customPrice * item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhatsAppGeneral = () => {
    const msg = `Hello ${restaurantInfo.name}! I want to inquire about your menu and place an order.`;
    window.open(`https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // If Admin View is active and authenticated, show full Admin Control Dashboard
  if (currentView === 'admin' && isAdmin) {
    return (
      <>
        <AdminDashboard />
        <AdminLoginModal />
      </>
    );
  }

  // Otherwise, render the Customer Storefront
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1F2937] font-sans antialiased selection:bg-amber-500 selection:text-white flex flex-col">
      {/* Navbar */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreMenu={() => scrollToSection('menu')}
          onOpenWhatsApp={handleOpenWhatsAppGeneral}
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* Complete Menu Section with Tangy Chicken, Chillers & Mandi Rice */}
        <MenuSection onAddToCart={handleAddToCart} />

        {/* Google Reviews & Ratings */}
        <ReviewsSection />

        {/* Branch Location & Plus Code */}
        <BranchLocation />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            id="scroll-to-top-btn"
            className="w-11 h-11 rounded-full bg-white text-[#1F2937] hover:text-[#D97706] border border-gray-200 flex items-center justify-center shadow-lg transition-all hover:scale-105 pointer-events-auto"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Floating WhatsApp Hotline Button */}
        <button
          onClick={handleOpenWhatsAppGeneral}
          id="floating-whatsapp-btn"
          className="px-5 py-3 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs tracking-wider uppercase shadow-xl flex items-center gap-2 pointer-events-auto transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-700"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span className="hidden sm:inline">WhatsApp Order</span>
        </button>

        {/* Floating Cart Pill (when cart has items) */}
        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            id="floating-cart-btn"
            className="px-6 py-3.5 rounded-full bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-xs tracking-widest uppercase shadow-2xl flex items-center gap-2.5 pointer-events-auto transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Order ({totalCartCount}) • {currency} {totalCartAmount.toLocaleString()}</span>
          </button>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Customer In-Website Direct Chat Widget */}
      <CustomerChatWidget />

      {/* Admin Login Modal */}
      <AdminLoginModal />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <MainAppContent />
    </RestaurantProvider>
  );
}
