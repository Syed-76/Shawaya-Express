export interface MenuItem {
  id: string;
  name: string;
  urduName?: string;
  category: 'deals' | 'shawaya' | 'rice' | 'bbq' | 'fastfood' | 'beverages' | 'sides';
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  serves: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';
  includes?: string[];
  options?: {
    name: string;
    choices: { name: string; extraPrice?: number }[];
  }[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedOptions?: { [key: string]: string };
  specialInstructions?: string;
  customPrice: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  badge?: string; // e.g. "Local Guide · 10 reviews"
  avatar?: string;
  rating: number;
  timeAgo: string;
  content: string;
  isNew?: boolean;
  tags?: string[];
  likesCount: number;
  orderItem?: string;
}

export interface FamilyDeal {
  id: string;
  title: string;
  urduTitle?: string;
  badge: string;
  price: number;
  originalPrice: number;
  serves: string;
  image: string;
  itemsIncluded: string[];
  description: string;
  recommendedFor: string;
}

export interface ReservationData {
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seatingType: 'Family Hall (AC)' | 'General Dining' | 'Private Corner';
  specialNotes?: string;
}

export interface OrderItemRecord {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: { [key: string]: string };
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderType: 'delivery' | 'takeaway' | 'dinein';
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'cod';
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'restaurant';
  senderName?: string;
  senderPhone?: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface RestaurantSettings {
  name: string;
  urduName: string;
  tagline: string;
  branch: string;
  address: string;
  plusCode: string;
  phone: string;
  displayPhone: string;
  whatsappNumber: string;
  mapsUrl: string;
  rating: number;
  reviewsCount: number;
  priceRange: string;
  hours: string;
  currencySymbol: string; // e.g. "₹" or "Rs"
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  heroHeadlineMain: string;
  heroHeadlineAccent: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImage: string;
  amenities: string[];
  deliveryNote: string;
}
