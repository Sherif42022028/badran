"use client";

import { useState } from "react";
import { X, Plus, Minus, MessageSquare, ShoppingBag } from "lucide-react";
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
${notes ? `*ملاحظات الطحن والتحويج:* ${notes}` : ""}

يرجى تأكيد تجهيز الطلب والاستلام!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/201020499680?text=${encoded}`, "_blank");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border border-[#C5A059]/50 rounded-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between font-alexandria"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-[#C5A059]/30 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-amiri text-2xl font-bold text-[#1A110B]">
              سلة طلبات القهوة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#1A110B] hover:text-[#3D120E] p-1.5 rounded-lg hover:bg-[#1A110B]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1 my-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-[#66584F] text-xs">
              السلة فارغة حالياً. أضف بعض خلطات البن الفاخرة!
            </div>
          ) : (
            cartItems.map((ci) => (
              <div
                key={`${ci.item.id}-${ci.selectedPrice.unit}`}
                className="p-3.5 bg-[#F7F4EF] rounded-lg border border-[#1A110B]/10 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-bold text-[#1A110B]">{ci.item.name}</h5>
                  <p className="text-[11px] text-[#66584F] mt-0.5">
                    {ci.selectedPrice.unit} — {ci.selectedPrice.price} ج.م
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#1A110A]/20 rounded-md bg-white">
                    <button
                      onClick={() =>
                        onUpdateQuantity(ci.item.id, ci.selectedPrice.unit, -1)
                      }
                      className="px-2 py-1 text-[#1A110B] hover:bg-[#1A110B]/5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 font-bold font-price">{ci.quantity}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(ci.item.id, ci.selectedPrice.unit, 1)
                      }
                      className="px-2 py-1 text-[#1A110B] hover:bg-[#1A110A]/5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-price font-bold text-[#C5A059]">
                    {ci.selectedPrice.price * ci.quantity} ج.م
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Inputs & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-dashed border-[#C5A059]/30 space-y-3">
            <div>
              <input
                type="text"
                placeholder="الاسم (اختياري)..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="ملاحظات الطحن أو التحويج..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-lg text-xs focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="font-amiri text-lg font-bold text-[#1A110B]">
                الإجمالي النهائي:
              </span>
              <span className="font-price font-bold text-2xl text-[#C5A059]">
                {totalAmount} <span className="text-xs text-[#1A110B]">ج.م</span>
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClearCart}
                className="px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                تفريغ
              </button>
              <button
                onClick={handleCheckoutWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white font-alexandria font-bold text-sm py-2.5 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
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
