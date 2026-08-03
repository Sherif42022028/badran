"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Phone, Menu as MenuIcon, X } from "lucide-react";
import { trackContactClick } from "@/lib/analytics";
import { PHONE_DISPLAY, PHONE_TEL_LINK } from "@/lib/constants";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1A110B]/10 shadow-2xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-lg border border-[#C5A059]/60 p-0.5 bg-white overflow-hidden group-hover:border-[#1A110B] transition-colors shadow-xs">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-alexandria font-extrabold text-xl text-[#1A110B] leading-none tracking-tight">
              بن بدران
            </h1>
            <p className="font-alexandria text-[10px] text-[#C5A059] font-bold mt-1">
              محمصة ومطحنة ميت غمر
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-alexandria text-xs font-bold text-[#1A110B]/85">
          <a
            href="#hero"
            className="hover:text-[#C5A059] transition-colors py-1"
          >
            الرئيسية
          </a>
          <a
            href="#about"
            className="hover:text-[#C5A059] transition-colors py-1"
          >
            عن المحل
          </a>
          <a
            href="#menu"
            className="hover:text-[#C5A059] transition-colors py-1"
          >
            أسعار المنيو
          </a>
          <a
            href="#blend-builder"
            className="hover:text-[#C5A059] transition-colors py-1"
          >
            ركّب خلطتك
          </a>
          <a
            href="#contact"
            className="hover:text-[#C5A059] transition-colors py-1"
          >
            موقعنا وتواصلنا
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={PHONE_TEL_LINK}
            onClick={() => trackContactClick("call")}
            className="hidden sm:inline-flex items-center gap-2 border border-[#1A110B]/20 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#1A110B] hover:border-[#1A110B] hover:bg-[#1A110B] hover:text-[#FAF8F5] transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-price text-xs">اتصل الآن ({PHONE_DISPLAY})</span>
          </a>

          <button
            onClick={onOpenCart}
            className="relative bg-[#1A110B] hover:bg-[#2A1D15] text-[#FAF8F5] px-4 py-2 rounded-lg text-xs font-bold font-alexandria flex items-center gap-2 transition-all shadow-xs active:scale-95 border border-[#C5A059]/40"
            aria-label="فتح سلة الطلبات"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden sm:inline">سلة الطلبات</span>
            {cartCount > 0 && (
              <span className="bg-[#C5A059] text-white font-price text-xs rounded-md px-1.5 py-0.2 font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1A110B] p-2 rounded-lg hover:bg-[#1A110B]/5"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1A110B]/10 bg-[#FAF8F5] px-6 py-6 space-y-3.5 font-alexandria text-center animate-fadeIn shadow-lg">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1A110B] font-semibold border-b border-dashed border-[#1A110B]/10"
          >
            الرئيسية
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1A110B] font-semibold border-b border-dashed border-[#1A110B]/10"
          >
            عن المحل
          </a>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1A110B] font-semibold border-b border-dashed border-[#1A110B]/10"
          >
            أسعار المنيو
          </a>
          <a
            href="#blend-builder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1A110B] font-semibold border-b border-dashed border-[#1A110B]/10"
          >
            ركّب خلطتك
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1A110B] font-semibold"
          >
            موقعنا وتواصلنا
          </a>
          <a
            href={PHONE_TEL_LINK}
            onClick={() => trackContactClick("call")}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-[#1A110B] text-[#FAF8F5] py-2.5 rounded-lg text-xs font-price font-bold border border-[#C5A059]/40"
          >
            <Phone className="w-4 h-4 text-[#C5A059]" />
            <span>اتصل الآن ({PHONE_DISPLAY})</span>
          </a>
        </div>
      )}
    </header>
  );
}
