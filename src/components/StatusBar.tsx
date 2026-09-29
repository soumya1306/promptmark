"use client";

import React from "react";

interface StatusBarProps {
  isPageless: boolean;
  setIsPageless: (val: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (val: number | ((prev: number) => number)) => void;
  wordCount: number;
  readingTimeMinutes: number;
  onOpenWordStats: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isPageless,
  setIsPageless,
  zoomLevel,
  setZoomLevel,
  wordCount,
  readingTimeMinutes,
  onOpenWordStats,
}) => {
  return (
    <footer className="h-9 bg-[#fbfaf8] border-t border-[#e4e0d8] text-[#5e5548] flex items-center justify-between px-3 md:px-4 text-[12px] select-none shrink-0 z-50 shadow-2xs">
      {/* Left document statistics */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 font-bold text-[#2e3230] shrink-0">
          <span className="material-symbols-outlined text-[15px] text-[#74796e]">description</span>
          <span>Page 1 of 4</span>
        </div>

        <div className="h-3 w-px bg-[#e4e0d8]"></div>

        <button
          onClick={onOpenWordStats}
          className="hover:text-[#2e3230] hover:underline cursor-pointer shrink-0 transition-colors"
          title="Click to view detailed statistics"
        >
          {wordCount.toLocaleString()} words
        </button>

        <div className="h-3 w-px bg-[#e4e0d8] hidden sm:block"></div>

        <span className="hidden sm:inline shrink-0">{readingTimeMinutes} min read</span>

        <div className="h-3 w-px bg-[#e4e0d8] hidden md:block"></div>

        <div className="hidden md:flex items-center gap-1.5 text-[#4a7c59] font-bold shrink-0">
          <span className="material-symbols-outlined text-[15px]">check_circle</span>
          <span className="text-[#5e5548] font-normal">All systems synced</span>
        </div>
      </div>

      {/* Right view modes & zoom */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-1 bg-[#f0ece4] px-1 py-0.5 rounded-lg border border-[#e6e2da]">
          <button
            onClick={() => setIsPageless(false)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              !isPageless ? "bg-white text-[#2e3230] shadow-2xs" : "text-[#5e5548] hover:text-[#2e3230]"
            }`}
          >
            Print
          </button>
          <button
            onClick={() => setIsPageless(true)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              isPageless ? "bg-white text-[#2e3230] shadow-2xs" : "text-[#5e5548] hover:text-[#2e3230]"
            }`}
          >
            Pageless
          </button>
        </div>

        <div className="h-3 w-px bg-[#e4e0d8]"></div>

        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#ede8df] text-[#5e5548] hover:text-[#2e3230] font-bold"
            title="Zoom out"
          >
            -
          </button>
          <span
            onClick={() => setZoomLevel(100)}
            className="w-9 text-center cursor-pointer hover:underline text-[#2e3230]"
            title="Reset zoom to 100%"
          >
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#ede8df] text-[#5e5548] hover:text-[#2e3230] font-bold"
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>
    </footer>
  );
};
