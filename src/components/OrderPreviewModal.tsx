"use client";

import { useState } from "react";
import { X, Send, Copy, Check, MessageSquare, ShoppingBag, User, Phone, MapPin, Store, CreditCard } from "lucide-react";
import { CheckoutOrder } from "@/types/Order";

interface OrderPreviewModalProps {
  isOpen: boolean;
  message: string;
  order: CheckoutOrder;
  onClose: () => void;
  onSend: () => void;
}

export default function OrderPreviewModal({
  isOpen,
  message,
  order,
  onClose,
  onSend,
}: OrderPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-preview-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1A110B] text-[#FAF8F5] border-b border-[#C5A059]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#25D366]/20 text-[#25D366] rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 id="order-preview-title" className="font-bold text-lg leading-tight">
                Review WhatsApp Order
              </h3>
              <p className="text-xs text-[#C5A059] mt-0.5">
                Badran Coffee • WhatsApp Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1">
          {/* Order Summary Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#F7F4EF] p-3 rounded-xl border border-[#1A110B]/10">
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-[#C5A059]" /> Order ID
              </span>
              <span className="font-bold text-[#1A110B] truncate mt-0.5">
                {order.orderId || "Pending"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-[#C5A059]" /> Customer
              </span>
              <span className="font-bold text-[#1A110B] truncate mt-0.5">
                {order.customer.name}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                {order.orderType === "Delivery" ? (
                  <MapPin className="w-3 h-3 text-[#C5A059]" />
                ) : (
                  <Store className="w-3 h-3 text-[#C5A059]" />
                )}
                Type
              </span>
              <span className="font-bold text-[#1A110B] truncate mt-0.5">
                {order.orderType}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-[#C5A059]" /> Total
              </span>
              <span className="font-bold text-[#25D366] mt-0.5">
                {order.total} {order.currency || "EGP"}
              </span>
            </div>
          </div>

          {/* WhatsApp Chat Bubble Container */}
          <div className="rounded-xl overflow-hidden border border-[#25D366]/30 shadow-inner bg-[#efeae2]">
            <div className="bg-[#075e54] text-white px-3.5 py-2 flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                Formatted WhatsApp Message Preview
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] transition-colors"
                title="Copy message to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="p-3 sm:p-4 max-h-72 overflow-y-auto">
              <div className="bg-[#dcf8c6] text-[#000000] p-3.5 rounded-lg shadow-sm font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border border-green-200">
                {message}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#1A110B]/10 flex flex-col sm:flex-row items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
          >
            Edit Order
          </button>
          <button
            onClick={onSend}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
