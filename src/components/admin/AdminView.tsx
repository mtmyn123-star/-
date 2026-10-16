import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Bike,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  BadgePercent,
  Receipt,
  FileCheck,
  Clock,
  ArrowDownLeft,
  BarChart3,
  Navigation,
  MapPin,
} from 'lucide-react';
import { useMshwar } from '../../context/MshwarContext';
import { AdminAnalyticsCharts } from './AdminAnalyticsCharts';
import { OrderLiveTrackingMap } from '../common/OrderLiveTrackingMap';

export const AdminView: React.FC = () => {
  const {
    orders,
    restaurants,
    captains,
    updateOrderStatus,
    settleCaptainDailyCommission,
    showToast,
  } = useMshwar();

  const [activeTab, setActiveTab] = useState<'analytics' | 'commission_ledger' | 'bidding_monitor' | 'orders_table' | 'live_map'>('analytics');
  const [selectedAdminMapOrderId, setSelectedAdminMapOrderId] = useState<string>(orders[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);

  // Calculate total daily platform commission from all captains
  const totalDailyDeliveryRevenue = captains.reduce((sum, c) => sum + c.dailyDeliveryRevenue, 0);
  const totalPlatformOwed = captains.reduce((sum, c) => sum + c.platformOwedAmount, 0);
  const totalSettledToday = captains
    .filter((c) => c.isCommissionSettledToday)
    .reduce((sum, c) => sum + c.platformOwedAmount, 0);
  const totalPendingSettlement = totalPlatformOwed - totalSettledToday;

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const biddingOrdersCount = orders.filter(
    (o) => o.status === 'bidding_open' && o.biddingStatus === 'open'
  ).length;

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.restaurantNameAr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-right">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">
              لوحة تحكم إدارة منصة مشوار (نظام حمامة دلفري)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              إحصائيات Recharts & إدارة العمولات
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة المشاوير اليومية للكباتن، حساب مبالغ التوصيل، واقتطاع نسبة المنصة الرسمية بدقة مع رسوم بيانية تفاعلية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
            <span className="text-[10px] text-emerald-800 font-bold block">
              إجمالي عمولات اليوم المستحقة
            </span>
            <span className="text-base font-black text-emerald-950">
              {totalPlatformOwed.toFixed(2)} ₪
            </span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-right">
            <span className="text-[10px] text-amber-800 font-bold block">معلق للتحصيل</span>
            <span className="text-base font-black text-amber-950">
              {totalPendingSettlement.toFixed(2)} ₪
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">إجمالي مبيعات التوصيل اليومي</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {totalDailyDeliveryRevenue.toFixed(2)} ₪
          </h3>
          <p className="text-[11px] text-emerald-700 font-bold">
            محصل بواسطة {captains.length} كباتن مسجلين
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">طلبات بمزاد العروض المفتوح</span>
            <BadgePercent className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{biddingOrdersCount}</h3>
          <p className="text-[11px] text-purple-700 font-bold">الكباتن يضعون عروض تسعيرة حية</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">الطلبات النشطة وقيد التوصيل</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{activeOrdersCount}</h3>
          <p className="text-[11px] text-blue-700 font-bold">من أصل {orders.length} طلب إجمالي</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">الكباتن المتصلون بالخدمة</span>
            <Bike className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {captains.filter((c) => c.isOnline).length} / {captains.length}
          </h3>
          <p className="text-[11px] text-emerald-700 font-bold">جاهزون لاستقبال الطلبات وبث العروض</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>الرسوم البيانية اليومية والأسبوعية (Recharts)</span>
        </button>

        <button
          onClick={() => setActiveTab('commission_ledger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'commission_ledger'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>كشف حساب الكباتن والنسبة اليومية (المطلوب تحصيله)</span>
        </button>

        <button
          onClick={() => setActiveTab('bidding_monitor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'bidding_monitor'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BadgePercent className="w-4 h-4" />
          <span>مراقبة مزاد عروض الأسعار ({biddingOrdersCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders_table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'orders_table'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>سجل كافة الطلبات ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live_map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'live_map'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>رادار الخريطة والتتبع المباشر (GPS)</span>
        </button>
      </div>

      {/* TAB 1: RECHARTS ANALYTICS CHARTS */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsCharts captains={captains} />
      )}

      {/* TAB 2: CAPTAIN DAILY COMMISSION & FINANCIAL SETTLEMENT */}
      {activeTab === 'commission_ledger' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                تفصيل دخل التوصيل اليومي للكباتن وحساب النسبة (Commission Settlement)
              </h3>
              <p className="text-xs text-slate-500">
                يوضح كم يملك كل كابتن من التوصيل اليومي، ونسبة المنصة المستحقة (15%)، وزر تسوية القبض.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">معيار النسبة:</span>
              <span className="font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                15% من قيمة كل مشوار
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="pb-3 pr-2">الكابتن</th>
                  <th className="pb-3">المركبة والهاتف</th>
                  <th className="pb-3 text-center">مشاوير اليوم</th>
                  <th className="pb-3">إجمالي دخل التوصيل</th>
                  <th className="pb-3">كاش وجبات باليد</th>
                  <th className="pb-3">نسبة المنصة</th>
                  <th className="pb-3 font-black text-emerald-900">حصة المنصة (لأخذ النسبة)</th>
                  <th className="pb-3">صافي ربح الكابتن</th>
                  <th className="pb-3">حالة القبض والتسوية</th>
                  <th className="pb-3 pl-2 text-left">إجراء الإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {captains.map((cap) => (
                  <tr key={cap.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                          {cap.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{cap.name}</span>
                          <span className="text-[11px] text-amber-600 font-bold">
                            ⭐ {cap.rating}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <span className="text-slate-800 font-semibold block">{cap.vehicle}</span>
                      <span className="text-[11px] text-slate-500">{cap.phone}</span>
                    </td>

                    <td className="py-4 text-center font-bold text-slate-900">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg">
                        {cap.dailyDeliveriesCount} مشاوير
                      </span>
                    </td>

                    <td className="py-4 font-black text-slate-900">
                      {cap.dailyDeliveryRevenue.toFixed(2)} ₪
                    </td>

                    <td className="py-4 font-bold text-slate-600">
                      {cap.dailyFoodCashCollected.toFixed(2)} ₪
                    </td>

                    <td className="py-4 text-slate-600 font-semibold">
                      {cap.commissionRatePercent}%
                    </td>

                    <td className="py-4 font-black text-base text-emerald-800">
                      {cap.platformOwedAmount.toFixed(2)} ₪
                    </td>

                    <td className="py-4 font-bold text-slate-700">
                      {(cap.dailyDeliveryRevenue - cap.platformOwedAmount).toFixed(2)} ₪
                    </td>

                    <td className="py-4">
                      {cap.isCommissionSettledToday ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>تم القبض والتسوية</span>
                          </span>
                          {cap.lastSettlementTime && (
                            <span className="text-[9px] text-slate-400 block">
                              {cap.lastSettlementTime}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <Clock className="w-3 h-3" />
                          <span>معلق بانتظار التحصيل</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 pl-2 text-left">
                      {cap.isCommissionSettledToday ? (
                        <span className="text-[11px] text-slate-400 font-medium">مكتمل اليوم ✓</span>
                      ) : (
                        <button
                          onClick={() => settleCaptainDailyCommission(cap.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          تحصيل النسبة ({cap.platformOwedAmount.toFixed(2)} ₪)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BIDDING MONITOR */}
      {activeTab === 'bidding_monitor' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                مراقبة مزاد عروض الأسعار والتنافس بين الكباتن (Live Bidding)
              </h3>
              <p className="text-xs text-slate-500">
                الطلبات المعروضة حالياً على رادار الكباتن والعروض المقدمة لكل طلب.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
              {biddingOrdersCount} طلبات في وضع المزاد
            </span>
          </div>

          <div className="space-y-4">
            {orders
              .filter((o) => o.status === 'bidding_open' || o.bids.length > 0)
              .map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {ord.restaurantNameAr}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-slate-600">
                        الزبون: {ord.customerName} ({ord.customerPhone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">حالة المزاد:</span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                          ord.biddingStatus === 'open'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ord.biddingStatus === 'open' ? 'مفتوح للعروض' : 'تم اختيار الكابتن'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800 mb-2">
                      العروض المقدمة من الكباتن ({ord.bids.length}):
                    </h5>
                    {ord.bids.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        تم بث الطلب للكباتن، وبانتظار تقديم العروض الأولى...
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ord.bids.map((b) => (
                          <div
                            key={b.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between ${
                              b.status === 'accepted'
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{b.captainName}</span>
                              <span className="text-sm font-black text-emerald-800">
                                {b.bidAmount} ₪
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1">
                              {b.captainVehicle} • زمن الوصول: {b.estimatedMinutes} د
                            </span>
                            {b.note && (
                              <p className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg mt-1.5">
                                "{b.note}"
                              </p>
                            )}
                            <div className="mt-2 pt-1 border-t border-slate-100 flex justify-between items-center text-[10px]">
                              <span className="text-slate-400">{b.createdAt}</span>
                              <span
                                className={`font-bold ${
                                  b.status === 'accepted' ? 'text-emerald-700' : 'text-slate-500'
                                }`}
                              >
                                {b.status === 'accepted' ? 'تم القبول ✓' : 'عرض معروض'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALL ORDERS TABLE */}
      {activeTab === 'orders_table' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">سجل كافة الطلبات والمشاوير</h3>
              <p className="text-xs text-slate-500">
                متابعة حركة الطلبات، الكباتن المكلفين، وتحديث الحالات.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث برقم الطلب أو الزبون..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="bidding_open">مزاد مفتوح</option>
                <option value="confirmed">مؤكد</option>
                <option value="preparing">قيد التحضير</option>
                <option value="ready_for_pickup">جاهز للتسليم</option>
                <option value="on_the_way">في الطريق</option>
                <option value="delivered">مكتمل ومسلّم</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-3 pr-2">رقم الطلب</th>
                  <th className="pb-3">الزبون</th>
                  <th className="pb-3">المطعم / الخدمة</th>
                  <th className="pb-3">أجرة التوصيل</th>
                  <th className="pb-3">الإجمالي</th>
                  <th className="pb-3">الكابتن</th>
                  <th className="pb-3">الحالة</th>
                  <th className="pb-3 pl-2 text-left">إجراء إداري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-2 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-500">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-800">{ord.restaurantNameAr}</td>
                    <td className="py-3.5 font-bold text-emerald-800">{ord.deliveryFee} ₪</td>
                    <td className="py-3.5 font-bold text-slate-900">{ord.total} ₪</td>
                    <td className="py-3.5 text-slate-700">
                      {ord.captainName || (
                        <span className="text-purple-600 font-bold">
                          {ord.bids.length > 0 ? `${ord.bids.length} عروض معروضة` : 'بانتظار كابتن'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'bidding_open'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.status === 'on_the_way'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'preparing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ord.status === 'bidding_open' && 'مزاد مفتوح'}
                        {ord.status === 'placed' && 'وارد جديد'}
                        {ord.status === 'confirmed' && 'مؤكد'}
                        {ord.status === 'preparing' && 'قيد التحضير'}
                        {ord.status === 'ready_for_pickup' && 'جاهز للتسليم'}
                        {ord.status === 'on_the_way' && 'في الطريق'}
                        {ord.status === 'delivered' && 'تم التسليم'}
                        {ord.status === 'cancelled' && 'ملغي'}
                      </span>
                    </td>
                    <td className="py-3.5 pl-2 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedAdminMapOrderId(ord.id);
                            setActiveTab('live_map');
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          title="عرض المسار على الخريطة"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </button>
                        {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            إكمال الطلب ✓
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE GPS RADAR MAP */}
      {activeTab === 'live_map' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>رادار تتبع العمليات والأسطول المباشر (Fleet GPS Radar)</span>
              </h3>
              <p className="text-xs text-slate-500">
                متابعة حركة الكباتن والطلبات الجارية لحظياً من المطاعم إلى منازل الزبائن بدقة عالية
              </p>
            </div>

            {/* Order Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
              <span className="text-xs text-slate-400 font-bold shrink-0">اختر طلباً للمراقبة:</span>
              {orders.map((ord) => {
                const isSelected =
                  ord.id === selectedAdminMapOrderId ||
                  (!selectedAdminMapOrderId && ord.id === orders[0]?.id);
                return (
                  <button
                    key={`admin-map-select-${ord.id}`}
                    onClick={() => setSelectedAdminMapOrderId(ord.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {ord.orderNumber} ({ord.restaurantNameAr.split(' ')[0]})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Interactive Tracking Map */}
          {(() => {
            const currentOrder =
              orders.find((o) => o.id === selectedAdminMapOrderId) || orders[0];
            if (!currentOrder) {
              return (
                <div className="p-8 text-center bg-white rounded-3xl text-slate-500 text-xs">
                  لا توجد طلبات للعرض
                </div>
              );
            }
            return <OrderLiveTrackingMap order={currentOrder} />;
          })()}
        </div>
      )}
    </div>
  );
};
