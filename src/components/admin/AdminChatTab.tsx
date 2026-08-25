import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, User, Trash2, CheckCircle2, 
  Sparkles, Clock, Phone, AlertCircle, RefreshCw, Bot
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

const QUICK_STAFF_REPLIES = [
  'Assalam-o-Alaikum! Yes, fresh flame-roasted chicken and Mandi rice are available.',
  'Your order is being prepared and will be dispatched within 15-20 minutes.',
  'Table reserved in our AC Family Hall! We look forward to hosting you.',
  'Yes, we provide free home delivery for orders above ₹1,500.',
  'Thank you for contacting Shawaya Express! Let us know if you need anything else.'
];

export const AdminChatTab: React.FC = () => {
  const { 
    chatMessages, 
    sendAdminReply, 
    clearChatMessages, 
    restaurantInfo 
  } = useRestaurant();

  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    sendAdminReply(replyText);
    setReplyText('');
  };

  const handleUseQuickReply = (text: string) => {
    sendAdminReply(text);
  };

  const customerMessagesCount = chatMessages.filter(m => m.sender === 'customer').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Direct Customer Live Chat Desk</h3>
            <p className="text-xs text-gray-500 font-light">
              Direct two-way in-website communication between customer and {restaurantInfo.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Connected
          </span>
          <button
            onClick={() => {
              if (confirm('Clear all conversation messages?')) {
                clearChatMessages();
              }
            }}
            className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-bold text-gray-600">No active customer messages</p>
              <p className="text-xs text-gray-400 max-w-sm mt-1">
                When customers chat using the live chat widget on the website, their questions and orders will appear here.
              </p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} max-w-[80%] ${
                    isCustomer ? 'mr-auto' : 'ml-auto'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-bold text-gray-800">
                      {msg.senderName || (isCustomer ? 'Guest Customer' : 'Restaurant Staff')}
                    </span>
                    {msg.senderPhone && (
                      <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        📞 {msg.senderPhone}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-light">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isCustomer
                        ? 'bg-white text-gray-900 border border-gray-200 rounded-tl-none font-medium'
                        : 'bg-[#1F2937] text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Staff Response Chips */}
        <div className="p-3 bg-gray-100/80 border-t border-gray-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">
            ⚡ Quick One-Click Staff Responses:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_STAFF_REPLIES.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleUseQuickReply(reply)}
                className="px-3 py-1.5 bg-white hover:bg-amber-50 hover:border-[#D97706] hover:text-[#D97706] text-gray-700 text-xs rounded-xl border border-gray-200 whitespace-nowrap transition-colors shadow-2xs font-medium cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Reply Input Form */}
        <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type official restaurant staff reply..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="py-3 px-6 bg-[#D97706] hover:bg-amber-600 disabled:opacity-40 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Send Reply</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
