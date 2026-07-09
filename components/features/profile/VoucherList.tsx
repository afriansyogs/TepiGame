"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { Voucher } from "@/services/rewardService";
import { Ticket, Copy, Check } from "lucide-react";

interface VoucherListProps {
  vouchers: Voucher[];
  onCopySuccess: (message: string) => void;
}

export default function VoucherList({ vouchers, onCopySuccess }: VoucherListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      onCopySuccess("Kode voucher berhasil disalin!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.log("Failed to copy code")
    }
  };

  const formatJoinedDate = (dateVal: unknown) => {
    if (!dateVal) return "-";
    let dateObj: Date;
    if (dateVal instanceof Timestamp) {
      dateObj = dateVal.toDate();
    } else if (dateVal instanceof Date) {
      dateObj = dateVal;
    } else if (typeof dateVal === "object" && dateVal !== null && "toDate" in dateVal) {
      dateObj = (dateVal as { toDate: () => Date }).toDate();
    } else if (typeof dateVal === "string" || typeof dateVal === "number") {
      dateObj = new Date(dateVal);
    } else {
      return "-";
    }

    return dateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Ticket className="w-5.5 h-5.5 text-[#9B00E8]" />
        Voucher Saya
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouchers.map((voucher) => (
          <div 
            key={voucher.id} 
            className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between ${
              voucher.isUsed 
                ? "bg-gray-50/50 border-gray-100" 
                : "bg-gradient-to-r from-purple-50/20 to-purple-50/40 border-purple-100/70"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                  voucher.isUsed 
                    ? "bg-gray-100 text-gray-400 border-gray-200" 
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                }`}>
                  {voucher.isUsed ? "Terpakai" : "Tersedia"}
                </span>
              </div>
              
              <h4 className={`font-bold text-base mb-1 ${voucher.isUsed ? "text-gray-400" : "text-gray-800"}`}>
                {voucher.name}
              </h4>
              <p className="text-[11px] text-gray-400 font-medium">
                Redeemed at: {formatJoinedDate(voucher.redeemedAt)}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kode Voucher</p>
                <p className={`font-mono text-sm font-bold truncate ${
                  voucher.isUsed ? "text-gray-400 line-through" : "text-purple-700"
                }`}>
                  {voucher.voucherCode}
                </p>
              </div>

              {!voucher.isUsed && (
                <button
                  onClick={() => handleCopyCode(voucher.voucherCode, voucher.id)}
                  className="flex-shrink-0 w-8.5 h-8.5 rounded-xl bg-white border border-purple-100 text-[#9B00E8] hover:bg-purple-50/50 flex items-center justify-center transition-colors active:scale-90"
                  title="Copy Code"
                >
                  {copiedId === voucher.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {vouchers.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3 opacity-70" />
            <p className="text-gray-500 font-semibold text-sm">Kamu belum menukarkan voucher apapun.</p>
            <p className="text-xs text-gray-400 mt-1">Kumpulkan Tepi Points dan redeem di halaman Tukar Point.</p>
            <Link 
              href="/tukar-point" 
              className="inline-block mt-4 text-xs font-extrabold text-[#9B00E8] hover:underline"
            >
              Pergi ke Tukar Point &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
