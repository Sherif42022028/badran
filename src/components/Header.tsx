"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Phone, Menu as MenuIcon, X, Sparkles } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#C89B3C]/30 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-full border-2 border-[#C89B3C] p-0.5 bg-white overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md">
            <Image
              src="/logo.jpg"
              alt="شعار بن بدران"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-alexandria font-extrabold text-2xl text-[#1E110A] leading-none tracking-tight group-hover:text-[#C89B3C] transition-colors">
              بن بدران
            </h1>
            <p className="font-price text-[9px] text-[#C89B3C] tracking-[0.25em] uppercase font-bold mt-1">
              BUDRAN COFFEE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-alexandria text-xs font-semibold text-[#1E110A]/90">
          <a
            href="#hero"
            className="hover:text-[#C89B3C] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#C89B3C] hover:after:w-full hover:after:left-0 after:transition-all"
          >
            الرئيسية
          </a>
          <a
            href="#about"
            className="hover:text-[#C89B3C] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#C89B3C] hover:after:w-full hover:after:left-0 after:transition-all"
          >
            قصتنا والعراقة
          </a>
          <a
            href="#menu"
            className="hover:text-[#C89B3C] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#C89B3C] hover:after:w-full hover:after:left-0 after:transition-all"
          >
            المنيو والأسعار
          </a>
          <a
            href="#blend-builder"
            className="hover:text-[#C89B3C] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#C89B3C] hover:after:w-full hover:after:left-0 after:transition-all"
          >
            صمّم توليفتك
          </a>
          <a
            href="#contact"
            className="hover:text-[#C89B3C] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#C89B3C] hover:after:w-full hover:after:left-0 after:transition-all"
          >
            موقعنا وتواصلنا
          </a>
        </nav>

        {/* Action Buttons: Phone & Cart */}
        <div className="flex items-center gap-3">
          <a
            href="tel:01020499680"
            className="hidden sm:inline-flex items-center gap-2 border border-[#C89B3C]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1E110A] hover:bg-[#1E110A] hover:text-[#FAF7F2] hover:border-[#1E110A] transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span className="font-price font-bold text-xs tracking-wider">01020499680</span>
          </a>

          <button
            onClick={onOpenCart}
            className="relative bg-gold-gradient text-white px-4 py-2 rounded-full text-xs font-bold font-alexandria flex items-center gap-2 transition-all shadow-md active:scale-95 hover:shadow-lg"
            aria-label="فتح سلة الطلبات"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">السلة</span>
            {cartCount > 0 && (
              <span className="bg-[#1E110A] text-[#D4AF37] font-price text-xs rounded-full px-2 py-0.5 font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1E110A] p-2 rounded-lg hover:bg-[#1E110A]/5"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C89B3C]/30 bg-[#FAF7F2] px-6 py-6 space-y-4 font-alexandria text-center animate-fadeIn shadow-lg">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E110A] font-semibold border-b border-dashed border-[#C89B3C]/20"
          >
            الرئيسية
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E110A] font-semibold border-b border-dashed border-[#C89B3C]/20"
          >
            قصتنا والعراقة
          </a>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E110A] font-semibold border-b border-dashed border-[#C89B3C]/20"
          >
            المنيو والأسعار
          </a>
          <a
            href="#blend-builder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E110A] font-semibold border-b border-dashed border-[#C89B3C]/20"
          >
            صمّم توليفتك
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E110A] font-semibold"
          >
            موقعنا وتواصلنا
          </a>
          <a
            href="tel:01020499680"
            className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-[#1E110A] text-[#FAF7F2] py-2.5 rounded-full text-xs font-price font-bold border border-[#C89B3C]/50"
          >
            <Phone className="w-4 h-4 text-[#C89B3C]" />
            <span>01020499680 (اتصل الآن)</span>
          </a>
        </div>
      )}
    </header>
  );
}
