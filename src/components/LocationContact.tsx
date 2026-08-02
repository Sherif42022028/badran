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
    <section id="contact" className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-8 md:p-14">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="solid-badge text-base md:text-lg mb-3">
            <MapPin className="w-4 h-4 text-[#C89B3C]" />
            <span>موقع الفرع ووسائل التواصل</span>
          </span>
          <p className="font-alexandria text-xs md:text-sm text-[#1E110A]/75 max-w-2xl mx-auto mt-3 font-light">
            يسعدنا تشريفكم في فرعنا بميت غمر أو التواصل السريع للطلبات والاستفسارات الخاصة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Branch Details Cards */}
          <div className="lg:col-span-5 space-y-4 font-alexandria">
            
            <div className="p-5 bg-white rounded-xl border border-[#C89B3C]/30 flex items-start gap-4 shadow-xs">
              <div className="p-3 bg-[#1E110A] text-[#C89B3C] rounded-lg shrink-0 border border-[#C89B3C]/40">
                <MapPin className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <div>
                <h4 className="font-amiri text-xl font-bold text-[#1E110A]">عنوان الفرع الرئيسي</h4>
                <p className="text-xs text-[#1E110A]/85 mt-1 leading-relaxed">
                  مدينة ميت غمر - محافظة الدقهلية - مصر
                </p>
                <span className="inline-block mt-2 text-[11px] text-[#6B5B52] font-medium">
                  (بن بدران - الشارع الرئيسي)
                </span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#C89B3C]/30 flex items-start gap-4 shadow-xs">
              <div className="p-3 bg-[#1E110A] text-[#C89B3C] rounded-lg shrink-0 border border-[#C89B3C]/40">
                <Phone className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <div>
                <h4 className="font-amiri text-xl font-bold text-[#1E110A]">أرقام الهاتف والطلب المباشر</h4>
                <p className="font-price font-bold text-xl text-[#C89B3C] mt-1">
                  01020499680
                </p>
                <div className="flex gap-2 mt-3">
                  <a
                    href="tel:01020499680"
                    className="px-3.5 py-1.5 bg-[#1E110A] text-[#FAF7F2] rounded-full text-xs font-bold hover:bg-[#4A1510] transition-colors"
                  >
                    اتصال هاتفي
                  </a>
                  <a
                    href="https://wa.me/201020499680"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] text-white rounded-full text-xs font-bold hover:bg-[#1ebd59] transition-colors flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#C89B3C]/30 flex items-start gap-4 shadow-xs">
              <div className="p-3 bg-[#1E110A] text-[#C89B3C] rounded-lg shrink-0 border border-[#C89B3C]/40">
                <Clock className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <div>
                <h4 className="font-amiri text-xl font-bold text-[#1E110A]">مواعيد العمل</h4>
                <p className="text-xs text-[#C89B3C] mt-1 font-bold">
                  شغالين 24 ساعة طوال أيام الأسبوع 🕒
                </p>
                <p className="text-[11px] text-[#6B5B52] mt-1">
                  نستقبلكم ونجيب على اتصالاتكم في أي وقت.
                </p>
              </div>
            </div>

          </div>

          {/* Contact & Feedback Form */}
          <div className="lg:col-span-7 bg-white p-7 rounded-2xl border-2 border-[#C89B3C]/40 shadow-sm font-alexandria">
            <h4 className="font-amiri text-2xl text-[#1E110A] mb-1">
              أرسل لنا ملاحظة أو استفسار
            </h4>
            <p className="text-xs text-[#1E110A]/70 mb-6 border-b border-dashed border-[#C89B3C]/30 pb-3">
              يسعدنا استقبال ملاحظاتكم وطلباتكم الخاصة عبر هذا النموذج (يتم الحفظ في قاعدة البيانات).
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E110A] mb-1.5">
                  الاسم الكريم: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك هنا..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#C89B3C]/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E110A] mb-1.5">
                  رقم الهاتف / الواتساب: *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010XXXXXXXX"
                  className="w-full p-3 bg-[#FAF7F2] border border-[#C89B3C]/30 rounded-xl text-xs font-price focus:outline-none focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E110A] mb-1.5">
                  الرسالة أو طلبك الخاص: *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب ملاحظاتك، استفساراتك، أو تفاصيل الطلب الذي ترغب به..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#C89B3C]/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              {statusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    statusMsg.type === "success"
                      ? "bg-green-50 text-green-900 border border-green-200"
                      : "bg-red-50 text-red-900 border border-red-200"
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
                className="w-full bg-[#1E110A] hover:bg-[#321E14] text-[#FAF7F2] font-alexandria font-bold text-sm py-3.5 rounded-full border border-[#C89B3C]/40 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#C89B3C]" />
                <span>{loading ? "جارٍ الإرسال..." : "إرسال الرسالة الآن"}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Embedded Google Maps Container */}
        <div className="mt-12">
          <div className="text-center mb-4">
            <h4 className="font-amiri text-2xl font-bold text-[#1E110A]">
              موقع الفرع التفاعلي على خريطة جوجل
            </h4>
            <p className="font-alexandria text-xs text-[#1E110A]/70 mt-1">
              يمكنك تكبير الخريطة والوصول مباشرة عبر اتجاهات الملاحة إلى محل بن بدران بميت غمر.
            </p>
          </div>

          <div className="border-2 border-[#C89B3C]/40 rounded-2xl overflow-hidden shadow-lg bg-white p-2">
            <div className="relative w-full h-[380px] rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.056646202436!2d31.25960087527777!3d30.716807886402545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7c1c05bf53d5d%3A0xa89763a2cdde0a36!2z2KjZhiDYqNiv2LHYp9mG!5e0!3m2!1sen!2seg!4v1785685705668!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="موقع بن بدران على خريطة جوجل"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
