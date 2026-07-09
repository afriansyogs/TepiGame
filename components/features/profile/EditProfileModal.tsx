"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, Loader2 } from "lucide-react";
import { updateUserProfile } from "@/services/userService";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  initialName: string;
  initialPhone: string;
  onUpdateSuccess: (name: string, phone: string | null) => void;
  onShowToast: (message: string, type: "success" | "error") => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  uid,
  initialName,
  initialPhone,
  onUpdateSuccess,
  onShowToast
}: EditProfileModalProps) {
  const [editName, setEditName] = useState(initialName);
  const [editPhone, setEditPhone] = useState(initialPhone);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setEditName(initialName);
        setEditPhone(initialPhone);
        setUpdateError("");
      }, 0);
    }
  }, [isOpen, initialName, initialPhone]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim()) {
      setUpdateError("Nama lengkap tidak boleh kosong.");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      await updateUserProfile(uid, {
        displayName: editName.trim(),
        phoneNumber: editPhone.trim() || null,
      });

      onUpdateSuccess(editName.trim(), editPhone.trim() || null);
      onShowToast("Profil berhasil diperbarui!", "success");
      onClose();
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      setUpdateError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui profil.");
    } finally {
      setIsUpdating(false);
    }
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
              if (!isUpdating) onClose();
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden"
          >
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Edit Data Profil</h3>
              <button
                onClick={onClose}
                disabled={isUpdating}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {updateError && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#9B00E8] focus:ring-2 focus:ring-[#9B00E8]/10"
                  placeholder="Masukkan nama lengkap"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor Handphone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#9B00E8] focus:ring-2 focus:ring-[#9B00E8]/10"
                  placeholder="Contoh: 08123456789"
                  disabled={isUpdating}
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUpdating}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer text-center disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-[#9B00E8] hover:bg-[#8500c7] text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-98 disabled:opacity-75 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
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
