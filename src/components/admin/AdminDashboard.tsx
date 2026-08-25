import React, { useState } from 'react';
import { 
  ShoppingBag, UtensilsCrossed, Settings, Image as ImageIcon, 
  ArrowLeft, LogOut, ShieldCheck, Flame, Store, Eye, 
  Sparkles, CheckCircle2, Clock, MessageSquare 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminMenuTab } from './AdminMenuTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminMediaTab } from './AdminMediaTab';
import { AdminChatTab } from './AdminChatTab';

export const AdminDashboard: React.FC = () => {
  const { restaurantInfo, menuItems, orders, logout, setCurrentView, unreadCustomerMessagesCount } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'orders' | 'chat' | 'menu' | 'settings' | 'media'>('orders');

  const pendingOrdersCount = orders.filter(o => ['pending', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length;
  const currency = restaurantInfo.currencySymbol || '₹';

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-800 flex flex-col antialiased">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Brand Info & Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97706] flex items-center justify-center text-white font-bold text-lg shadow-inner">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                  {restaurantInfo.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-light truncate max-w-xs">
                {restaurantInfo.branch} • Active Management Session
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* View Live Customer Site Button */}
            <button
              onClick={() => setCurrentView('customer')}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>View Customer Site</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Logout from admin session"
              className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 border border-rose-800/40 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="bg-gray-950 border-t border-gray-800 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5">
            {[
              { 
                id: 'orders', 
                label: 'Orders & Kitchen', 
                icon: ShoppingBag, 
                badge: pendingOrdersCount > 0 ? pendingOrdersCount : null 
              },
              { 
                id: 'chat', 
                label: 'Customer Live Chat', 
                icon: MessageSquare, 
                badge: unreadCustomerMessagesCount > 0 ? unreadCustomerMessagesCount : null 
              },
              { 
                id: 'menu', 
                label: 'Menu Items & Pricing', 
                icon: UtensilsCrossed, 
                count: menuItems.length 
              },
              { 
                id: 'settings', 
                label: 'Restaurant Info & Address', 
                icon: Settings 
              },
              { 
                id: 'media', 
                label: 'Pictures & Headlines', 
                icon: ImageIcon 
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#D97706] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span className="text-[10px] opacity-75 font-mono">
                      ({tab.count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {activeTab === 'orders' && <AdminOrdersTab />}
        {activeTab === 'chat' && <AdminChatTab />}
        {activeTab === 'menu' && <AdminMenuTab />}
        {activeTab === 'settings' && <AdminSettingsTab />}
        {activeTab === 'media' && <AdminMediaTab />}
      </main>

      {/* Admin Footer Bar */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-gray-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {restaurantInfo.name} Admin Management System (Live Sync Enabled)
          </span>
          <button
            onClick={() => setCurrentView('customer')}
            className="text-[#D97706] hover:underline font-bold cursor-pointer"
          >
            ← Back to Customer Website
          </button>
        </div>
      </footer>
    </div>
  );
};
