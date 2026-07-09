"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Loader2, 
  Gamepad2, 
  CreditCard, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles
} from "lucide-react";

function TransactionFlowContent() {
  const searchParams = useSearchParams();
  
  const txId = searchParams.get("id") || "TX-MLBB-92841";
  const gameName = searchParams.get("game") || "Mobile Legends: Bang Bang";
  const gameImageUrl = searchParams.get("image") || "/img/mobile_legends.jpg";
  const packageName = searchParams.get("package") || "926 Diamonds";
  const grossAmount = parseInt(searchParams.get("amount") || "235000");
  const paymentMethod = searchParams.get("method") || "BCA Virtual Account";
  const gameUserId = searchParams.get("userId") || "12345678";
  const gameZoneId = searchParams.get("zoneId") || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
    }, 2000);

    const timer2 = setTimeout(() => {
      setCurrentStep(2);
    }, 4000);

    const timer3 = setTimeout(() => {
      setCurrentStep(3);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(txId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.log("Failed to copy transaction ID");
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  const steps = [
    {
      title: "Pembayaran Diterima",
      description: "Pembayaran terverifikasi secara otomatis.",
      loadingText: "Memverifikasi dana...",
      successText: "Dana Diterima",
      index: 0
    },
    {
      title: "Pesanan Diproses",
      description: "Menghubungkan ke server game & antrian pengiriman.",
      loadingText: "Memasukkan item ke server...",
      successText: "Item Berhasil Diproses",
      index: 1
    },
    {
      title: "Top Up Selesai",
      description: "Diamonds berhasil masuk ke akun game Anda.",
      loadingText: "Mengirim Diamonds...",
      successText: "Diamonds Terkirim!",
      index: 2
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 pt-10 md:12 pb-16">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-3xl">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#9B00E8] border border-purple-100 mb-3">
              <Gamepad2 className="w-3.5 h-3.5" />
              Proses Transaksi Langsung
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {currentStep === 0 && "Memverifikasi Pembayaran"}
              {currentStep === 1 && "Memproses Pengiriman"}
              {currentStep === 2 && "Mengirim Diamonds ke Akun..."}
              {currentStep === 3 && "Top Up Anda Berhasil!"}
            </h1>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">
              {currentStep < 3 
                ? "Mohon tunggu sebentar, sistem sedang memproses pesanan Anda." 
                : "Diamond telah berhasil ditambahkan ke akun Anda. Selamat bermain!"}
            </p>
          </div>
          
          <div className="relative mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 md:px-6">
            <div className="hidden md:block absolute top-[21px] left-12 right-12 h-1 bg-gray-100 -z-0">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-[#9B00E8]"
                initial={{ width: "0%" }}
                animate={{ width: currentStep === 0 ? "25%" : currentStep === 1 ? "65%" : "100%" }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="md:hidden absolute left-[21px] top-6 bottom-6 w-1 bg-gray-100 -z-0">
              <motion.div 
                className="w-full bg-gradient-to-b from-purple-500 to-[#9B00E8]"
                initial={{ height: "0%" }}
                animate={{ height: currentStep === 0 ? "25%" : currentStep === 1 ? "65%" : "100%" }}
                transition={{ duration: 1 }}
              />
            </div>

            {/* Render Steps */}
            {steps.map((step) => {
              const isActive = currentStep === step.index;
              const isCompleted = currentStep > step.index;
              const isPending = currentStep < step.index;

              return (
                <div key={step.index} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 relative z-10 w-full">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                      : isActive 
                        ? "bg-[#9B00E8] border-[#9B00E8] text-white shadow-lg shadow-purple-500/25 scale-110" 
                        : "bg-white border-gray-200 text-gray-400"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5.5 h-5.5 stroke-[2.5]" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="text-sm font-bold">{step.index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 md:text-center min-w-0">
                    <h4 className={`text-sm font-black transition-colors ${
                      isPending ? "text-gray-400" : "text-gray-900"
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs mt-0.5 font-medium leading-relaxed ${
                      isActive ? "text-[#9B00E8] font-bold" : "text-gray-400"
                    }`}>
                      {isActive ? step.loadingText : isCompleted ? step.successText : step.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
          {currentStep === 3 && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-10 -right-10 text-yellow-400/20 pointer-events-none"
            >
              <Sparkles className="w-36 h-36 rotate-12" />
            </motion.div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-4 mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            Rincian Pesanan
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-20 h-20 rounded-2xl overflow-hidden relative border border-gray-100 flex-shrink-0 bg-gray-100">
                <Image 
                  src={gameImageUrl} 
                  alt={gameName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">{gameName}</h3>
                <p className="text-sm font-bold text-[#9B00E8]">{packageName}</p>
                <p className="text-xs text-gray-400 mt-1 font-semibold">User ID: {gameUserId} {gameZoneId ? `(${gameZoneId})` : ""}</p>
              </div>
            </div>
            <div className="hidden sm:block w-[1px] self-stretch bg-gray-100" />
            <div className="flex flex-col gap-3.5 w-full sm:w-auto sm:min-w-48 text-sm font-semibold">
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <span className="text-gray-400 font-bold min-w-24">Nomor Ref:</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-gray-700 font-bold">{txId}</span>
                  <button 
                    onClick={handleCopyId}
                    className="text-gray-400 hover:text-[#9B00E8] transition-colors p-1"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <span className="text-gray-400 font-bold min-w-24">Metode:</span>
                <span className="text-gray-700">{paymentMethod}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8 pt-3 border-t border-gray-100">
                <span className="text-gray-900 font-black min-w-24">Total Bayar:</span>
                <span className="text-base font-black text-[#9B00E8]">{formatRupiah(grossAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {currentStep === 3 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/" 
                className="flex-1 bg-white hover:bg-gray-50 text-gray-600 py-3.5 rounded-2xl font-bold text-center border border-gray-200 transition-all hover:shadow-sm"
              >
                Kembali ke Beranda
              </Link>
              <Link 
                href="/transactions" 
                className="flex-1 bg-[#9B00E8] hover:bg-[#8500c7] text-white py-3.5 rounded-2xl font-bold text-center shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>Lihat Riwayat Transaksi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TransactionFlowPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#9B00E8] animate-spin" />
      </div>
    }>
      <TransactionFlowContent />
    </Suspense>
  );
}
