import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Phone, User, CheckCircle2, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRestaurant } from '../context/RestaurantContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const { restaurantInfo } = useRestaurant();
  const [name, setName] = useState(() => {
    return localStorage.getItem('shawaya_customer_name') || '';
  });
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('shawaya_customer_phone') || '';
  });
  const [guests, setGuests] = useState('4');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('20:00');
  const [seatingType, setSeatingType] = useState<'Family Hall (AC)' | 'General Dining' | 'Private Corner'>('Family Hall (AC)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = cleanPhone.length >= 7;

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isNameValid) {
      setErrorMsg('Full Name is strictly required so we can reserve your table.');
      return;
    }

    if (!isPhoneValid) {
      setErrorMsg('Contact Phone Number is strictly required so our host desk can confirm availability with you.');
      return;
    }

    setErrorMsg(null);
    localStorage.setItem('shawaya_customer_name', name.trim());
    localStorage.setItem('shawaya_customer_phone', phone.trim());

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    // Generate WhatsApp text for table booking
    let msg = `*🍽️ TABLE RESERVATION REQUEST - ${restaurantInfo.name.toUpperCase()}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Name:* ${name.trim()}\n`;
    msg += `*Phone:* ${phone.trim()}\n`;
    msg += `*Guests:* ${guests} Persons\n`;
    msg += `*Date:* ${date}\n`;
    msg += `*Estimated Time:* ${time}\n`;
    msg += `*Seating Area:* ${seatingType}\n`;
    if (specialNotes.trim()) {
      msg += `*Special Requests:* ${specialNotes.trim()}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📍 Branch: ${restaurantInfo.address}\n`;
    msg += `Please confirm table availability for my family. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${restaurantInfo.whatsappNumber}?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="reservation-modal-box"
        className="bg-white border border-gray-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-[#D97706] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Reserve AC Family Table</h3>
              <p className="text-xs text-[#D97706] font-medium">{restaurantInfo.branch} • {restaurantInfo.hours || '12:00 PM – 12:00 AM'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Table Request Sent!</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto font-light">
              Your reservation details have been transmitted directly to our staff in {restaurantInfo.branch} via WhatsApp. We will welcome your family warmly!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#1F2937] hover:bg-[#D97706] text-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReservation} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{errorMsg}</p>
                  <p className="text-[11px] text-rose-700 font-light mt-0.5">
                    Your name and phone number are required so our desk can verify and allocate the right table.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g. Bilal Ahmed"
                    className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                      touched && !isNameValid
                        ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                        : 'border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-amber-200'
                    }`}
                  />
                </div>
                {touched && !isNameValid && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">Name is required</span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Contact Phone <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="03xx-xxxxxxx"
                    className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                      touched && !isPhoneValid
                        ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                        : 'border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-amber-200'
                    }`}
                  />
                </div>
                {touched && !isPhoneValid && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">Phone number is required</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-gray-900"
                >
                  {[2, 3, 4, 5, 6, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>{n} Persons</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            {/* Seating preference */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Seating Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Family Hall (AC)', 'General Dining', 'Private Corner'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSeatingType(type)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border text-center transition-colors cursor-pointer ${
                      seatingType === type
                        ? 'bg-[#1F2937] text-white font-bold border-[#1F2937]'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Special Notes (Optional)</label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Need high chair, pre-order Full Shawaya roast"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Table via WhatsApp</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2 font-light">
                🔒 Name and phone number ensure our table host can prepare your AC Family seating.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

