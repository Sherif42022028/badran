"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Send, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

export default function LocationContact() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: "success", text: data.message });
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setStatusMsg({ type: "error", text: data.error || "حدث خطأ أثناء الإرسال." });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-14 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-6 md:p-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="solid-badge text-xl mb-3">
            <MapPin className="w-5 h-5 text-[#C97A2B]" />
            <span>موقعنا وطرق التواصل</span>
          </span>
          <p className="font-tajawal text-sm md:text-base text-[#3A2416]/80 max-w-2xl mx-auto mt-2">
            يسعدنا تشريفكم في فرعنا بميت غمر أو التواصل السريع للطلبات والاستفسارات.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Branch Details Cards */}
          <div className="lg:col-span-5 space-y-4 font-tajawal">
            
            <div className="p-5 bg-[#FFF8F6] rounded border border-[#3A2416]/30 flex items-start gap-4">
              <div className="p-3 bg-[#3A2416] text-[#FFF8F6] rounded shrink-0">
                <MapPin className="w-6 h-6 text-[#C97A2B]" />
              </div>
              <div>
                <h4 className="font-lalezar text-lg text-[#3A2416]">عنوان المحل الرئيسي</h4>
                <p className="text-sm text-[#3A2416]/90 mt-1 leading-relaxed">
                  مدينة ميت غمر - محافظة الدقهلية - مصر
                </p>
                <span className="inline-block mt-2 text-xs text-[#5E604D] font-semibold">
                  (بجوار منطقة الخدمات الرئيسية والشارع الرئيسي)
                </span>
              </div>
            </div>

            <div className="p-5 bg-[#FFF8F6] rounded border border-[#3A2416]/30 flex items-start gap-4">
              <div className="p-3 bg-[#3A2416] text-[#FFF8F6] rounded shrink-0">
                <Phone className="w-6 h-6 text-[#C97A2B]" />
              </div>
              <div>
                <h4 className="font-lalezar text-lg text-[#3A2416]">أرقام الهاتف والطلب المباشر</h4>
                <p className="font-price font-bold text-lg text-[#6B2A22] mt-1">
                  01020499680
                </p>
                <div className="flex gap-2 mt-3">
                  <a
                    href="tel:01020499680"
                    className="px-3 py-1.5 bg-[#3A2416] text-[#FFF8F6] rounded text-xs font-semibold hover:bg-[#6B2A22] transition-colors"
                  >
                    اتصال هاتفي
                  </a>
                  <a
                    href="https://wa.me/201020499680"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-white rounded text-xs font-semibold hover:bg-[#1ebd59] transition-colors flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FFF8F6] rounded border border-[#3A2416]/30 flex items-start gap-4">
              <div className="p-3 bg-[#3A2416] text-[#FFF8F6] rounded shrink-0">
                <Clock className="w-6 h-6 text-[#C97A2B]" />
              </div>
              <div>
                <h4 className="font-lalezar text-lg text-[#3A2416]">مواعيد العمل</h4>
                <p className="text-sm text-[#3A2416]/90 mt-1 font-semibold text-[#6B2A22]">
                  شغالين 24 ساعة طوال أيام الأسبوع 🕒
                </p>
                <p className="text-xs text-[#5E604D] mt-1">
                  نستقبلكم ونجيب على اتصالاتكم وطلباتكم في أي وقت.
                </p>
              </div>
            </div>

          </div>

          {/* Contact & Feedback Form (Neon DB connected) */}
          <div className="lg:col-span-7 bg-[#FFF8F6] p-6 rounded border-2 border-[#3A2416] shadow-sm font-tajawal">
            <h4 className="font-lalezar text-xl text-[#3A2416] mb-2">
              أرسل لنا ملاحظة أو استفسار
            </h4>
            <p className="text-xs text-[#3A2416]/80 mb-6 border-b border-dashed border-[#3A2416]/30 pb-3">
              يسعدنا استقبال مقترحاتكم وطلباتكم الخاصة عبر هذا النموذج (يتم حفظ البيانات بأمان).
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3A2416] mb-1">
                  الاسم الكريم: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك هنا..."
                  className="w-full p-2.5 bg-[#F3ECDD] border border-[#3A2416] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2A22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2416] mb-1">
                  رقم الهاتف / الواتساب: *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010XXXXXXXX"
                  className="w-full p-2.5 bg-[#F3ECDD] border border-[#3A2416] rounded text-xs font-price focus:outline-none focus:ring-1 focus:ring-[#6B2A22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2416] mb-1">
                  الرسالة أو طلبك الخاص: *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب ملاحظاتك، استفساراتك، أو تفاصيل الطلب الذي ترغب به..."
                  className="w-full p-2.5 bg-[#F3ECDD] border border-[#3A2416] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#6B2A22]"
                />
              </div>

              {statusMsg && (
                <div
                  className={`p-3 rounded text-xs flex items-center gap-2 ${
                    statusMsg.type === "success"
                      ? "bg-green-100 text-green-900 border border-green-300"
                      : "bg-red-100 text-red-900 border border-red-300"
                  }`}
                >
                  {statusMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A2416] hover:bg-[#6B2A22] text-white font-lalezar text-base py-3 rounded border border-[#3A2416] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#C97A2B]" />
                <span>{loading ? "جارٍ الإرسال..." : "إرسال الرسالة الآن"}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
