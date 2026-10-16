import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppRole,
  CustomerTab,
  FoodItem,
  Restaurant,
  Captain,
  Order,
  OrderItem,
  CaptainBid,
  OrderRating,
} from '../types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_RESTAURANTS,
  INITIAL_CAPTAINS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
} from '../data/mockData';
import {
  calculateCartSummary,
  canTransitionOrder,
  OrderStatus,
  calculateUpdatedAverage,
  validateOrderRating,
} from '../utils/mshwarLogic';

interface MshwarContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
  isTechModalOpen: boolean;
  setIsTechModalOpen: (val: boolean) => void;
  isStoreModalOpen: boolean;
  setIsStoreModalOpen: (val: boolean) => void;

  // Customer state
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  cartItems: OrderItem[];
  addToCart: (item: FoodItem, quantity?: number, selectedOptions?: string[]) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  appliedPromo: string;
  setAppliedPromo: (code: string) => void;
  cartSummary: ReturnType<typeof calculateCartSummary>;
  savedFoodIds: string[];
  toggleSaveFood: (foodId: string) => void;
  customerUser: { name: string; phone: string; address: string };
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (val: boolean) => void;

  // Global Orders state & Hamama Bidding System
  orders: Order[];
  activeCustomerOrder: Order | null;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    captainInfo?: { id: string; name: string; phone: string; vehicle?: string }
  ) => boolean;
  placeCustomerOrder: (
    paymentMethod: 'cash' | 'card' | 'wallet',
    notes?: string,
    requestBidding?: boolean
  ) => Order;
  createCustomParcelOrder: (
    pickupAddress: string,
    dropAddress: string,
    packageDescription: string,
    suggestedPrice: number
  ) => Order;
  submitCaptainBid: (
    orderId: string,
    bidAmount: number,
    estimatedMinutes: number,
    note?: string
  ) => void;
  acceptCaptainBid: (orderId: string, bidId: string) => void;

  // Food & Restaurant Management
  foodItems: FoodItem[];
  toggleFoodAvailability: (foodId: string) => void;
  updateFoodPrice: (foodId: string, newPrice: number) => void;
  restaurants: Restaurant[];

  // Captain state & Ledger
  captains: Captain[];
  activeCaptain: Captain;
  toggleCaptainOnline: () => void;
  captainAcceptOrder: (orderId: string) => void;
  captainUpdateDeliveryStep: (orderId: string, step: 'pickup' | 'deliver') => void;
  settleCaptainDailyCommission: (captainId: string) => void;
  requestCaptainWithdrawal: (
    amount: number,
    method: 'jawwal_pay' | 'bank_of_palestine' | 'palpay' | 'cash_office',
    accountDetail?: string
  ) => boolean;

  // Cashier POS state
  cashierCart: OrderItem[];
  cashierAddToCart: (item: FoodItem) => void;
  cashierRemoveFromCart: (itemId: string) => void;
  cashierClearCart: () => void;
  cashierSubmitOrder: (
    orderType: 'dine_in' | 'takeaway' | 'delivery',
    paymentMethod: 'cash' | 'card' | 'wallet',
    cashGiven?: number
  ) => Order;

  // Rating System (Food quality & Delivery speed)
  orderRatings: OrderRating[];
  submitOrderRating: (ratingData: {
    orderId: string;
    foodQualityRating: number;
    deliverySpeedRating: number;
    comment?: string;
    tags?: string[];
  }) => boolean;
  getOrderRating: (orderId: string) => OrderRating | undefined;
  getRestaurantReviews: (restaurantId: string) => OrderRating[];
  getCaptainReviews: (captainId: string) => OrderRating[];

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const MshwarContext = createContext<MshwarContextType | undefined>(undefined);

export const MshwarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('customer');
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(true);
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);

  // Customer State
  const [customerTab, setCustomerTab] = useState<CustomerTab>('home');
  const [cartItems, setCartItems] = useState<OrderItem[]>([
    {
      foodItem: INITIAL_FOOD_ITEMS[0],
      quantity: 1,
      selectedOptions: ['شيدر إضافي ذائب'],
    },
  ]);
  const [appliedPromo, setAppliedPromo] = useState<string>('MSHWAR30');
  const [savedFoodIds, setSavedFoodIds] = useState<string[]>(['food-1', 'food-2']);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const customerUser = {
    name: 'محمد أحمد السوسي',
    phone: '0599223344',
    address: 'غزة، الرمال الجنوبي، شارع فلسطين',
  };

  // Platform Entities
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [captains, setCaptains] = useState<Captain[]>(INITIAL_CAPTAINS);
  const [activeCaptain, setActiveCaptain] = useState<Captain>(INITIAL_CAPTAINS[0]);
  const [orderRatings, setOrderRatings] = useState<OrderRating[]>(INITIAL_REVIEWS);

  // Cashier POS Cart
  const [cashierCart, setCashierCart] = useState<OrderItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active customer order: Prioritize order that is in bidding or active progress
  const activeCustomerOrder =
    orders.find(
      (o) =>
        o.customerPhone === customerUser.phone &&
        o.status !== 'delivered' &&
        o.status !== 'cancelled'
    ) ||
    orders[0] ||
    null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Periodic timer for orders elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status !== 'delivered' && o.status !== 'cancelled') {
            return { ...o, elapsedSeconds: o.elapsedSeconds + 1 };
          }
          return o;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cart operations
  const cartSummary = calculateCartSummary(
    cartItems.map((ci) => ({
      id: ci.foodItem.id,
      name: ci.foodItem.nameAr,
      price: ci.foodItem.price,
      quantity: ci.quantity,
      selectedOptions: ci.selectedOptions,
    })),
    appliedPromo,
    8, // base delivery fee
    0.05
  );

  const addToCart = (item: FoodItem, quantity: number = 1, selectedOptions: string[] = []) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.foodItem.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { foodItem: item, quantity, selectedOptions }];
    });
    showToast(`تمت إضافة "${item.nameAr}" إلى السلة`);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.foodItem.id !== itemId));
    showToast('تم حذف الصنف من السلة');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.foodItem.id === itemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const clearCart = () => setCartItems([]);

  const toggleSaveFood = (foodId: string) => {
    setSavedFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
    showToast('تم تحديث قائمة المفضلة');
  };

  // Orders operations
  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    captainInfo?: { id: string; name: string; phone: string; vehicle?: string }
  ): boolean => {
    let success = false;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (canTransitionOrder(ord.status, newStatus)) {
            success = true;
            return {
              ...ord,
              status: newStatus,
              captainId: captainInfo ? captainInfo.id : ord.captainId,
              captainName: captainInfo ? captainInfo.name : ord.captainName,
              captainPhone: captainInfo ? captainInfo.phone : ord.captainPhone,
              captainVehicle: captainInfo?.vehicle || ord.captainVehicle,
            };
          }
        }
        return ord;
      })
    );

    if (success) {
      const statusLabels: Record<OrderStatus, string> = {
        placed: 'تم إنشاء الطلب',
        bidding_open: 'تم بث الطلب للكباتن وفتح باب العروض',
        confirmed: 'تم تأكيد الطلب واختيار الكابتن',
        preparing: 'بدأ تحضير الوجبة بالمطبخ',
        ready_for_pickup: 'الطلب جاهز للتسليم للكابتن',
        on_the_way: 'الكابتن استلم الطلب وهو في الطريق للزبون',
        delivered: 'تم تسليم الطلب بنجاح',
        cancelled: 'تم إلغاء الطلب',
      };
      showToast(`حالة الطلب: ${statusLabels[newStatus]}`);
    }
    return success;
  };

  // Customer places standard order (with Hamama bidding option)
  const placeCustomerOrder = (
    paymentMethod: 'cash' | 'card' | 'wallet',
    notes?: string,
    requestBidding: boolean = true
  ): Order => {
    const newOrderNumber = `MSH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      customerAddress: customerUser.address,
      pickupAddress: cartItems[0]?.foodItem.restaurantNameAr || 'شارع عمر المختار - برجر هانت',
      restaurantId: cartItems[0]?.foodItem.restaurantId || 'rest-1',
      restaurantNameAr: cartItems[0]?.foodItem.restaurantNameAr || 'برجر هانت',
      items: [...cartItems],
      subtotal: cartSummary.subtotal,
      discount: cartSummary.discountAmount,
      deliveryFee: cartSummary.deliveryFee,
      serviceFee: cartSummary.serviceFee,
      total: cartSummary.grandTotal,
      status: requestBidding ? 'bidding_open' : 'placed',
      biddingStatus: requestBidding ? 'open' : 'closed',
      orderType: 'delivery',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      createdAt: 'الآن',
      elapsedSeconds: 0,
      estimatedDeliveryTime: requestBidding ? 'بانتظار عروض الكباتن' : '20-30 دقيقة',
      notes,
      pickupLat: 31.5042,
      pickupLng: 34.4648,
      dropoffLat: 31.4965,
      dropoffLng: 34.453,
      captainLat: 31.501,
      captainLng: 34.466,
      bids: [
        // Seed an immediate competitive bid from captain 2 to illustrate instant bidding
        {
          id: `bid-${Date.now()}-1`,
          orderId: `ord-${Date.now()}`,
          captainId: 'cap-2',
          captainName: 'محمود خليل',
          captainPhone: '0598765432',
          captainVehicle: 'دراجة ياماها (#108)',
          captainRating: 4.88,
          bidAmount: 8,
          estimatedMinutes: 18,
          note: 'عرض منافس وسريع، قريب من الموقع',
          createdAt: 'الآن',
          status: 'pending',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCustomerTab('live_order');
    showToast(
      requestBidding
        ? `تم بث طلبك رقم ${newOrderNumber} لجميع الكباتن لاستقبال عروض الأسعار!`
        : `تم إرسال طلبك رقم ${newOrderNumber} بنجاح!`
    );
    return newOrder;
  };

  // Custom Direct Parcel / Errand Request (Hamama Delivery Model)
  const createCustomParcelOrder = (
    pickupAddress: string,
    dropAddress: string,
    packageDescription: string,
    suggestedPrice: number
  ): Order => {
    const newOrderNumber = `HAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-parcel-${Date.now()}`,
      orderNumber: newOrderNumber,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      customerAddress: dropAddress,
      pickupAddress,
      restaurantNameAr: 'مشوار خاص / توصيل طرد (حمامة دليفري)',
      packageDescription,
      items: [],
      subtotal: 0,
      discount: 0,
      deliveryFee: suggestedPrice,
      serviceFee: 1.5,
      total: suggestedPrice + 1.5,
      status: 'bidding_open',
      biddingStatus: 'open',
      orderType: 'parcel',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      createdAt: 'الآن',
      elapsedSeconds: 0,
      estimatedDeliveryTime: 'بانتظار عروض الكباتن',
      notes: packageDescription,
      pickupLat: 31.502,
      pickupLng: 34.466,
      dropoffLat: 31.495,
      dropoffLng: 34.452,
      captainLat: 31.501,
      captainLng: 34.466,
      bids: [
        {
          id: `bid-${Date.now()}-auto`,
          orderId: `ord-parcel-${Date.now()}`,
          captainId: 'cap-1',
          captainName: 'أحمد السعدي',
          captainPhone: '0599123456',
          captainVehicle: 'سكوتر هوندا أخضر (#102)',
          captainRating: 4.95,
          bidAmount: suggestedPrice,
          estimatedMinutes: 15,
          note: 'جاهز للاستلام والتوصيل فوراً',
          createdAt: 'الآن',
          status: 'pending',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCustomerTab('live_order');
    showToast(`تم نشر مشوار التوصيل الخاص رقم ${newOrderNumber} لجميع الكباتن!`);
    return newOrder;
  };

  // Captain submits a price offer (bid) on an open order
  const submitCaptainBid = (
    orderId: string,
    bidAmount: number,
    estimatedMinutes: number,
    note?: string
  ) => {
    const newBid: CaptainBid = {
      id: `bid-${Date.now()}`,
      orderId,
      captainId: activeCaptain.id,
      captainName: activeCaptain.name,
      captainPhone: activeCaptain.phone,
      captainVehicle: activeCaptain.vehicle,
      captainRating: activeCaptain.rating,
      bidAmount,
      estimatedMinutes,
      note,
      createdAt: 'الآن',
      status: 'pending',
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // Replace or add captain's bid
          const filteredBids = ord.bids.filter((b) => b.captainId !== activeCaptain.id);
          return {
            ...ord,
            bids: [newBid, ...filteredBids],
          };
        }
        return ord;
      })
    );
    showToast(`أرسلت عرض توصيل بقيمة ${bidAmount} ₪ للزبون`);
  };

  // Customer accepts a captain's bid
  const acceptCaptainBid = (orderId: string, bidId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const acceptedBid = ord.bids.find((b) => b.id === bidId);
          if (!acceptedBid) return ord;

          const updatedBids = ord.bids.map((b) => ({
            ...b,
            status: (b.id === bidId ? 'accepted' : 'rejected') as 'accepted' | 'rejected',
          }));

          const updatedDeliveryFee = acceptedBid.bidAmount;
          const updatedTotal = ord.subtotal - ord.discount + updatedDeliveryFee + ord.serviceFee;

          return {
            ...ord,
            status: ord.orderType === 'parcel' ? 'ready_for_pickup' : 'confirmed',
            biddingStatus: 'closed',
            deliveryFee: updatedDeliveryFee,
            total: Math.round(updatedTotal * 100) / 100,
            captainId: acceptedBid.captainId,
            captainName: acceptedBid.captainName,
            captainPhone: acceptedBid.captainPhone,
            captainVehicle: acceptedBid.captainVehicle,
            selectedBid: acceptedBid,
            bids: updatedBids,
            estimatedDeliveryTime: `${acceptedBid.estimatedMinutes} دقيقة`,
          };
        }
        return ord;
      })
    );
    showToast('تم قبول عرض الكابتن بنجاح! تم تثبيت سعر التوصيل.');
  };

  // Captain Operations & Delivery Step
  const toggleCaptainOnline = () => {
    setActiveCaptain((prev) => {
      const next = { ...prev, isOnline: !prev.isOnline };
      setCaptains((caps) => caps.map((c) => (c.id === prev.id ? next : c)));
      showToast(next.isOnline ? 'أنت الآن متصل وتستقبل طلبات الزبائن' : 'أنت الآن في وضع غير متصل');
      return next;
    });
  };

  const captainAcceptOrder = (orderId: string) => {
    // Submit standard bid or instant claim
    submitCaptainBid(orderId, 10, 15, 'عرض فوري من الكابتن');
  };

  const captainUpdateDeliveryStep = (orderId: string, step: 'pickup' | 'deliver') => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (step === 'pickup') {
      updateOrderStatus(orderId, 'on_the_way');
    } else {
      updateOrderStatus(orderId, 'delivered');
      const deliveryEarning = targetOrder.deliveryFee || 10;
      const foodCash = targetOrder.paymentMethod === 'cash' ? targetOrder.subtotal : 0;

      // Update Captain's daily financial ledger
      setActiveCaptain((prev) => {
        const newDailyRevenue = prev.dailyDeliveryRevenue + deliveryEarning;
        const newFoodCash = prev.dailyFoodCashCollected + foodCash;
        const newOwed = Math.round(newDailyRevenue * (prev.commissionRatePercent / 100) * 100) / 100;

        const now = new Date();
        const dateStr = `اليوم، ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const earningTx = {
          id: `tx-${Date.now()}`,
          type: 'earning' as const,
          titleAr: `أجرة توصيل مشوار #${targetOrder.orderNumber} (${targetOrder.restaurantNameAr})`,
          amount: deliveryEarning,
          date: dateStr,
          status: 'completed' as const,
          referenceId: targetOrder.orderNumber,
          method: 'cash_office' as const,
        };

        const next = {
          ...prev,
          walletBalance: prev.walletBalance + deliveryEarning,
          completedOrdersCount: prev.completedOrdersCount + 1,
          dailyDeliveriesCount: prev.dailyDeliveriesCount + 1,
          dailyDeliveryRevenue: newDailyRevenue,
          dailyFoodCashCollected: newFoodCash,
          platformOwedAmount: newOwed,
          isCommissionSettledToday: false,
          transactions: [earningTx, ...(prev.transactions || [])],
        };
        setCaptains((caps) => caps.map((c) => (c.id === prev.id ? next : c)));
        return next;
      });
      showToast(`تم تسليم المشوار بنجاح وإضافة ${deliveryEarning} ₪ لمحفظتك`);
    }
  };

  // Captain requests withdrawal of earnings
  const requestCaptainWithdrawal = (
    amount: number,
    method: 'jawwal_pay' | 'bank_of_palestine' | 'palpay' | 'cash_office',
    accountDetail?: string
  ): boolean => {
    if (amount <= 0 || amount > activeCaptain.walletBalance) {
      showToast('المبلغ المطلوب غير صالح أو يتجاوز رصيدك المتاح');
      return false;
    }

    const now = new Date();
    const dateStr = `اليوم، ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const ref = `WTH-${Math.floor(10000 + Math.random() * 90000)}`;

    const methodLabels: Record<string, string> = {
      jawwal_pay: 'سحب أرباح إلى محفظة جوال باي (Jawwal Pay)',
      bank_of_palestine: 'حوالة بنكية إلى بنك فلسطين (Bank of Palestine)',
      palpay: 'سحب أرباح إلى محفظة بال باي (PalPay)',
      cash_office: 'طلب صرف نقدي فوري من مقر مشوار الرئيسي',
    };

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal' as const,
      titleAr: methodLabels[method] || 'طلب سحب أرباح',
      amount: -amount,
      date: dateStr,
      status: 'pending' as const,
      referenceId: ref,
      method,
      accountDetail: accountDetail || (method === 'jawwal_pay' ? activeCaptain.phone : undefined),
    };

    setActiveCaptain((prev) => {
      const next = {
        ...prev,
        walletBalance: Math.max(0, Math.round((prev.walletBalance - amount) * 100) / 100),
        pendingTransfersAmount: Math.round((prev.pendingTransfersAmount + amount) * 100) / 100,
        transactions: [newTx, ...(prev.transactions || [])],
      };
      setCaptains((caps) => caps.map((c) => (c.id === prev.id ? next : c)));
      return next;
    });

    showToast(`تم تسجيل طلب سحب ${amount} ₪ بنجاح وهو قيد المعالجة ⏳`);
    return true;
  };

  // Admin settles captain daily commission (أخذ النسبة اليومية)
  const settleCaptainDailyCommission = (captainId: string) => {
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    setCaptains((prev) =>
      prev.map((cap) => {
        if (cap.id === captainId) {
          return {
            ...cap,
            isCommissionSettledToday: true,
            lastSettlementTime: `${nowTime} (تم تحصيل ${cap.platformOwedAmount.toFixed(2)} ₪)`,
          };
        }
        return cap;
      })
    );
    if (activeCaptain.id === captainId) {
      setActiveCaptain((prev) => ({
        ...prev,
        isCommissionSettledToday: true,
        lastSettlementTime: `${nowTime} (تم تسوية النسبة بنجاح)`,
      }));
    }
    showToast('تمت تسوية حساب الكابتن وتحصيل نسبة المنصة اليومية بنجاح ✓');
  };

  // Menu updates
  const toggleFoodAvailability = (foodId: string) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, isAvailable: !item.isAvailable } : item))
    );
    showToast('تم تحديث حالة توفر الصنف');
  };

  const updateFoodPrice = (foodId: string, newPrice: number) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, price: newPrice } : item))
    );
    showToast('تم تحديث سعر الوجبة بنجاح');
  };

  // Cashier POS Operations
  const cashierAddToCart = (item: FoodItem) => {
    setCashierCart((prev) => {
      const index = prev.findIndex((ci) => ci.foodItem.id === item.id);
      if (index > -1) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: next[index].quantity + 1 };
        return next;
      }
      return [...prev, { foodItem: item, quantity: 1 }];
    });
  };

  const cashierRemoveFromCart = (itemId: string) => {
    setCashierCart((prev) => prev.filter((ci) => ci.foodItem.id !== itemId));
  };

  const cashierClearCart = () => setCashierCart([]);

  const cashierSubmitOrder = (
    orderType: 'dine_in' | 'takeaway' | 'delivery',
    paymentMethod: 'cash' | 'card' | 'wallet'
  ): Order => {
    const subtotal = cashierCart.reduce((acc, ci) => acc + ci.foodItem.price * ci.quantity, 0);
    const newOrderNumber = `POS-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord-pos-${Date.now()}`,
      orderNumber: newOrderNumber,
      customerName: 'زبون محلي (كاشير)',
      customerPhone: '0590000000',
      customerAddress: orderType === 'dine_in' ? 'طاولة رقم 4 (صالة)' : 'استلام مباشر من الكاونتر',
      restaurantId: 'rest-1',
      restaurantNameAr: 'برجر هانت',
      items: [...cashierCart],
      subtotal,
      discount: 0,
      deliveryFee: orderType === 'delivery' ? 5 : 0,
      serviceFee: 0,
      total: subtotal + (orderType === 'delivery' ? 5 : 0),
      status: 'confirmed',
      biddingStatus: 'closed',
      orderType,
      paymentMethod,
      paymentStatus: 'paid',
      createdAt: 'الآن',
      elapsedSeconds: 0,
      estimatedDeliveryTime: '10 دقائق',
      bids: [],
    };

    setOrders((prev) => [newOrder, ...prev]);
    cashierClearCart();
    showToast(`تم إصدار فاتورة ${newOrderNumber} وإرسالها لشاشة المطبخ KDS`);
    return newOrder;
  };

  // Submit rating for an order (both food quality and captain delivery speed)
  const submitOrderRating = (ratingData: {
    orderId: string;
    foodQualityRating: number;
    deliverySpeedRating: number;
    comment?: string;
    tags?: string[];
  }): boolean => {
    const { orderId, foodQualityRating, deliverySpeedRating, comment, tags = [] } = ratingData;
    const validation = validateOrderRating(foodQualityRating, deliverySpeedRating);
    if (!validation.isValid) {
      showToast(validation.error || 'يرجى تقديم تقييم صحيح بالنجوم');
      return false;
    }

    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      showToast('الطلب غير موجود');
      return false;
    }

    const overallRating = Math.round(((foodQualityRating + deliverySpeedRating) / 2) * 10) / 10;
    const newRatingId = `rev-${Date.now()}`;
    const newReview: OrderRating = {
      id: newRatingId,
      orderId: targetOrder.id,
      orderNumber: targetOrder.orderNumber,
      restaurantId: targetOrder.restaurantId,
      restaurantNameAr: targetOrder.restaurantNameAr,
      captainId: targetOrder.captainId,
      captainName: targetOrder.captainName,
      foodQualityRating,
      deliverySpeedRating,
      overallRating,
      comment: comment?.trim() || '',
      tags,
      customerName: customerUser.name,
      createdAt: 'اليوم، الآن',
    };

    // 1. Update order in state
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isRated: true, rating: newReview } : o))
    );

    // 2. Add to ratings list
    setOrderRatings((prev) => [newReview, ...prev.filter((r) => r.orderId !== orderId)]);

    // 3. Dynamically update Restaurant average rating & review count
    if (targetOrder.restaurantId) {
      setRestaurants((prevRests) =>
        prevRests.map((rest) => {
          if (rest.id === targetOrder.restaurantId) {
            const prevCount = rest.ratingsCount || 50;
            const prevAvg = rest.rating || 4.8;
            const prevFoodAvg = rest.foodQualityAvg || 4.8;
            const { newAvg, newCount } = calculateUpdatedAverage(prevAvg, prevCount, overallRating);
            const { newAvg: newFoodAvg } = calculateUpdatedAverage(prevFoodAvg, prevCount, foodQualityRating);
            return {
              ...rest,
              rating: newAvg,
              ratingsCount: newCount,
              foodQualityAvg: newFoodAvg,
            };
          }
          return rest;
        })
      );
    }

    // 4. Dynamically update Captain average rating & review count
    if (targetOrder.captainId) {
      const captainId = targetOrder.captainId;
      setCaptains((prevCaps) =>
        prevCaps.map((cap) => {
          if (cap.id === captainId) {
            const prevCount = cap.ratingsCount || 30;
            const prevAvg = cap.rating || 4.9;
            const prevSpeedAvg = cap.deliverySpeedAvg || 4.9;
            const { newAvg, newCount } = calculateUpdatedAverage(prevAvg, prevCount, overallRating);
            const { newAvg: newSpeedAvg } = calculateUpdatedAverage(prevSpeedAvg, prevCount, deliverySpeedRating);
            return {
              ...cap,
              rating: newAvg,
              ratingsCount: newCount,
              deliverySpeedAvg: newSpeedAvg,
            };
          }
          return cap;
        })
      );

      setActiveCaptain((prevCap) => {
        if (prevCap.id === captainId) {
          const prevCount = prevCap.ratingsCount || 30;
          const prevAvg = prevCap.rating || 4.9;
          const prevSpeedAvg = prevCap.deliverySpeedAvg || 4.9;
          const { newAvg, newCount } = calculateUpdatedAverage(prevAvg, prevCount, overallRating);
          const { newAvg: newSpeedAvg } = calculateUpdatedAverage(prevSpeedAvg, prevCount, deliverySpeedRating);
          return {
            ...prevCap,
            rating: newAvg,
            ratingsCount: newCount,
            deliverySpeedAvg: newSpeedAvg,
          };
        }
        return prevCap;
      });
    }

    showToast('شكراً لمشاركتنا تقييمك! تم تحديث تقييم المطعم والكابتن بنجاح ⭐');
    return true;
  };

  const getOrderRating = (orderId: string): OrderRating | undefined => {
    return orderRatings.find((r) => r.orderId === orderId);
  };

  const getRestaurantReviews = (restaurantId: string): OrderRating[] => {
    return orderRatings.filter((r) => r.restaurantId === restaurantId);
  };

  const getCaptainReviews = (captainId: string): OrderRating[] => {
    return orderRatings.filter((r) => r.captainId === captainId);
  };

  return (
    <MshwarContext.Provider
      value={{
        role,
        setRole,
        isMobileSimulator,
        setIsMobileSimulator,
        isTechModalOpen,
        setIsTechModalOpen,
        isStoreModalOpen,
        setIsStoreModalOpen,

        customerTab,
        setCustomerTab,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedPromo,
        setAppliedPromo,
        cartSummary,
        savedFoodIds,
        toggleSaveFood,
        customerUser,
        isLoginModalOpen,
        setIsLoginModalOpen,

        orders,
        activeCustomerOrder,
        updateOrderStatus,
        placeCustomerOrder,
        createCustomParcelOrder,
        submitCaptainBid,
        acceptCaptainBid,

        foodItems,
        toggleFoodAvailability,
        updateFoodPrice,
        restaurants,

        captains,
        activeCaptain,
        toggleCaptainOnline,
        captainAcceptOrder,
        captainUpdateDeliveryStep,
        settleCaptainDailyCommission,
        requestCaptainWithdrawal,

        cashierCart,
        cashierAddToCart,
        cashierRemoveFromCart,
        cashierClearCart,
        cashierSubmitOrder,

        orderRatings,
        submitOrderRating,
        getOrderRating,
        getRestaurantReviews,
        getCaptainReviews,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </MshwarContext.Provider>
  );
};

export const useMshwar = () => {
  const context = useContext(MshwarContext);
  if (!context) {
    throw new Error('useMshwar must be used within a MshwarProvider');
  }
  return context;
};
