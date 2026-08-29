"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import BlendBuilder from "@/components/BlendBuilder";
import ReviewsSection from "@/components/ReviewsSection";
import LocationContact from "@/components/LocationContact";
import Footer from "@/components/Footer";
import CartModal, { CartItem } from "@/components/CartModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Product } from "@/types/products";
import { MenuItem } from "@/data/menu";

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleAddToCart = (
    item: Product | MenuItem,
    selectedPriceOrVariant: { unit?: string; label?: string; price: number }
  ) => {
    const itemName = item.name;
    const variantLabel =
      selectedPriceOrVariant.label || selectedPriceOrVariant.unit || "سعر موحد";
    const unitPrice = selectedPriceOrVariant.price;
    const cartLineId = `${item.id}-${variantLabel.replace(/[\s|]+/g, "_")}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.id === cartLineId);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      const newCartItem: CartItem = {
        id: cartLineId,
        name: itemName,
        category: item.category,
        selectedVariant: variantLabel,
        unitPrice,
        quantity: 1,
        item,
        selectedPrice: { unit: variantLabel, price: unitPrice },
      };

      return [...prev, newCartItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-[#5C2A26] selection:text-white">
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="flex-1">
        <Hero />
        <AboutSection />
        <MenuSection onAddToCart={handleAddToCart} />
        <BlendBuilder />
        <ReviewsSection />
        <LocationContact />
      </div>

      <Footer />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      <FloatingWhatsApp />
    </main>
  );
}
