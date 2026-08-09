"use client";

import { useState } from "react";
import { MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { CheckoutOrder } from "@/types/Order";
import { generateOrderId } from "@/lib/orderId";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import { buildOrderMessage } from "@/lib/whatsapp/buildOrderMessage";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";
import OrderPreviewModal from "@/components/OrderPreviewModal";

interface WhatsAppCheckoutButtonProps {
  order: CheckoutOrder;
  phoneNumber?: string;
  onSuccess?: (order: CheckoutOrder) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function WhatsAppCheckoutButton({
  order,
  phoneNumber = WHATSAPP_NUMBER,
  onSuccess,
  onError,
  className = "",
  disabled = false,
}: WhatsAppCheckoutButtonProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [builtMessage, setBuiltMessage] = useState("");
  const [preparedOrder, setPreparedOrder] = useState<CheckoutOrder | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const validateOrder = (orderToValidate: CheckoutOrder): string | null => {
    if (!orderToValidate.items || orderToValidate.items.length === 0) {
      return "Cart is empty. Please add items before checking out.";
    }

    if (!orderToValidate.customer?.name?.trim()) {
      return "Customer name is required.";
    }

    if (!orderToValidate.customer?.phone?.trim()) {
      return "Customer phone number is required.";
    }

    if (orderToValidate.orderType === "Delivery") {
      if (!orderToValidate.address?.trim()) {
        return "Delivery address is required for delivery orders.";
      }
    } else if (orderToValidate.orderType === "Pickup") {
      if (!orderToValidate.branch?.trim()) {
        return "Branch location is required for pickup orders.";
      }
      if (!orderToValidate.pickupTime?.trim()) {
        return "Pickup time is required for pickup orders.";
      }
    }

    return null;
  };

  const handleInitialClick = () => {
    setValidationError(null);
    setSuccessNotice(null);

    const error = validateOrder(order);
    if (error) {
      setValidationError(error);
      if (onError) onError(error);
      return;
    }

    // Ensure orderId is assigned
    const finalOrderId = order.orderId && order.orderId.trim() !== ""
      ? order.orderId
      : generateOrderId("BD");

    const finalOrder: CheckoutOrder = {
      ...order,
      orderId: finalOrderId,
    };

    const message = buildOrderMessage(finalOrder);
    setPreparedOrder(finalOrder);
    setBuiltMessage(message);
    setIsPreviewOpen(true);
  };

  const handleSendViaWhatsApp = () => {
    if (!preparedOrder || !builtMessage) return;

    try {
      const targetPhone = phoneNumber || WHATSAPP_NUMBER;
      const link = buildWhatsAppLink(targetPhone, builtMessage);

      // Save order to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("badran_last_order", JSON.stringify(preparedOrder));
        } catch (e) {
          console.warn("Failed to save order to localStorage", e);
        }
      }

      // Open WhatsApp link in new tab
      window.open(link, "_blank", "noopener,noreferrer");

      setSuccessNotice("Order prepared! Opening WhatsApp...");
      if (onSuccess) onSuccess(preparedOrder);
      setIsPreviewOpen(false);

      setTimeout(() => {
        setSuccessNotice(null);
      }, 5000);
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to generate WhatsApp checkout link.";
      setValidationError(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  return (
    <div className="w-full space-y-2">
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#25D366]" />
          <span>{successNotice}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleInitialClick}
        disabled={disabled}
        className={`w-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1ebd59] text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <MessageSquare className="w-5 h-5" />
        <span>Checkout via WhatsApp</span>
      </button>

      {preparedOrder && (
        <OrderPreviewModal
          isOpen={isPreviewOpen}
          message={builtMessage}
          order={preparedOrder}
          onClose={() => setIsPreviewOpen(false)}
          onSend={handleSendViaWhatsApp}
        />
      )}
    </div>
  );
}
