"use client";

import { useState } from "react";
import { X, Plus, Minus, MessageSquare, ShoppingBag, User, Phone, FileText, AlertCircle } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";
import { generateOrderId } from "@/lib/orderId";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";
import { generateCartWhatsAppMessage } from "@/lib/whatsapp/generateWhatsAppMessage";
import OrderPreviewModal from "@/components/OrderPreviewModal";
import { CheckoutOrder } from "@/types/Order";
import { Product } from "@/types/products";

export interface CartItem {
  id: string; // unique identifier e.g. "basic-plain-matrix-fatikh-100g"
  name: string;
  category?: string;
  selectedVariant: string; // e.g. "ساده" or "وسط | 100 جم"
  unitPrice: number;
  quantity: number;
  // Legacy / fallback props
  item?: { id: string; name: string; [key: string]: any } | Product;
  selectedPrice?: { unit: string; price: number };
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
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
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [builtMessage, setBuiltMessage] = useState("");
  const [checkoutOrderObj, setCheckoutOrderObj] = useState<CheckoutOrder | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, ci) => {
      const price = ci.unitPrice ?? ci.selectedPrice?.price ?? 0;
      return sum + price * ci.quantity;
    },
    0
  );

  const handleOpenPreview = () => {
    trackContactClick("whatsapp");
    const orderId = generateOrderId("BD");

    const message = generateCartWhatsAppMessage(
      cartItems,
      totalAmount,
      customerName,
      customerPhone,
      notes,
      orderId
    );

    const summaryOrderObj: CheckoutOrder = {
      orderId,
      customer: {
        name: customerName.trim() || "عميل بن بدران",
        phone: customerPhone.trim() || "01020499680",
      },
      orderType: "Pickup",
      items: cartItems.map((ci) => ({
        name: ci.name || ci.item?.name || "صنف",
        quantity: ci.quantity,
        options: {
          size: ci.selectedVariant || ci.selectedPrice?.unit || undefined,
        },
      })),
      subtotal: totalAmount,
      total: totalAmount,
      paymentMethod: "Cash",
      additionalNote: notes || undefined,
      currency: "ج.م",
    };

    setBuiltMessage(message);
    setCheckoutOrderObj(summaryOrderObj);
    setIsPreviewOpen(true);
  };

  const handleSendViaWhatsApp = () => {
    if (!builtMessage) return;

    try {
      const targetPhone = WHATSAPP_NUMBER || "201020499680";
      const link = buildWhatsAppLink(targetPhone, builtMessage);

      if (typeof window !== "undefined") {
        try {
          const lastOrder = {
            orderId: checkoutOrderObj?.orderId,
            type: "Cart Order",
            items: cartItems.map((ci) => ({
              name: ci.name || ci.item?.name,
              variant: ci.selectedVariant || ci.selectedPrice?.unit,
              quantity: ci.quantity,
              unitPrice: ci.unitPrice ?? ci.selectedPrice?.price ?? 0,
              price: (ci.unitPrice ?? ci.selectedPrice?.price ?? 0) * ci.quantity,
            })),
            totalAmount,
            customerName,
            customerPhone,
            notes,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem("badran_last_order", JSON.stringify(lastOrder));
        } catch (e) {
          console.warn("Failed to save order to localStorage", e);
        }
      }

      window.open(link, "_blank", "noopener,noreferrer");
      setIsPreviewOpen(false);
    } catch (err: any) {
      alert(err?.message || "حدث خطأ أثناء إنشاء رابط الواتساب");
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#FAF7F2] border-2 border-[#5C2A26] rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between font-alexandria dir-rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-dashed border-[#C9A45F]/50 pb-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#5C2A26] text-[#F78320] rounded-xl shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-amiri text-2xl font-bold text-[#5C2A26]">
                  سلة طلبات بن بدران
                </h3>
                <p className="text-[11px] text-[#7F3A35] font-light">
                  قهوة تستحقها كل يوم
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#5C2A26] hover:text-[#F78320] p-1.5 rounded-lg hover:bg-[#5C2A26]/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 my-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-[#7F3A35]/80 text-sm">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-[#C9A45F]/50" />
                السلة فارغة حالياً. تصفح الأقسام الـ 11 وأضف ما يعجبك!
              </div>
            ) : (
              cartItems.map((ci) => {
                const itemName = ci.name || ci.item?.name || "صنف";
                const itemVariant = ci.selectedVariant || ci.selectedPrice?.unit || "";
                const price = ci.unitPrice ?? ci.selectedPrice?.price ?? 0;
                const lineTotal = price * ci.quantity;

                return (
                  <div
                    key={ci.id}
                    className="p-3.5 bg-white rounded-xl border border-[#5C2A26]/15 hover:border-[#C9A45F] flex items-center justify-between gap-3 text-xs shadow-2xs transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-[#5C2A26] truncate text-sm">
                        {itemName}
                      </h5>
                      {itemVariant && (
                        <span className="block mt-1 px-2.5 py-1 bg-[#FAF7F2] text-[#7F3A35] rounded-md font-semibold text-[11px] border border-[#5C2A26]/10 break-words leading-relaxed">
                          {itemVariant}
                        </span>
                      )}
                      <p className="text-[11px] text-[#7F3A35]/70 mt-1 font-price">
                        {price} ج.م للواحد
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-[#5C2A26]/20 rounded-lg bg-[#FAF7F2] overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(ci.id, -1)}
                          className="px-2 py-1 text-[#5C2A26] hover:bg-[#5C2A26]/10 transition-colors"
                          title="تقليل الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold font-price text-[#5C2A26]">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(ci.id, 1)}
                          className="px-2 py-1 text-[#5C2A26] hover:bg-[#5C2A26]/10 transition-colors"
                          title="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-price font-bold text-sm text-[#F78320] min-w-[55px] text-left">
                        {lineTotal} ج.م
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Form Inputs & Checkout */}
          {cartItems.length > 0 && (
            <div className="pt-3 border-t border-dashed border-[#C9A45F]/40 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <User className="w-4 h-4 text-[#C9A45F] absolute top-3 right-3" />
                  <input
                    type="text"
                    placeholder="الاسم الكريم (اختياري)..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full py-2.5 pr-9 pl-3 bg-white border border-[#5C2A26]/20 rounded-lg text-xs focus:outline-none focus:border-[#F78320]"
                  />
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#C9A45F] absolute top-3 right-3" />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف (اختياري)..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full py-2.5 pr-9 pl-3 bg-white border border-[#5C2A26]/20 rounded-lg text-xs font-price focus:outline-none focus:border-[#F78320]"
                  />
                </div>
              </div>

              <div className="relative">
                <FileText className="w-4 h-4 text-[#C9A45F] absolute top-3 right-3" />
                <input
                  type="text"
                  placeholder="ملاحظات الطحن، التحويج أو الاستلام..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full py-2.5 pr-9 pl-3 bg-white border border-[#5C2A26]/20 rounded-lg text-xs focus:outline-none focus:border-[#F78320]"
                />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="font-amiri text-lg font-bold text-[#5C2A26]">
                  الإجمالي النهائي:
                </span>
                <span className="font-price font-bold text-2xl text-[#F78320]">
                  {totalAmount} <span className="text-xs text-[#5C2A26]">ج.م</span>
                </span>
              </div>

              {/* Payment Policy Notice */}
              <div className="w-full bg-amber-50 border border-amber-300/80 rounded-xl p-2.5 text-xs text-amber-950 flex items-start gap-2 shadow-2xs leading-relaxed text-right">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-bold block text-amber-900 font-alexandria text-[11px]">
                    تنبيه الدفع وتجهيز الطلب:
                  </strong>
                  <p className="text-[11px] text-amber-950/85 leading-normal font-alexandria">
                    يتم سداد قيمة الأوردر بالكامل أثناء التأكيد عبر الواتساب (عبر إنستاباي أو فودافون كاش)، ولن يتم تجهيز أو خروج الأوردر إلا بعد تحصيل المبلغ كاملاً.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                >
                  تفريغ
                </button>
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white font-alexandria font-bold text-sm py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>تأكيد وإرسال الطلب عبر واتساب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {checkoutOrderObj && (
        <OrderPreviewModal
          isOpen={isPreviewOpen}
          message={builtMessage}
          order={checkoutOrderObj}
          onClose={() => setIsPreviewOpen(false)}
          onSend={handleSendViaWhatsApp}
        />
      )}
    </>
  );
}
