import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Printer,
  Trash2,
  Plus,
  Minus,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  CheckCircle,
  X,
} from 'lucide-react';
import { useMshwar } from '../../context/MshwarContext';
import { FoodItem, Order } from '../../types';
import { calculateCashChange } from '../../utils/mshwarLogic';

export const CashierView: React.FC = () => {
  const {
    foodItems,
    cashierCart,
    cashierAddToCart,
    cashierRemoveFromCart,
    cashierClearCart,
    cashierSubmitOrder,
  } = useMshwar();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [cashGiven, setCashGiven] = useState<number>(100);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);

  const subtotal = cashierCart.reduce((acc, i) => acc + i.foodItem.price * i.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 5 : 0;
  const total = subtotal + deliveryFee;

  const changeResult = calculateCashChange(total, cashGiven);

  const filteredFoods = foodItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleCompleteOrder = () => {
    if (cashierCart.length === 0) return;
    const ord = cashierSubmitOrder(orderType, paymentMethod, cashGiven);
    setLastSubmittedOrder(ord);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-right space-y-6">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900">
              نظام نقطة البيع السريع (Cashier POS)
            </h1>
            <p className="text-xs text-slate-500">
              كاشير مطعم برجر هانت • وردية الصباح • الكاشير: أحمد سعيد
            </p>
          </div>
        </div>

        {/* Order Type Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setOrderType('dine_in')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              orderType === 'dine_in' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>صالة (طاولة)</span>
          </button>
          <button
            onClick={() => setOrderType('takeaway')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              orderType === 'takeaway' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>سفري (تيك أواي)</span>
          </button>
          <button
            onClick={() => setOrderType('delivery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              orderType === 'delivery' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>توصيل مشوار</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Quick Food Selection Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', nameAr: 'الكل' },
              { id: 'burger', nameAr: 'برجر' },
              { id: 'pizza', nameAr: 'بيتزا' },
              { id: 'chicken', nameAr: 'دجاج' },
              { id: 'sushi', nameAr: 'سوشي' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.nameAr}
              </button>
            ))}
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => cashierAddToCart(food)}
                className="p-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl shadow-2xs hover:shadow-md transition-all text-right flex flex-col justify-between h-40 cursor-pointer group"
              >
                <div className="relative w-full h-20 mb-2 overflow-hidden rounded-xl">
                  <img
                    src={food.imageUrl}
                    alt={food.nameAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-900/80 text-white text-[10px] font-bold">
                    {food.price} ₪
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{food.nameAr}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {food.calories} كالوري • {food.prepTimeMinutes} د
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): Live POS Ticket & Payment */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">فاتورة الطلب الحالي</h3>
                <span className="text-[11px] text-slate-400">
                  {orderType === 'dine_in' ? 'طاولة رقم 4' : orderType === 'takeaway' ? 'استلام كاونتر' : 'طلب توصيل'}
                </span>
              </div>
              {cashierCart.length > 0 && (
                <button
                  onClick={cashierClearCart}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تفريغ</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cashierCart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                انقر على الوجبات في الشبكة لإضافتها للفاتورة مباشرة.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                {cashierCart.map((item) => (
                  <div
                    key={item.foodItem.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-bold text-slate-800 truncate block">
                        {item.foodItem.nameAr}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {item.foodItem.price} ₪ × {item.quantity} = {item.foodItem.price * item.quantity} ₪
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => cashierRemoveFromCart(item.foodItem.id)}
                        className="w-5 h-5 rounded bg-white text-slate-600 flex items-center justify-center hover:bg-rose-100 hover:text-rose-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cashierAddToCart(item.foodItem)}
                        className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Checkout Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>المجموع</span>
                <span className="font-bold">{subtotal} ₪</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>رسوم التوصيل</span>
                  <span className="font-bold">{deliveryFee} ₪</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                <span>الإجمالي المطلوب</span>
                <span className="text-emerald-800 text-base">{total} ₪</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                نقدي
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                بطاقة بنكية
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                محفظة
              </button>
            </div>

            {/* Cash Calculator if cash chosen */}
            {paymentMethod === 'cash' && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">المبلغ المستلم من الزبون:</span>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold text-slate-900"
                  />
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">الباقي للزبون:</span>
                  <span
                    className={changeResult.isValid ? 'text-emerald-700' : 'text-rose-600'}
                  >
                    {changeResult.isValid ? `${changeResult.change} ₪` : 'المبلغ المدفوع غير كافٍ'}
                  </span>
                </div>
              </div>
            )}

            {/* Complete & Send to Kitchen Button */}
            <button
              disabled={cashierCart.length === 0 || (paymentMethod === 'cash' && !changeResult.isValid)}
              onClick={handleCompleteOrder}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>إصدار الفاتورة وإرسالها للمطبخ (KDS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {lastSubmittedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h3 className="text-base font-black text-slate-900">مشـوار • برجر هانت</h3>
              <p className="text-[11px] text-slate-500">فاتورة ضريبية مبسطة</p>
              <p className="text-xs font-mono font-bold mt-1">#{lastSubmittedOrder.orderNumber}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              {lastSubmittedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.quantity}x {it.foodItem.nameAr}
                  </span>
                  <span className="font-bold">{it.foodItem.price * it.quantity} ₪</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dashed border-slate-300 space-y-1 text-xs">
              <div className="flex justify-between font-black text-slate-900 text-sm">
                <span>الإجمالي</span>
                <span className="text-emerald-800">{lastSubmittedOrder.total} ₪</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>طريقة الدفع</span>
                <span>{lastSubmittedOrder.paymentMethod === 'cash' ? 'نقدي' : 'إلكتروني'}</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl text-center text-xs text-emerald-800 font-bold">
              ✓ تم إرسال الطلب فوراً إلى شاشة المطبخ KDS
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setLastSubmittedOrder(null)}
                className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                إغلاق وطلب جديد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
