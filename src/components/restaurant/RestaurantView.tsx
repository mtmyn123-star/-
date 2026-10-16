import React, { useState } from 'react';
import {
  Store,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Utensils,
  Plus,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Bike,
} from 'lucide-react';
import { useMshwar } from '../../context/MshwarContext';

export const RestaurantView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    foodItems,
    toggleFoodAvailability,
    updateFoodPrice,
    restaurants,
  } = useMshwar();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');
  const restaurant = restaurants[0]; // Active restaurant: Burger Hunt
  const restaurantOrders = orders.filter((o) => o.restaurantId === restaurant.id);

  const pendingOrders = restaurantOrders.filter((o) => o.status === 'placed');
  const preparingOrders = restaurantOrders.filter(
    (o) => o.status === 'confirmed' || o.status === 'preparing'
  );
  const readyOrders = restaurantOrders.filter((o) => o.status === 'ready_for_pickup');
  const deliveredOrders = restaurantOrders.filter((o) => o.status === 'delivered');

  const todayRevenue = restaurantOrders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Restaurant Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={restaurant.logoUrl}
            alt={restaurant.nameAr}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{restaurant.nameAr}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                مفتوح لاستقبال الطلبات
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {restaurant.cuisineAr} • {restaurant.addressAr} • تقييم {restaurant.rating} ⭐
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-right">
            <span className="text-[11px] text-emerald-800 font-semibold block">مبيعات اليوم</span>
            <span className="text-base font-black text-emerald-900">{todayRevenue} ₪</span>
          </div>
          <div className="px-4 py-2.5 bg-slate-100 rounded-2xl text-right">
            <span className="text-[11px] text-slate-600 font-semibold block">طلبات نشطة</span>
            <span className="text-base font-black text-slate-900">
              {pendingOrders.length + preparingOrders.length + readyOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>الطلبات الحية ({pendingOrders.length + preparingOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>قائمة الطعام والأسعار</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>التقارير والمبيعات</span>
        </button>
      </div>

      {/* TAB: ORDERS PIPELINE */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Incoming / Pending Orders */}
          <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">طلبات واردة جديدة</h3>
              </div>
              <span className="text-xs font-black bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                {pendingOrders.length}
              </span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد طلبات جديدة حالياً
              </div>
            ) : (
              pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-900">#{ord.orderNumber}</span>
                    <span className="text-[11px] text-slate-500">{ord.createdAt}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{ord.customerName}</h4>
                    <p className="text-[11px] text-slate-500">{ord.customerPhone}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-700">
                        <span>
                          {it.quantity}x {it.foodItem.nameAr}
                        </span>
                        <span className="font-bold">{it.foodItem.price * it.quantity} ₪</span>
                      </div>
                    ))}
                  </div>
                  {ord.notes && (
                    <p className="text-[11px] bg-amber-50 p-2 rounded-lg text-amber-900 border border-amber-200">
                      ملاحظة: {ord.notes}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      قبول وتأكيد الطلب
                    </button>
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      اعتذار
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Column 2: In Preparation (Kitchen) */}
          <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="text-sm font-bold text-slate-900">قيد التحضير في المطبخ</h3>
              </div>
              <span className="text-xs font-black bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                {preparingOrders.length}
              </span>
            </div>

            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد طلبات قيد التحضير
              </div>
            ) : (
              preparingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-900">#{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                      مضى {Math.floor(ord.elapsedSeconds / 60)} دقيقة
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{ord.customerName}</h4>
                    <p className="text-[11px] text-slate-500">
                      {ord.items.map((i) => `${i.quantity}x ${i.foodItem.nameAr}`).join('، ')}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      جاهز للتسليم للكابتن ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Column 3: Ready for pickup / Out for delivery */}
          <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">جاهز للتسليم أو مع الكابتن</h3>
              </div>
              <span className="text-xs font-black bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700">
                {readyOrders.length}
              </span>
            </div>

            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد طلبات بانتظار الاستلام
              </div>
            ) : (
              readyOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-emerald-800">#{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                      جاهز للتسليم
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Bike className="w-4 h-4 text-emerald-700" />
                    <span>الكابتن: {ord.captainName || 'بانتظار قبول الكابتن'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    قيمة الطلب: <span className="font-bold text-slate-900">{ord.total} ₪</span> (
                    {ord.paymentMethod === 'cash' ? 'نقدي عند الاستلام' : 'مدفوع مسبقاً'})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">إدارة قائمة الطعام والتوفر</h3>
              <p className="text-xs text-slate-500">
                يمكنك إيقاف الوجبات المنتهية مؤقتاً أو تعديل أسعارها فورياً.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodItems.map((food) => (
              <div
                key={food.id}
                className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <img
                  src={food.imageUrl}
                  alt={food.nameAr}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 text-right">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{food.nameAr}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      defaultValue={food.price}
                      onBlur={(e) => updateFoodPrice(food.id, Number(e.target.value) || food.price)}
                      className="w-14 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-emerald-800"
                    />
                    <span className="text-xs text-slate-600 font-semibold">₪</span>
                  </div>
                </div>

                {/* Availability Toggle */}
                <button
                  onClick={() => toggleFoodAvailability(food.id)}
                  className={`p-1.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                    food.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                  title="تغيير حالة التوفر"
                >
                  <span className="text-[10px]">
                    {food.isAvailable ? 'متوفر ✓' : 'غير متوفر ✕'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">إجمالي الطلبات المستلمة</span>
            <h4 className="text-2xl font-black text-slate-900">{restaurantOrders.length}</h4>
            <p className="text-[11px] text-emerald-700">معدل الإنجاز 98%</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">متوسط زمن التجهيز بالمطبخ</span>
            <h4 className="text-2xl font-black text-slate-900">12 دقيقة</h4>
            <p className="text-[11px] text-emerald-700">أسرع بنسبة 15% من المتوسط</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">تقييم الزبائن العام</span>
            <h4 className="text-2xl font-black text-slate-900">{restaurant.rating} / 5.0</h4>
            <p className="text-[11px] text-amber-600">بناءً على 850 تقييم موثق</p>
          </div>
        </div>
      )}
    </div>
  );
};
