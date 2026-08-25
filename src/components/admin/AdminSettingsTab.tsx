import React, { useState } from 'react';
import { 
  Building2, Phone, MapPin, Clock, DollarSign, 
  Lock, Save, RotateCcw, Check, Sparkles, AlertTriangle,
  Eye, EyeOff, ShieldCheck, KeyRound
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { RestaurantSettings } from '../../types';

export const AdminSettingsTab: React.FC = () => {
  const { restaurantInfo, updateRestaurantInfo, changePassword, resetToDefaults } = useRestaurant();

  // Local Form State
  const [formData, setFormData] = useState<RestaurantSettings>(restaurantInfo);
  
  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  const handleChange = (field: keyof RestaurantSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantInfo(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg({ text: 'Please enter your current admin password.', type: 'error' });
      return;
    }
    if (!newPassword.trim()) {
      setPasswordMsg({ text: 'New password cannot be empty.', type: 'error' });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMsg({ text: 'New password must be at least 4 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordMsg({ text: result.message, type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } else {
      setPasswordMsg({ text: result.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-700 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-emerald-200" />
          <div>
            <h5 className="font-bold text-xs">Settings Saved!</h5>
            <p className="text-[11px] text-emerald-100 font-light">All restaurant details updated on live site.</p>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Card 1: Restaurant Identity */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Restaurant Branding & Identity</h3>
              <p className="text-xs text-gray-500 font-light">Website title, Urdu branding, and marketing tagline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Urdu Name</label>
              <input
                type="text"
                value={formData.urduName}
                onChange={(e) => handleChange('urduName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706] font-serif text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Branch Name</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                placeholder="e.g. Thikrian, Mor Lalamusa"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Authentic Flame-Roasted Chicken & Fragrant Mandi Rice"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contact, Phone & WhatsApp */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Contact & WhatsApp Orders</h3>
              <p className="text-xs text-gray-500 font-light">Numbers for customer calls and direct WhatsApp orders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">WhatsApp Number (Digits only)</label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 923171780967"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Used for direct 1-click cart WhatsApp ordering</span>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Display Phone</label>
              <input
                type="text"
                value={formData.displayPhone}
                onChange={(e) => handleChange('displayPhone', e.target.value)}
                placeholder="e.g. 0317 1780967"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Direct Call Link Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +92 317 1780967"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Address & Location */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Location & Branch Address</h3>
              <p className="text-xs text-gray-500 font-light">Physical branch location, Google Plus Code, and maps URL</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Full Physical Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Thikrian, Mor Lalamusa, 50200, Pakistan"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Google Plus Code</label>
              <input
                type="text"
                value={formData.plusCode}
                onChange={(e) => handleChange('plusCode', e.target.value)}
                placeholder="e.g. PWGP+63 Lalamusa, Pakistan"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.hours}
                onChange={(e) => handleChange('hours', e.target.value)}
                placeholder="e.g. 12:00 PM – 12:00 AM (7 Days a Week)"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Delivery Pricing & Currency */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delivery Rates & Currency</h3>
              <p className="text-xs text-gray-500 font-light">Free delivery threshold buttons and delivery notes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                placeholder="e.g. ₹ or Rs"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Free Delivery Min Threshold</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#D97706]"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Controls top header button: "Free Delivery for orders above ₹1500"</span>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Standard Delivery Fee</label>
              <input
                type="number"
                value={formData.standardDeliveryFee}
                onChange={(e) => handleChange('standardDeliveryFee', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Delivery Banner Note</label>
            <input
              type="text"
              value={formData.deliveryNote}
              onChange={(e) => handleChange('deliveryNote', e.target.value)}
              placeholder="e.g. Free delivery in Lalamusa city & nearby on orders above ₹1,500"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
            />
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-8 bg-[#D97706] hover:bg-amber-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Restaurant Changes</span>
          </button>
        </div>
      </form>

      {/* Security & Admin Password Section */}
      <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Change Secret Admin Password</h3>
            <p className="text-xs text-gray-500 font-light">
              Securely update the password used to access this Admin Portal. Password remains masked and strictly private.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
          {passwordMsg && (
            <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
              passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {passwordMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  title={showCurrentPass ? 'Hide' : 'Show'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  title={showNewPass ? 'Hide' : 'Show'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  title={showConfirmPass ? 'Hide' : 'Show'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400 font-light flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Password is encrypted & never displayed to visitors or unauthorized users.
            </span>
            <button
              type="submit"
              className="py-2.5 px-6 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              Update Admin Password
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone / Factory Reset */}
      <div className="p-6 bg-rose-50/60 rounded-3xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h4 className="font-bold text-rose-900 text-sm">Reset Menu & Settings</h4>
        </div>
        <p className="text-xs text-rose-700 font-light">
          Restore default menu dishes and restaurant configuration.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to reset menu and restaurant settings to initial defaults?')) {
              resetToDefaults();
              alert('Restaurant details restored to default!');
            }
          }}
          className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
};
