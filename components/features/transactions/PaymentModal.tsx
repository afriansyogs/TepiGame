"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Clock, ShieldCheck, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  gameImageUrl: string;
  packageName: string;
  totalAmount: number;
  paymentMethodName: string;
  paymentMethodId: string;
  gameUserId: string;
  gameZoneId?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  gameName,
  gameImageUrl,
  packageName,
  totalAmount,
  paymentMethodName,
  paymentMethodId,
  gameUserId,
  gameZoneId
}: PaymentModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const autoRedirectTimer = useRef<NodeJS.Timeout | null>(null);

  const isQris = paymentMethodId === "qris";
  
  let vaNumber = "883012847291039";
  let paymentInstructions = "Transfer ke Virtual Account di atas sebelum batas waktu habis.";
  
  if (paymentMethodId === "ovo" || paymentMethodId === "dana") {
    vaNumber = "081298765432";
    paymentInstructions = "Silakan transfer ke Nomor E-Wallet di atas atau bayar via aplikasi e-wallet Anda.";
  }

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isQris) return;

    const txId = `TX-${gameName.substring(0, 4).toUpperCase().replace(/\s+/g, "")}-${Math.floor(10000 + Math.random() * 90000)}`;
    const targetUrl = `/transactions/flow?id=${txId}&game=${encodeURIComponent(gameName)}&image=${encodeURIComponent(gameImageUrl)}&package=${encodeURIComponent(packageName)}&amount=${totalAmount}&method=${encodeURIComponent(paymentMethodName)}&userId=${encodeURIComponent(gameUserId)}${gameZoneId ? `&zoneId=${encodeURIComponent(gameZoneId)}` : ""}`;

    autoRedirectTimer.current = setTimeout(() => {
      router.push(targetUrl);
      onClose();
    }, 3000);

    return () => {
      if (autoRedirectTimer.current) clearTimeout(autoRedirectTimer.current);
    };
  }, [isOpen, isQris, gameName, gameImageUrl, packageName, totalAmount, paymentMethodName, gameUserId, gameZoneId, router, onClose]);

  const handleManualPay = () => {
    const txId = `TX-${gameName.substring(0, 4).toUpperCase().replace(/\s+/g, "")}-${Math.floor(10000 + Math.random() * 90000)}`;
    const targetUrl = `/transactions/flow?id=${txId}&game=${encodeURIComponent(gameName)}&image=${encodeURIComponent(gameImageUrl)}&package=${encodeURIComponent(packageName)}&amount=${totalAmount}&method=${encodeURIComponent(paymentMethodName)}&userId=${encodeURIComponent(gameUserId)}${gameZoneId ? `&zoneId=${encodeURIComponent(gameZoneId)}` : ""}`;
    
    if (autoRedirectTimer.current) clearTimeout(autoRedirectTimer.current);
    router.push(targetUrl);
    onClose();
  };

  const handleCopyVa = async () => {
    try {
      await navigator.clipboard.writeText(vaNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.log("Failed to copy VA number");
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isQris) onClose();
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Pembayaran</h3>
                <p className="text-xs text-[#9B00E8] font-bold mt-0.5">{paymentMethodName}</p>
              </div>
              {!isQris && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isQris ? (
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="bg-purple-50/50 rounded-2xl p-4 w-full border border-purple-100/50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{formatRupiah(totalAmount)}</p>
                </div>

                <div className="relative w-48 h-48 border border-gray-200 rounded-3xl overflow-hidden p-2 bg-white shadow-inner flex items-center justify-center">
                  <Image 
                    src="/img/payment_qr_code.jpg" 
                    alt="QRIS Payment QR Code"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100/70 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Batas Waktu: {formatTime(countdown)}</span>
                </div>

                <div className="text-xs text-gray-400 font-medium pt-3 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#9B00E8] rounded-full animate-ping" />
                    <span>Mendeteksi pembayaran otomatis...</span>
                  </div>
                  <p className="text-[10px] text-gray-300 font-bold">Mengarahkan ke halaman transaksi dalam 3 detik</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{gameName}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{packageName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tagihan</p>
                    <p className="text-sm font-black text-gray-900">{formatRupiah(totalAmount)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {paymentMethodId === "bca" ? "Nomor Virtual Account" : "Nomor HP / E-Wallet ID"}
                  </label>
                  
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                    <span className="font-mono text-base font-black text-gray-800 tracking-wider">
                      {vaNumber}
                    </span>
                    <button
                      onClick={handleCopyVa}
                      className="text-[#9B00E8] hover:text-[#7a00b8] transition-colors p-1.5 bg-white border border-purple-100/50 rounded-xl"
                      title="Salin Nomor"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2.5 p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100/50 text-xs text-purple-700 font-medium">
                  <AlertCircle className="w-4.5 h-4.5 text-[#9B00E8] flex-shrink-0" />
                  <p>{paymentInstructions}</p>
                </div>
                <button
                  onClick={handleManualPay}
                  className="w-full bg-[#9B00E8] hover:bg-[#8500c7] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-purple-500/10 hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Saya Sudah Bayar</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
