export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: string[];
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  freeDelivery?: boolean;
  minOrder?: number;
}

export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  MSHWAR30: {
    code: 'MSHWAR30',
    discountPercent: 30,
    minOrder: 30,
  },
  FREESHIP: {
    code: 'FREESHIP',
    freeDelivery: true,
    minOrder: 20,
  },
  WELCOME10: {
    code: 'WELCOME10',
    fixedDiscount: 10,
    minOrder: 40,
  },
};

export function calculateCartSummary(
  items: CartItem[],
  promoCode?: string,
  baseDeliveryFee: number = 8,
  serviceFeeRate: number = 0.05
) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discountAmount = 0;
  let deliveryFee = baseDeliveryFee;

  if (promoCode) {
    const promo = VALID_PROMO_CODES[promoCode.trim().toUpperCase()];
    if (promo && subtotal >= (promo.minOrder || 0)) {
      if (promo.freeDelivery) {
        deliveryFee = 0;
      }
      if (promo.discountPercent) {
        discountAmount += (subtotal * promo.discountPercent) / 100;
      }
      if (promo.fixedDiscount) {
        discountAmount += Math.min(promo.fixedDiscount, subtotal);
      }
    }
  }

  const serviceFee = Math.round(subtotal * serviceFeeRate * 100) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + serviceFee);

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    serviceFee,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

export type OrderStatus =
  | 'placed'
  | 'bidding_open'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  placed: ['bidding_open', 'confirmed', 'cancelled'],
  bidding_open: ['confirmed', 'preparing', 'ready_for_pickup', 'cancelled'],
  confirmed: ['preparing', 'bidding_open', 'cancelled'],
  preparing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['on_the_way', 'cancelled'],
  on_the_way: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export function canTransitionOrder(current: OrderStatus, next: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}

export function getKdsUrgency(elapsedSeconds: number): 'normal' | 'warning' | 'critical' {
  if (elapsedSeconds >= 900) return 'critical';
  if (elapsedSeconds >= 480) return 'warning';
  return 'normal';
}

export function calculateCashChange(totalDue: number, cashGiven: number): { isValid: boolean; change: number } {
  if (cashGiven < totalDue) {
    return { isValid: false, change: 0 };
  }
  return {
    isValid: true,
    change: Math.round((cashGiven - totalDue) * 100) / 100,
  };
}

/**
 * Calculates captain platform commission and settlement figures
 */
export function calculateCaptainCommission(
  dailyDeliveryRevenue: number,
  commissionRatePercent: number = 15
) {
  const platformCut = Math.round(dailyDeliveryRevenue * (commissionRatePercent / 100) * 100) / 100;
  const captainNetProfit = Math.round((dailyDeliveryRevenue - platformCut) * 100) / 100;

  return {
    dailyDeliveryRevenue,
    commissionRatePercent,
    platformCut,
    captainNetProfit,
  };
}

export interface WithdrawalValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedAmount: number;
}

/**
 * Validates a captain withdrawal request against available balance and limits
 */
export function validateWithdrawalRequest(
  availableBalance: number,
  requestedAmount: number,
  minAmount: number = 20
): WithdrawalValidationResult {
  if (isNaN(requestedAmount) || requestedAmount <= 0) {
    return {
      isValid: false,
      errorMessage: 'يرجى إدخال مبلغ صحيح أكبر من صفر',
      sanitizedAmount: 0,
    };
  }

  const rounded = Math.round(requestedAmount * 100) / 100;

  if (rounded < minAmount) {
    return {
      isValid: false,
      errorMessage: `الحد الأدنى لطلب السحب هو ${minAmount} ₪`,
      sanitizedAmount: rounded,
    };
  }

  if (rounded > availableBalance) {
    return {
      isValid: false,
      errorMessage: `المبلغ المطلوب (${rounded} ₪) يتجاوز رصيدك المتاح (${availableBalance.toFixed(1)} ₪)`,
      sanitizedAmount: rounded,
    };
  }

  return {
    isValid: true,
    sanitizedAmount: rounded,
  };
}

/**
 * Calculates complete captain wallet summary metrics
 */
export function calculateWalletMetrics(
  walletBalance: number,
  pendingTransfersAmount: number,
  dailyDeliveryRevenue: number,
  commissionRatePercent: number = 15
) {
  const commission = calculateCaptainCommission(dailyDeliveryRevenue, commissionRatePercent);
  const totalFinancialHoldings = Math.round((walletBalance + pendingTransfersAmount) * 100) / 100;

  return {
    availableBalance: Math.round(walletBalance * 100) / 100,
    pendingTransfersAmount: Math.round(pendingTransfersAmount * 100) / 100,
    totalFinancialHoldings,
    dailyGrossEarnings: commission.dailyDeliveryRevenue,
    dailyPlatformCommission: commission.platformCut,
    dailyNetEarnings: commission.captainNetProfit,
    commissionRatePercent,
  };
}

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100;
}

/**
 * Calculates estimated remaining ETA in minutes given distance and speed
 */
export function estimateRemainingEtaMinutes(
  distanceKm: number,
  speedKmh: number = 25
): number {
  if (distanceKm <= 0.05) return 0;
  const safeSpeed = Math.max(speedKmh, 10);
  const hours = distanceKm / safeSpeed;
  const minutes = Math.ceil(hours * 60);
  return Math.max(1, minutes);
}

/**
 * Linearly interpolates between two geographic coordinates
 */
export function interpolateCoordinate(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  progress: number // 0 to 1
): [number, number] {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const lat = startLat + (endLat - startLat) * clampedProgress;
  const lng = startLng + (endLng - startLng) * clampedProgress;
  return [Math.round(lat * 1000000) / 1000000, Math.round(lng * 1000000) / 1000000];
}

/**
 * Generates realistic street-aligned route waypoints between pickup and dropoff
 */
export function generateRoutePoints(
  pickup: [number, number],
  dropoff: [number, number]
): [number, number][] {
  const [pLat, pLng] = pickup;
  const [dLat, dLng] = dropoff;

  // Realistic city street waypoints simulating street intersections
  const midLat1 = pLat + (dLat - pLat) * 0.3;
  const midLng1 = pLng + (dLng - pLng) * 0.15;

  const midLat2 = pLat + (dLat - pLat) * 0.65;
  const midLng2 = pLng + (dLng - pLng) * 0.75;

  const midLat3 = pLat + (dLat - pLat) * 0.88;
  const midLng3 = pLng + (dLng - pLng) * 0.95;

  return [
    [pLat, pLng],
    [midLat1, midLng1],
    [midLat2, midLng2],
    [midLat3, midLng3],
    [dLat, dLng],
  ];
}

/**
 * Calculates updated average rating and new count using running weighted sum
 */
export function calculateUpdatedAverage(
  previousAvg: number,
  previousCount: number,
  newScore: number
): { newAvg: number; newCount: number } {
  const safeCount = Math.max(0, previousCount);
  const clampedScore = Math.max(1, Math.min(5, newScore));
  const newCount = safeCount + 1;
  const newSum = previousAvg * safeCount + clampedScore;
  const newAvg = Math.round((newSum / newCount) * 10) / 10;
  return { newAvg, newCount };
}

/**
 * Returns Arabic descriptive label for star rating
 */
export function getRatingDescriptionAr(rating: number): string {
  if (rating >= 4.8) return 'ممتاز وفائق الروعة 🔥';
  if (rating >= 4.0) return 'جيد جداً ومميز 👏';
  if (rating >= 3.0) return 'جيد ومقبول 👍';
  if (rating >= 2.0) return 'دون المتوقع 😐';
  return 'يحتاج إلى تحسين ⚠️';
}

/**
 * Validates food quality and delivery speed ratings
 */
export function validateOrderRating(
  foodQuality: number,
  deliverySpeed: number
): { isValid: boolean; error?: string } {
  if (foodQuality < 1 || foodQuality > 5) {
    return { isValid: false, error: 'يرجى تحديد تقييم جودة الطعام من 1 إلى 5 نجوم' };
  }
  if (deliverySpeed < 1 || deliverySpeed > 5) {
    return { isValid: false, error: 'يرجى تحديد تقييم سرعة التوصيل من 1 إلى 5 نجوم' };
  }
  return { isValid: true };
}

/**
 * Aggregates a list of review ratings into overall statistics
 */
export function calculateRatingMetricsFromReviews(
  reviews: { foodQualityRating: number; deliverySpeedRating: number }[]
): {
  foodQualityAvg: number;
  deliverySpeedAvg: number;
  overallAvg: number;
  totalCount: number;
} {
  if (!reviews || reviews.length === 0) {
    return { foodQualityAvg: 5.0, deliverySpeedAvg: 5.0, overallAvg: 5.0, totalCount: 0 };
  }

  const totalCount = reviews.length;
  const foodSum = reviews.reduce((sum, r) => sum + r.foodQualityRating, 0);
  const deliverySum = reviews.reduce((sum, r) => sum + r.deliverySpeedRating, 0);

  const foodQualityAvg = Math.round((foodSum / totalCount) * 10) / 10;
  const deliverySpeedAvg = Math.round((deliverySum / totalCount) * 10) / 10;
  const overallAvg = Math.round(((foodQualityAvg + deliverySpeedAvg) / 2) * 10) / 10;

  return { foodQualityAvg, deliverySpeedAvg, overallAvg, totalCount };
}

