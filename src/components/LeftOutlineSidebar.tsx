"use client";

import React from "react";

interface LeftOutlineSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showCallout: boolean;
  showTable: boolean;
  onOpenStatsModal: () => void;
}

export const LeftOutlineSidebar: React.FC<LeftOutlineSidebarProps> = ({
  isOpen,
  onClose,
  showCallout,
  showTable,
  onOpenStatsModal,
}) => {
  if (!isOpen) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-3 sticky top-4 select-none">
      <div className="bg-[#fbfaf8] rounded-xl p-3.5 border border-[#e4e0d8] shadow-[0_2px_12px_rgba(74,124,89,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#e4e0d8]">
          <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#2d4e36]">
            <span className="material-symbols-outlined text-[17px] text-[#4a7c59]">list_alt</span>
            <span>Document Outline</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#74796e] hover:text-[#2e3230] p-1 rounded hover:bg-[#f0ece4] transition-colors"
            title="Collapse sidebar"
          >
            <span className="material-symbols-outlined text-[16px]">dock_to_right</span>
          </button>
        </div>

        {/* Outline Navigation items */}
        <nav className="space-y-1 text-[12px]">
          <button
            onClick={() => scrollToSection("section-1")}
            className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#e2efe6] text-[#4a7c59] font-bold border-l-2 border-[#4a7c59] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_right</span>
            <span className="truncate">1. Executive Summary &amp; Market Drivers</span>
          </button>

          {showCallout && (
            <button
              onClick={() => scrollToSection("callout-block")}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#5e5548] hover:text-[#2e3230] hover:bg-[#f0ece4] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] text-[#a49f95]">lightbulb</span>
              <span className="truncate">Strategic Alignment Note</span>
            </button>
          )}

          {showTable && (
            <button
              onClick={() => scrollToSection("table-block")}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#5e5548] hover:text-[#2e3230] hover:bg-[#f0ece4] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[14px] text-[#a49f95]">table_chart</span>
              <span className="truncate">Target Milestones Table</span>
            </button>
          )}

          <button
            onClick={() => scrollToSection("section-2")}
            className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#5e5548] hover:text-[#2e3230] hover:bg-[#f0ece4] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[14px] text-[#a49f95]">chevron_right</span>
            <span className="truncate">2. Q3 Readiness Deliverables</span>
          </button>
        </nav>

        {/* Document Stats Card */}
        <div className="mt-4 pt-3 border-t border-[#e4e0d8] bg-[#f5f1ea] -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#5e5548] mb-2">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#4a7c59]">bar_chart</span>
              Document Stats
            </span>
            <span className="text-[#4a7c59] bg-[#e2efe6] px-1.5 py-0.2 rounded text-[10px] font-semibold border border-[#4a7c59]/20">
              Optimal
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div
              onClick={onOpenStatsModal}
              className="bg-white p-1.5 rounded-lg border border-[#e4e0d8] cursor-pointer hover:bg-[#fbfaf8] transition-colors"
            >
              <span className="text-[#74796e] block text-[10px]">Word count</span>
              <span className="font-bold text-[#2e3230]">1,420 words</span>
            </div>
            <div
              onClick={onOpenStatsModal}
              className="bg-white p-1.5 rounded-lg border border-[#e4e0d8] cursor-pointer hover:bg-[#fbfaf8] transition-colors"
            >
              <span className="text-[#74796e] block text-[10px]">Reading time</span>
              <span className="font-bold text-[#2e3230]">5 min read</span>
            </div>
          </div>

          <div
            onClick={onOpenStatsModal}
            className="mt-2 bg-white p-1.5 rounded-lg border border-[#e4e0d8] flex items-center justify-between text-[11px] cursor-pointer hover:bg-[#fbfaf8] transition-colors"
          >
            <span className="text-[#74796e]">Readability</span>
            <span className="font-bold text-[#4a7c59]">Grade 9.2 (Good)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
