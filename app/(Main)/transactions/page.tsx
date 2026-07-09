"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ChevronLeft, 
  CheckCircle2
} from "lucide-react";

import { Transaction } from "@/components/features/transactions/types";
import TransactionTabs from "@/components/features/transactions/TransactionTabs";
import TransactionCard from "@/components/features/transactions/TransactionCard";
import ReviewModal from "@/components/features/transactions/ReviewModal";
import PaymentModal from "@/components/features/transactions/PaymentModal";

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-MLBB-92841",
    userId: "user-123",
    gameId: "mobile-legends-bang-bang",
    gameName: "Mobile Legends: Bang Bang",
    gameImageUrl: "/img/mobile_legends.jpg",
    packageId: "mlbb-926",
    packageAmount: 926,
    itemName: "Diamonds",
    gameUserId: "12345678",
    gameZoneId: "1234",
    paymentMethod: "BCA Virtual Account",
    grossAmount: 235000,
    pointsEarned: 20,
    status: "SUCCESS",
    createdAt: "2026-07-08T14:32:00Z",
    isReviewed: false,
  },
  {
    id: "TX-VAL-74910",
    userId: "user-123",
    gameId: "valorant",
    gameName: "Valorant",
    gameImageUrl: "/img/valorant.jpg",
    packageId: "val-1125",
    packageAmount: 1125,
    itemName: "Points",
    gameUserId: "RiotGamer#IDN",
    paymentMethod: "QRIS",
    grossAmount: 135000,
    pointsEarned: 0,
    status: "PENDING",
    createdAt: "2026-07-09T12:00:00Z",
    isReviewed: false,
  },
  {
    id: "TX-PUBG-58194",
    userId: "user-123",
    gameId: "pubg-mobile",
    gameName: "PUBG Mobile",
    gameImageUrl: "/img/pubg_mobile.jpg",
    packageId: "pubg-660",
    packageAmount: 660,
    itemName: "UC",
    gameUserId: "592810482",
    paymentMethod: "OVO",
    grossAmount: 145000,
    pointsEarned: 20,
    status: "SUCCESS",
    createdAt: "2026-07-05T09:12:00Z",
    isReviewed: true,
  },
  {
    id: "TX-FF-29402",
    userId: "user-123",
    gameId: "free-fire",
    gameName: "Free Fire",
    gameImageUrl: "/img/free_fire.jpg",
    packageId: "ff-355",
    packageAmount: 355,
    itemName: "Diamonds",
    gameUserId: "99824102",
    paymentMethod: "Dana",
    grossAmount: 50000,
    pointsEarned: 0,
    status: "SUCCESS",
    createdAt: "2026-07-02T18:45:00Z",
    isReviewed: false,
  },
  {
    id: "TX-HOK-10294",
    userId: "user-123",
    gameId: "honor-of-kings",
    gameName: "Honor of Kings",
    gameImageUrl: "/img/honor_of_kings.jpg",
    packageId: "hok-240",
    packageAmount: 240,
    itemName: "Tokens",
    gameUserId: "HoKMaster",
    paymentMethod: "GoPay",
    grossAmount: 48000,
    pointsEarned: 0,
    status: "FAILED",
    createdAt: "2026-06-28T11:20:00Z",
    isReviewed: false,
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<"ALL" | "SUCCESS" | "PENDING" | "FAILED">("ALL");
  
  // Modals States
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedPaymentTx, setSelectedPaymentTx] = useState<Transaction | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenReview = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsReviewOpen(true);
  };

  const handleReviewSuccess = (txId: string) => {
    setTransactions(prev => 
      prev.map(t => t.id === txId ? { ...t, isReviewed: true } : t)
    );
  };

  const getPaymentMethodId = (methodName: string) => {
    const lower = methodName.toLowerCase();
    if (lower.includes("qris")) return "qris";
    if (lower.includes("bca")) return "bca";
    if (lower.includes("ovo")) return "ovo";
    if (lower.includes("dana")) return "dana";
    if (lower.includes("gopay")) return "gopay";
    return "bca";
  };

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === "ALL") return true;
    return tx.status === activeTab;
  });

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 pt-10 md:pt-12 pb-16">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-4xl">
        
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#9B00E8] font-bold text-sm transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke Profil
          </Link>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <CreditCard className="w-8 h-8 text-[#9B00E8]" />
              Riwayat Transaksi
            </h1>
            <p className="text-gray-500 mt-1.5 font-medium">Pantau seluruh status pesanan top-up game kamu di sini.</p>
          </div>
        </div>

        <TransactionTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="space-y-6">
          {filteredTransactions.map((tx) => (
            <TransactionCard 
              key={tx.id}
              tx={tx}
              onWriteReview={handleOpenReview}
              onCopySuccess={showToast}
              onPayNow={(targetTx) => setSelectedPaymentTx(targetTx)}
            />
          ))}

          {filteredTransactions.length === 0 && (
            <div className="w-full bg-white rounded-3xl p-12 text-center border border-gray-100">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-70" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak ada transaksi</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Kamu tidak memiliki transaksi dengan status ini. Coba ubah filter atau lakukan top-up game pertamamu!
              </p>
              <Link 
                href="/product" 
                className="inline-block mt-6 bg-[#9B00E8] text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#8500c7] transition-colors"
              >
                Top Up Sekarang
              </Link>
            </div>
          )}
        </div>

      </div>

      <ReviewModal 
        isOpen={isReviewOpen}
        transaction={selectedTx}
        onClose={() => setIsReviewOpen(false)}
        onSubmitSuccess={handleReviewSuccess}
        onShowToast={showToast}
      />

      {selectedPaymentTx && (
        <PaymentModal 
          isOpen={!!selectedPaymentTx}
          onClose={() => setSelectedPaymentTx(null)}
          gameName={selectedPaymentTx.gameName}
          gameImageUrl={selectedPaymentTx.gameImageUrl}
          packageName={`${selectedPaymentTx.packageAmount} ${selectedPaymentTx.itemName}`}
          totalAmount={selectedPaymentTx.grossAmount}
          paymentMethodName={selectedPaymentTx.paymentMethod}
          paymentMethodId={getPaymentMethodId(selectedPaymentTx.paymentMethod)}
          gameUserId={selectedPaymentTx.gameUserId}
          gameZoneId={selectedPaymentTx.gameZoneId}
        />
      )}

    </div>
  );
}
