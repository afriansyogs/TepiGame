"use client";

import React from "react";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import { User as UserIcon, Calendar, Edit3 } from "lucide-react";

interface ProfileHeaderProps {
  displayName: string | null;
  photoURL: string | null;
  role: string;
  createdAt: unknown;
  onEditClick: () => void;
}

export default function ProfileHeader({
  displayName,
  photoURL,
  role,
  createdAt,
  onEditClick
}: ProfileHeaderProps) {
  
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
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8 relative">
      <div className="h-40 md:h-48 bg-gradient-to-r from-[#2A0054] to-[#9B00E8] relative">
        <div className="absolute top-0 right-0 w-80 h-full bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      </div>
      
      <div className="px-6 md:px-8 pb-8 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative shadow-md">
          {photoURL ? (
            <Image src={photoURL} alt="Profile Picture" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-50 text-[#9B00E8]">
              <UserIcon className="w-16 h-16 stroke-[1.5]" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left pt-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {displayName || "User"}
            </h1>
            <span className="self-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#9B00E8] border border-purple-100">
              {role.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-500 mt-1.5 flex items-center justify-center md:justify-start gap-1 text-sm font-medium">
            <Calendar className="w-4 h-4 text-gray-400" />
            Joined {formatJoinedDate(createdAt)}
          </p>
        </div>

        <button
          onClick={onEditClick}
          className="inline-flex items-center gap-2 bg-[#9B00E8]/10 hover:bg-[#9B00E8]/20 text-[#9B00E8] px-5 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profil
        </button>
      </div>
    </div>
  );
}
