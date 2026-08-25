import { MenuItem, CustomerReview, FamilyDeal, RestaurantSettings, OrderRecord } from '../types';

export const DEFAULT_RESTAURANT_SETTINGS: RestaurantSettings = {
  name: 'Shawaya Express',
  urduName: 'شواية ایکسپریس',
  tagline: 'Authentic Flame-Roasted Chicken & Fragrant Mandi Rice',
  branch: 'Thikrian, Mor Lalamusa',
  address: 'Thikrian, Mor Lalamusa, Thikrian, Lalamusa, 50200, Pakistan',
  plusCode: 'PWGP+63 Lalamusa, Pakistan',
  phone: '+92 317 1780967',
  displayPhone: '0317 1780967',
  whatsappNumber: '923171780967',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=PWGP%2B63+Lalamusa%2C+Pakistan+Shawaya+Express',
  rating: 4.4,
  reviewsCount: 72,
  priceRange: 'Rs 1,000 – 2,000 per person',
  hours: '12:00 PM – 12:00 AM (7 Days a Week)',
  currencySymbol: '₹',
  freeDeliveryThreshold: 1500,
  standardDeliveryFee: 150,
  heroHeadlineMain: 'Roasted',
  heroHeadlineAccent: 'to Perfection.',
  heroSubtitle: 'Experience the authentic taste of succulent roasted chicken served with aromatic rice. Open daily from 12:00 PM to 12:00 AM.',
  heroBadge: 'Lalamusa, Pakistan',
  heroImage: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
  amenities: [
    'Fully Air Conditioned Family Hall',
    'Open Daily 12:00 PM to 12:00 AM',
    'Free Wi-Fi & Clean Restrooms',
    'Spacious Dedicated Parking',
    'Fast Takeaway & Home Delivery',
    'Special Family Seating Privacy',
  ],
  deliveryNote: 'Free delivery in Lalamusa city & nearby on orders above ₹1,500'
};

export const RESTAURANT_INFO = DEFAULT_RESTAURANT_SETTINGS;

export const DEFAULT_ORDERS: OrderRecord[] = [];

export const FAMILY_DEALS: FamilyDeal[] = [
  {
    id: 'deal-family-grand',
    title: 'Grand Family Shawaya Feast',
    urduTitle: 'گرینڈ فیملی شواية ڈیل',
    badge: 'Most Popular ⭐',
    price: 1850,
    originalPrice: 2200,
    serves: '4 - 5 Persons',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
    description: 'Our signature full juicy flame-roasted rotisserie chicken served on a large mountain of fragrant Arabian Mandi Basmati rice with authentic dips & drinks.',
    itemsIncluded: [
      '1x Full Roasted Shawaya Chicken (Juicy & Tender)',
      '1x Large Platter Aromatic Mandi Basmati Rice',
      '2x Authentic Garlic Toum Sauces',
      '2x Spicy Yemeni Red Daqqoos Salsa',
      'Fresh Garden Salad & Raita',
      '1x 1.5L Chilled Soft Drink'
    ],
    recommendedFor: 'Family Dinners, Travel Groups, Celebrations'
  },
  {
    id: 'deal-duo-special',
    title: 'Shawaya Express Duo Pack',
    urduTitle: 'شواية ڈو پیک',
    badge: 'Best Value 🏷️',
    price: 1050,
    originalPrice: 1250,
    serves: '2 Persons',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
    description: 'Half rotisserie chicken slow roasted to golden perfection, served over hot spiced basmati rice, with creamy garlic sauce and drinks.',
    itemsIncluded: [
      '1/2 Roasted Shawaya Chicken',
      'Medium Platter Fragrant Mandi Rice',
      'Garlic Toum & Spicy Daqqoos Dip',
      'Fresh Raita & Salad',
      '2x Regular Chilled Drinks'
    ],
    recommendedFor: 'Couples & Quick Meals'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Tangy Chicken Specials (Direct from Official Menu)
  {
    id: 'tangy-chicken-full',
    name: 'Full Tangy Chicken',
    urduName: 'فل ٹینگی چکن',
    category: 'shawaya',
    description: 'Whole flame-roasted chicken coated in our signature tangy sweet-savory glaze. Served with 2 warm Tortilla breads, crisp golden french fries, 3 gourmet dipping sauces, fresh salad & pickles.',
    price: 2600,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 64,
    serves: '3-4 Persons',
    isPopular: true,
    isSpicy: true,
    spiceLevel: 'Medium',
    includes: [
      '1x Full Tangy Glazed Chicken',
      '2x Fresh Tortilla Breads',
      'Golden French Fries Basket',
      '1x Chef Fusion Sauce',
      '1x Green Chilli Spicy Sauce',
      '1x Creamy Garlic Toum Sauce',
      'Crisp Salad & Tangy Pickles'
    ],
    options: [
      {
        name: 'Add Beverage',
        choices: [
          { name: 'No Beverage' },
          { name: 'Chilled Mint Margarita (+Rs 250)', extraPrice: 250 },
          { name: 'Chilled Fresh Lime (+Rs 250)', extraPrice: 250 },
          { name: '1.5L Soft Drink (+Rs 220)', extraPrice: 220 }
        ]
      },
      {
        name: 'Extra Add-ons',
        choices: [
          { name: 'None' },
          { name: 'Extra Fragrant Mandi Rice (+Rs 300)', extraPrice: 300 },
          { name: 'Extra Tortilla Bread (+Rs 80)', extraPrice: 80 },
          { name: 'Extra Fusion Sauce (+Rs 100)', extraPrice: 100 }
        ]
      }
    ]
  },
  {
    id: 'tangy-chicken-half',
    name: 'Half Tangy Chicken',
    urduName: 'ہاف ٹینگی چکن',
    category: 'shawaya',
    description: 'Succulent half chicken roasted with tangy seasoning. Served with 1 Tortilla bread, crispy fries, Fusion sauce, Green Chilli sauce, Garlic sauce, and pickled vegetables.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 42,
    serves: '1-2 Persons',
    isPopular: true,
    spiceLevel: 'Medium',
    includes: [
      '1/2 Tangy Glazed Chicken',
      '1x Fresh Tortilla Bread',
      'Crispy French Fries',
      '1x Fusion Sauce',
      '1x Green Chilli Sauce',
      '1x Garlic Toum Sauce',
      'Salad & Pickles'
    ],
    options: [
      {
        name: 'Add Beverage',
        choices: [
          { name: 'No Beverage' },
          { name: 'Mint Margarita (+Rs 250)', extraPrice: 250 },
          { name: 'Fresh Lime Soda (+Rs 250)', extraPrice: 250 },
          { name: 'Cold Drink Can (+Rs 120)', extraPrice: 120 }
        ]
      }
    ]
  },

  // Chillers & Cold Drinks
  {
    id: 'chiller-mint-margarita',
    name: 'Mint Margarita Chiller',
    urduName: 'منٹ مارگریٹا چلر',
    category: 'beverages',
    description: 'Ice-blended refreshing cooler made with fresh crushed mint leaves, zesty lemon juice, sparkling soda, and black salt. Served frosty and ice-cold!',
    price: 250,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 52,
    serves: '1 Tall Glass (Chilled)',
    isPopular: true,
    includes: ['Fresh Crushed Mint', 'Sparkling Fizz', 'Crushed Ice & Lemon Slice']
  },
  {
    id: 'chiller-fresh-lime',
    name: 'Fresh Lime Soda Chiller',
    urduName: 'فریش لائم سوڈا',
    category: 'beverages',
    description: 'Crisp, tangy, sparkling fresh limeade with crushed ice, a splash of lemon zest, and balanced sweet-salted soda.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 38,
    serves: '1 Tall Glass (Chilled)',
    isPopular: true,
    includes: ['Fresh Lime Juice', 'Sparkling Soda', 'Crushed Crystal Ice']
  },
  {
    id: 'drink-soft-can',
    name: 'Chilled Soft Drink (Can / Bottle)',
    urduName: 'ٹھنڈی کولڈ ڈرنک (کین / بوتل)',
    category: 'beverages',
    description: 'Choice of ice-cold Pepsi, 7Up, Mirinda, Mountain Dew, or Sting.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 29,
    serves: '1 Chilled Can / 500ml',
    options: [
      {
        name: 'Flavor Option',
        choices: [
          { name: 'Pepsi' },
          { name: '7Up' },
          { name: 'Mountain Dew' },
          { name: 'Mirinda Orange' },
          { name: 'Sting Berry' }
        ]
      }
    ]
  },
  {
    id: 'drink-jumbo-bottle',
    name: '1.5 Litre Family Cold Drink',
    urduName: 'ڈیڑھ لیٹر فیملی بوتل',
    category: 'beverages',
    description: '1.5 Litre jumbo chilled family beverage bottle (Pepsi, 7Up, or Dew).',
    price: 220,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 33,
    serves: '4-5 Persons',
    options: [
      {
        name: 'Brand Choice',
        choices: [{ name: 'Pepsi 1.5L' }, { name: '7Up 1.5L' }, { name: 'Mountain Dew 1.5L' }]
      }
    ]
  },

  // Extra Add-Ons (Direct from menu card)
  {
    id: 'addon-extra-rice',
    name: 'Extra Mandi Basmati Rice',
    urduName: 'اضافی مندی باسمتی چاول',
    category: 'sides',
    description: 'Hot steaming portion of long-grain aged aromatic Basmati Mandi rice cooked in rich spiced broth.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 45,
    serves: '1 Portion'
  },
  {
    id: 'addon-tortilla-bread',
    name: 'Fresh Tortilla Bread',
    urduName: 'تازہ ٹورٹیلا بریڈ',
    category: 'sides',
    description: 'Warm, soft, freshly toasted tortilla flatbread - ideal for wrapping juicy tangy chicken.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 27,
    serves: '1 Piece'
  },
  {
    id: 'addon-sauces-gourmet',
    name: 'Special Signature Sauce (Choice)',
    urduName: 'اسپیشل سوس (گرین چلی / فیوژن / گارلک / ٹماٹو)',
    category: 'sides',
    description: 'Freshly made authentic dipping sauce bowl: Choose between Signature Fusion Sauce, Spicy Green Chilli Sauce, Creamy Garlic Toum, or Tangy Tomato Daqqoos.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 50,
    serves: '1 Dip Bowl',
    options: [
      {
        name: 'Select Sauce Flavor',
        choices: [
          { name: 'Signature Fusion Sauce' },
          { name: 'Spicy Green Chilli Sauce' },
          { name: 'Creamy Garlic Toum' },
          { name: 'Tangy Tomato Sauce' }
        ]
      }
    ]
  }
];

export const GOOGLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Hassan Masood',
    badge: 'Local Guide · 10 reviews · 11 photos',
    rating: 5,
    timeAgo: '3 weeks ago',
    isNew: true,
    content: 'The food was great tasting, value for money, and healthy. Service was on time, courteous and very supportive. Great spot at Mor Lalamusa.',
    tags: ['rice', 'food', 'money', 'service'],
    likesCount: 14,
    orderItem: 'Full Roasted Chicken with Rice Deal'
  },
  {
    id: 'rev-2',
    author: 'Mubarik',
    badge: 'Local Guide · 32 reviews · 16 photos',
    rating: 5,
    timeAgo: 'a month ago',
    content: 'A solid spot for a light meal. The standout for me was the rice... well-cooked and flavorful... noticeably better than what I have had at the famous Shawaya in Gujrat.',
    tags: ['rice', 'food', 'ac'],
    likesCount: 22,
    orderItem: 'Signature Mandi Rice & Shawaya'
  },
  {
    id: 'rev-3',
    author: 'Imam Says',
    badge: 'Verified Customer · 1 review',
    rating: 5,
    timeAgo: '2 months ago',
    content: 'I tried the Full Roasted Chicken with Rice Family Deal from Shawaya Express today and really enjoyed it. The chicken was juicy, flavorful, and perfectly roasted, with excellent taste and quality.',
    tags: ['food', 'rice', 'money'],
    likesCount: 9,
    orderItem: 'Full Roasted Chicken with Rice Family Deal'
  },
  {
    id: 'rev-4',
    author: 'Zubair Chaudhry',
    badge: 'Local Guide · 18 reviews',
    rating: 4,
    timeAgo: '1 month ago',
    content: 'Great pitstop on GT Road near Thikrian. The garlic toum paste is authentic Arabian style. Being open 24 hours is a massive plus for late night travellers.',
    tags: ['food', 'ac', 'money'],
    likesCount: 7,
    orderItem: 'Shawaya Express Duo Pack'
  },
  {
    id: 'rev-5',
    author: 'Hamza Tariq',
    badge: 'Food Reviewer · 24 reviews',
    rating: 5,
    timeAgo: '2 months ago',
    content: 'Best roasted chicken in Lalamusa without doubt. The mandi rice aroma hits you the moment it arrives on the table. AC family hall is clean and comfortable.',
    tags: ['ac', 'rice', 'food'],
    likesCount: 11,
    orderItem: 'Grand Family Shawaya Feast'
  }
];

export const FAQ_LIST = [
  {
    q: 'What are the opening and closing hours of Shawaya Express in Lalamusa?',
    a: 'Our Thikrian, Mor Lalamusa branch is open daily from 12:00 PM (Noon) to 12:00 AM (Midnight), 7 days a week. Fresh rotisserie batches and fragrant Mandi rice are prepared throughout the day.'
  },
  {
    q: 'How can I order home delivery in Lalamusa?',
    a: 'You can directly build your order on this website and click "Order via WhatsApp", or call our direct branch line at +92 317 1780967. We offer fast doorstep delivery across Lalamusa and surrounding areas.'
  },
  {
    q: 'Is there a separate air-conditioned hall for families?',
    a: 'Yes, we have a dedicated, fully air-conditioned family hall with private seating arrangements and clean restrooms to ensure maximum comfort.'
  },
  {
    q: 'What is the difference between Shawaya and normal BBQ Chicken?',
    a: 'Shawaya is the famous Middle Eastern rotisserie style where whole marinated chickens are slow-turned over controlled heat so all the juices stay trapped inside, resulting in crispy golden skin with incredibly tender, succulent meat.'
  },
  {
    q: 'Where exactly is the branch located?',
    a: 'We are situated at Thikrian, Mor Lalamusa (near GT Road junction, Plus Code: PWGP+63 Lalamusa). Ample car parking is available right in front of the restaurant.'
  }
];
