import React, { useState } from 'react';
import { 
  Plus, Search, Filter, ShoppingBag, Clock, CheckCircle2, 
  Truck, AlertCircle, X, Trash2, Eye, MessageSquare, Phone, 
  MapPin, Check, DollarSign, Calendar, RefreshCw, Printer 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderRecord, OrderItemRecord, MenuItem } from '../../types';

export const AdminOrdersTab: React.FC = () => {
  const { 
    orders, 
    menuItems, 
    restaurantInfo, 
    addOrder, 
    updateOrderStatus, 
    updateOrderPaymentStatus, 
    deleteOrder 
  } = useRestaurant();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderRecord | null>(null);

  // New Order Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newOrderType, setNewOrderType] = useState<'delivery' | 'takeaway' | 'dinein'>('delivery');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'paid' | 'unpaid' | 'cod'>('cod');
  const [newNotes, setNewNotes] = useState('');
  const [newSelectedItems, setNewSelectedItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // Calculate quick metrics
  const currency = restaurantInfo.currencySymbol || '₹';
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(o => ['pending', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSearch = 
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">⏳ Pending</span>;
      case 'preparing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">🔥 Kitchen Preparing</span>;
      case 'ready':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">📦 Ready for Pickup</span>;
      case 'out_for_delivery':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">🛵 On the Way</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✅ Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">❌ Cancelled</span>;
      default:
        return null;
    }
  };

  // Add Item to New Order Form
  const handleAddItemToNewOrder = (item: MenuItem) => {
    setNewSelectedItems(prev => {
      const idx = prev.findIndex(p => p.item.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateNewOrderQty = (itemId: string, delta: number) => {
    setNewSelectedItems(prev => {
      return prev
        .map(p => {
          if (p.item.id === itemId) {
            const newQty = p.quantity + delta;
            return newQty > 0 ? { ...p, quantity: newQty } : null;
          }
          return p;
        })
        .filter(Boolean) as { item: MenuItem; quantity: number }[];
    });
  };

  const calculateNewOrderSubtotal = () => {
    return newSelectedItems.reduce((sum, p) => sum + (p.item.discountPrice || p.item.price) * p.quantity, 0);
  };

  const [newOrderError, setNewOrderError] = useState<string | null>(null);

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewOrderError(null);

    if (!newCustomerName.trim()) {
      setNewOrderError('Customer Name is required.');
      return;
    }

    if (!newCustomerPhone.trim() || newCustomerPhone.replace(/[^0-9]/g, '').length < 7) {
      setNewOrderError('Valid Customer Phone number is required (min 7 digits).');
      return;
    }

    if (newOrderType === 'delivery' && !newAddress.trim()) {
      setNewOrderError('Delivery address / landmark is required for delivery orders.');
      return;
    }

    if (newSelectedItems.length === 0) {
      setNewOrderError('Please select at least one menu item to create the order.');
      return;
    }

    const subtotal = calculateNewOrderSubtotal();
    const deliveryFee = newOrderType === 'delivery' 
      ? (subtotal >= restaurantInfo.freeDeliveryThreshold ? 0 : restaurantInfo.standardDeliveryFee) 
      : 0;

    const items: OrderItemRecord[] = newSelectedItems.map(p => ({
      id: p.item.id,
      name: p.item.name,
      price: p.item.discountPrice || p.item.price,
      quantity: p.quantity,
    }));

    addOrder({
      customerName: newCustomerName.trim(),
      customerPhone: newCustomerPhone.trim(),
      deliveryAddress: newAddress.trim() || (newOrderType === 'dinein' ? 'AC Family Hall' : 'Branch Pickup Counter'),
      orderType: newOrderType,
      paymentStatus: newPaymentStatus,
      status: 'pending',
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      items,
      notes: newNotes.trim()
    });

    // Reset Form
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewAddress('');
    setNewOrderType('delivery');
    setNewPaymentStatus('cod');
    setNewNotes('');
    setNewSelectedItems([]);
    setNewOrderError(null);
    setIsAddModalOpen(false);
  };

  const handleSendWhatsAppReceipt = (ord: OrderRecord) => {
    let msg = `*🍗 SHAWAYA EXPRESS - ORDER RECEIPT (#${ord.orderNumber})*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Status:* ${ord.status.toUpperCase()}\n`;
    msg += `*Customer:* ${ord.customerName}\n`;
    msg += `*Type:* ${ord.orderType.toUpperCase()}\n`;
    if (ord.deliveryAddress) msg += `*Address:* ${ord.deliveryAddress}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*ITEMS:*\n`;
    ord.items.forEach((it, i) => {
      msg += `${i + 1}. ${it.name} x ${it.quantity} = ${currency} ${(it.price * it.quantity).toLocaleString()}\n`;
    });
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Subtotal:* ${currency} ${ord.subtotal.toLocaleString()}\n`;
    if (ord.deliveryFee > 0) msg += `*Delivery Fee:* ${currency} ${ord.deliveryFee}\n`;
    msg += `*Grand Total:* ${currency} ${ord.total.toLocaleString()}\n`;
    msg += `*Payment:* ${ord.paymentStatus.toUpperCase()}\n`;
    msg += `\nThank you for choosing Shawaya Express!`;

    const phoneToUse = ord.customerPhone.replace(/[^0-9]/g, '') || restaurantInfo.whatsappNumber;
    window.open(`https://wa.me/${phoneToUse}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Kitchen Orders</span>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{activeOrdersCount}</h4>
            <span className="text-[11px] text-amber-600 font-semibold">In preparation / delivery</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivered Orders</span>
            <h4 className="text-2xl font-bold text-emerald-700 mt-1">{deliveredCount}</h4>
            <span className="text-[11px] text-emerald-600 font-semibold">Successfully served</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{currency} {totalRevenue.toLocaleString()}</h4>
            <span className="text-[11px] text-gray-500 font-light">From {totalOrdersCount} orders</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Quick Action</span>
            <ShoppingBag className="w-5 h-5 text-amber-400" />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 w-full py-2.5 px-4 bg-[#D97706] hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Order</span>
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
            placeholder="Search order #, customer, phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'out_for_delivery', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table / Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-gray-900">No orders found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto font-light">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search query or status filter.' 
                : 'No orders placed yet. Click "Create New Order" to log a walk-in, phone, or delivery order.'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#D97706] text-white text-xs font-bold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Order</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">Items & Details</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="font-bold text-gray-900 block font-mono text-sm">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {ord.orderType}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <span className="font-bold text-gray-900 block">{ord.customerName}</span>
                      <span className="text-gray-500 font-mono text-[11px] block">{ord.customerPhone}</span>
                      {ord.deliveryAddress && (
                        <span className="text-gray-500 text-[11px] font-light block max-w-xs truncate mt-0.5">
                          📍 {ord.deliveryAddress}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-gray-800">
                            <span className="font-bold text-amber-700">{it.quantity}x</span>
                            <span>{it.name}</span>
                          </div>
                        ))}
                      </div>
                      {ord.notes && (
                        <p className="mt-1.5 text-[11px] text-amber-800 italic bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 max-w-xs">
                          Note: {ord.notes}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <span className="font-bold text-gray-900 text-sm block">
                        {currency} {ord.total.toLocaleString()}
                      </span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus === 'paid' ? 'Paid' : 'COD / Unpaid'}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top">
                      {getStatusBadge(ord.status)}
                      <div className="mt-2">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderRecord['status'])}
                          className="w-full text-[11px] font-medium py-1 px-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#D97706]"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Kitchen Preparing</option>
                          <option value="ready">Ready for Pickup</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top text-right space-y-1.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendWhatsAppReceipt(ord)}
                          title="Share WhatsApp Receipt"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete order #${ord.orderNumber}?`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                          title="Delete Order"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CREATE NEW ORDER MODAL */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-white font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Add New Order</h3>
                  <p className="text-xs text-gray-300">Create walk-in, phone, or manual delivery order</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateOrderSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              {newOrderError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{newOrderError}</p>
                    <p className="text-[11px] text-rose-700 font-light mt-0.5">
                      Name, Phone, and Address (for Delivery) are mandatory so orders can be tracked and delivered accurately.
                    </p>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Customer Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => {
                      setNewCustomerName(e.target.value);
                      if (newOrderError) setNewOrderError(null);
                    }}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => {
                      setNewCustomerPhone(e.target.value);
                      if (newOrderError) setNewOrderError(null);
                    }}
                    placeholder="e.g. 0317 1234567"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              {/* Order Type & Payment Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Order Type</label>
                  <select
                    value={newOrderType}
                    onChange={(e) => {
                      setNewOrderType(e.target.value as any);
                      if (newOrderError) setNewOrderError(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  >
                    <option value="delivery">Home Delivery (Address Mandatory)</option>
                    <option value="takeaway">Takeaway Pickup</option>
                    <option value="dinein">Dine-In (Family Hall)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                  >
                    <option value="cod">Cash on Delivery / Counter</option>
                    <option value="paid">Already Paid (JazzCash / Card)</option>
                    <option value="unpaid">Unpaid Tab</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  {newOrderType === 'delivery' ? (
                    <>
                      Delivery Address / House & Street <span className="text-rose-600">*</span>
                    </>
                  ) : (
                    <>Table Number / Branch Pickup Note</>
                  )}
                </label>
                <input
                  type="text"
                  required={newOrderType === 'delivery'}
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                    if (newOrderError) setNewOrderError(null);
                  }}
                  placeholder={
                    newOrderType === 'delivery'
                      ? "e.g. Mohalla Eidgah, House #14, near Jamia Masjid"
                      : "e.g. Table 4 / AC Hall / Counter pickup"
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              {/* Item Selector */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-gray-900">
                    Select Menu Items to Add
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {newSelectedItems.reduce((s, it) => s + it.quantity, 0)} items selected
                  </span>
                </div>

                {/* Search Menu Items */}
                <input
                  type="text"
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  placeholder="Type to filter menu items (e.g. Tangy, Mandi, Chiller)..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />

                {/* Quick Add Menu Grid */}
                <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
                  {menuItems
                    .filter(m => m.name.toLowerCase().includes(itemSearchQuery.toLowerCase()))
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAddItemToNewOrder(item)}
                        className="p-2 bg-white border border-gray-200 hover:border-[#D97706] rounded-xl text-left flex items-center justify-between text-xs transition-colors group"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-gray-900 block truncate">{item.name}</span>
                          <span className="text-[10px] text-[#D97706] font-semibold">
                            {currency} {(item.discountPrice || item.price).toLocaleString()}
                          </span>
                        </div>
                        <span className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-[#D97706] group-hover:text-white flex items-center justify-center text-xs font-bold">
                          +
                        </span>
                      </button>
                    ))}
                </div>

                {/* Selected Items List */}
                {newSelectedItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                    <span className="text-xs font-bold text-gray-700 block">Selected Items in Order:</span>
                    {newSelectedItems.map(({ item, quantity }) => (
                      <div key={item.id} className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-gray-900">{item.name}</span>
                          <span className="text-gray-500 block text-[10px]">
                            {currency} {(item.discountPrice || item.price).toLocaleString()} each
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateNewOrderQty(item.id, -1)}
                            className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs w-4 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateNewOrderQty(item.id, 1)}
                            className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center"
                          >
                            +
                          </button>
                          <span className="font-bold text-gray-900 ml-2">
                            {currency} {((item.discountPrice || item.price) * quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Kitchen / Delivery Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Extra spicy, separate sauces, call upon arrival..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              {/* Summary Calculations */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-600 block">Subtotal: {currency} {calculateNewOrderSubtotal().toLocaleString()}</span>
                  <span className="text-gray-600 block">
                    Delivery Fee: {newOrderType === 'delivery' ? (calculateNewOrderSubtotal() >= restaurantInfo.freeDeliveryThreshold ? 'FREE' : `${currency} ${restaurantInfo.standardDeliveryFee}`) : '0'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Grand Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {currency} {(calculateNewOrderSubtotal() + (newOrderType === 'delivery' && calculateNewOrderSubtotal() < restaurantInfo.freeDeliveryThreshold ? restaurantInfo.standardDeliveryFee : 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-[#D97706] hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  Save & Log Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
