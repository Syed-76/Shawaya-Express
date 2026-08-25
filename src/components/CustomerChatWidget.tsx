import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, User, Phone, Bot, Check, 
  Sparkles, Clock, ChevronDown, Minimize2, Flame
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

const QUICK_INQUIRIES = [
  'Is free home delivery available right now?',
  'I would like to reserve a table in the AC Family Hall.',
  'How spicy is the Tangy Chicken Shawaya?',
  'What are your today special deals & timings?'
];

export const CustomerChatWidget: React.FC = () => {
  const { 
    restaurantInfo, 
    chatMessages, 
    isChatOpen, 
    openChat, 
    closeChat, 
    toggleChat,
    sendCustomerMessage 
  } = useRestaurant();

  const [inputMessage, setInputMessage] = useState('');
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('shawaya_customer_name') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('shawaya_customer_phone') || '';
  });
  const [showIdentityInputs, setShowIdentityInputs] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Unread messages count for customer (messages sent by restaurant that are unread)
  const unreadRestaurantCount = chatMessages.filter(m => m.sender === 'restaurant' && !m.isRead).length;

  useEffect(() => {
    if (customerName) localStorage.setItem('shawaya_customer_name', customerName);
    if (customerPhone) localStorage.setItem('shawaya_customer_phone', customerPhone);
  }, [customerName, customerPhone]);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    sendCustomerMessage(inputMessage, customerName, customerPhone);
    setInputMessage('');
  };

  const handleSendQuickInquiry = (text: string) => {
    sendCustomerMessage(text, customerName, customerPhone);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto">
        <button
          onClick={toggleChat}
          id="customer-live-chat-toggle-btn"
          aria-label="Direct Live Chat"
          className="relative group px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs tracking-wider uppercase shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-700 cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-gray-900 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Direct Chat</span>
          <span className="sm:hidden">Chat</span>
          
          {unreadRestaurantCount > 0 && !isChatOpen && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
              {unreadRestaurantCount}
            </span>
          )}
        </button>
      </div>

      {/* In-Website Chat Modal / Window */}
      {isChatOpen && (
        <div 
          id="in-website-chat-modal"
          className="fixed bottom-20 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow-inner font-bold">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-gray-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm tracking-tight">{restaurantInfo.name}</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-light flex items-center gap-1">
                  <span>Direct Kitchen & Support Desk</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer Info Bar (Collapsible) */}
          <div className="bg-amber-50/80 px-4 py-2 border-b border-amber-100/80 text-[11px] text-gray-700 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="text-gray-500 font-medium">Chatting as: </span>
              <span className="font-bold text-gray-900">
                {customerName ? customerName : 'Guest Customer'}
              </span>
              {customerPhone && <span className="text-gray-500 font-mono ml-1">({customerPhone})</span>}
            </div>
            <button
              type="button"
              onClick={() => setShowIdentityInputs(!showIdentityInputs)}
              className="text-[#D97706] font-bold underline whitespace-nowrap text-[11px]"
            >
              {showIdentityInputs ? 'Save' : 'Edit info'}
            </button>
          </div>

          {/* Optional Identity Form Drawer */}
          {showIdentityInputs && (
            <div className="p-3 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-2 animate-in fade-in">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-600 mb-0.5">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-600 mb-0.5">Phone (Optional)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FDFCFB]">
            {chatMessages.map((msg) => {
              const isMe = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                    isMe ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <span className="text-[10px] text-gray-400 mb-1 px-1 font-light">
                    {msg.senderName || (isMe ? 'You' : 'Staff')} •{' '}
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#1F2937] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiry Suggestions */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {QUICK_INQUIRIES.map((inquiry, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuickInquiry(inquiry)}
                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#D97706] hover:text-[#D97706] text-[11px] font-medium transition-colors shadow-2xs shrink-0"
              >
                {inquiry}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message to Shawaya Express..."
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 rounded-2xl bg-[#D97706] hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-[#D97706] text-white flex items-center justify-center shadow-sm transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
