import React, { useState } from 'react';
import {
  MapPin,
  Bell,
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  Plus,
  Minus,
  Star,
  Check,
  Percent,
  Bike,
  Heart,
  ChevronLeft,
  X,
  CreditCard,
  Wallet,
  Phone,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Package,
  Layers,
  Send,
  Sparkles,
} from 'lucide-react';
import { useMshwar } from '../../context/MshwarContext';
import { FoodItem, Restaurant, CaptainBid } from '../../types';
import { HERO_IMAGE } from '../../data/mockData';
import { OrderLiveTrackingMap } from '../common/OrderLiveTrackingMap';
import { OrderRatingCard } from './OrderRatingCard';
import { RestaurantReviewsModal } from '../common/RestaurantReviewsModal';

export const CustomerView: React.FC = () => {
  const {
    customerTab,
    setCustomerTab,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    appliedPromo,
    setAppliedPromo,
    cartSummary,
    savedFoodIds,
    toggleSaveFood,
    customerUser,
    orders,
    activeCustomerOrder,
    placeCustomerOrder,
    createCustomParcelOrder,
    acceptCaptainBid,
    foodItems,
    restaurants,
    captains,
    activeCaptain,
    orderRatings,
    isMobileSimulator,
    isLoginModalOpen,
    setIsLoginModalOpen,
    setIsStoreModalOpen,
  } = useMshwar();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);
  const [foodModalQuantity, setFoodModalQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isBiddingPreferred, setIsBiddingPreferred] = useState<boolean>(true);

  // Custom parcel delivery state (Hamama Delivery model)
  const [parcelPickup, setParcelPickup] = useState<string>('ميدان فلسطين، غزة');
  const [parcelDrop, setParcelDrop] = useState<string>('حي الرمال الجنوبي، شارع الشهداء');
  const [parcelDesc, setParcelDesc] = useState<string>('توصيل أوراق هامة ومستندات مغلفة');
  const [parcelOfferPrice, setParcelOfferPrice] = useState<number>(10);
  const [viewedOrderId, setViewedOrderId] = useState<string | null>(null);
  const [selectedRestaurantForReviews, setSelectedRestaurantForReviews] = useState<Restaurant | null>(null);

  const currentTrackedOrder =
    (viewedOrderId ? orders.find((o) => o.id === viewedOrderId) : null) ||
    activeCustomerOrder;

  const categories = [
    { id: 'all', nameAr: 'الكل', icon: '🍽️' },
    { id: 'burger', nameAr: 'برجر', icon: '🍔' },
    { id: 'pizza', nameAr: 'بيتزا', icon: '🍕' },
    { id: 'chicken', nameAr: 'دجاج مقرمش', icon: '🍗' },
    { id: 'sushi', nameAr: 'سوشي', icon: '🍣' },
    { id: 'grills', nameAr: 'مشويات', icon: '🥩' },
    { id: 'pasta', nameAr: 'باستا', icon: '🍝' },
    { id: 'dessert', nameAr: 'حلويات', icon: '🧁' },
    { id: 'drinks', nameAr: 'مشروبات', icon: '🧃' },
  ];

  const deals = [
    {
      code: 'MSHWAR30',
      titleAr: 'خصم 30% على وجبتك الأولى',
      descAr: 'استخدم كود MSHWAR30 للطلبات فوق 30 ₪',
      discount: '30% خصم',
      bgGradient: 'from-emerald-900 to-emerald-700',
    },
    {
      code: 'FREESHIP',
      titleAr: 'توصيل مجاني سريع',
      descAr: 'توصيل مجاني لكافة مطاعم غزة المميزة كود FREESHIP',
      discount: 'توصيل مجاني',
      bgGradient: 'from-amber-900 to-amber-700',
    },
  ];

  const filteredFoods = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantNameAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularRestaurants = restaurants.filter((r) => r.isOpen);

  const openFoodModal = (food: FoodItem) => {
    setSelectedFoodForModal(food);
    setFoodModalQuantity(1);
    setSelectedOptions([]);
  };

  const handleConfirmAddToCart = () => {
    if (selectedFoodForModal) {
      addToCart(selectedFoodForModal, foodModalQuantity, selectedOptions);
      setSelectedFoodForModal(null);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    placeCustomerOrder(selectedPayment, orderNotes, isBiddingPreferred);
  };

  const handleCreateParcel = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomParcelOrder(parcelPickup, parcelDrop, parcelDesc, parcelOfferPrice);
  };

  return (
    <div className={`w-full ${isMobileSimulator ? 'py-6 px-4 flex justify-center bg-slate-900/10 min-h-[calc(100vh-4rem)]' : 'max-w-7xl mx-auto px-4 sm:px-6 py-6'}`}>
      <div
        className={`bg-white transition-all duration-300 relative ${
          isMobileSimulator
            ? 'w-[390px] min-h-[844px] max-h-[890px] rounded-[48px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col ring-1 ring-slate-800/20'
            : 'w-full rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[800px] flex flex-col'
        }`}
      >
        {/* Dynamic Island / Phone speaker bar */}
        {isMobileSimulator && (
          <div className="absolute top-0 left-0 right-0 h-7 z-30 flex items-center justify-between px-7 text-[12px] font-semibold text-slate-800 pointer-events-none select-none">
            <span>9:41</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>5G</span>
              <div className="w-4 h-2 border border-slate-800 rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-800 rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Top Header - Deliver To Location Bar */}
        <header className={`px-4 ${isMobileSimulator ? 'pt-8' : 'pt-4'} pb-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="leading-tight text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">توصيل إلى</span>
              <span className="text-xs font-bold text-slate-900 truncate max-w-[170px] sm:max-w-[260px] block">
                {customerUser.address.split('،')[1] || 'شارع فلسطين، غزة'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              دخول / حسابي
            </button>
            <button
              onClick={() => {
                if (activeCustomerOrder) setCustomerTab('live_order');
              }}
              className="relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              title="تتبع الطلب"
            >
              <Bell className="w-5 h-5" />
              {activeCustomerOrder && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>
        </header>

        {/* Main Body Content based on customerTab */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* TAB: HOME */}
          {customerTab === 'home' && (
            <div className="p-4 space-y-6">
              {/* Promo Banner matching video: "FAST & FREE DELIVERY" with courier */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-5 shadow-lg shadow-emerald-900/15">
                <div className="relative z-10 max-w-[65%] space-y-2 text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold border border-emerald-400/20">
                    <Bike className="w-3.5 h-3.5" />
                    <span>توصيل سريع ومجاني</span>
                  </div>
                  <h2 className="text-xl font-black leading-tight text-white">
                    طعامك المفضل ساخن عند بابك!
                  </h2>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    أشهى الوجبات بنظام عروض أسعار الكباتن (حمامة دليفري).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const el = document.getElementById('fast-meals-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3.5 py-1.5 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
                    >
                      اطلب وجبة
                    </button>
                    <button
                      onClick={() => setCustomerTab('custom_delivery')}
                      className="px-3.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-950 text-white border border-emerald-400/30 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-300" />
                      <span>مشوار طرد</span>
                    </button>
                  </div>
                </div>
                {/* Delivery Courier Image */}
                <div className="absolute -bottom-2 -left-2 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none select-none">
                  <img
                    src={HERO_IMAGE}
                    alt="كابتن مشوار"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن وجبة، برجر، بيتزا، مطعم..."
                    className="w-full pr-10 pl-4 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none rounded-2xl text-xs text-slate-800 transition-all text-right"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors cursor-pointer"
                  title="تصفية"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Parcel Errand Quick Feature Bar (حمامة دلفري) */}
              <div
                onClick={() => setCustomerTab('custom_delivery')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-between cursor-pointer shadow-xs hover:shadow-md transition-all text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-xs flex items-center justify-center font-bold text-slate-950 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black">خدمة حمامة: توصيل طرد أو مشوار خاص</h4>
                    <p className="text-[10px] text-slate-900 font-medium">
                      أرسل طلباً واستقبل عروض أسعار تنافسية من كباتن غزة فوراً
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 rotate-180 shrink-0 text-slate-950" />
              </div>

              {/* Categories Horizontal Carousel */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-900">التصنيفات</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer">
                    عرض الكل
                  </span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex flex-col items-center gap-1.5 min-w-[62px] p-2 rounded-2xl transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-[11px] font-bold whitespace-nowrap">{cat.nameAr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Again Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-900">اطلب مجدداً</h3>
                  <span className="text-[11px] text-slate-400 font-medium">سجل طلباتك</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  {foodItems.slice(0, 3).map((item) => (
                    <div
                      key={`again-${item.id}`}
                      className="flex items-center gap-3 p-2.5 bg-white border border-slate-200/80 rounded-2xl min-w-[210px] shrink-0 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.nameAr}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-right">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.nameAr}</h4>
                        <span className="text-xs font-extrabold text-emerald-700 block mt-0.5">
                          {item.price} ₪
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="إضافة للسلة"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deals For You Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-900">عروض وتخفيضات لك</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer">
                    كوبونات فعالة
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deals.map((deal) => {
                    const isApplied = appliedPromo === deal.code;
                    return (
                      <div
                        key={deal.code}
                        className={`p-3.5 rounded-2xl bg-gradient-to-br ${deal.bgGradient} text-white flex items-center justify-between gap-3 shadow-sm`}
                      >
                        <div className="space-y-1 text-right">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">
                            {deal.discount}
                          </span>
                          <h4 className="text-xs font-extrabold text-white">{deal.titleAr}</h4>
                          <p className="text-[10px] text-white/80">{deal.descAr}</p>
                        </div>
                        <button
                          onClick={() => {
                            setAppliedPromo(deal.code);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                            isApplied
                              ? 'bg-white text-emerald-800'
                              : 'bg-white/20 hover:bg-white text-white hover:text-slate-900'
                          }`}
                        >
                          {isApplied ? 'مُفعّل ✓' : 'تطبيق'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Popular Restaurants Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-900">مطاعم شهيرة بالقرب منك</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer">
                    {popularRestaurants.length} مطاعم
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {popularRestaurants.map((rest) => (
                    <div
                      key={rest.id}
                      onClick={() => setSelectedRestaurantForReviews(rest)}
                      className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={rest.logoUrl}
                        alt={rest.nameAr}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                            {rest.nameAr}
                          </h4>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRestaurantForReviews(rest);
                            }}
                            className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200/70 transition-colors"
                            title="عرض تقييمات وتجارب الزبائن"
                          >
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{rest.rating}</span>
                            <span className="text-[9px] text-slate-400">({rest.ratingsCount || 45})</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{rest.cuisineAr}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px]">
                          <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                            جودة {rest.foodQualityAvg || 4.9}⭐
                          </span>
                          <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                            سرعة {rest.deliverySpeedAvg || 4.7}⭐
                          </span>
                          <span className="text-slate-400 mr-auto font-medium">
                            {rest.deliveryFee === 0 ? 'مجاني' : `${rest.deliveryFee} ₪`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Delivery Meals Grid */}
              <div id="fast-meals-section">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-bold text-slate-900">
                      أطباق وتوصيل سريع - أقل من 15 دقيقة
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {filteredFoods.length} وجبة
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {filteredFoods.map((food) => {
                    const isSaved = savedFoodIds.includes(food.id);
                    return (
                      <div
                        key={food.id}
                        className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                      >
                        <div className="relative mb-2">
                          <img
                            src={food.imageUrl}
                            alt={food.nameAr}
                            className="w-full h-28 object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
                          />
                          <button
                            onClick={() => toggleSaveFood(food.id)}
                            className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-black/40 text-white hover:bg-black/60'
                            }`}
                            title="حفظ في المفضلة"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>

                        <div className="space-y-1 text-right flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="flex items-center gap-0.5">
                                <Flame className="w-3 h-3 text-orange-400" />
                                {food.calories} كالوري
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {food.prepTimeMinutes} د
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 mt-1">
                              {food.nameAr}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate">
                              {food.restaurantNameAr}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                            <span className="text-xs font-black text-emerald-800">
                              {food.price} ₪
                            </span>
                            <button
                              onClick={() => openFoodModal(food)}
                              className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                              title="تخصيص وإضافة للسلة"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOM PARCEL ERRAND DELIVERY (HAMAMA DELIVERY MODEL) */}
          {customerTab === 'custom_delivery' && (
            <div className="p-4 space-y-4 text-right">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-200" />
                  <h3 className="text-base font-black">مشوار خاص / توصيل طرد (حمامة دليفري)</h3>
                </div>
                <p className="text-xs text-amber-100">
                  اطلب توصيل أي غرض، هدية، مستند، أو شراء شخصي من أي مكان في غزة مع مزاد أسعار مباشر بين الكباتن!
                </p>
              </div>

              <form onSubmit={handleCreateParcel} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">نقطة الاستلام (من أين؟)</label>
                  <input
                    type="text"
                    value={parcelPickup}
                    onChange={(e) => setParcelPickup(e.target.value)}
                    required
                    placeholder="مثال: صيدلية القدس - شارع الوحدة"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">نقطة التسليم (إلى أين؟)</label>
                  <input
                    type="text"
                    value={parcelDrop}
                    onChange={(e) => setParcelDrop(e.target.value)}
                    required
                    placeholder="مثال: حي الرمال - عمارة الشفاء ط 3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">تفاصيل ووصف الطرد أو المشوار</label>
                  <textarea
                    value={parcelDesc}
                    onChange={(e) => setParcelDesc(e.target.value)}
                    required
                    rows={2}
                    placeholder="مثال: استلام ملف أوراق هامة وتسليمها للدكتور أحمد..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">أجرة التوصيل المقترحة من طرفك (₪)</label>
                  <div className="flex items-center gap-2">
                    {[8, 10, 12, 15].map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setParcelOfferPrice(price)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                          parcelOfferPrice === price
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {price} ₪
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200">
                  ⚡ بمجرد نشر الطلب، سيصل إشعار لجميع الكباتن المتصلين ليضعوا عروض أسعارهم وتختار الأنسب والأسرع لك!
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>بث المشوار واستقبال عروض الكباتن الآن</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: CART */}
          {customerTab === 'cart' && (
            <div className="p-4 space-y-5 text-right">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">سلة المشتريات</h3>
                <span className="text-xs text-slate-500">{cartSummary.itemCount} أصناف</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">سلتك فارغة حالياً</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    تصفح أشهى الأطباق من مطاعم مشوار وأضف وجباتك المفضلة!
                  </p>
                  <button
                    onClick={() => setCustomerTab('home')}
                    className="mt-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    تصفح قائمة الطعام
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items list */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.foodItem.id}
                        className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-2xs"
                      >
                        <img
                          src={item.foodItem.imageUrl}
                          alt={item.foodItem.nameAr}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-right">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.foodItem.nameAr}
                          </h4>
                          <span className="text-xs font-bold text-emerald-700 block">
                            {item.foodItem.price} ₪
                          </span>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <p className="text-[10px] text-slate-500 truncate">
                              {item.selectedOptions.join('، ')}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
                          <button
                            onClick={() => updateQuantity(item.foodItem.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.foodItem.id, 1)}
                            className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hamama Delivery Bidding Option Toggle */}
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5 text-right">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-700" />
                        <span className="text-xs font-bold text-purple-950">
                          نظام مزاد عروض الأسعار بين الكباتن (حمامة دليفري)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isBiddingPreferred}
                        onChange={(e) => setIsBiddingPreferred(e.target.checked)}
                        className="w-4 h-4 accent-purple-600 rounded"
                      />
                    </label>
                    <p className="text-[10px] text-purple-800 leading-relaxed">
                      عند التفعيل، يُبث طلبك فوراً لجميع الكباتن ليضعوا عروض تسعيرة التوصيل وتختار بنفسك السعر الأرخص والكابتن الأقرب!
                    </p>
                  </div>

                  {/* Promo code input */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      كود الخصم أو القسيمة
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={appliedPromo}
                        onChange={(e) => setAppliedPromo(e.target.value.toUpperCase())}
                        placeholder="مثل MSHWAR30 أو FREESHIP"
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <button
                        onClick={() => setAppliedPromo(appliedPromo)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        تطبيق
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      طريقة الدفع
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedPayment('cash')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedPayment === 'cash'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Wallet className="w-4 h-4 text-emerald-700" />
                        <span>عند الاستلام</span>
                      </button>
                      <button
                        onClick={() => setSelectedPayment('card')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedPayment === 'card'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        <span>بطاقة بنكية</span>
                      </button>
                      <button
                        onClick={() => setSelectedPayment('wallet')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedPayment === 'wallet'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>محفظة مشوار</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>المجموع الفرعي للوجبات</span>
                      <span className="font-bold">{cartSummary.subtotal} ₪</span>
                    </div>
                    {cartSummary.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>خصم الكوبون ({appliedPromo})</span>
                        <span>-{cartSummary.discountAmount} ₪</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>أجرة التوصيل المتوقعة</span>
                      <span className="font-bold">
                        {isBiddingPreferred ? 'حسب عروض الكباتن' : `${cartSummary.deliveryFee} ₪`}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                      <span>الإجمالي التقديري</span>
                      <span className="text-emerald-800">{cartSummary.grandTotal} ₪</span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {isBiddingPreferred ? 'بث الطلب واستقبال عروض الكباتن' : `تأكيد الطلب (${cartSummary.grandTotal} ₪)`}
                    </span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* TAB: LIVE ORDER TRACKING & CAPTAIN BIDDING SCREEN */}
          {customerTab === 'live_order' && (
            <div className="p-4 space-y-5 text-right">
              {!activeCustomerOrder ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Bike className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">لا يوجد طلب نشط حالياً</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    عندما تؤكد طلباً جديداً، ستتمكن من استقبال عروض الكباتن ومتابعة خط السير لحظة بلحظة.
                  </p>
                  <button
                    onClick={() => setCustomerTab('home')}
                    className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              ) : (
                <>
                  {/* Active Orders Switcher */}
                  {orders.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                      <span className="text-[11px] text-slate-500 font-bold shrink-0">اختر طلباً للتتبع:</span>
                      {orders.map((ord) => {
                        const isSelected = (currentTrackedOrder?.id === ord.id);
                        return (
                          <button
                            key={`switch-ord-${ord.id}`}
                            onClick={() => setViewedOrderId(ord.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{ord.orderNumber}</span>
                            <span className="text-[10px] opacity-80">
                              ({ord.status === 'bidding_open' ? 'عروض' : ord.status === 'on_the_way' ? 'بالطريق 🛵' : ord.status === 'delivered' ? 'مكتمل' : 'تحضير'})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Order Top Badge */}
                  <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">رقم الطلب: {currentTrackedOrder?.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
                        {currentTrackedOrder?.estimatedDeliveryTime}
                      </span>
                    </div>
                    <h3 className="text-base font-black">
                      {currentTrackedOrder?.status === 'bidding_open' && '📢 تم بث الطلب لجميع الكباتن! اختر العرض الأنسب'}
                      {currentTrackedOrder?.status === 'placed' && 'تم استلام طلبك وبانتظار تأكيد المطعم'}
                      {currentTrackedOrder?.status === 'confirmed' && 'تم اعتماد الكابتن وتأكيد الطلب'}
                      {currentTrackedOrder?.status === 'preparing' && 'وجبتك قيد الطهي والتحضير بالمطبخ'}
                      {currentTrackedOrder?.status === 'ready_for_pickup' && 'الوجبة جاهزة، الكابتن يستلمها الآن'}
                      {currentTrackedOrder?.status === 'on_the_way' && 'الكابتن في الطريق إليك الآن! 🛵'}
                      {currentTrackedOrder?.status === 'delivered' && 'تم التوصيل بنجاح، بالهناء والشفاء! 🎉'}
                    </h3>
                    <p className="text-xs text-emerald-100">
                      {currentTrackedOrder?.restaurantNameAr} • الإجمالي: {currentTrackedOrder?.total} ₪
                    </p>
                  </div>

                  {/* LIVE CAPTAIN BIDS BOX (If Bidding is open) */}
                  {currentTrackedOrder?.status === 'bidding_open' && (
                    <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-3xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between pb-1 border-b border-purple-200">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                          <h4 className="text-xs font-black text-purple-950">
                            عروض الكباتن الحية المتنافسة ({currentTrackedOrder.bids.length})
                          </h4>
                        </div>
                        <span className="text-[10px] text-purple-700 font-bold">تحديث لحظي</span>
                      </div>

                      {currentTrackedOrder.bids.length === 0 ? (
                        <div className="py-6 text-center text-xs text-purple-800">
                          جاري انتظار استجابة الكباتن الأقرب إليك...
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {currentTrackedOrder.bids.map((bid) => (
                            <div
                              key={bid.id}
                              className="p-3 bg-white rounded-2xl border border-purple-200 shadow-2xs flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                                  {bid.captainName.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="text-xs font-bold text-slate-900">{bid.captainName}</h5>
                                    <span className="text-[10px] text-amber-500 font-bold">
                                      ⭐ {bid.captainRating}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500">
                                    {bid.captainVehicle} • وصول خلال {bid.estimatedMinutes} دقيقة
                                  </p>
                                  {bid.note && (
                                    <p className="text-[10px] text-purple-800 italic mt-0.5">
                                      "{bid.note}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="text-left shrink-0 space-y-1">
                                <span className="text-base font-black text-emerald-800 block">
                                  {bid.bidAmount} ₪
                                </span>
                                <button
                                  onClick={() => acceptCaptainBid(currentTrackedOrder.id, bid.id)}
                                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                                >
                                  قبول واختيار ✓
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Leaflet Live Route Tracking Map */}
                  {currentTrackedOrder && (
                    <div className="w-full">
                      <OrderLiveTrackingMap order={currentTrackedOrder} />
                    </div>
                  )}

                  {/* STAR RATING SYSTEM: Rate food quality & delivery speed after trip completion */}
                  {currentTrackedOrder && currentTrackedOrder.status === 'delivered' && (
                    <div className="w-full">
                      <OrderRatingCard order={currentTrackedOrder} />
                    </div>
                  )}

                  {/* Assigned Captain Card with Dynamic Live Rating & Speed Score */}
                  {currentTrackedOrder && currentTrackedOrder.captainName && (() => {
                    const assignedCap =
                      captains.find((c) => c.id === currentTrackedOrder.captainId) || activeCaptain;
                    return (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shadow-2xs">
                            {currentTrackedOrder.captainName.slice(0, 2)}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-slate-900">
                                الكابتن: {currentTrackedOrder.captainName}
                              </h4>
                              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                                ⭐ {assignedCap.rating} ({assignedCap.ratingsCount || 40} تقييم)
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {currentTrackedOrder.captainVehicle || 'سكوتر هوندا'} • سرعة التوصيل:{' '}
                              <strong className="text-emerald-700 font-bold">
                                {assignedCap.deliverySpeedAvg || 4.9} ⭐
                              </strong>
                            </span>
                          </div>
                        </div>
                        <a
                          href={`tel:${currentTrackedOrder.captainPhone || '0599123456'}`}
                          className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="اتصال بالكابتن"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* TAB: SAVED FAVORITES */}
          {customerTab === 'saved' && (
            <div className="p-4 space-y-4 text-right">
              <h3 className="text-base font-bold text-slate-900">الأطباق المحفوظة والمفضلة</h3>
              {savedFoodIds.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <Heart className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs text-slate-500">لم تقم بحفظ أي وجبات في المفضلة بعد.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {foodItems
                    .filter((f) => savedFoodIds.includes(f.id))
                    .map((food) => (
                      <div
                        key={`fav-${food.id}`}
                        className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-2xs"
                      >
                        <img
                          src={food.imageUrl}
                          alt={food.nameAr}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-right">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {food.nameAr}
                          </h4>
                          <span className="text-xs font-bold text-emerald-700 block">
                            {food.price} ₪
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(food, 1)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          طلب الآن
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: DEALS */}
          {customerTab === 'deals' && (
            <div className="p-4 space-y-4 text-right">
              <h3 className="text-base font-bold text-slate-900">أحدث العروض وقسائم الخصم</h3>
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div
                    key={`tab-deal-${deal.code}`}
                    className={`p-4 rounded-2xl bg-gradient-to-r ${deal.bgGradient} text-white space-y-2 shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-bold">
                        {deal.discount}
                      </span>
                      <span className="text-xs font-mono font-bold bg-white text-slate-900 px-2 py-0.5 rounded-md">
                        {deal.code}
                      </span>
                    </div>
                    <h4 className="text-sm font-black">{deal.titleAr}</h4>
                    <p className="text-xs text-white/80">{deal.descAr}</p>
                    <button
                      onClick={() => {
                        setAppliedPromo(deal.code);
                        setCustomerTab('cart');
                      }}
                      className="mt-2 w-full py-2 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black rounded-xl transition-colors cursor-pointer"
                    >
                      تفعيل الكود والذهاب للسلة
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {customerTab === 'profile' && (
            <div className="p-4 space-y-4 text-right">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-black text-base flex items-center justify-center">
                  {customerUser.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{customerUser.name}</h4>
                  <span className="text-xs text-slate-500 block">{customerUser.phone}</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">العنوان المسجل</span>
                  <span className="font-bold text-slate-900 max-w-[200px] truncate">
                    {customerUser.address}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">رصيد محفظة مشوار</span>
                  <span className="font-bold text-emerald-700">75.00 ₪</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">إجمالي الطلبات</span>
                  <span className="font-bold text-slate-900">
                    {orders.filter((o) => o.status === 'delivered').length} طلبات مكتملة
                  </span>
                </div>
              </div>

              {/* Delivered Orders & Rating History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>تقييماتي وطلباتي المكتملة</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {orders.filter((o) => o.status === 'delivered').length} مشوار منجز
                  </span>
                </div>

                <div className="space-y-2">
                  {orders
                    .filter((o) => o.status === 'delivered')
                    .map((ord) => {
                      const isRated = ord.isRated || ord.rating !== undefined;
                      return (
                        <div
                          key={`hist-${ord.id}`}
                          className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                              {ord.orderNumber} • {ord.restaurantNameAr}
                            </span>
                            <span className="text-[10px] text-slate-400">{ord.createdAt}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">
                              الكابتن: {ord.captainName || 'أحمد السعدي'} • {ord.total} ₪
                            </span>
                            {isRated ? (
                              <button
                                onClick={() => {
                                  setViewedOrderId(ord.id);
                                  setCustomerTab('live_order');
                                }}
                                className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] rounded-lg border border-amber-200 cursor-pointer flex items-center gap-1"
                              >
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>تم التقييم ({ord.rating?.overallRating || 5})</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setViewedOrderId(ord.id);
                                  setCustomerTab('live_order');
                                }}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Star className="w-3 h-3 fill-white text-white" />
                                <span>قيّم المشوار الآن ⭐</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <button
                onClick={() => setIsStoreModalOpen(true)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>تثبيت التطبيق على جهازك أو Google Play</span>
              </button>

              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                تبديل الحساب / تسجيل الدخول
              </button>
            </div>
          )}
        </div>

        {/* Fixed Mobile Bottom Tab Bar */}
        <nav
          aria-label="شريط تنقل الزبون"
          className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-20 grid grid-cols-5 items-center px-2 select-none"
        >
          {[
            { id: 'home', label: 'الرئيسية', icon: '🏠' },
            { id: 'custom_delivery', label: 'مشوار طرد', icon: '📦' },
            {
              id: 'cart',
              label: 'السلة',
              icon: '🛍️',
              badge: cartSummary.itemCount > 0 ? cartSummary.itemCount : undefined,
            },
            { id: 'live_order', label: 'الطلبات', icon: '🛵' },
            { id: 'profile', label: 'حسابي', icon: '👤' },
          ].map((tab) => {
            const isActive = customerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCustomerTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
                }`}
              >
                <div className="relative">
                  <span className="text-lg leading-none">{tab.icon}</span>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Modal: Food Details & Customization */}
        {selectedFoodForModal && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 space-y-4 max-h-[85%] overflow-y-auto no-scrollbar shadow-2xl border-t border-slate-200 animate-slideUp text-right">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedFoodForModal.nameAr}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedFoodForModal.descriptionAr}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFoodForModal(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <img
                src={selectedFoodForModal.imageUrl}
                alt={selectedFoodForModal.nameAr}
                className="w-full h-40 object-cover rounded-2xl"
              />

              {/* Options & Addons */}
              {selectedFoodForModal.options?.map((optGroup) => (
                <div key={optGroup.nameAr} className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    {optGroup.nameAr}
                  </label>
                  <div className="space-y-1.5">
                    {optGroup.choices.map((choice) => {
                      const isChosen = selectedOptions.includes(choice.nameAr);
                      return (
                        <button
                          key={choice.nameAr}
                          type="button"
                          onClick={() => {
                            setSelectedOptions((prev) =>
                              prev.includes(choice.nameAr)
                                ? prev.filter((c) => c !== choice.nameAr)
                                : [...prev, choice.nameAr]
                            );
                          }}
                          className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isChosen
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{choice.nameAr}</span>
                          <span className="text-emerald-700">+{choice.extraPrice} ₪</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity and Add to Cart Button */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setFoodModalQuantity(Math.max(1, foodModalQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{foodModalQuantity}</span>
                  <button
                    onClick={() => setFoodModalQuantity(foodModalQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center hover:bg-emerald-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleConfirmAddToCart}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  إضافة للسلة • {selectedFoodForModal.price * foodModalQuantity} ₪
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Login / Splash */}
        {isLoginModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-right animate-fadeIn">
              <div className="bg-gradient-to-b from-emerald-800 to-emerald-700 p-6 text-center text-white relative">
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-4 left-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-20 h-20 mx-auto mb-2">
                  <img src={HERO_IMAGE} alt="سكوتر مشوار" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-black">مشـوار • Foodie</h3>
                <p className="text-xs text-emerald-100">نظام حمامة دلفري للمشاوير والوجبات</p>
              </div>

              <div className="p-5 space-y-3.5">
                <h4 className="text-base font-bold text-slate-900 text-center">
                  أهلاً بك مجدداً (Welcome Back)
                </h4>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    البريد الإلكتروني أو رقم الهاتف
                  </label>
                  <input
                    type="text"
                    defaultValue="shivam8902@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">كلمة المرور</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" />
                    <span>تذكرني</span>
                  </label>
                  <span className="text-emerald-700 font-semibold cursor-pointer">
                    نسيت كلمة المرور؟
                  </span>
                </div>

                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  تسجيل الدخول (Log In)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Customer Reviews & Detailed Rating Breakdown Modal */}
        {selectedRestaurantForReviews && (
          <RestaurantReviewsModal
            restaurant={selectedRestaurantForReviews}
            isOpen={!!selectedRestaurantForReviews}
            onClose={() => setSelectedRestaurantForReviews(null)}
          />
        )}
      </div>
    </div>
  );
};
