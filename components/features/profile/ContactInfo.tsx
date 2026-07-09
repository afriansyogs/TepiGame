"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";

interface ContactInfoProps {
  email: string | null;
  phoneNumber: string | null;
}

export default function ContactInfo({ email, phoneNumber }: ContactInfoProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Kontak</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            <Mail className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{email || "-"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            <Phone className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nomor HP</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{phoneNumber || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
