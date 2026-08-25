import React, { useState, useRef } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, Send, Phone, MapPin, 
  Clock, Sparkles, Copy, Check, AlertCircle, User, Home, Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderItemRecord } from '../types';
import { useRestaurant } from '../context/RestaurantContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { restaurantInfo, addOrder } = useRestaurant();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dinein'>('delivery');
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('shawaya_customer_name') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('shawaya_customer_phone') || '';
  });
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    return localStorage.getItem('shawaya_customer_address') || '';
  });
  const [tableNumber, setTableNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currency = restaurantInfo.currencySymbol || '₹';
  const freeThreshold = restaurantInfo.freeDeliveryThreshold || 1500;
  const standardFee = restaurantInfo.standardDeliveryFee || 150;

  const subtotal = cart.reduce((acc, item) => acc + item.customPrice * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal >= freeThreshold ? 0 : standardFee) : 0;
  const grandTotal = subtotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, freeThreshold - subtotal);

  // Field validation helpers
  const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
  const isNameValid = customerName.trim().length >= 2;
  const isPhoneValid = cleanPhone.length >= 7;
  const isAddressValid = orderType !== 'delivery' || deliveryAddress.trim().length >= 4;

  const validateForm = (): boolean => {
    setTouched(true);

    if (!isNameValid) {
      setValidationError('Customer Name is required. Please enter your name.');
      nameInputRef.current?.focus();
      return false;
    }

    if (!isPhoneValid) {
      setValidationError('Valid Phone Number is required (min 7 digits) so we can confirm your order.');
      phoneInputRef.current?.focus();
      return false;
    }

    if (orderType === 'delivery' && !isAddressValid) {
      setValidationError('Delivery Address / Landmark is strictly mandatory to confirm a delivery order.');
      addressInputRef.current?.focus();
      return false;
    }

    setValidationError(null);
    return true;
  };

  const generateWhatsAppMessage = () => {
    let msg = `*🍗 NEW ORDER - ${restaurantInfo.name.toUpperCase()}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Order Type:* ${orderType.toUpperCase()}\n`;
    msg += `*Customer Name:* ${customerName.trim()}\n`;
    msg += `*Customer Phone:* ${customerPhone.trim()}\n`;
    if (orderType === 'delivery') {
      msg += `*Delivery Address:* ${deliveryAddress.trim()}\n`;
    } else if (orderType === 'dinein' && tableNumber.trim()) {
      msg += `*Table / Hall:* ${tableNumber.trim()}\n`;
    }
    if (specialInstructions.trim()) {
      msg += `*Special Instructions:* ${specialInstructions.trim()}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*ITEMS ORDERED:*\n`;

    cart.forEach((cItem, i) => {
      msg += `${i + 1}. *${cItem.item.name}* x ${cItem.quantity} = ${currency} ${(cItem.customPrice * cItem.quantity).toLocaleString()}\n`;
      if (cItem.selectedOptions && Object.keys(cItem.selectedOptions).length > 0) {
        const opts = Object.entries(cItem.selectedOptions)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        msg += `   └ _Options: ${opts}_\n`;
      }
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Subtotal:* ${currency} ${subtotal.toLocaleString()}\n`;
    if (orderType === 'delivery') {
      msg += `*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : `${currency} ${deliveryFee}`}\n`;
    }
    msg += `*GRAND TOTAL:* ${currency} ${grandTotal.toLocaleString()}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📍 Branch: ${restaurantInfo.address}\n`;
    msg += `⏰ Placed via ${restaurantInfo.name} Online Website`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    if (!validateForm()) {
      return;
    }

    // Save info for returning customer convenience
    localStorage.setItem('shawaya_customer_name', customerName.trim());
    localStorage.setItem('shawaya_customer_phone', customerPhone.trim());
    if (orderType === 'delivery') {
      localStorage.setItem('shawaya_customer_address', deliveryAddress.trim());
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // Auto record into Admin Orders panel
    const orderItems: OrderItemRecord[] = cart.map(c => ({
      id: c.item.id,
      name: c.item.name,
      price: c.customPrice,
      quantity: c.quantity,
      selectedOptions: c.selectedOptions
    }));

    const resolvedAddress = orderType === 'delivery'
      ? deliveryAddress.trim()
      : orderType === 'dinein'
        ? `Dine-In ${tableNumber.trim() ? `(${tableNumber.trim()})` : '(Family Hall)'}`
        : 'Takeaway Counter Pickup';

    addOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: resolvedAddress,
      orderType,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: grandTotal,
      status: 'pending',
      paymentStatus: 'cod',
      notes: specialInstructions.trim()
    });

    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodedMessage}`;
    
    setOrderPlaced(true);
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyOrder = () => {
    if (!validateForm()) {
      return;
    }
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFormComplete = isNameValid && isPhoneValid && (orderType !== 'delivery' || isAddressValid);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div 
        id="cart-drawer-container"
        className="w-full max-w-md bg-white text-gray-900 h-full flex flex-col border-l border-gray-200 shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 text-[#D97706] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-900">Your Food Order</h2>
              <span className="text-[11px] text-gray-400 font-light">
                {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-gray-400 hover:text-red-600 p-2 rounded-full text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear all items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              id="close-cart-btn"
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Delivery Bar */}
        {orderType === 'delivery' && (
          <div className="bg-amber-50/80 px-5 py-2.5 border-b border-amber-100 text-xs">
            {amountNeededForFreeDelivery > 0 ? (
              <p className="text-amber-900 font-light">
                Add <span className="font-bold text-[#D97706]">{currency} {amountNeededForFreeDelivery.toLocaleString()}</span> more for <span className="font-bold text-emerald-700">FREE Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>You unlocked FREE Delivery!</span>
              </p>
            )}
          </div>
        )}

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="text-gray-800 font-bold text-base">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs font-light">
                  Add some rotisserie Shawaya chicken, flavorful Mandi rice, or refreshing drinks to get started.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1F2937] hover:bg-[#D97706] text-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Order Type Toggle */}
              <div className="bg-gray-100 p-1 rounded-full grid grid-cols-3 gap-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setOrderType('delivery');
                    setValidationError(null);
                  }}
                  className={`py-2 rounded-full transition-colors cursor-pointer ${
                    orderType === 'delivery' ? 'bg-[#1F2937] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => {
                    setOrderType('takeaway');
                    setValidationError(null);
                  }}
                  className={`py-2 rounded-full transition-colors cursor-pointer ${
                    orderType === 'takeaway' ? 'bg-[#1F2937] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Takeaway
                </button>
                <button
                  onClick={() => {
                    setOrderType('dinein');
                    setValidationError(null);
                  }}
                  className={`py-2 rounded-full transition-colors cursor-pointer ${
                    orderType === 'dinein' ? 'bg-[#1F2937] text-white shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dine-in
                </button>
              </div>

              {/* Items Cards */}
              <div className="space-y-3 pt-2">
                {cart.map((cartItem, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3 justify-between"
                  >
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{cartItem.item.name}</h4>
                      {cartItem.selectedOptions && Object.keys(cartItem.selectedOptions).length > 0 && (
                        <p className="text-[10px] text-[#D97706] truncate font-medium">
                          {Object.values(cartItem.selectedOptions).join(', ')}
                        </p>
                      )}
                      <div className="text-xs font-bold text-gray-900">
                        {currency} {(cartItem.customPrice * cartItem.quantity).toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-full border border-gray-200">
                      <button
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center text-xs shadow-sm font-bold cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 min-w-[16px] text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center text-xs shadow-sm font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Delivery Details Form */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    <User className="w-3 h-3 text-[#D97706]" />
                    {orderType === 'delivery' ? 'Delivery Information (All Required)' : 'Customer Contact Details (Required)'}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">* Mandatory</span>
                </div>

                {/* Validation Banner if missing details */}
                {validationError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{validationError}</p>
                      <p className="text-[11px] text-rose-700 font-light mt-0.5">
                        {orderType === 'delivery' 
                          ? 'Delivery orders cannot be confirmed without Name, Phone Number, and Delivery Address.'
                          : 'Dine-in and takeaway orders cannot be confirmed without Name and Phone Number.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Your Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      placeholder="e.g. Ali Khan"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none shadow-sm transition-all ${
                        touched && !isNameValid 
                          ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30' 
                          : 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-amber-200'
                      }`}
                    />
                    {touched && !isNameValid && (
                      <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">Name is required</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Phone Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      required
                      placeholder="03xx-xxxxxxx"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none shadow-sm transition-all ${
                        touched && !isPhoneValid 
                          ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30' 
                          : 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-amber-200'
                      }`}
                    />
                    {touched && !isPhoneValid && (
                      <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">Phone is required</span>
                    )}
                  </div>
                </div>

                {/* Delivery Address field - strictly required for delivery */}
                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Full Delivery Address & Landmark <span className="text-rose-600">*</span>
                    </label>
                    <input
                      ref={addressInputRef}
                      type="text"
                      required
                      placeholder="House / Street, Mohallah / Near Landmark, Lalamusa"
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none shadow-sm transition-all ${
                        touched && !isAddressValid 
                          ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30' 
                          : 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-amber-200'
                      }`}
                    />
                    {touched && !isAddressValid && (
                      <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">
                        Delivery address is mandatory to deliver your order
                      </span>
                    )}
                  </div>
                )}

                {/* Dine-In Table number (optional) */}
                {orderType === 'dinein' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      Table / Seating Area (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4 / AC Family Hall / Ground Floor"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 shadow-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Special Kitchen Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra spicy, garlic toum sauce, no chili sauce"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 shadow-sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Order CTA */}
        {cart.length > 0 && (
          <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-4">
            {/* Bill summary */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">{currency} {subtotal.toLocaleString()}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'text-gray-900'}>
                    {deliveryFee === 0 ? 'FREE' : `${currency} ${deliveryFee}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-base text-gray-900 font-extrabold">{currency} {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                id="send-whatsapp-order-btn"
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 px-4 rounded-full bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Order via WhatsApp</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyOrder}
                  className="flex-1 py-2.5 px-3 rounded-full bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-gray-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="py-2.5 px-5 rounded-full bg-white hover:bg-gray-100 text-[#D97706] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-gray-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Branch</span>
                </a>
              </div>
            </div>

            <p className="text-[10px] text-center text-gray-400 font-light">
              🔒 Name & Phone required so our kitchen staff can verify and deliver your order accurately.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

