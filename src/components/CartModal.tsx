"use client";

import { useState } from "react";
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag } from "lucide-react";
import { MenuItem } from "@/data/menu";

export interface CartItem {
  item: MenuItem;
  selectedPrice: { unit: string; price: number };
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, unit: string, delta: number) => void;
  onClearCart: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
}: CartModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, ci) => sum + ci.selectedPrice.price * ci.quantity,
    0
  );

  const handleCheckoutWhatsApp = () => {
    let itemsText = cartItems
      ? cartItems
          .map(
            (ci, idx) =>
              `${idx + 1}. ${ci.item.name} (${ci.selectedPrice.unit}) × ${ci.quantity} = ${
                ci.selectedPrice.price * ci.quantity
              } ج.م`
          )
          .join("\n")
      : "";

    const message = `أهلاً بن بدران 👋 أرغب في إتمام الطلب التالي:

*تفاصيل المنتجات:*
${itemsText}

*الإجمالي:* ${totalAmount} ج.م
${customerName ? `*اسم العميل:* ${customerName}` : ""}
${notes ? `*ملاحظات إضافية:* ${notes}` : ""}

يرجى تأكيد تجهيز الطلب واستلامه!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201020499680?text=${encoded}`, "_blank");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FFF8F6] border-4 border-[#3A2416] rounded-lg shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between font-tajawal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-[#3A2416]/30 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#C97A2B]" />
            <h3 className="font-lalezar text-2xl text-[#3A2416]">
              سلة طلبات القهوة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#3A2416] hover:text-[#6B2A22] p-1 rounded hover:bg-[#3A2416]/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1 my-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-[#5E604D] text-sm">
              السلة فارغة حالياً. أضف بعض المنتجات والتوليفات الفاخرة!
            </div>
          ) : (
            cartItems.map((ci, idx) => (
              <div
                key={`${ci.item.id}-${ci.selectedPrice.unit}`}
                className="p-3 bg-[#F3ECDD] rounded border border-[#3A2416]/20 flex items-center justify-between gap-3 text-xs md:text-sm"
              >
                <div>
                  <h5 className="font-bold text-[#3A2416]">{ci.item.name}</h5>
                  <p className="text-[11px] text-[#5E604D]">
                    {ci.selectedPrice.unit} — {ci.selectedPrice.price} ج.م
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#3A2416] rounded bg-[#FFF8F6]">
                    <button
                      onClick={() =>
                        onUpdateQuantity(ci.item.id, ci.selectedPrice.unit, -1)
                      }
                      className="px-2 py-0.5 text-[#3A2416] hover:bg-[#3A2416]/10"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold font-price">{ci.quantity}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(ci.item.id, ci.selectedPrice.unit, 1)
                      }
                      className="px-2 py-0.5 text-[#3A2416] hover:bg-[#3A2416]/10"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-price font-bold text-[#6B2A22]">
                    {ci.selectedPrice.price * ci.quantity} ج.م
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Inputs & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-dashed border-[#3A2416]/30 space-y-3">
            <div>
              <input
                type="text"
                placeholder="الاسم (اختياري)..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 bg-[#F3ECDD] border border-[#3A2416]/40 rounded text-xs focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="ملاحظات الطحن أو التحويج المفضل..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-[#F3ECDD] border border-[#3A2416]/40 rounded text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-lalezar text-lg text-[#3A2416]">
                الإجمالي النهائي:
              </span>
              <span className="font-price font-bold text-2xl text-[#6B2A22]">
                {totalAmount} <span className="text-xs text-[#3A2416]">ج.م</span>
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClearCart}
                className="px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors"
              >
                تفريغ
              </button>
              <button
                onClick={handleCheckoutWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white font-lalezar text-base py-2.5 rounded border border-[#1ebd59] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>إرسال الطلب عبر واتساب</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
