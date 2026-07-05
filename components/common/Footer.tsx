"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, Phone, CreditCard, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#56007e] text-gray-300 border-t border-gray-800">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-[85%] py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <Image src="/img/tepigame-logo.png" alt="Footer Logo" width={250} height={250} />
            </Link>
            <p className="text-sm text-white leading-relaxed max-w-sm">
              The fastest, cheapest, and most trusted platform to top up your favorite games. Experience instant delivery and 24/7 customer support.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Link href="#" className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:bg-[#E000C1] transition-colors hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:bg-[#E000C1] transition-colors hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:bg-[#E000C1] transition-colors hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:bg-[#E000C1] transition-colors hover:text-white">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">All Games</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Flash Sale</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Support & Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Help Center / FAQ</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Trusted Payments</h3>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              We support a wide variety of secure payment methods for your convenience.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-bold text-gray-300 flex items-center gap-1.5 border border-gray-700">
                <CreditCard className="w-4 h-4 text-blue-400" />
                VISA
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-bold text-gray-300 flex items-center gap-1.5 border border-gray-700">
                <CreditCard className="w-4 h-4 text-red-500" />
                Mastercard
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-bold text-gray-300 border border-gray-700">
                QRIS
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-bold text-gray-300 border border-gray-700">
                GoPay
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-bold text-gray-300 border border-gray-700">
                OVO
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-bold text-gray-300 border border-gray-700">
                Dana
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>100% Secure Checkout Guarantee</span>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-6xl py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300 text-center md:text-left">
            &copy; {currentYear} TepiGame. All rights reserved. <br className="md:hidden" /> All trademarks are the property of their respective owners.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-300">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> support@tepigame.com</span>
            <span className="hidden sm:block text-gray-300">|</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> +62 812 3456 7890</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
