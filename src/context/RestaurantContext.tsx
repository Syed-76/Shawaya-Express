import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MenuItem, 
  RestaurantSettings, 
  OrderRecord, 
  OrderItemRecord,
  ChatMessage
} from '../types';
import { 
  DEFAULT_RESTAURANT_SETTINGS, 
  MENU_ITEMS as INITIAL_MENU_ITEMS, 
  DEFAULT_ORDERS 
} from '../data/restaurantData';

interface RestaurantContextType {
  restaurantInfo: RestaurantSettings;
  menuItems: MenuItem[];
  orders: OrderRecord[];
  isAdmin: boolean;
  currentView: 'customer' | 'admin';
  isAdminLoginModalOpen: boolean;
  openAdminLogin: () => void;
  closeAdminLogin: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  setCurrentView: (view: 'customer' | 'admin') => void;
  updateRestaurantInfo: (info: Partial<RestaurantSettings>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'> & { id?: string }) => void;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  addOrder: (order: Partial<OrderRecord> & { items: OrderItemRecord[] }) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: OrderRecord['paymentStatus']) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  // In-website direct customer-restaurant chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendCustomerMessage: (text: string, senderName?: string, senderPhone?: string) => void;
  sendAdminReply: (text: string) => void;
  clearChatMessages: () => void;
  unreadCustomerMessagesCount: number;
  unreadAdminMessagesCount: number;
  resetToDefaults: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INFO: 'shawaya_express_info_v1',
  MENU: 'shawaya_express_menu_v1',
  ORDERS: 'shawaya_express_orders_v2', // v2 to guarantee clean slate with no fake orders
  ADMIN_PASS: 'shawaya_express_admin_pass_v2',
  CHAT: 'shawaya_express_chat_v1',
};

const INITIAL_WELCOME_CHAT_MSG: ChatMessage = {
  id: 'msg-welcome-0',
  sender: 'restaurant',
  senderName: 'Shawaya Express Team',
  text: 'Assalam-o-Alaikum! Welcome to Shawaya Express. How can we assist you with your food order, rotisserie chicken, or family table booking today?',
  timestamp: new Date().toISOString(),
  isRead: true,
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restaurant Settings State
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      return saved ? { ...DEFAULT_RESTAURANT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_RESTAURANT_SETTINGS;
    } catch {
      return DEFAULT_RESTAURANT_SETTINGS;
    }
  });

  // Menu Items State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // Orders State - Only genuine orders placed by customer or created by admin
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed: OrderRecord[] = JSON.parse(saved);
        // Exclude fake/mock demo IDs if any
        return parsed.filter(o => !['ord-1001', 'ord-1002', 'ord-1003'].includes(o.id));
      }
      return DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Admin Auth & Navigation State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('shawaya_admin_logged_in') === 'true';
  });

  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // In-Website Direct Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      return saved ? JSON.parse(saved) : [INITIAL_WELCOME_CHAT_MSG];
    } catch {
      return [INITIAL_WELCOME_CHAT_MSG];
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(restaurantInfo));
    } catch {}
  }, [restaurantInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
    } catch {}
  }, [adminPassword]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  // Auth Handlers
  const openAdminLogin = () => {
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const closeAdminLogin = () => {
    setIsAdminLoginModalOpen(false);
  };

  const login = (inputPassword: string): boolean => {
    if (inputPassword === adminPassword) {
      setIsAdmin(true);
      sessionStorage.setItem('shawaya_admin_logged_in', 'true');
      setIsAdminLoginModalOpen(false);
      setCurrentView('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('shawaya_admin_logged_in');
    setCurrentView('customer');
  };

  const changePassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
    if (currentPass !== adminPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    setAdminPassword(newPass.trim());
    return { success: true, message: 'Admin password changed successfully and saved securely.' };
  };

  // Chat Actions
  const openChat = () => {
    setIsChatOpen(true);
    // mark restaurant messages as read for customer
    setChatMessages(prev => prev.map(m => m.sender === 'restaurant' ? { ...m, isRead: true } : m));
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const sendCustomerMessage = (text: string, senderName?: string, senderPhone?: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `c-msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'customer',
      senderName: senderName?.trim() || 'Guest Customer',
      senderPhone: senderPhone?.trim() || undefined,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const sendAdminReply = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `r-msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'restaurant',
      senderName: `${restaurantInfo.name} Staff`,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const clearChatMessages = () => {
    setChatMessages([INITIAL_WELCOME_CHAT_MSG]);
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify([INITIAL_WELCOME_CHAT_MSG]));
    } catch {}
  };

  const unreadCustomerMessagesCount = chatMessages.filter(m => m.sender === 'customer' && !m.isRead).length;
  const unreadAdminMessagesCount = chatMessages.filter(m => m.sender === 'restaurant' && !m.isRead).length;

  // Restaurant Info Update
  const updateRestaurantInfo = (updated: Partial<RestaurantSettings>) => {
    setRestaurantInfo((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Menu Item Management
  const addMenuItem = (itemData: Omit<MenuItem, 'id'> & { id?: string }) => {
    const newItem: MenuItem = {
      ...itemData,
      id: itemData.id || `custom-item-${Date.now()}`,
      rating: itemData.rating || 5.0,
      reviewsCount: itemData.reviewsCount || 1,
      isAvailable: itemData.isAvailable !== false,
      serves: itemData.serves || '1-2 Persons',
      category: itemData.category || 'shawaya',
    };

    setMenuItems((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, updated: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
      )
    );
  };

  // Order Management
  const addOrder = (orderData: Partial<OrderRecord> & { items: OrderItemRecord[] }): OrderRecord => {
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = orderData.subtotal || orderData.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const deliveryFee = orderData.deliveryFee ?? (orderData.orderType === 'delivery' ? (subtotal >= restaurantInfo.freeDeliveryThreshold ? 0 : restaurantInfo.standardDeliveryFee) : 0);
    const total = subtotal + deliveryFee;

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName || 'Walk-in Customer',
      customerPhone: orderData.customerPhone || 'N/A',
      deliveryAddress: orderData.deliveryAddress || 'Dine-In / Counter',
      orderType: orderData.orderType || 'takeaway',
      items: orderData.items,
      subtotal,
      deliveryFee,
      total,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'unpaid',
      createdAt: new Date().toISOString(),
      notes: orderData.notes || '',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: OrderRecord['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const clearAllOrders = () => {
    setOrders([]);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    } catch {}
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setRestaurantInfo(DEFAULT_RESTAURANT_SETTINGS);
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders([]);
    setAdminPassword('admin123');
    setChatMessages([INITIAL_WELCOME_CHAT_MSG]);
    try {
      localStorage.removeItem(STORAGE_KEYS.INFO);
      localStorage.removeItem(STORAGE_KEYS.MENU);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
      localStorage.removeItem(STORAGE_KEYS.CHAT);
    } catch {}
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurantInfo,
        menuItems,
        orders,
        isAdmin,
        currentView,
        isAdminLoginModalOpen,
        openAdminLogin,
        closeAdminLogin,
        login,
        logout,
        changePassword,
        setCurrentView,
        updateRestaurantInfo,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        addOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        clearAllOrders,
        chatMessages,
        isChatOpen,
        openChat,
        closeChat,
        toggleChat,
        sendCustomerMessage,
        sendAdminReply,
        clearChatMessages,
        unreadCustomerMessagesCount,
        unreadAdminMessagesCount,
        resetToDefaults,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

