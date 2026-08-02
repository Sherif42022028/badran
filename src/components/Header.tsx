"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, ShoppingBag, Phone, Menu as MenuIcon, X } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F3ECDD]/95 backdrop-blur-sm border-b-[3px] border-double border-[#3A2416] shadow-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded border-2 border-[#3A2416] p-0.5 bg-[#FFF8F6] overflow-hidden group-hover:scale-105 transition-transform duration-200 shadow-sm">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-lalezar text-2xl text-[#3A2416] leading-tight tracking-wide group-hover:text-[#6B2A22] transition-colors">
              بن بدران
            </h1>
            <p className="font-price text-[10px] text-[#5E604D] tracking-widest uppercase font-semibold">
              BUDRAN COFFEE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-tajawal font-medium text-sm text-[#3A2416]">
          <a
            href="#hero"
            className="hover:text-[#6B2A22] transition-colors hover:underline underline-offset-4 decoration-2"
          >
            الرئيسية
          </a>
          <a
            href="#about"
            className="hover:text-[#6B2A22] transition-colors hover:underline underline-offset-4 decoration-2"
          >
            قصتنا والعراقة
          </a>
          <a
            href="#menu"
            className="hover:text-[#6B2A22] transition-colors hover:underline underline-offset-4 decoration-2"
          >
            المنيو والأسعار
          </a>
          <a
            href="#blend-builder"
            className="hover:text-[#6B2A22] transition-colors hover:underline underline-offset-4 decoration-2"
          >
            صمّم توليفتك
          </a>
          <a
            href="#contact"
            className="hover:text-[#6B2A22] transition-colors hover:underline underline-offset-4 decoration-2"
          >
            موقعنا وتواصلنا
          </a>
        </nav>

        {/* Action Buttons: Cart & Direct Phone */}
        <div className="flex items-center gap-3">
          <a
            href="tel:01020499680"
            className="hidden sm:inline-flex items-center gap-2 border border-[#3A2416] px-3 py-1.5 rounded text-xs font-semibold text-[#3A2416] hover:bg-[#3A2416] hover:text-white transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#C97A2B]" />
            <span className="font-price text-sm">01020499680</span>
          </a>

          <button
            onClick={onOpenCart}
            className="relative bg-[#6B2A22] hover:bg-[#3A2416] text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95"
            aria-label="فتح سلة الطلبات"
          >
            <ShoppingBag className="w-4 h-4 text-[#C97A2B]" />
            <span className="hidden sm:inline font-tajawal">السلة</span>
            {cartCount > 0 && (
              <span className="bg-[#C97A2B] text-white font-price text-xs rounded-full px-2 py-0.5 font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#3A2416] p-1.5 rounded hover:bg-[#3A2416]/10"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3A2416]/20 bg-[#FFF8F6] px-4 py-4 space-y-3 font-tajawal text-center animate-fadeIn">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#3A2416] font-semibold border-b border-dashed border-[#3A2416]/20"
          >
            الرئيسية
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#3A2416] font-semibold border-b border-dashed border-[#3A2416]/20"
          >
            قصتنا والعراقة
          </a>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#3A2416] font-semibold border-b border-dashed border-[#3A2416]/20"
          >
            المنيو والأسعار
          </a>
          <a
            href="#blend-builder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#3A2416] font-semibold border-b border-dashed border-[#3A2416]/20"
          >
            صمّم توليفتك
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#3A2416] font-semibold"
          >
            موقعنا وتواصلنا
          </a>
          <a
            href="tel:01020499680"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#3A2416] text-white py-2 rounded text-sm font-price"
          >
            <Phone className="w-4 h-4 text-[#C97A2B]" />
            <span>01020499680 (اتصل الآن)</span>
          </a>
        </div>
      )}
    </header>
  );
}
