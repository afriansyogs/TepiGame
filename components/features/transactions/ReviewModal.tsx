"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2 } from "lucide-react";
import { Transaction } from "./types";

interface ReviewModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSubmitSuccess: (txId: string) => void;
  onShowToast: (message: string) => void;
}

export default function ReviewModal({
  isOpen,
  transaction,
  onClose,
  onSubmitSuccess,
  onShowToast
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setRating(5);
        setComment("");
      }, 0);
    }
  }, [isOpen]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitSuccess(transaction.id);
      onShowToast("Ulasan berhasil dikirim! Terima kasih.");
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && transaction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!isSubmitting) onClose(); }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden"
          >
            
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-50">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Beri Ulasan Game</h3>
                <p className="text-xs text-gray-400 font-bold mt-0.5">{transaction.gameName}</p>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div className="flex flex-col items-center py-2 bg-gray-50 rounded-2xl border border-gray-100/50">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Peringkat Kamu</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isHighlighted = hoverRating !== null ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform active:scale-90"
                        title={`${star} Bintang`}
                        disabled={isSubmitting}
                      >
                        <Star 
                          className={`w-8 h-8 transition-colors ${
                            isHighlighted 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "fill-gray-100 text-gray-200"
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-[#9B00E8] mt-2">
                  {rating === 1 && "Buruk Sekali"}
                  {rating === 2 && "Kurang Baik"}
                  {rating === 3 && "Cukup"}
                  {rating === 4 && "Bagus"}
                  {rating === 5 && "Sangat Bagus!"}
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ulasan Anda</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#9B00E8] focus:ring-2 focus:ring-[#9B00E8]/10 resize-none"
                  placeholder="Tulis ulasan Anda mengenai game ini..."
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer text-center disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#9B00E8] hover:bg-[#8500c7] text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-98 disabled:opacity-75 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Ulasan</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
