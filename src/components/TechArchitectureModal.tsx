import React from 'react';
import { X, Server, Database, Code, Smartphone, CheckCircle, Info } from 'lucide-react';
import { useMshwar } from '../context/MshwarContext';

export const TechArchitectureModal: React.FC = () => {
  const { isTechModalOpen, setIsTechModalOpen } = useMshwar();

  if (!isTechModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                تقرير التوافق التقني ومعمارية الربط مع PHP & MySQL
              </h2>
              <p className="text-xs text-slate-500">
                مشروع مشوار (Mshwar) - الواجهات الموحدة والربط مع الكود المصدري الخلفي
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTechModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice on Current Environment vs PHP/MySQL */}
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-sm flex gap-3">
          <Info className="w-5 h-5 shrink-0 text-emerald-700 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">توضيح تقني مهم بخصوص ملفات PHP & MySQL الحالية:</p>
            <p className="text-xs leading-relaxed text-emerald-900">
              هذه المعاينة التفاعلية تعمل حاليًا باستخدام <strong>React + TypeScript + Tailwind CSS</strong> داخل بيئة الويب السريعة لعرض جميع الواجهات الستة (الزبون، المطعم، الكابتن، الإدارة، الكاشير، وشاشة المطبخ KDS).
              كافة البيانات والتفاعلات هنا تعمل عبر <strong>محرك حالة تفاعلي واقعي (In-Memory Reactive State)</strong> متصل بالكامل، مما يتيح لك تجربة السيناريو الكامل للطلب من البداية وحتى التسليم دون الحاجة لتشغيل خادم Apache أو قاعدة بيانات MySQL محلية في متصفحك.
            </p>
          </div>
        </div>

        {/* Integration Blueprint */}
        <div className="mt-6 space-y-5">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            خريطة التوافق مع ملفات مشروع مشوار (PHP & MySQL):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Code className="w-4 h-4 text-emerald-600" />
                ملف API الخلفي: <code className="text-emerald-700">Mshwar/api/index.php</code>
              </div>
              <p className="text-slate-600 leading-relaxed">
                نقاط النهاية (REST Endpoints) المتطابقة:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><code>GET /api/restaurants</code> جلب المطاعم والتصنيفات</li>
                <li><code>GET /api/menu?restaurant_id=X</code> جلب الوجبات والأسعار</li>
                <li><code>POST /api/orders/create</code> إنشاء طلب جديد</li>
                <li><code>PATCH /api/orders/status</code> تحديث حالة الطلب</li>
                <li><code>GET /api/captain/active-orders</code> رادار الكابتن</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Database className="w-4 h-4 text-emerald-600" />
                جداول قاعدة البيانات: <code className="text-emerald-700">Mshwar/database/schema.sql</code>
              </div>
              <p className="text-slate-600 leading-relaxed">
                نماذج البيانات المستخدمة تطابق جداول SQL:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><code>users</code> (الزبائن، الكباتن، مدراء المطاعم)</li>
                <li><code>restaurants</code> (البيانات، الرسوم، التقييم)</li>
                <li><code>food_items</code> (الأسعار، السعرات، التوفر)</li>
                <li><code>orders</code> & <code>order_items</code> (تفاصيل الفاتورة)</li>
                <li><code>captain_wallets</code> (رصيد الكابتن والمشاوير)</li>
              </ul>
            </div>
          </div>

          {/* Android App & Portal compatibility */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              تكامل تطبيق الأندرويد (<code className="text-emerald-700">Mshwar/android/</code>) وبوابة الويب (<code className="text-emerald-700">portal.php</code>):
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تم تصميم هذه الواجهات بنظام موحد (Design Tokens) يعتمد درجات اللون الأخضر الزمردي الغني ومكونات بطاقات الوجبات العصرية المقتبسة من الفيديو المرجعي، بحيث يمكن تصديرها كواجهات ويب حديثة أو تحويلها إلى مكونات Jetpack Compose لتطبيق أندرويد بسهولة، مع بقاء الواجهة الخلفية PHP/MySQL كما هي دون أي تغيير على بنيتها.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
            <span className="font-bold">حالة النظام التفاعلي المباشر: </span>
            يمكنك الآن تجربة إضافة وجبات للسلة وتأكيد الطلب، وستشاهد الطلب يظهر فورًا في لوحة تحكم المطعم وشاشة الكاشير والمطبخ KDS، مع إمكانية تحريكه بواسطة الكابتن وتتبع خط سيره الحي!
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsTechModalOpen(false)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
          >
            فهمت، متابعة تجربة الواجهات
          </button>
        </div>
      </div>
    </div>
  );
};
