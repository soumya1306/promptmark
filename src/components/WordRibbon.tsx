"use client";

import React, { useState } from "react";
import { RibbonTab } from "./types";

interface WordRibbonProps {
  activeTab: RibbonTab;
  setActiveTab: (tab: RibbonTab) => void;
  trackChangesOn: boolean;
  setTrackChangesOn: (val: boolean) => void;
  outlineOpen: boolean;
  setOutlineOpen: (val: boolean) => void;
  showRulers: boolean;
  setShowRulers: (val: boolean) => void;
  onOpenShortcuts: () => void;
  onOpenCopilot: () => void;
  onOpenComment: () => void;
  onInsertCallout: () => void;
  onInsertTable: (rows: number, cols: number) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onExport: (format: string) => void;
  onOpenWordStats: () => void;
  reviewPaneOpen: boolean;
  setReviewPaneOpen: (val: boolean) => void;
}

export const WordRibbon: React.FC<WordRibbonProps> = ({
  activeTab,
  setActiveTab,
  trackChangesOn,
  setTrackChangesOn,
  outlineOpen,
  setOutlineOpen,
  showRulers,
  setShowRulers,
  onOpenShortcuts,
  onOpenCopilot,
  onOpenComment,
  onInsertCallout,
  onInsertTable,
  onAcceptAll,
  onRejectAll,
  onExport,
  onOpenWordStats,
  reviewPaneOpen,
  setReviewPaneOpen,
}) => {
  // Local formatting state for Home tab
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Nunito Sans");
  const [headingStyle, setHeadingStyle] = useState("Heading 2");
  const [alignment, setAlignment] = useState<"left" | "center" | "right" | "justify">("left");
  const [lineSpacing, setLineSpacing] = useState("1.15");

  // Layout tab states
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [marginSetting, setMarginSetting] = useState("Normal (1\")");
  const [showLineNumbers, setShowLineNumbers] = useState(false);

  // Table picker popup state for Insert tab
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [hoverGrid, setHoverGrid] = useState({ r: 3, c: 3 });

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Dropdown menus
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showMarkupMenu, setShowMarkupMenu] = useState(false);
  const [selectedMarkup, setSelectedMarkup] = useState("All Markup");

  return (
    <div className="bg-[#fbfaf8] border-b border-[#e6e2da] shrink-0 z-40 select-none transition-colors">
      {/* 1. RIBBON TAB HEADERS ROW */}
      <div className="flex items-center justify-between px-3 md:px-4 border-b border-[#e6e2da] bg-[#f5f1ea] text-[13px]">
        <div className="flex items-center gap-1 -mb-px overflow-x-auto no-scrollbar">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] transition-colors rounded-t-xl shrink-0 ${activeTab === "home"
                ? "font-bold text-[#4a7c59] border-b-2 border-[#4a7c59] bg-[#fbfaf8] shadow-2xs"
                : "font-medium text-[#6b6358] hover:text-[#2e3230] hover:bg-[#fbfaf8]/70 border-b-2 border-transparent"
              }`}
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Home</span>
          </button>

          {/* Insert Tab */}
          <button
            onClick={() => setActiveTab("insert")}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] transition-colors rounded-t-xl shrink-0 ${activeTab === "insert"
                ? "font-bold text-[#4a7c59] border-b-2 border-[#4a7c59] bg-[#fbfaf8] shadow-2xs"
                : "font-medium text-[#6b6358] hover:text-[#2e3230] hover:bg-[#fbfaf8]/70 border-b-2 border-transparent"
              }`}
          >
            <span className="material-symbols-outlined text-[15px]">add_circle</span>
            <span>Insert</span>
          </button>

          {/* Review & Changes Tab */}
          <button
            onClick={() => setActiveTab("review")}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] transition-colors rounded-t-xl relative shrink-0 ${activeTab === "review"
                ? "font-bold text-[#4a7c59] border-b-2 border-[#4a7c59] bg-[#fbfaf8] shadow-2xs"
                : "font-medium text-[#6b6358] hover:text-[#2e3230] hover:bg-[#fbfaf8]/70 border-b-2 border-transparent"
              }`}
          >
            <span className="material-symbols-outlined text-[15px]">rate_review</span>
            <span>Review & Changes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#eaf2ec] text-[#4a7c59] ml-1 border border-[#4a7c59]/20">
              4
            </span>
          </button>

          {/* Layout & Tools Tab */}
          <button
            onClick={() => setActiveTab("layout")}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] transition-colors rounded-t-xl shrink-0 ${activeTab === "layout"
                ? "font-bold text-[#4a7c59] border-b-2 border-[#4a7c59] bg-[#fbfaf8] shadow-2xs"
                : "font-medium text-[#6b6358] hover:text-[#2e3230] hover:bg-[#fbfaf8]/70 border-b-2 border-transparent"
              }`}
          >
            <span className="material-symbols-outlined text-[15px]">dashboard_customize</span>
            <span>Layout & Tools</span>
          </button>
        </div>

        {/* Right Tab Status & Shortcuts */}
        <div className="flex items-center gap-2 shrink-0 py-1">
          <button
            onClick={() => setTrackChangesOn(!trackChangesOn)}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${trackChangesOn
                ? "text-[#4a7c59] bg-[#eaf2ec] border-[#4a7c59]/30"
                : "text-[#6b6358] bg-[#f0ece4] border-[#e6e2da] opacity-75"
              }`}
            title="Toggle Track Changes"
          >
            <span
              className={`w-2 h-2 rounded-full ${trackChangesOn ? "bg-[#4a7c59] animate-pulse" : "bg-[#74796e]"
                }`}
            ></span>
            <span>Track Changes {trackChangesOn ? "ON" : "OFF"}</span>
          </button>

          <div className="h-3 w-px bg-[#e6e2da] hidden sm:block"></div>

          <button
            onClick={onOpenShortcuts}
            className="h-6 px-2 rounded-lg hover:bg-white text-[11px] font-medium text-[#6b6358] hover:text-[#2e3230] flex items-center gap-1 transition-colors"
            title="Keyboard Shortcuts"
          >
            <span className="material-symbols-outlined text-[14px]">keyboard_command_key</span>
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC RIBBON TOOLBAR ROW */}
      <div className="px-3 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-[13px] bg-[#fbfaf8]">
        {/* TAB 1: HOME TAB TOOLS */}
        {activeTab === "home" && (
          <>
            <div className="flex items-center gap-1 min-w-max">
              {/* History & Clipboard */}
              <div className="flex items-center gap-0.5" title="History & Clipboard">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Undo (⌘Z)"
                >
                  <span className="material-symbols-outlined text-[17px]">undo</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Redo (⌘Y)"
                >
                  <span className="material-symbols-outlined text-[17px]">redo</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Format Painter"
                >
                  <span className="material-symbols-outlined text-[17px]">imagesearch_roller</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#b83230] transition-colors"
                  title="Clear formatting"
                >
                  <span className="material-symbols-outlined text-[17px]">format_clear</span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Typography Group */}
              <div className="flex items-center gap-1 relative" title="Typography">
                {/* Heading selector */}
                <div
                  onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#2e3230] font-semibold border border-transparent hover:border-[#e6e2da] transition-all"
                  title="Paragraph Style"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#6b6358]">title</span>
                  <span className="text-[12px] font-headline">{headingStyle}</span>
                  <span className="material-symbols-outlined text-[14px] text-[#6b6358]">expand_more</span>
                </div>

                {showHeadingMenu && (
                  <div className="absolute left-0 top-9 w-40 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-1 z-50 text-[12px]">
                    {["Title (30px)", "Heading 1 (24px)", "Heading 2 (20px)", "Heading 3 (16px)", "Normal Text (14px)"].map(
                      (style) => (
                        <button
                          key={style}
                          onClick={() => {
                            setHeadingStyle(style.split(" ")[0] + " " + (style.split(" ")[1] || ""));
                            setShowHeadingMenu(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0ece4] font-medium text-[#2e3230]"
                        >
                          {style}
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* Font family selector */}
                <div
                  onClick={() => setShowFontMenu(!showFontMenu)}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#4a4e4a] border border-transparent hover:border-[#e6e2da] transition-all"
                  title="Font Family"
                >
                  <span className="text-[12px]">{fontFamily}</span>
                  <span className="material-symbols-outlined text-[14px] text-[#6b6358]">expand_more</span>
                </div>

                {showFontMenu && (
                  <div className="absolute left-28 top-9 w-36 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-1 z-50 text-[12px]">
                    {["Nunito Sans", "Literata", "Geist", "Inter", "JetBrains Mono"].map((font) => (
                      <button
                        key={font}
                        onClick={() => {
                          setFontFamily(font);
                          setShowFontMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0ece4] font-medium text-[#2e3230]"
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                )}

                {/* Font size stepper */}
                <div className="flex items-center bg-[#f0ece4] rounded-xl px-1 py-0.5">
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                    className="w-5 h-5 flex items-center justify-center text-[#6b6358] hover:text-[#2e3230] rounded-lg hover:bg-white text-[12px] font-bold"
                    title="Decrease font size"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-[12px] font-semibold text-[#2e3230]">
                    {fontSize}
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(36, fontSize + 1))}
                    className="w-5 h-5 flex items-center justify-center text-[#6b6358] hover:text-[#2e3230] rounded-lg hover:bg-white text-[12px] font-bold"
                    title="Increase font size"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Font Styling Group */}
              <div className="flex items-center gap-0.5" title="Font Styling">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl font-bold shadow-2xs border transition-colors ${isBold
                      ? "bg-[#eaf2ec] text-[#4a7c59] border-[#4a7c59]/30"
                      : "hover:bg-[#f0ece4] text-[#6b6358] border-transparent"
                    }`}
                  title="Bold (⌘B)"
                >
                  B
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl italic font-headline transition-colors ${isItalic
                      ? "bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/30"
                      : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Italic (⌘I)"
                >
                  I
                </button>
                <button
                  onClick={() => setIsUnderline(!isUnderline)}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl underline transition-colors ${isUnderline
                      ? "bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/30"
                      : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Underline (⌘U)"
                >
                  U
                </button>
                <button
                  onClick={() => setIsStrikethrough(!isStrikethrough)}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl line-through transition-colors ${isStrikethrough
                      ? "bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/30"
                      : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Strikethrough"
                >
                  S
                </button>

                {/* Text Color button with swatch */}
                <button
                  className="w-7 h-7 flex flex-col items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#2e3230]"
                  title="Text Color"
                >
                  <span className="font-bold text-[12px] leading-tight text-[#705c30]">A</span>
                  <span className="w-4 h-1 bg-[#705c30] rounded-full mt-0.5"></span>
                </button>

                {/* Highlight Color button with swatch */}
                <button
                  className="w-7 h-7 flex flex-col items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#2e3230]"
                  title="Highlight Color"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#c4a66a]">
                    ink_highlighter
                  </span>
                  <span className="w-4 h-1 bg-[#f8e0a8] rounded-full mt-0.5"></span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Alignment & Spacing */}
              <div className="flex items-center gap-0.5" title="Alignment & Spacing">
                <button
                  onClick={() => setAlignment("left")}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl transition-colors ${alignment === "left" ? "bg-[#f0ece4] text-[#2e3230]" : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Align Left"
                >
                  <span className="material-symbols-outlined text-[16px]">format_align_left</span>
                </button>
                <button
                  onClick={() => setAlignment("center")}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl transition-colors ${alignment === "center" ? "bg-[#f0ece4] text-[#2e3230]" : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Align Center"
                >
                  <span className="material-symbols-outlined text-[16px]">format_align_center</span>
                </button>
                <button
                  onClick={() => setAlignment("right")}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl transition-colors ${alignment === "right" ? "bg-[#f0ece4] text-[#2e3230]" : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Align Right"
                >
                  <span className="material-symbols-outlined text-[16px]">format_align_right</span>
                </button>
                <button
                  onClick={() => setAlignment("justify")}
                  className={`w-7 h-7 flex items-center justify-center rounded-xl transition-colors ${alignment === "justify" ? "bg-[#f0ece4] text-[#2e3230]" : "hover:bg-[#f0ece4] text-[#6b6358]"
                    }`}
                  title="Justify"
                >
                  <span className="material-symbols-outlined text-[16px]">format_align_justify</span>
                </button>

                {/* Line Spacing */}
                <div
                  onClick={() => setLineSpacing(lineSpacing === "1.15" ? "1.5" : lineSpacing === "1.5" ? "2.0" : "1.15")}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#6b6358] hover:text-[#2e3230]"
                  title="Line Spacing (click to toggle)"
                >
                  <span className="material-symbols-outlined text-[16px]">format_line_spacing</span>
                  <span className="text-[11px] font-medium">{lineSpacing}</span>
                </div>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Lists & Indents */}
              <div className="flex items-center gap-0.5" title="Lists & Indents">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230]"
                  title="Bulleted list"
                >
                  <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230]"
                  title="Numbered list"
                >
                  <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230]"
                  title="Checklist"
                >
                  <span className="material-symbols-outlined text-[16px]">checklist</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230]"
                  title="Decrease indent"
                >
                  <span className="material-symbols-outlined text-[16px]">format_indent_decrease</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230]"
                  title="Increase indent"
                >
                  <span className="material-symbols-outlined text-[16px]">format_indent_increase</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Right */}
            <div className="flex items-center gap-1.5 ml-4 shrink-0 min-w-max">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                title="Insert Link (⌘K)"
              >
                <span className="material-symbols-outlined text-[16px]">link</span>
              </button>
              <button
                onClick={onOpenComment}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                title="Add Comment (⌘⌥M)"
              >
                <span className="material-symbols-outlined text-[16px]">add_comment</span>
                <span className="text-[11px] font-medium hidden sm:inline">Comment</span>
              </button>
              <div className="h-4 w-px bg-[#e6e2da] mx-0.5"></div>
              <button
                onClick={onOpenCopilot}
                className="h-7 px-3 rounded-xl bg-[#eaf2ec] hover:bg-[#dce8df] text-[#4a7c59] text-[12px] font-semibold flex items-center gap-1 transition-all border border-[#4a7c59]/20 shadow-2xs"
                title="AI Polish & Rewrite"
              >
                <span className="material-symbols-outlined text-[15px]">magic_button</span>
                <span>AI Polish</span>
              </button>
            </div>
          </>
        )}

        {/* TAB 2: INSERT TAB TOOLS */}
        {activeTab === "insert" && (
          <>
            <div className="flex items-center gap-1 min-w-max text-[12px]">
              {/* Media & Assets */}
              <div className="flex items-center gap-1" title="Media & Assets">
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#2e3230] font-semibold border border-transparent hover:border-[#e6e2da] transition-all"
                  title="Insert Image"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">image</span>
                  <span>Image</span>
                  <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
                </button>

                {/* Table with popover grid */}
                <div className="relative">
                  <button
                    onClick={() => setShowTablePicker(!showTablePicker)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#2e3230] font-semibold border border-transparent hover:border-[#e6e2da] transition-all"
                    title="Insert Table"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">table_chart</span>
                    <span>Table</span>
                    <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
                  </button>

                  {showTablePicker && (
                    <div className="absolute left-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-3 z-50">
                      <div className="text-[11px] font-bold text-[#6b6358] mb-2">
                        Insert Table: {hoverGrid.r} × {hoverGrid.c}
                      </div>
                      <div className="grid grid-cols-5 gap-1 mb-2">
                        {Array.from({ length: 25 }).map((_, i) => {
                          const r = Math.floor(i / 5) + 1;
                          const c = (i % 5) + 1;
                          const active = r <= hoverGrid.r && c <= hoverGrid.c;
                          return (
                            <div
                              key={i}
                              onMouseEnter={() => setHoverGrid({ r, c })}
                              onClick={() => {
                                onInsertTable(hoverGrid.r, hoverGrid.c);
                                setShowTablePicker(false);
                              }}
                              className={`w-6 h-6 border rounded cursor-pointer transition-colors ${active ? "bg-[#d8f0de] border-[#4a7c59]" : "bg-[#f5f1ea] border-[#e6e2da]"
                                }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Insert Chart / Graph"
                >
                  <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                  <span>Chart</span>
                  <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
                </button>
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Drawing / Canvas"
                >
                  <span className="material-symbols-outlined text-[16px]">draw</span>
                  <span>Drawing</span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Structured Blocks */}
              <div className="flex items-center gap-1" title="Structured Blocks">
                <button
                  onClick={onInsertCallout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[#4a7c59] font-bold bg-[#d8f0de]/80 border border-[#4a7c59]/20 hover:bg-[#d8f0de] transition-all"
                  title="Insert Callout Box"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">lightbulb</span>
                  <span>Callout</span>
                  <span className="material-symbols-outlined text-[14px] text-[#4a7c59]">expand_more</span>
                </button>
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Insert Code Block"
                >
                  <span className="material-symbols-outlined text-[16px]">code_blocks</span>
                  <span>Code</span>
                </button>
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Insert Quote"
                >
                  <span className="material-symbols-outlined text-[16px]">format_quote</span>
                  <span>Quote</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Horizontal Divider"
                >
                  <span className="material-symbols-outlined text-[17px]">horizontal_rule</span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Components & Widgets */}
              <div className="flex items-center gap-1" title="Components & Widgets">
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Checklist"
                >
                  <span className="material-symbols-outlined text-[16px]">checklist</span>
                  <span>Task List</span>
                </button>
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Dropdown / Tag Pill"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_drop_down_circle</span>
                  <span>Status Pill</span>
                </button>
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Date & Reminder"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>Date</span>
                </button>
                <button
                  onClick={() => setOutlineOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-all font-semibold"
                  title="Table of Contents"
                >
                  <span className="material-symbols-outlined text-[16px]">toc</span>
                  <span>TOC</span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* Embed & Link */}
              <div className="flex items-center gap-0.5" title="Embed & Link">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Insert Link (⌘K)"
                >
                  <span className="material-symbols-outlined text-[16px]">link</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Bookmark"
                >
                  <span className="material-symbols-outlined text-[16px]">bookmark</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Special Characters / Formula"
                >
                  <span className="material-symbols-outlined text-[16px]">functions</span>
                </button>
              </div>
            </div>

            {/* Right Ribbon tools */}
            <div className="flex items-center gap-2 ml-4 shrink-0 min-w-max">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6b6358] bg-[#f5f1ea] border border-[#e6e2da] px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px] text-[#4a7c59]">grid_on</span>
                <span>Table Picker: 3 × 3</span>
              </div>
              <button
                onClick={onOpenCopilot}
                className="h-7 px-3 rounded-full bg-[#d8f0de] hover:bg-[#c8e8d0] text-[#4a7c59] text-[12px] font-bold flex items-center gap-1 transition-all border border-[#4a7c59]/25 shadow-2xs"
                title="AI Polish & Rewrite"
              >
                <span className="material-symbols-outlined text-[15px]">magic_button</span>
                <span>AI Polish</span>
              </button>
            </div>
          </>
        )}

        {/* TAB 3: REVIEW & CHANGES TAB TOOLS */}
        {activeTab === "review" && (
          <>
            <div className="flex items-center gap-1.5 min-w-max text-[12px]">
              {/* 1. Track Changes Controls */}
              <div
                onClick={() => setTrackChangesOn(!trackChangesOn)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#eaf2ec] border border-[#4a7c59]/30 shadow-2xs cursor-pointer"
                title="Click to toggle Track Changes"
              >
                <span className="w-2 h-2 rounded-full bg-[#4a7c59] animate-pulse"></span>
                <span className="font-bold text-[#4a7c59]">
                  Track Changes: {trackChangesOn ? "ON" : "OFF"}
                </span>
              </div>

              {/* Markup selector */}
              <div className="relative">
                <div
                  onClick={() => setShowMarkupMenu(!showMarkupMenu)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-[#f0ece4] cursor-pointer text-[#2e3230] font-semibold border border-[#e6e2da] transition-all"
                  title="Markup Display View"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">visibility</span>
                  <span>{selectedMarkup}</span>
                  <span className="material-symbols-outlined text-[15px] text-[#74796e]">expand_more</span>
                </div>

                {showMarkupMenu && (
                  <div className="absolute left-0 top-9 w-36 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-1 z-50 text-[12px]">
                    {["All Markup", "Simple Markup", "No Markup", "Original"].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMarkup(m);
                          setShowMarkupMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0ece4] font-medium text-[#2e3230]"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-5 w-px bg-[#e6e2da] mx-1"></div>

              {/* 2. Resolution Actions */}
              <div className="flex items-center bg-[#f0ece4] rounded-xl p-0.5 border border-[#e6e2da]">
                <button
                  onClick={onAcceptAll}
                  className="h-7 px-2.5 rounded-lg flex items-center gap-1 bg-white shadow-2xs text-[#4a7c59] hover:bg-[#fbfaf8] font-bold transition-all"
                  title="Accept All Changes"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">check_circle</span>
                  <span>Accept</span>
                </button>
                <button
                  onClick={onRejectAll}
                  className="h-7 px-2.5 rounded-lg flex items-center gap-1 hover:bg-white text-[#b83230] font-bold transition-all"
                  title="Reject All Changes"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#b83230]">cancel</span>
                  <span>Reject</span>
                </button>
              </div>

              {/* Change Navigation */}
              <div className="flex items-center gap-0.5 ml-1" title="Change Navigation">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Previous Change"
                >
                  <span className="material-symbols-outlined text-[17px]">arrow_upward</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors"
                  title="Next Change"
                >
                  <span className="material-symbols-outlined text-[17px]">arrow_downward</span>
                </button>
              </div>

              <div className="h-5 w-px bg-[#e6e2da] mx-1"></div>

              {/* 3. Collaboration, Comments & Compare Tools */}
              <button
                onClick={onOpenComment}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-[#f0ece4] text-[#4a7c59] font-bold border border-[#4a7c59]/30 transition-all shadow-2xs"
                title="Insert New Comment"
              >
                <span className="material-symbols-outlined text-[16px]">add_comment</span>
                <span>New Comment</span>
              </button>

              <button
                onClick={() => setReviewPaneOpen(!reviewPaneOpen)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold border transition-all shadow-2xs ${reviewPaneOpen
                    ? "bg-[#eaf2ec] text-[#4a7c59] border-[#4a7c59]/40"
                    : "bg-white text-[#6b6358] border-[#e6e2da] hover:bg-[#f0ece4]"
                  }`}
                title="Reviewing Pane"
              >
                <span className="material-symbols-outlined text-[16px]">side_navigation</span>
                <span>Review Pane</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#4a7c59] text-white ml-0.5">
                  4
                </span>
              </button>

              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors font-semibold"
                title="Compare documents"
              >
                <span className="material-symbols-outlined text-[16px]">compare</span>
                <span className="hidden sm:inline">Compare</span>
              </button>

              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] transition-colors font-semibold"
                title="Version History"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span className="hidden sm:inline">Version History</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 ml-4 shrink-0 min-w-max">
              <button
                onClick={onOpenCopilot}
                className="h-7 px-3 rounded-xl bg-[#eaf2ec] hover:bg-[#dbe9de] text-[#4a7c59] text-[12px] font-bold flex items-center gap-1.5 transition-all border border-[#4a7c59]/25 shadow-2xs"
                title="AI Polish & Rewrite"
              >
                <span className="material-symbols-outlined text-[15px]">magic_button</span>
                <span>AI Polish</span>
              </button>
            </div>
          </>
        )}

        {/* TAB 4: LAYOUT & TOOLS TAB */}
        {activeTab === "layout" && (
          <>
            <div className="flex items-center gap-2 min-w-max text-[12px]">
              {/* 1. Page Setup Group */}
              <div className="flex items-center gap-1">
                {/* Margins */}
                <div
                  onClick={() =>
                    setMarginSetting(
                      marginSetting === "Normal (1\")"
                        ? "Narrow (0.5\")"
                        : marginSetting === "Narrow (0.5\")"
                          ? "Wide (2\")"
                          : "Normal (1\")"
                    )
                  }
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#ede8df] cursor-pointer text-[#2e3230] font-medium border border-transparent hover:border-[#dcd7cc] transition-all"
                  title="Margins (click to toggle)"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">margin</span>
                  <span className="font-medium">{marginSetting}</span>
                  <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
                </div>

                {/* Orientation Stepper */}
                <div className="flex items-center bg-[#f0ece4] rounded-lg p-0.5" title="Orientation">
                  <button
                    onClick={() => setOrientation("portrait")}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${orientation === "portrait"
                        ? "bg-white text-[#4a7c59] shadow-2xs"
                        : "text-[#6b6358] hover:text-[#2e3230]"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">crop_portrait</span>
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation("landscape")}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${orientation === "landscape"
                        ? "bg-white text-[#4a7c59] shadow-2xs"
                        : "text-[#6b6358] hover:text-[#2e3230]"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">crop_landscape</span>
                    Landscape
                  </button>
                </div>

                {/* Page Size */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#ede8df] cursor-pointer text-[#2e3230] border border-transparent hover:border-[#dcd7cc] transition-all"
                  title="Page Size"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">aspect_ratio</span>
                  <span>Letter 8.5"×11"</span>
                  <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
                </div>

                {/* Columns */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#ede8df] cursor-pointer text-[#2e3230] border border-transparent hover:border-[#dcd7cc] transition-all"
                  title="Columns"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">view_column</span>
                  <span>Columns (1)</span>
                  <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
                </div>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* 2. Canvas & Spacing Group */}
              <div className="flex items-center gap-1">
                {/* Rulers toggle */}
                <button
                  onClick={() => setShowRulers(!showRulers)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${showRulers
                      ? "bg-[#e2efe6] text-[#4a7c59] font-bold border border-[#4a7c59]/20"
                      : "hover:bg-[#ede8df] text-[#2e3230]"
                    }`}
                  title="Toggle Rulers"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">straighten</span>
                  <span>Rulers</span>
                </button>

                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#ede8df] cursor-pointer text-[#2e3230]"
                  title="Page Color"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">palette</span>
                  <span>Page Color</span>
                  <span className="w-3 h-3 rounded-full border border-[#dcd7cc] bg-[#ffffff] ml-0.5 shadow-2xs"></span>
                </div>

                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#ede8df] text-[#2e3230] transition-colors"
                  title="Watermark Tool"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">branding_watermark</span>
                  <span>Watermark</span>
                </button>

                <button
                  onClick={() => setShowLineNumbers(!showLineNumbers)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${showLineNumbers ? "bg-[#e2efe6] text-[#4a7c59] font-bold" : "hover:bg-[#ede8df] text-[#2e3230]"
                    }`}
                  title="Line Numbers Toggle"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">
                    format_list_numbered_rtl
                  </span>
                  <span>Line Numbers</span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#e6e2da] mx-1"></div>

              {/* 3. Navigation & Intelligence */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOutlineOpen(!outlineOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${outlineOpen
                      ? "bg-[#e2efe6] text-[#4a7c59] font-bold border border-[#4a7c59]/30 shadow-2xs"
                      : "hover:bg-[#ede8df] text-[#2e3230]"
                    }`}
                  title="Toggle Document Outline"
                >
                  <span className="material-symbols-outlined text-[16px]">toc</span>
                  <span>Outline</span>
                  {outlineOpen && <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]"></span>}
                </button>

                <button
                  onClick={onOpenWordStats}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#ede8df] text-[#2e3230] transition-colors"
                  title="Word & Reading Stats"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#74796e]">analytics</span>
                  <span>Word Stats</span>
                </button>

                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#ede8df] text-[#2e3230] transition-colors"
                  title="A11y & Readability Checker"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">task_alt</span>
                  <span>A11y Checker</span>
                </button>
              </div>
            </div>

            {/* Right Actions: Export dropdown */}
            <div className="flex items-center gap-2 ml-4 shrink-0 min-w-max relative">
              <div
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#dcd7cc] hover:bg-[#f5f1ea] text-[#2e3230] font-semibold text-[12px] cursor-pointer shadow-2xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">file_download</span>
                <span>Export (PDF, DOCX)</span>
                <span className="material-symbols-outlined text-[14px] text-[#74796e]">expand_more</span>
              </div>

              {showExportMenu && (
                <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-1 z-50 text-[12px]">
                  <button
                    onClick={() => {
                      onExport("pdf");
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0ece4] flex items-center gap-2 text-[#2e3230] font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#b83230]">picture_as_pdf</span>
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      onExport("docx");
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0ece4] flex items-center gap-2 text-[#2e3230] font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">description</span>
                    <span>Download DOCX</span>
                  </button>
                  <button
                    onClick={() => {
                      onExport("md");
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0ece4] flex items-center gap-2 text-[#2e3230] font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#705c30]">markdown</span>
                    <span>Download Markdown</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
