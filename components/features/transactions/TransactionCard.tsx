"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Transaction } from "./types";
import { 
  Calendar, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Coins, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight 
} from "lucide-react";

interface TransactionCardProps {
  tx: Transaction;
  onWriteReview: (tx: Transaction) => void;
  onCopySuccess: (message: string) => void;
  onPayNow: (tx: Transaction) => void;
}

export default function TransactionCard({
  tx,
  onWriteReview,
  onCopySuccess,
  onPayNow
}: TransactionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      onCopySuccess("ID Transaksi berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.log("Gagal menyalin ID Transaksi");
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  const formatTxDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-5">
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 font-bold">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatTxDate(tx.createdAt)}
          </span>
          <span className="hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-gray-500">{tx.id}</span>
            <button 
              onClick={() => handleCopyId(tx.id)}
              className="text-gray-400 hover:text-[#9B00E8] transition-colors"
              title="Salin ID Transaksi"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div>
          {tx.status === "SUCCESS" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Berhasil
            </span>
          )}
          {tx.status === "PENDING" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              Tertunda
            </span>
          )}
          {tx.status === "FAILED" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
              <AlertCircle className="w-3.5 h-3.5" />
              Gagal
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 flex-shrink-0 bg-gray-100">
            <Image 
              src={tx.gameImageUrl} 
              alt={tx.gameName}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="font-extrabold text-gray-900 text-base md:text-lg leading-tight mb-1">
              {tx.gameName}
            </h3>
            <p className="text-sm font-bold text-gray-500">
              {tx.packageAmount} {tx.itemName}
            </p>
            <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-wide">
              ID: {tx.gameUserId} {tx.gameZoneId ? `(${tx.gameZoneId})` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-col items-baseline md:items-end justify-between md:justify-center gap-2 md:gap-1.5 pt-4 md:pt-0 border-t border-dashed border-gray-100 md:border-none">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider md:text-right">Metode</p>
            <p className="text-xs font-semibold text-gray-600 md:text-right">{tx.paymentMethod}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider md:text-right">Harga</p>
            <p className="text-base md:text-lg font-black text-gray-900 md:text-right">
              {formatRupiah(tx.grossAmount)}
            </p>
          </div>
        </div>

      </div>

      {tx.status === "SUCCESS" && (
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-1.5 text-[#9B00E8] bg-purple-50/50 px-3.5 py-1.5 rounded-full border border-purple-100/50">
            <Coins className="w-4 h-4" />
            <span className="text-xs font-extrabold">+ {tx.pointsEarned} Points</span>
          </div>
          <div>
            {tx.isReviewed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Sudah Diulas
              </span>
            ) : (
              <button
                onClick={() => onWriteReview(tx)}
                className="inline-flex items-center gap-1.5 bg-[#9B00E8]/10 hover:bg-[#9B00E8]/20 text-[#9B00E8] px-4.5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Tulis Ulasan
              </button>
            )}
          </div>
        </div>
      )}
      {tx.status === "PENDING" && (
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-end">
          <button 
            className="inline-flex items-center gap-1.5 bg-[#9B00E8] hover:bg-[#8500c7] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            onClick={() => onPayNow(tx)}
          >
            Bayar Sekarang
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
