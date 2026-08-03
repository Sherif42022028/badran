"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Send, MessageCircle, CheckCircle2, AlertCircle, Navigation } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";
import { GOOGLE_MAPS_URL, PHONE_DISPLAY, PHONE_TEL_LINK, WHATSAPP_LINK } from "@/lib/constants";

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
    <section id="contact" className="py-4 md:py-8 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10">
        
        {/* Title */}
        <div className="text-center mb-6">
          <span className="solid-badge text-xs md:text-sm mb-2 py-1 px-3">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>موقع الفرع ووسائل التواصل</span>
          </span>
          <p className="font-alexandria text-xs md:text-sm text-[#1A110A]/75 max-w-2xl mx-auto mt-2 font-light">
            يسعدنا تشريفكم في فرعنا بميت غمر أو التواصل السريع للطلبات والاستفسارات الخاصة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Branch Details Cards */}
          <div className="lg:col-span-5 space-y-3 font-alexandria">
            
            <div className="p-4 bg-white rounded-xl border border-[#1A110A]/15 flex items-start gap-3.5 shadow-xs">
              <div className="p-2.5 bg-[#1A110A] text-[#C5A059] rounded-lg shrink-0 border border-[#C5A059]/30">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div>
                <h4 className="font-amiri text-lg font-bold text-[#1A110A]">العنوان الدقيق (Google Maps)</h4>
                <p className="text-xs text-[#1A110A]/90 mt-1 font-mono leading-relaxed bg-[#FAF8F5] p-2 rounded border border-[#1A110A]/10 dir-ltr text-right">
                  P786+PVF, Madinet Mit Ghamr (Include Daqados), Mit Ghamr, Dakahlia Governorate 7511463
                </p>
                <div className="mt-2.5">
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C5A059] text-white rounded-lg text-xs font-bold hover:bg-[#B08B46] transition-all shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>احصل على الاتجاهات</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#1A110A]/15 flex items-start gap-3.5 shadow-xs">
              <div className="p-2.5 bg-[#1A110A] text-[#C5A059] rounded-lg shrink-0 border border-[#C5A059]/30">
                <Phone className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div>
                <h4 className="font-amiri text-lg font-bold text-[#1A110A]">أرقام الهاتف والطلب المباشر</h4>
                <p className="font-price font-bold text-lg text-[#C5A059] mt-0.5">
                  {PHONE_DISPLAY}
                </p>
                <div className="flex gap-2 mt-2">
                  <a
                    href={PHONE_TEL_LINK}
                    onClick={() => trackContactClick('call')}
                    className="px-3.5 py-1.5 bg-[#1A110A] text-[#FAF8F5] rounded-lg text-xs font-bold hover:bg-[#2A1D15] transition-colors flex items-center gap-1.5"
                  >
                    <span>📞 اتصل الآن</span>
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    onClick={() => trackContactClick('whatsapp')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#1ebd59] transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#1A110A]/15 flex items-start gap-3.5 shadow-xs">
              <div className="p-2.5 bg-[#1A110A] text-[#C5A059] rounded-lg shrink-0 border border-[#C5A059]/30">
                <Clock className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div>
                <h4 className="font-amiri text-lg font-bold text-[#1A110A]">مواعيد العمل</h4>
                <p className="text-xs text-[#C5A059] mt-0.5 font-bold">
                  شغالين 24 ساعة طوال أيام الأسبوع 🕒
                </p>
                <p className="text-[11px] text-[#66584F] mt-0.5">
                  نستقبلكم ونجيب على اتصالاتكم في أي وقت.
                </p>
              </div>
            </div>

          </div>

          {/* Contact & Feedback Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#1A110A]/15 shadow-xs font-alexandria">
            <h4 className="font-amiri text-xl text-[#1A110A] mb-1">
              أرسل لنا ملاحظة أو استفسار
            </h4>
            <p className="text-xs text-[#1A110A]/70 mb-4 border-b border-dashed border-[#C5A059]/30 pb-2.5">
              يسعدنا استقبال ملاحظاتكم وطلباتكم الخاصة عبر هذا النموذج.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1A110A] mb-1">
                  الاسم الكريم: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك هنا..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#1A110A]/20 rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A110A] mb-1">
                  رقم الهاتف / الواتساب: *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010XXXXXXXX"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#1A110A]/20 rounded-lg text-xs font-price focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A110A] mb-1">
                  الرسالة أو طلبك الخاص: *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب ملاحظاتك، استفساراتك، أو تفاصيل الطلب الذي ترغب به..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#1A110A]/20 rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {statusMsg && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
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
                className="w-full bg-[#1A110A] hover:bg-[#2A1D15] text-[#FAF8F5] font-alexandria font-bold text-xs py-3 rounded-lg border border-[#C5A059]/40 transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{loading ? "جارٍ الإرسال..." : "إرسال الرسالة الآن"}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Embedded Google Maps Container */}
        <div className="mt-8">
          <div className="text-center mb-3">
            <h4 className="font-amiri text-xl font-bold text-[#1A110A]">
              موقع الفرع التفاعلي على خريطة جوجل
            </h4>
            <p className="font-alexandria text-xs text-[#1A110A]/70 mt-0.5">
              يمكنك تكبير الخريطة والوصول مباشرة عبر اتجاهات الملاحة إلى محل بن بدران بميت غمر.
            </p>
          </div>

          {/* TODO: أضف رابط Google Business Profile هنا بعد ما يتم المطالبة بالملف */}

          <div className="border border-[#C5A059]/40 rounded-xl overflow-hidden shadow-xs bg-white p-1.5">
            <div className="relative w-full h-[320px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.056646202436!2d31.2621758!3d30.7168033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7c1c05bf53d5d%3A0xa89763a2cdde0a36!2z2KjZhiDYqNiv2LHYp9mG!5e0!3m2!1sen!2seg!4v1785685705668!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="موقع بن بدران (Budran Coffee) على خريطة جوجل"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
