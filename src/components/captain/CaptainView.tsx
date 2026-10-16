import React, { useState } from 'react';
import {
  Bike,
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  Wallet,
  Shield,
  ArrowRight,
  TrendingUp,
  Send,
  DollarSign,
  Package,
  Layers,
  ArrowDownLeft,
  ChevronLeft,
} from 'lucide-react';
import { useMshwar } from '../../context/MshwarContext';
import { CaptainWallet } from './CaptainWallet';
import { OrderLiveTrackingMap } from '../common/OrderLiveTrackingMap';

export const CaptainView: React.FC = () => {
  const {
    activeCaptain,
    toggleCaptainOnline,
    orders,
    submitCaptainBid,
    captainUpdateDeliveryStep,
    isMobileSimulator,
  } = useMshwar();

  const [captainTab, setCaptainTab] = useState<'deliveries' | 'wallet'>('deliveries');
  const [bidAmountInput, setBidAmountInput] = useState<number>(10);
  const [estimatedMinutesInput, setEstimatedMinutesInput] = useState<number>(15);
  const [captainBidNote, setCaptainBidNote] = useState<string>('مستعد للاستلام فوراً، قريب من الموقع');

  // Find order currently assigned to this captain in active transit
  const assignedOrder = orders.find(
    (o) =>
      o.captainId === activeCaptain.id &&
      (o.status === 'ready_for_pickup' || o.status === 'on_the_way' || (o.status === 'confirmed' && o.biddingStatus === 'closed'))
  );

  // Orders currently broadcasting in bidding mode or looking for offers
  const openBiddingOrders = orders.filter(
    (o) => o.status === 'bidding_open' && o.biddingStatus === 'open'
  );

  return (
    <div className={`w-full ${isMobileSimulator ? 'py-6 px-4 flex justify-center bg-slate-900/10 min-h-[calc(100vh-4rem)]' : 'max-w-4xl mx-auto px-4 py-6'}`}>
      <div
        className={`bg-white transition-all duration-300 relative ${
          isMobileSimulator
            ? 'w-[390px] min-h-[844px] rounded-[48px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col ring-1 ring-slate-800/20'
            : 'w-full rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col p-6'
        }`}
      >
        {/* Dynamic Island in simulator */}
        {isMobileSimulator && (
          <div className="h-7 w-full flex items-center justify-between px-7 text-[12px] font-semibold text-slate-800 select-none">
            <span>10:20</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
            <span>5G 98%</span>
          </div>
        )}

        {/* Captain Top Header */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm ring-2 ring-emerald-300">
              <Bike className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{activeCaptain.name}</h3>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                  ⭐ {activeCaptain.rating} ({activeCaptain.ratingsCount || 48})
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {activeCaptain.vehicle} • سرعة التوصيل: {activeCaptain.deliverySpeedAvg || 4.9} ⭐
              </p>
            </div>
          </div>

          {/* Online / Offline Toggle */}
          <button
            onClick={toggleCaptainOnline}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCaptain.isOnline
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeCaptain.isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{activeCaptain.isOnline ? 'متصل للعمل' : 'غير متصل'}</span>
          </button>
        </div>

        {/* Tab Switcher: Radar & Deliveries vs Digital Wallet */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setCaptainTab('deliveries')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              captainTab === 'deliveries'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-4 h-4 text-emerald-600" />
            <span>المشاوير والرادار</span>
            {assignedOrder ? (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            ) : openBiddingOrders.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {openBiddingOrders.length}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setCaptainTab('wallet')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              captainTab === 'wallet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>المحفظة الرقمية</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-mono font-black">
              {activeCaptain.walletBalance.toFixed(0)} ₪
            </span>
          </button>
        </div>

        {/* TAB 1: DIGITAL WALLET */}
        {captainTab === 'wallet' ? (
          <div className="mt-4">
            <CaptainWallet />
          </div>
        ) : (
          /* TAB 2: DELIVERIES & RADAR */
          <>
            {/* Quick Summary Strip linking to Digital Wallet */}
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-right">
              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={() => setCaptainTab('wallet')}
                  className="font-bold text-slate-900 flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>كشف حساب الكابتن ومحفظة الأرباح</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      activeCaptain.isCommissionSettledToday
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeCaptain.isCommissionSettledToday ? 'تمت تسوية النسبة ✓' : 'نسبة اليوم معلقة'}
                  </span>
                  <button
                    onClick={() => setCaptainTab('wallet')}
                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ArrowDownLeft className="w-2.5 h-2.5" />
                    <span>سحب</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-200">
                <div
                  onClick={() => setCaptainTab('wallet')}
                  className="p-2 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <span className="text-[10px] text-slate-400 block font-semibold">دخل التوصيل</span>
                  <span className="font-black text-slate-900 text-sm">
                    {activeCaptain.dailyDeliveryRevenue.toFixed(1)} ₪
                  </span>
                </div>
                <div
                  onClick={() => setCaptainTab('wallet')}
                  className="p-2 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    نسبة المنصة ({activeCaptain.commissionRatePercent}%)
                  </span>
                  <span className="font-black text-emerald-800 text-sm">
                    {activeCaptain.platformOwedAmount.toFixed(1)} ₪
                  </span>
                </div>
                <div
                  onClick={() => setCaptainTab('wallet')}
                  className="p-2 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <span className="text-[10px] text-slate-400 block font-semibold">رصيد السحب</span>
                  <span className="font-black text-emerald-700 text-sm font-mono">
                    {activeCaptain.walletBalance.toFixed(1)} ₪
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIVE ASSIGNED ORDER IN TRANSIT */}
            {assignedOrder ? (
          <div className="mt-5 p-4 rounded-3xl bg-white border-2 border-emerald-600 shadow-md space-y-4 text-right">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                مشوار توصيل قيد التنفيذ #{assignedOrder.orderNumber}
              </span>
              <span className="text-xs font-black text-emerald-800">
                أجرتك: {assignedOrder.deliveryFee} ₪
              </span>
            </div>

            {/* Restaurant pickup details */}
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold">1. الاستلام من:</span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  {assignedOrder.status === 'ready_for_pickup' ? 'جاهز للاستلام ✓' : 'قيد التحضير'}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900">{assignedOrder.restaurantNameAr}</h4>
              <p className="text-[11px] text-slate-500">
                {assignedOrder.pickupAddress || 'شارع عمر المختار، غزة'}
              </p>
            </div>

            {/* Customer Drop-off details */}
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 font-bold">2. التسليم للزبون:</span>
              <h4 className="text-xs font-black text-slate-900">{assignedOrder.customerName}</h4>
              <p className="text-[11px] text-slate-600">{assignedOrder.customerAddress}</p>
              <div className="text-[11px] text-emerald-800 font-bold pt-1">
                المبلغ المطلوب تحصيله من الزبون:{' '}
                {assignedOrder.paymentMethod === 'cash'
                  ? `${assignedOrder.total} ₪ (نقدي)`
                  : 'مدفوع مسبقاً (0 ₪)'}
              </div>
            </div>

            {/* Interactive Live Navigation Route Map */}
            <div className="w-full">
              <OrderLiveTrackingMap order={assignedOrder} captain={activeCaptain} compact={true} />
            </div>

            {/* Action Buttons for driver */}
            <div className="space-y-2 pt-2">
              {assignedOrder.status === 'ready_for_pickup' ? (
                <button
                  onClick={() => captainUpdateDeliveryStep(assignedOrder.id, 'pickup')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  وصلت للمطعم واستلمت الطلب ✓
                </button>
              ) : (
                <button
                  onClick={() => captainUpdateDeliveryStep(assignedOrder.id, 'deliver')}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  تم تسليم الطلب للزبون وتحصيل المبلغ ✓
                </button>
              )}

              <a
                href={`tel:${assignedOrder.customerPhone}`}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>الاتصال بالزبون ({assignedOrder.customerPhone})</span>
              </a>
            </div>
          </div>
        ) : (
          /* RADAR OF BROADCAST ORDERS (HAMAMA DELIVERY BIDDING SYSTEM) */
          <div className="mt-5 space-y-4 text-right">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>رادار المشاوير المتاحة وتقديم عروض الأسعار</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  تظهر هنا طلبات الزبائن فورياً، ضع تسعيرتك وزمن وصولك للتنافس وقبول المشوار.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                {openBiddingOrders.length} طلبات بث
              </span>
            </div>

            {!activeCaptain.isOnline ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                أنت في وضع غير متصل. اضغط على «متصل للعمل» في الأعلى لاستقبال بث طلبات الزبائن.
              </div>
            ) : openBiddingOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl space-y-2">
                <Bike className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">لا توجد طلبات بث نشطة حالياً</p>
                <p className="text-[11px] text-slate-400">
                  جاري فحص الطلبات في غزة ومحيطك... بمجرد أن يطلب زبون وجبة أو طرداً ستصلك فوراً!
                </p>
              </div>
            ) : (
              openBiddingOrders.map((ord) => {
                const myExistingBid = ord.bids.find((b) => b.captainId === activeCaptain.id);

                return (
                  <div
                    key={ord.id}
                    className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-emerald-400 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-mono font-black text-slate-900 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">{ord.createdAt}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-800 font-bold rounded-lg text-[11px]">
                        {ord.bids.length} كباتن قدموا عروضاً
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">نقطة الاستلام:</span>
                        <span className="font-bold text-slate-800">
                          {ord.pickupAddress || ord.restaurantNameAr}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">عنوان الزبون:</span>
                        <span className="font-bold text-slate-800">{ord.customerAddress}</span>
                      </div>
                      {ord.packageDescription && (
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-900 text-[11px] border border-amber-200">
                          وصف الطرد: {ord.packageDescription}
                        </div>
                      )}
                      {ord.items.length > 0 && (
                        <div className="text-[11px] text-slate-500 truncate">
                          الوجبات:{' '}
                          {ord.items.map((i) => `${i.quantity}x ${i.foodItem.nameAr}`).join('، ')}
                        </div>
                      )}
                    </div>

                    {/* Captain Bidding Action Box (Like Hamama Delivery) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {myExistingBid ? 'عرض السعر الذي أرسلته:' : 'ضع تسعيرة التوصيل التي تناسبك:'}
                        </span>
                        {myExistingBid && (
                          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            أرسلت {myExistingBid.bidAmount} ₪ (بانتظار موافقة الزبون)
                          </span>
                        )}
                      </div>

                      {/* Quick Bid Amount Buttons */}
                      <div className="flex items-center gap-2">
                        {[8, 10, 12, 15].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setBidAmountInput(amt)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              bidAmountInput === amt
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {amt} ₪
                          </button>
                        ))}
                        <div className="flex items-center gap-1 w-20">
                          <input
                            type="number"
                            value={bidAmountInput}
                            onChange={(e) => setBidAmountInput(Number(e.target.value) || 10)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Quick Arrival Time Selector */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">زمن الوصول المقدر:</span>
                        <div className="flex items-center gap-1.5">
                          {[10, 15, 20].map((mins) => (
                            <button
                              key={mins}
                              onClick={() => setEstimatedMinutesInput(mins)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                                estimatedMinutesInput === mins
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {mins} دقيقة
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit Bid Button */}
                      <button
                        onClick={() =>
                          submitCaptainBid(
                            ord.id,
                            bidAmountInput,
                            estimatedMinutesInput,
                            captainBidNote
                          )
                        }
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {myExistingBid
                            ? `تحديث عرض السعر إلى (${bidAmountInput} ₪)`
                            : `إرسال عرض التوصيل للزبون (${bidAmountInput} ₪)`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

