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
import { MenuItem } from "@/data/menu";

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleAddToCart = (
    item: MenuItem,
    selectedPrice: { unit: string; price: number }
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.item.id === item.id && ci.selectedPrice.unit === selectedPrice.unit
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { item, selectedPrice, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, unit: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === id && ci.selectedPrice.unit === unit) {
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
    <main className="min-h-screen flex flex-col justify-between selection:bg-[#3D120E] selection:text-white">
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
