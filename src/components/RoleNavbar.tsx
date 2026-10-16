import React from 'react';
import {
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  CreditCard,
  ChefHat,
  Smartphone,
  Monitor,
  Database,
  Download,
  Share2,
} from 'lucide-react';
import { useMshwar } from '../context/MshwarContext';
import { AppRole } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const RoleNavbar: React.FC = () => {
  const {
    role,
    setRole,
    isMobileSimulator,
    setIsMobileSimulator,
    setIsTechModalOpen,
    setIsStoreModalOpen,
    orders,
    cartSummary,
  } = useMshwar();

  const { isInstallable, install } = usePWAInstall();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const biddingOrdersCount = orders.filter(
    (o) => o.status === 'bidding_open' && o.biddingStatus === 'open'
  ).length;

  const rolesConfig: { id: AppRole; titleAr: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'customer',
      titleAr: 'تطبيق الزبون',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: cartSummary.itemCount > 0 ? cartSummary.itemCount : undefined,
    },
    {
      id: 'captain',
      titleAr: 'تطبيق الكابتن (العروض)',
      icon: <Bike className="w-4 h-4" />,
      badge: biddingOrdersCount > 0 ? biddingOrdersCount : undefined,
    },
    {
      id: 'restaurant',
      titleAr: 'بوابة المطعم',
      icon: <Store className="w-4 h-4" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'admin',
      titleAr: 'لوحة الإدارة والنسبة',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'cashier',
      titleAr: 'نقطة البيع (POS)',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: 'kds',
      titleAr: 'شاشة المطبخ (KDS)',
      icon: <ChefHat className="w-4 h-4" />,
      badge: orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing').length || undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Wordmark & Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-700/20">
              <span className="font-extrabold text-lg">مـ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">مشـوار</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  نظام حمامة دلفري
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden xl:block">
                مزاد عروض الكباتن • تحصيل النسبة اليومية • جاهز لـ Google Play & Chrome
              </p>
            </div>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <nav
            aria-label="اختيار واجهة النظام"
            className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl overflow-x-auto no-scrollbar max-w-[50%]"
          >
            {rolesConfig.map((item) => {
              const isActive = role === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.titleAr}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-white text-emerald-800'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Google Play button + Architecture + Simulator */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google Play & Chrome Store Setup Modal Trigger */}
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              title="دليل الرفع على Google Play ومتجر كروم"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">رفع لـ Google Play & Chrome</span>
            </button>

            {/* Direct 1-Click PWA install if available in browser */}
            {isInstallable && (
              <button
                onClick={install}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-colors cursor-pointer"
                title="تثبيت التطبيق مباشرة على جهازك"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت PWA</span>
              </button>
            )}

            {/* Mobile / Desktop frame toggle */}
            {(role === 'customer' || role === 'captain') && (
              <button
                onClick={() => setIsMobileSimulator(!isMobileSimulator)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                title="تبديل وضع العرض بين إطار الهاتف والشاشة الكاملة"
              >
                {isMobileSimulator ? (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden md:inline">سطح المكتب</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden md:inline">إطار الهاتف</span>
                  </>
                )}
              </button>
            )}

            {/* Architecture alignment button */}
            <button
              onClick={() => setIsTechModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="معمارية الربط مع PHP و MySQL"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">PHP & MySQL</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
