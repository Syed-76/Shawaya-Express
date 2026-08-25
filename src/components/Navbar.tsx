import React, { useState, useEffect } from 'react';
import { Phone, ShoppingBag, Clock, MapPin, Menu as MenuIcon, X, Flame, Lock, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenReservation,
}) => {
  const { restaurantInfo, openAdminLogin, openChat, unreadAdminMessagesCount } = useRestaurant();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currency = restaurantInfo.currencySymbol || '₹';
  const freeThreshold = restaurantInfo.freeDeliveryThreshold || 1500;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Location', href: '#location' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full transition-all duration-200 bg-[#FDFCFB]">
      {/* Top Announcement & Action Bar */}
      <div id="top-announcement-bar" className="bg-[#FAF9F6] text-[#1F2937] px-4 sm:px-8 py-2 text-xs font-medium border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Timing & Branch note */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-[#059669] text-white uppercase">
              ● {restaurantInfo.hours ? restaurantInfo.hours.split('(')[0] : '12:00 PM – 12:00 AM'}
            </span>
            <span className="text-gray-600 text-xs hidden sm:inline">
              {restaurantInfo.branch} • {restaurantInfo.tagline}
            </span>
          </div>

          {/* Right: Free Delivery Button & Admin Button */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
            {/* Free Delivery Button */}
            <button
              id="top-free-delivery-btn"
              onClick={() => {
                const el = document.getElementById('menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300/60 font-bold text-[11px] transition-colors shadow-2xs group cursor-pointer"
              title="Click to view our delicious menu items"
            >
              <Truck className="w-3.5 h-3.5 text-[#D97706] group-hover:scale-110 transition-transform" />
              <span>Free Delivery for orders above {currency}{freeThreshold.toLocaleString()}</span>
            </button>

            {/* In-Website Direct Chat Button */}
            <button
              id="top-direct-chat-btn"
              onClick={openChat}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/70 font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
              title="Open direct in-website live chat with restaurant"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600 fill-emerald-600/30" />
              <span>Direct Chat</span>
            </button>

            {/* Admin Portal Button */}
            <button
              id="top-admin-portal-btn"
              onClick={openAdminLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-[11px] transition-all shadow-2xs hover:shadow-sm cursor-pointer"
              title="Manage menu, orders, pictures, and restaurant details"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin</span>
            </button>

            {/* Call Link on Desktop */}
            <a 
              href={`tel:${restaurantInfo.phone}`}
              className="hidden lg:flex items-center gap-1.5 hover:text-[#D97706] transition-colors ml-2 text-gray-700 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{restaurantInfo.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FDFCFB]/95 backdrop-blur-md shadow-sm border-b border-gray-200' 
          : 'bg-[#FDFCFB] border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <a href="#" className="flex items-center space-x-3 group" id="brand-logo-link">
              <div className="w-10 h-10 bg-[#D97706] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                {restaurantInfo.name.charAt(0) || 'S'}
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold tracking-tight uppercase text-gray-900">
                  {restaurantInfo.name.split(' ')[0]} <span className="text-[#D97706] font-normal">{restaurantInfo.name.split(' ').slice(1).join(' ') || 'Express'}</span>
                </span>
                <span className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">
                  {restaurantInfo.branch}
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase text-gray-500" id="desktop-nav-links">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-[#D97706] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={openChat}
                className="hover:text-[#D97706] transition-colors uppercase font-medium flex items-center gap-1.5 text-emerald-700 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>
            </nav>

            {/* Actions (Book Table + Cart) */}
            <div className="flex items-center gap-3">
              <button
                id="nav-book-table-btn"
                onClick={onOpenReservation}
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Book Table</span>
              </button>

              {/* Cart Button */}
              <button
                id="nav-cart-btn"
                onClick={onOpenCart}
                className="bg-[#1F2937] text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#D97706] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order Now</span>
                {cartCount > 0 && (
                  <span className="bg-[#D97706] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-dropdown-menu" className="lg:hidden bg-[#FDFCFB] border-t border-gray-100 px-6 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                Book Table
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openChat();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Live Chat
              </button>
            </div>

            {/* Mobile Admin Link */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdminLogin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Management Portal</span>
            </button>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium tracking-wide uppercase text-gray-600 hover:text-[#D97706]"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 text-xs text-gray-400 flex items-center gap-1.5 border-t border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{restaurantInfo.branch} ({restaurantInfo.plusCode ? restaurantInfo.plusCode.split(' ')[0] : 'PWGP+63'})</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
