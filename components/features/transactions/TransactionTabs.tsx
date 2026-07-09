"use client";

import React from "react";

type TabType = "ALL" | "SUCCESS" | "PENDING" | "FAILED";

interface TransactionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TransactionTabs({ activeTab, onTabChange }: TransactionTabsProps) {
  const tabs = [
    { id: "ALL", label: "Semua" },
    { id: "SUCCESS", label: "Berhasil" },
    { id: "PENDING", label: "Tertunda" },
    { id: "FAILED", label: "Gagal" }
  ] as const;

  return (
    <div className="bg-white rounded-3xl p-2.5 shadow-sm border border-gray-100 flex gap-2 mb-8 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === tab.id
              ? "bg-[#9B00E8] text-white shadow-md shadow-purple-500/10"
              : "text-gray-500 hover:bg-purple-50/50 hover:text-[#9B00E8]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
