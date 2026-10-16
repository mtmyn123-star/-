export type AppRole = 'customer' | 'restaurant' | 'captain' | 'admin' | 'cashier' | 'kds';

export type CustomerTab = 'home' | 'saved' | 'cart' | 'deals' | 'profile' | 'live_order' | 'custom_delivery';

export interface FoodItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  category: 'burger' | 'pizza' | 'sushi' | 'chicken' | 'grills' | 'pasta' | 'dessert' | 'drinks';
  price: number;
  calories: number;
  prepTimeMinutes: number;
  imageUrl: string;
  restaurantId: string;
  restaurantNameAr: string;
  rating: number;
  ratingCount: number;
  isPopular?: boolean;
  isFastDelivery?: boolean;
  isAvailable: boolean;
  options?: {
    nameAr: string;
    choices: { nameAr: string; extraPrice: number }[];
  }[];
}

export interface Restaurant {
  id: string;
  nameAr: string;
  nameEn: string;
  cuisineAr: string;
  logoUrl: string;
  rating: number;
  ratingsCount?: number;
  foodQualityAvg?: number;
  deliverySpeedAvg?: number;
  deliveryFee: number;
  estimatedDeliveryMin: string;
  isOpen: boolean;
  minOrder: number;
  addressAr: string;
  lat?: number;
  lng?: number;
}

export interface OrderItem {
  foodItem: FoodItem;
  quantity: number;
  selectedOptions?: string[];
  notes?: string;
}

export interface CaptainBid {
  id: string;
  orderId: string;
  captainId: string;
  captainName: string;
  captainPhone: string;
  captainVehicle: string;
  captainRating: number;
  bidAmount: number; // Delivery fee offer proposed by captain in ILS
  estimatedMinutes: number;
  note?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  pickupAddress?: string;
  restaurantId?: string;
  restaurantNameAr: string;
  packageDescription?: string; // For Hamama direct parcel/errand delivery
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  status:
    | 'placed'
    | 'bidding_open'
    | 'confirmed'
    | 'preparing'
    | 'ready_for_pickup'
    | 'on_the_way'
    | 'delivered'
    | 'cancelled';
  orderType: 'delivery' | 'takeaway' | 'dine_in' | 'parcel';
  paymentMethod: 'cash' | 'card' | 'wallet';
  paymentStatus: 'paid' | 'pending';
  captainId?: string;
  captainName?: string;
  captainPhone?: string;
  captainVehicle?: string;
  createdAt: string;
  elapsedSeconds: number;
  estimatedDeliveryTime: string;
  notes?: string;
  bids: CaptainBid[];
  biddingStatus: 'open' | 'closed';
  selectedBid?: CaptainBid;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  captainLat?: number;
  captainLng?: number;
  isRated?: boolean;
  rating?: OrderRating;
}

export interface OrderRating {
  id: string;
  orderId: string;
  orderNumber: string;
  restaurantId?: string;
  restaurantNameAr: string;
  captainId?: string;
  captainName?: string;
  foodQualityRating: number; // 1 to 5 stars
  deliverySpeedRating: number; // 1 to 5 stars
  overallRating: number; // average of food & speed
  comment?: string;
  tags: string[];
  customerName: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'commission_deduction' | 'bonus';
  titleAr: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId: string;
  method: 'jawwal_pay' | 'bank_of_palestine' | 'palpay' | 'cash_office';
  accountDetail?: string;
}

export interface Captain {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  ratingsCount?: number;
  deliverySpeedAvg?: number;
  isOnline: boolean;
  currentLat: number;
  currentLng: number;
  walletBalance: number;
  pendingTransfersAmount: number;
  completedOrdersCount: number;
  dailyDeliveriesCount: number;
  dailyDeliveryRevenue: number;
  dailyFoodCashCollected: number;
  commissionRatePercent: number;
  platformOwedAmount: number;
  isCommissionSettledToday: boolean;
  lastSettlementTime?: string;
  transactions: WalletTransaction[];
}
