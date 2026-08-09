"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppCheckoutButton from "@/components/WhatsAppCheckoutButton";
import { CheckoutOrder, OrderType, PaymentMethod } from "@/types/Order";
import { ShoppingBag, Coffee, User, Phone, MapPin, Store, Clock, CreditCard, FileText, CheckCircle } from "lucide-react";

export default function DemoWhatsAppCheckoutPage() {
  const [customerName, setCustomerName] = useState("Sarah Ahmed");
  const [customerPhone, setCustomerPhone] = useState("01234567890");
  const [orderType, setOrderType] = useState<OrderType>("Delivery");
  const [address, setAddress] = useState("Nasr City, Cairo");
  const [branch, setBranch] = useState("Mit Ghamr Branch");
  const [pickupTime, setPickupTime] = useState("05:30 PM");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [additionalNote, setAdditionalNote] = useState("Please call on arrival");
  const [customPhone, setCustomPhone] = useState("201020499680");
  const [lastSavedOrder, setLastSavedOrder] = useState<string | null>(null);

  // Sample items specified in requirements
  const sampleItems = [
    {
      name: "Cappuccino",
      quantity: 2,
      options: {
        size: "Large",
        milk: "Oat Milk",
        sugar: "Medium",
        extras: ["Extra Shot"],
        note: "Hot",
      },
    },
    {
      name: "Croissant",
      quantity: 1,
    },
  ];

  const subtotal = 180;
  const deliveryFee = orderType === "Delivery" ? 20 : 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const currentOrder: CheckoutOrder = {
    customer: {
      name: customerName,
      phone: customerPhone,
    },
    orderType,
    address: orderType === "Delivery" ? address : undefined,
    branch: orderType === "Pickup" ? branch : undefined,
    pickupTime: orderType === "Pickup" ? pickupTime : undefined,
    items: sampleItems,
    subtotal,
    deliveryFee: orderType === "Delivery" ? deliveryFee : undefined,
    discount: discount > 0 ? discount : undefined,
    total,
    paymentMethod,
    additionalNote: additionalNote || undefined,
    currency: "EGP",
  };

  const refreshLastSavedOrder = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("badran_last_order");
      setLastSavedOrder(saved);
    }
  };

  useEffect(() => {
    refreshLastSavedOrder();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A110B] font-sans flex flex-col justify-between">
      <Header cartCount={3} onOpenCart={() => {}} />


      <main className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        {/* Page Title & Intro */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] font-bold text-xs mb-3 border border-[#C5A059]/30">
            <Coffee className="w-4 h-4" /> Badran Coffee • Interactive Demo
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-lalezar text-[#1A110B]">
            WhatsApp Checkout Demo
          </h1>
          <p className="text-sm text-[#66584F] max-w-xl mx-auto mt-2 font-tajawal">
            Test the structured WhatsApp order message generator, pre-filled order data, modal preview, and formatting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Form & Settings */}
          <div className="md:col-span-7 space-y-6">
            {/* Customer Details Form */}
            <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1A110B] flex items-center gap-2 border-b pb-3 border-[#1A110B]/10">
                <User className="w-4 h-4 text-[#C5A059]" /> Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#66584F] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#66584F] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Enter customer phone"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#66584F] mb-1">
                  Target WhatsApp Number (For Testing Link)
                </label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="e.g. 201020499680"
                />
              </div>
            </div>

            {/* Order Type & Logistics */}
            <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1A110B] flex items-center gap-2 border-b pb-3 border-[#1A110B]/10">
                <MapPin className="w-4 h-4 text-[#C5A059]" /> Fulfillment & Delivery
              </h3>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("Delivery")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    orderType === "Delivery"
                      ? "bg-[#1A110B] text-white border-[#1A110B]"
                      : "bg-[#F7F4EF] text-[#66584F] border-[#1A110B]/10 hover:border-[#C5A059]"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("Pickup")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    orderType === "Pickup"
                      ? "bg-[#1A110B] text-white border-[#1A110B]"
                      : "bg-[#F7F4EF] text-[#66584F] border-[#1A110B]/10 hover:border-[#C5A059]"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" /> Pickup
                </button>
              </div>

              {orderType === "Delivery" ? (
                <div>
                  <label className="block text-xs font-semibold text-[#66584F] mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Enter delivery address"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#66584F] mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                      placeholder="Branch name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#66584F] mb-1">
                      Pickup Time
                    </label>
                    <input
                      type="text"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                      placeholder="e.g. 05:30 PM"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment & Notes */}
            <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1A110B] flex items-center gap-2 border-b pb-3 border-[#1A110B]/10">
                <CreditCard className="w-4 h-4 text-[#C5A059]" /> Payment & Notes
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Cash", "Card", "Wallet", "InstaPay"] as PaymentMethod[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      paymentMethod === pm
                        ? "bg-[#C5A059] text-white border-[#C5A059]"
                        : "bg-[#F7F4EF] text-[#66584F] border-[#1A110B]/10 hover:border-[#C5A059]"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#66584F] mb-1">
                  Additional Note
                </label>
                <input
                  type="text"
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F4EF] border border-[#1A110B]/15 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="Order note (optional)"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Button */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/40 shadow-lg space-y-5 sticky top-6">
              <h3 className="font-bold text-lg text-[#1A110B] flex items-center gap-2 border-b pb-3 border-[#1A110B]/10">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" /> Order Summary
              </h3>

              {/* Sample Items List */}
              <div className="space-y-3">
                {sampleItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F7F4EF] rounded-xl border border-[#1A110B]/10 space-y-1 text-xs"
                  >
                    <div className="flex justify-between font-bold text-[#1A110B]">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>

                    {item.options && (
                      <div className="text-[11px] text-[#66584F] space-y-0.5 pt-1 border-t border-gray-200">
                        {item.options.size && <div>• Size: {item.options.size}</div>}
                        {item.options.milk && <div>• Milk: {item.options.milk}</div>}
                        {item.options.sugar && <div>• Sugar: {item.options.sugar}</div>}
                        {item.options.extras && <div>• Extras: {item.options.extras.join(", ")}</div>}
                        {item.options.note && <div>• Note: {item.options.note}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs pt-3 border-t border-dashed border-[#C5A059]/30">
                <div className="flex justify-between text-[#66584F]">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-[#1A110B]">{subtotal} EGP</span>
                </div>
                {orderType === "Delivery" && (
                  <div className="flex justify-between text-[#66584F]">
                    <span>Delivery Fee:</span>
                    <span className="font-mono font-bold text-[#1A110B]">{deliveryFee} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#1A110B] pt-2 border-t border-[#1A110B]/10">
                  <span>Total:</span>
                  <span className="font-mono text-[#25D366]">{total} EGP</span>
                </div>
              </div>

              {/* Checkout Button Component */}
              <WhatsAppCheckoutButton
                order={currentOrder}
                phoneNumber={customPhone}
                onSuccess={refreshLastSavedOrder}
              />
            </div>

            {/* LocalStorage Inspector Card */}
            <div className="bg-[#1A110B] text-[#FAF8F5] p-4 rounded-2xl border border-[#C5A059]/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1 text-[#C5A059]">
                  <FileText className="w-3.5 h-3.5" /> localStorage Inspector
                </span>
                <span className="text-[10px] text-gray-400 font-mono">key: badran_last_order</span>
              </div>
              {lastSavedOrder ? (
                <pre className="p-3 bg-black/50 rounded-xl font-mono text-[11px] overflow-x-auto text-emerald-400 max-h-40">
                  {JSON.stringify(JSON.parse(lastSavedOrder), null, 2)}
                </pre>
              ) : (
                <div className="p-3 bg-white/5 rounded-xl text-gray-400 text-center italic text-[11px]">
                  No order saved in localStorage yet. Complete a checkout via WhatsApp to save `badran_last_order`.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
