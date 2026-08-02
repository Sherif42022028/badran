"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Plus, CheckCircle2, User } from "lucide-react";

interface Review {
  id: number;
  name: string;
  comment: string;
  rating: number;
  created_at?: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        setName("");
        setComment("");
        fetchReviews();
        setTimeout(() => {
          setShowForm(false);
          setSuccessMsg("");
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-4 md:py-8 px-4 max-w-7xl mx-auto">
      <div className="framed-section p-5 sm:p-8 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-center sm:text-right">
          <div>
            <span className="solid-badge text-xs md:text-sm py-1 px-3 mb-2">
              <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
              <span>آراء وانطباعات العملاء</span>
            </span>
            <p className="font-alexandria text-xs text-[#1A110A]/75 mt-1 font-light">
              ما يقوله أهالي ميت غمر وعشاق البن المحوج عن بن بدران.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#1A110A] hover:bg-[#2A1D15] text-[#FAF8F5] px-4 py-2 rounded-lg text-xs font-bold font-alexandria flex items-center gap-1.5 transition-all border border-[#C5A059]/30 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>أضف تقييمك ورأيك</span>
          </button>
        </div>

        {/* Submit Review Form Drawer */}
        {showForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 p-5 bg-[#F7F4EF] rounded-xl border border-[#C5A059]/40 space-y-3 font-alexandria animate-fadeIn"
          >
            <h4 className="font-amiri text-lg font-bold text-[#1A110A]">
              اكتب تقييمك لمحل بن بدران:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">اسمك الكريم:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد علي"
                  className="w-full p-2.5 bg-white border border-[#1A110A]/20 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">التقييم:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-[#1A110A]/20 rounded-lg text-xs"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (ممتاز جداً - 5 نجوم)</option>
                  <option value={4}>⭐⭐⭐⭐ (جيد جداً - 4 نجوم)</option>
                  <option value={3}>⭐⭐⭐ (جيد - 3 نجوم)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">رأيك أو تجربتك:</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب انطباعك عن البن والخدمة والتحويجة..."
                className="w-full p-2.5 bg-white border border-[#1A110A]/20 rounded-lg text-xs"
              />
            </div>

            {successMsg && (
              <div className="p-2.5 bg-green-50 text-green-900 border border-green-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1A110A] hover:bg-[#1A110A]/10"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#C5A059] hover:bg-[#B08B46] text-white px-5 py-1.5 rounded-lg text-xs font-bold"
              >
                {submitting ? "جارٍ الحفظ..." : "حفظ التقييم"}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-white rounded-xl border border-[#1A110A]/12 shadow-xs font-alexandria flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1A110A] text-[#C5A059] flex items-center justify-center text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-[#1A110A]">{rev.name}</span>
                  </div>

                  <div className="flex text-[#C5A059]">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#1A110A]/80 leading-relaxed font-light mt-1">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 mt-3 border-t border-dashed border-[#1A110A]/10 text-[10px] text-[#66584F] flex justify-between">
                <span>زبون بن بدران الأصلي</span>
                <span>ميت غمر 📍</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
