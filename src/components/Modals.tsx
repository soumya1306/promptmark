"use client";

import React, { useState } from "react";
import { ScreenPreset, RibbonTab } from "./types";

export type TerraActiveModal =
  | null
  | "modal-doc-file"
  | "modal-search-palette"
  | "modal-copilot-drawer"
  | "modal-share-dialog"
  | "modal-account-popover";

interface ModalsProps {
  activeModal: TerraActiveModal;
  setActiveModal: (modal: TerraActiveModal) => void;
  onApplyCopilotSuggestion: (text: string) => void;
  onToggleTrackChanges: () => void;
  onExportPdf: () => void;
  screensModalOpen: boolean;
  setScreensModalOpen: (val: boolean) => void;
  onSelectPreset: (preset: ScreenPreset) => void;
  activePreset: ScreenPreset;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  setActiveModal,
  onApplyCopilotSuggestion,
  onToggleTrackChanges,
  onExportPdf,
  screensModalOpen,
  setScreensModalOpen,
  onSelectPreset,
  activePreset,
}) => {
  // Search palette query
  const [searchQuery, setSearchQuery] = useState("Executive");

  // Share state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Can edit");
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<Array<{ email: string; role: string }>>([]);

  // Copilot prompt state
  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [copilotCustomResponse, setCopilotCustomResponse] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Close all modals
  const closeAll = () => setActiveModal(null);

  // Scroll to section helper
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    closeAll();
  };

  // Handle Share invite
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInvitedMembers((prev) => [...prev, { email: inviteEmail, role: inviteRole }]);
    setInviteEmail("");
  };

  // Handle Copilot prompt
  const handleAskCopilot = (customChip?: string) => {
    const q = customChip || copilotPrompt;
    if (!q.trim()) return;
    setIsCopilotThinking(true);
    setTimeout(() => {
      setIsCopilotThinking(false);
      if (q.toLowerCase().includes("summarize") || q.toLowerCase().includes("market")) {
        setCopilotCustomResponse(
          "Market drivers pivot from single-player apps toward synchronous density. Tier-1 buyers demand fast setup with proven 48-hour onboarding conversion."
        );
      } else if (q.toLowerCase().includes("takeaway") || q.toLowerCase().includes("draft")) {
        setCopilotCustomResponse(
          "Key Takeaway: Prioritize live synchronization protocol v2 and customer flywheels to double quarterly account retention."
        );
      } else {
        setCopilotCustomResponse(
          "“Enterprise migration toward synchronous workspaces accelerates time-to-value by 40% when collaborative customer flywheels replace legacy outbound outreach.”"
        );
      }
    }, 500);
  };

  return (
    <>
      {/* ========================================================
          FLOATING PROTOTYPE BAR (From Stitch Prototype Screen)
          Allows 1-click preview of all 5 prototype modals
          ======================================================== */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#2e3230]/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-xl border border-white/10 flex items-center gap-1.5 text-[12px] font-medium select-none max-w-[95vw] overflow-x-auto no-scrollbar">
        <span className="text-[#8ecf9e] font-semibold text-[11px] px-2 py-0.5 rounded-full bg-white/10 flex items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-[14px]">layers</span>
          Modal Previews:
        </span>

        <button
          onClick={() => setActiveModal(activeModal === "modal-doc-file" ? null : "modal-doc-file")}
          className={`px-2.5 py-1 rounded-xl transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
            activeModal === "modal-doc-file" ? "bg-[#4a7c59] text-white font-semibold" : "hover:bg-white/15 text-white/90"
          }`}
          title="Open File & Application Menu"
        >
          <span className="material-symbols-outlined text-[14px]">folder_open</span>
          <span>1. File/App Menu</span>
        </button>

        <button
          onClick={() => setActiveModal(activeModal === "modal-search-palette" ? null : "modal-search-palette")}
          className={`px-2.5 py-1 rounded-xl transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
            activeModal === "modal-search-palette" ? "bg-[#4a7c59] text-white font-semibold" : "hover:bg-white/15 text-white/90"
          }`}
          title="Open Omni-Search Palette"
        >
          <span className="material-symbols-outlined text-[14px]">search</span>
          <span>2. Search / Jump To</span>
        </button>

        <button
          onClick={() => setActiveModal(activeModal === "modal-copilot-drawer" ? null : "modal-copilot-drawer")}
          className={`px-2.5 py-1 rounded-xl transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
            activeModal === "modal-copilot-drawer" ? "bg-[#4a7c59] text-white font-semibold" : "hover:bg-white/15 text-white/90"
          }`}
          title="Open Copilot AI Drawer"
        >
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          <span>3. Copilot AI</span>
        </button>

        <button
          onClick={() => setActiveModal(activeModal === "modal-share-dialog" ? null : "modal-share-dialog")}
          className={`px-2.5 py-1 rounded-xl transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
            activeModal === "modal-share-dialog" ? "bg-[#4a7c59] text-white font-semibold shadow-xs" : "hover:bg-white/15 text-white/90"
          }`}
          title="Open Share Dialog"
        >
          <span className="material-symbols-outlined text-[14px]">share</span>
          <span>4. Share Modal</span>
        </button>

        <button
          onClick={() => setActiveModal(activeModal === "modal-account-popover" ? null : "modal-account-popover")}
          className={`px-2.5 py-1 rounded-xl transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
            activeModal === "modal-account-popover" ? "bg-[#4a7c59] text-white font-semibold" : "hover:bg-white/15 text-white/90"
          }`}
          title="Open Account Controls Popover"
        >
          <span className="material-symbols-outlined text-[14px]">account_circle</span>
          <span>5. Account Controls</span>
        </button>
      </div>

      {/* ========================================================
          MODAL 1: FILE / APP MENU (modal-doc-file)
          Triggered by clicking the edit_document brand icon
          ======================================================== */}
      {activeModal === "modal-doc-file" && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeAll}></div>
          <div
            id="modal-doc-file"
            className="fixed top-14 left-4 z-50 w-80 bg-[#fbfaf8] border border-[#e6e2da] shadow-[0_12px_36px_rgba(46,50,48,0.16)] rounded-2xl p-4 animate-in fade-in zoom-in-95 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e2da]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4a7c59] text-white flex items-center justify-center font-bold text-[16px] shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-[13px] text-[#2e3230] leading-tight">
                    Terra Document
                  </h3>
                  <span className="text-[11px] text-[#6b6358]">Cloud Drive • Strategy • v2.4</span>
                </div>
              </div>
              <button
                onClick={closeAll}
                className="w-6 h-6 rounded-lg hover:bg-[#f0ece4] flex items-center justify-center text-[#6b6358] hover:text-[#2e3230]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Document Info Metadata */}
            <div className="py-2.5 border-b border-[#e6e2da] space-y-1.5 text-[11px] text-[#6b6358]">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#4a7c59]">folder</span>
                  Location
                </span>
                <span className="font-semibold text-[#2e3230]">Terra / Q3 Campaigns</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#4a7c59]">history</span>
                  Version History
                </span>
                <span className="font-semibold text-[#4a7c59] cursor-pointer hover:underline">
                  Browse 18 revisions
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#4a7c59]">analytics</span>
                  Document Stats
                </span>
                <span className="text-[#2e3230]">1,420 words • 4 pages</span>
              </div>
            </div>

            {/* File Menu Actions */}
            <div className="pt-2.5 pb-1 space-y-0.5 text-[12px]">
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">note_add</span>
                <span className="flex-1">New Document from Template</span>
                <span className="text-[10px] text-[#74796e]">⌥N</span>
              </button>
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">content_copy</span>
                <span className="flex-1">Make a Copy</span>
              </button>
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">drive_file_move</span>
                <span className="flex-1">Move to Workspace...</span>
              </button>
              <button
                onClick={() => {
                  onExportPdf();
                  closeAll();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">download</span>
                <span className="flex-1">Export As...</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#f0ece4] rounded text-[#6b6358] font-medium border border-[#e6e2da]">
                  PDF, DOCX
                </span>
              </button>

              <div className="my-1.5 border-t border-[#e6e2da]"></div>

              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">settings</span>
                <span className="flex-1">Page Setup &amp; Margins</span>
              </button>
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#ffdad8]/40 text-[#b83230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span className="flex-1">Move to Trash</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          MODAL 2: SEARCH / JUMP TO PALETTE (modal-search-palette)
          Triggered by clicking search bar or ⌘K
          ======================================================== */}
      {activeModal === "modal-search-palette" && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start justify-center pt-14 px-4"
          onClick={closeAll}
        >
          <div
            id="modal-search-palette"
            className="w-[540px] max-w-[92vw] bg-[#fbfaf8] border border-[#e6e2da] shadow-[0_16px_48px_rgba(46,50,48,0.18)] rounded-2xl overflow-hidden animate-in fade-in select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-3.5 border-b border-[#e6e2da] flex items-center gap-2.5 bg-[#f5f1ea]/60">
              <span className="material-symbols-outlined text-[18px] text-[#4a7c59]">search</span>
              <input
                autoFocus
                className="bg-transparent text-[13px] text-[#2e3230] w-full focus:outline-none placeholder-[#6b6358] font-body font-medium"
                placeholder="Search headings, files, actions, or collaborators..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="text-[10px] bg-white border border-[#e6e2da] px-1.5 py-0.5 rounded text-[#74796e] font-semibold">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="p-2 max-h-[380px] overflow-y-auto space-y-3">
              {/* Group 1: Jump to Document Headings */}
              <div className="space-y-1">
                <div className="px-2.5 pt-1 text-[10px] font-bold text-[#6b6358] uppercase tracking-wider">
                  Jump to Document Headings
                </div>
                <div
                  onClick={() => scrollTo("section-1")}
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#eaf2ec] text-[#1e4a2c] cursor-pointer hover:bg-[#dce8df] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">title</span>
                    <div className="text-[12px] font-semibold">
                      1. Executive Summary &amp; Market Drivers
                      <div className="text-[10px] font-normal text-[#6b6358]">
                        Page 1 • Active selection by Sarah K.
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-white px-1.5 py-0.5 rounded shadow-xs text-[#4a7c59]">
                    ↵ Jump
                  </span>
                </div>

                <div
                  onClick={() => scrollTo("section-2")}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#6b6358]">checklist</span>
                    <div className="text-[12px] font-medium">
                      2. Q3 Readiness Deliverables
                      <div className="text-[10px] text-[#6b6358]">Page 1 • 3 of 5 items completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Recent Workspaces & Documents */}
              <div className="space-y-1">
                <div className="px-2.5 pt-1 text-[10px] font-bold text-[#6b6358] uppercase tracking-wider">
                  Recent Workspaces &amp; Documents
                </div>
                <div
                  onClick={closeAll}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#6b6358]">description</span>
                    <div className="text-[12px] font-medium">
                      Q2 Enterprise Product Retrospective
                      <div className="text-[10px] text-[#6b6358]">Edited yesterday by Alex M.</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6b6358]">Marketing</span>
                </div>

                <div
                  onClick={closeAll}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#6b6358]">style</span>
                    <div className="text-[12px] font-medium">
                      Terra Design Guidelines &amp; Tokens v3
                      <div className="text-[10px] text-[#6b6358]">Shared with Terra Team</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6b6358]">Design System</span>
                </div>
              </div>

              {/* Group 3: Quick Actions & Commands */}
              <div className="space-y-1">
                <div className="px-2.5 pt-1 text-[10px] font-bold text-[#6b6358] uppercase tracking-wider">
                  Quick Actions &amp; Commands
                </div>
                <div
                  onClick={() => {
                    onToggleTrackChanges();
                    closeAll();
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">toggle_on</span>
                    <span className="text-[12px] font-medium">Toggle Track Changes (Currently ON)</span>
                  </div>
                  <span className="text-[10px] text-[#6b6358]">⌘⇧T</span>
                </div>

                <div
                  onClick={() => {
                    onExportPdf();
                    closeAll();
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">picture_as_pdf</span>
                    <span className="text-[12px] font-medium">Export as Paginated PDF</span>
                  </div>
                  <span className="text-[10px] text-[#6b6358]">⌘P</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-[#f5f1ea] border-t border-[#e6e2da] flex items-center justify-between text-[11px] text-[#6b6358]">
              <div className="flex items-center gap-3">
                <span>
                  Use{" "}
                  <kbd className="bg-white px-1 py-0.5 rounded border border-[#e6e2da] text-[10px]">↑</kbd>
                  <kbd className="bg-white px-1 py-0.5 rounded border border-[#e6e2da] text-[10px]">↓</kbd>{" "}
                  to navigate
                </span>
                <span>
                  <kbd className="bg-white px-1 py-0.5 rounded border border-[#e6e2da] text-[10px]">↵</kbd>{" "}
                  to select
                </span>
              </div>
              <button onClick={closeAll} className="text-[#4a7c59] hover:underline font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: COPILOT AI DRAWER (modal-copilot-drawer)
          Triggered by clicking Ask Copilot in top bar
          ======================================================== */}
      {activeModal === "modal-copilot-drawer" && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeAll}></div>
          <div
            id="modal-copilot-drawer"
            className="fixed top-16 right-6 z-50 w-96 max-w-[95vw] bg-[#fbfaf8] border border-[#e6e2da] shadow-[0_16px_40px_rgba(74,124,89,0.15)] rounded-2xl overflow-hidden animate-in fade-in select-none"
          >
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-[#eaf2ec] to-[#fbfaf8] border-b border-[#4a7c59]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#4a7c59] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-[13px] text-[#4a7c59] leading-tight">
                    Terra Copilot
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-[#6b6358]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] animate-pulse"></span>
                    <span>Context: Section 1 (Executive Summary)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeAll}
                className="w-6 h-6 rounded-lg hover:bg-white/80 flex items-center justify-center text-[#6b6358] hover:text-[#2e3230]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-3.5 space-y-3 text-[12px]">
              {/* Suggested Actions */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#6b6358]">
                  Suggested Actions for Selection:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAskCopilot("Summarize market drivers")}
                    className="px-2.5 py-1 rounded-xl bg-[#f0ece4] hover:bg-[#eaf2ec] hover:text-[#4a7c59] transition-all text-[11px] font-medium text-[#2e3230] border border-transparent hover:border-[#4a7c59]/20"
                  >
                    ✨ Summarize market drivers
                  </button>
                  <button
                    onClick={() => handleAskCopilot("Draft executive takeaways")}
                    className="px-2.5 py-1 rounded-xl bg-[#f0ece4] hover:bg-[#eaf2ec] hover:text-[#4a7c59] transition-all text-[11px] font-medium text-[#2e3230] border border-transparent hover:border-[#4a7c59]/20"
                  >
                    🎯 Draft executive takeaways
                  </button>
                  <button
                    onClick={() => handleAskCopilot("Match Terra brand voice")}
                    className="px-2.5 py-1 rounded-xl bg-[#f0ece4] hover:bg-[#eaf2ec] hover:text-[#4a7c59] transition-all text-[11px] font-medium text-[#2e3230] border border-transparent hover:border-[#4a7c59]/20"
                  >
                    🌿 Match Terra brand voice
                  </button>
                </div>
              </div>

              {/* Proposed Polish Card */}
              <div className="p-3 bg-white border border-[#4a7c59]/20 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#4a7c59] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">magic_button</span>
                    Proposed Executive Polish:
                  </span>
                  <span className="text-[10px] text-[#6b6358]">Confidence 98%</span>
                </div>
                <p className="text-[12px] leading-relaxed text-[#2e3230] italic bg-[#faf6f0] p-2 rounded-lg border-l-2 border-[#4a7c59]">
                  {copilotCustomResponse ||
                    "“Enterprise migration toward synchronous workspaces accelerates time-to-value by 40% when collaborative customer flywheels replace legacy outbound outreach.”"}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      onApplyCopilotSuggestion(
                        copilotCustomResponse ||
                          "Enterprise migration toward synchronous workspaces accelerates time-to-value by 40% when collaborative customer flywheels replace legacy outbound outreach."
                      );
                      closeAll();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#4a7c59] hover:bg-[#3d6749] text-white text-[11px] font-semibold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">check</span>
                    Replace Selection
                  </button>
                  <button
                    onClick={() => {
                      onApplyCopilotSuggestion(
                        copilotCustomResponse ||
                          "Enterprise migration toward synchronous workspaces accelerates time-to-value by 40% when collaborative customer flywheels replace legacy outbound outreach."
                      );
                      closeAll();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#f0ece4] hover:bg-[#eae6de] text-[#2e3230] text-[11px] font-medium transition-colors"
                  >
                    Insert Below
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        copilotCustomResponse ||
                          "Enterprise migration toward synchronous workspaces accelerates time-to-value by 40% when collaborative customer flywheels replace legacy outbound outreach."
                      );
                    }}
                    className="p-1 rounded-lg hover:bg-[#f0ece4] text-[#6b6358]"
                    title="Copy response"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Chat Input */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 bg-white border border-[#e6e2da] rounded-xl p-2 focus-within:border-[#4a7c59] focus-within:ring-2 focus-within:ring-[#4a7c59]/20 transition-all">
                  <input
                    className="bg-transparent text-[12px] w-full focus:outline-none placeholder-[#6b6358] font-body"
                    placeholder="Ask Copilot to write, edit, summarize..."
                    type="text"
                    value={copilotPrompt}
                    onChange={(e) => setCopilotPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskCopilot()}
                  />
                  <button
                    onClick={() => handleAskCopilot()}
                    className="w-7 h-7 rounded-lg bg-[#4a7c59] text-white flex items-center justify-center shrink-0 hover:bg-[#3d6749] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          MODAL 4: SHARE DIALOG (modal-share-dialog)
          Triggered by clicking Share in top bar
          ======================================================== */}
      {activeModal === "modal-share-dialog" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in select-none"
          onClick={closeAll}
        >
          <div
            id="modal-share-dialog"
            className="w-full max-w-[500px] bg-[#fbfaf8] border border-[#e6e2da] shadow-[0_24px_56px_rgba(46,50,48,0.2)] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#e6e2da] flex items-center justify-between bg-[#f5f1ea]/60">
              <div>
                <h2 className="font-headline font-semibold text-[15px] text-[#2e3230] leading-tight">
                  Share “Q3 Brand Positioning &amp; Launch Strategy”
                </h2>
                <div className="text-[11px] text-[#6b6358] mt-0.5">
                  Terra Workspace • Cloud Document
                </div>
              </div>
              <button
                onClick={closeAll}
                className="w-7 h-7 rounded-xl hover:bg-[#f0ece4] flex items-center justify-center text-[#6b6358] hover:text-[#2e3230]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 text-[13px]">
              {/* Invite Input Row */}
              <form onSubmit={handleInvite} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white border border-[#e6e2da] rounded-xl px-3 py-1.5 focus-within:border-[#4a7c59] focus-within:ring-2 focus-within:ring-[#4a7c59]/20 transition-all">
                  <span className="material-symbols-outlined text-[16px] text-[#6b6358]">person_add</span>
                  <input
                    className="w-full bg-transparent text-[12px] focus:outline-none placeholder-[#6b6358] font-body"
                    placeholder="Add people, groups or emails..."
                    type="text"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="bg-[#f0ece4] border border-[#e6e2da] rounded-xl px-2.5 py-1.5 text-[12px] font-semibold text-[#2e3230] focus:outline-none"
                >
                  <option>Can edit</option>
                  <option>Can comment</option>
                  <option>Can view</option>
                </select>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white font-semibold rounded-xl text-[12px] shadow-xs transition-colors"
                >
                  Invite
                </button>
              </form>

              {/* People with access list */}
              <div>
                <div className="text-[11px] font-bold text-[#6b6358] uppercase tracking-wider mb-2">
                  People with access
                </div>
                <div className="space-y-2">
                  {/* Sarah Jenkins (You) */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#f0ece4]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#705c30] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                        ME
                      </div>
                      <div>
                        <div className="font-semibold text-[12px] text-[#2e3230]">
                          Sarah Jenkins{" "}
                          <span className="text-[10px] text-[#6b6358] font-normal">(You)</span>
                        </div>
                        <div className="text-[11px] text-[#6b6358]">sarah@terra.design</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6b6358] px-2 py-0.5 bg-[#f0ece4] rounded-lg border border-[#e6e2da]">
                      Owner
                    </span>
                  </div>

                  {/* Sarah K. */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#f0ece4]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#78a886] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                        SK
                      </div>
                      <div>
                        <div className="font-semibold text-[12px] text-[#2e3230]">Sarah K.</div>
                        <div className="text-[11px] text-[#6b6358]">Product Lead</div>
                      </div>
                    </div>
                    <select className="bg-transparent hover:bg-white text-[11px] font-semibold text-[#2e3230] border border-transparent hover:border-[#e6e2da] rounded-lg px-2 py-1">
                      <option>Can edit</option>
                      <option>Can comment</option>
                      <option>Can view</option>
                      <option className="text-[#b83230]">Remove</option>
                    </select>
                  </div>

                  {/* Alex M. */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#f0ece4]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#c4a66a] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                        AM
                      </div>
                      <div>
                        <div className="font-semibold text-[12px] text-[#2e3230]">Alex M.</div>
                        <div className="text-[11px] text-[#6b6358]">Infra Lead</div>
                      </div>
                    </div>
                    <select className="bg-transparent hover:bg-white text-[11px] font-semibold text-[#2e3230] border border-transparent hover:border-[#e6e2da] rounded-lg px-2 py-1">
                      <option>Can edit</option>
                      <option selected>Can comment</option>
                      <option>Can view</option>
                      <option className="text-[#b83230]">Remove</option>
                    </select>
                  </div>

                  {/* Dynamic invited members */}
                  {invitedMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#f0ece4] animate-fadeIn"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#6b6358] text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                          {m.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[12px] text-[#2e3230]">{m.email}</div>
                          <div className="text-[11px] text-[#4a7c59]">Invited just now</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#6b6358]">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Access Section */}
              <div className="pt-2 border-t border-[#e6e2da]">
                <div className="text-[11px] font-bold text-[#6b6358] uppercase tracking-wider mb-2">
                  General access
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#f5f1ea]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#eaf2ec] text-[#4a7c59] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">domain</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[12px] text-[#2e3230]">
                        Anyone at Terra Design Workspace
                      </div>
                      <div className="text-[11px] text-[#6b6358]">
                        Anyone with link in organization can view
                      </div>
                    </div>
                  </div>
                  <select className="bg-white border border-[#e6e2da] text-[11px] font-semibold text-[#2e3230] rounded-lg px-2 py-1">
                    <option>Viewer</option>
                    <option>Commenter</option>
                    <option>Editor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-[#f5f1ea] border-t border-[#e6e2da] flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#e6e2da] bg-white hover:bg-[#f0ece4] font-semibold text-[12px] text-[#2e3230] flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedLink ? "check" : "link"}
                </span>
                <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeAll}
                  className="px-3.5 py-1.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white text-[12px] font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: ACCOUNT CONTROLS POPOVER (modal-account-popover)
          Triggered by clicking ME profile avatar
          ======================================================== */}
      {activeModal === "modal-account-popover" && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeAll}></div>
          <div
            id="modal-account-popover"
            className="fixed top-14 right-4 z-50 w-80 bg-[#fbfaf8] border border-[#e6e2da] shadow-[0_16px_40px_rgba(46,50,48,0.18)] rounded-2xl p-4 animate-in fade-in select-none"
          >
            {/* User Profile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e2da]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#705c30] text-white font-bold text-[13px] flex items-center justify-center shadow-xs ring-2 ring-[#4a7c59]/20">
                  ME
                </div>
                <div>
                  <div className="font-headline font-bold text-[13px] text-[#2e3230] leading-tight">
                    Sarah Jenkins
                  </div>
                  <div className="text-[11px] text-[#6b6358] truncate">sarah@terra.design</div>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#eaf2ec] text-[#4a7c59]">
                    Terra Pro Workspace
                  </span>
                </div>
              </div>
              <button
                onClick={closeAll}
                className="w-6 h-6 rounded-lg hover:bg-[#f0ece4] flex items-center justify-center text-[#6b6358]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Status Section */}
            <div className="py-2.5 border-b border-[#e6e2da]">
              <div className="text-[10px] font-bold text-[#6b6358] uppercase tracking-wider mb-1.5">
                Status
              </div>
              <button
                onClick={closeAll}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#f0ece4] hover:bg-[#eae6de] transition-colors text-[11px] text-[#2e3230]"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#4a7c59]"></span>
                  Active • Available
                </span>
                <span className="text-[10px] text-[#6b6358] font-medium">Set status ▾</span>
              </button>
            </div>

            {/* Workspaces Section */}
            <div className="py-2 border-b border-[#e6e2da] space-y-0.5 text-[12px]">
              <div className="text-[10px] font-bold text-[#6b6358] uppercase tracking-wider px-2 py-1">
                Workspaces
              </div>
              <button
                onClick={closeAll}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl bg-[#eaf2ec] text-[#1e4a2c] font-semibold"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-[#4a7c59]">
                    check_circle
                  </span>
                  Terra Design Systems
                </span>
                <span className="text-[10px] text-[#4a7c59] font-bold">Active</span>
              </button>
              <button
                onClick={closeAll}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors"
              >
                <span className="flex items-center gap-2 text-[#6b6358]">
                  <span className="material-symbols-outlined text-[15px]">folder_shared</span>
                  Personal Drafts
                </span>
              </button>
            </div>

            {/* Menu Items */}
            <div className="pt-2 space-y-0.5 text-[12px]">
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">
                  account_circle
                </span>
                <span>Profile &amp; Preferences</span>
              </button>
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">keyboard</span>
                <span>Shortcuts Guide</span>
                <span className="text-[10px] text-[#6b6358] ml-auto">⌘/</span>
              </button>
              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#6b6358]">palette</span>
                <span>Theme: Terra Organic Light</span>
              </button>
              <button
                onClick={() => {
                  setScreensModalOpen(true);
                  closeAll();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">
                  gallery_thumbnail
                </span>
                <span>View Stitch Project Screens</span>
              </button>

              <div className="my-1 border-t border-[#e6e2da]"></div>

              <button
                onClick={closeAll}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#ffdad8]/40 text-[#b83230] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Log out of Terra</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          OPTIONAL: STITCH SCREENS GALLERY MODAL (Accessible via account)
          ======================================================== */}
      {screensModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setScreensModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#e6e2da] overflow-hidden flex flex-col animate-fadeIn select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#e6e2da] flex items-center justify-between bg-[#fbfaf8]">
              <div>
                <h3 className="font-bold text-[16px] text-[#2e3230]">
                  Stitch Project: Multiplayer Collaborative Writing Workspace
                </h3>
                <span className="text-[12px] text-[#74796e]">
                  Project ID: 1139688462927240715 • Interactive Modals &amp; Screens
                </span>
              </div>
              <button
                onClick={() => setScreensModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#f0ece4] flex items-center justify-center text-[#74796e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Screen 1 */}
                <div
                  onClick={() => {
                    onSelectPreset(1);
                    setScreensModalOpen(false);
                  }}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
                    activePreset === 1 ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20" : "border-[#e6e2da]"
                  }`}
                >
                  <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                    <img
                      src="/stitch-source/screen1_document_editor.png"
                      alt="Screen 1 Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Screen 1: a69358a87fb04a1aba7b0a0f3b8f7605
                    </span>
                  </div>
                  <div className="font-bold text-[13px] text-[#2e3230]">
                    1. Terra Modern Collaborative Document Editor
                  </div>
                  <p className="text-[11px] text-[#6b6358] mt-1">
                    Home ribbon, real-time caret tag for Sarah K., active comment card on right.
                  </p>
                </div>

                {/* Screen 2 */}
                <div
                  onClick={() => {
                    onSelectPreset(2);
                    setScreensModalOpen(false);
                  }}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
                    activePreset === 2 ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20" : "border-[#e6e2da]"
                  }`}
                >
                  <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                    <img
                      src="/stitch-source/screen2_layout_tools.png"
                      alt="Screen 2 Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Screen 2: fc82b306897143dc99cceb2efa8f7dcb
                    </span>
                  </div>
                  <div className="font-bold text-[13px] text-[#2e3230]">
                    2. Terra Modern Editor - Layout &amp; Tools Tab
                  </div>
                  <p className="text-[11px] text-[#6b6358] mt-1">
                    Horizontal &amp; vertical rulers, document outline sidebar with stats.
                  </p>
                </div>

                {/* Screen 3 */}
                <div
                  onClick={() => {
                    onSelectPreset(3);
                    setScreensModalOpen(false);
                  }}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
                    activePreset === 3 ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20" : "border-[#e6e2da]"
                  }`}
                >
                  <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                    <img
                      src="/stitch-source/screen3_insert_tab.png"
                      alt="Screen 3 Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Screen 3: 9c937f4e22c242f7bf475b064b23f1db
                    </span>
                  </div>
                  <div className="font-bold text-[13px] text-[#2e3230]">
                    3. Terra Modern Editor - Insert Tab Tools
                  </div>
                  <p className="text-[11px] text-[#6b6358] mt-1">
                    Insert ribbon, 3×3 milestone table block, strategic alignment callout box.
                  </p>
                </div>

                {/* Screen 4 */}
                <div
                  onClick={() => {
                    onSelectPreset(4);
                    setScreensModalOpen(false);
                  }}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
                    activePreset === 4 ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20" : "border-[#e6e2da]"
                  }`}
                >
                  <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                    <img
                      src="/stitch-source/screen4_review_changes.png"
                      alt="Screen 4 Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Screen 4: 150711dd9f5544e791a7aa5ce2564e56
                    </span>
                  </div>
                  <div className="font-bold text-[13px] text-[#2e3230]">
                    4. Terra Modern Editor - Review &amp; Changes Tab Tools
                  </div>
                  <p className="text-[11px] text-[#6b6358] mt-1">
                    Review ribbon, suggestions right rail with replacement diff cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
