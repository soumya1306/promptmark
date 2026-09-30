"use client";

import React, { useState } from "react";
import { Collaborator } from "./types";

interface TopAppBarProps {
  title: string;
  setTitle: (title: string) => void;
  collaborators: Collaborator[];
  isStarred: boolean;
  setIsStarred: (val: boolean) => void;
  onOpenFileMenu: () => void;
  onOpenSearch: () => void;
  onOpenShare: () => void;
  onOpenCopilot: () => void;
  onOpenAccount: () => void;
  onOpenScreensModal: () => void;
  onOpenAssetUpload?: () => void;
  commentsCount: number;
  rightPanelOpen: boolean;
  setRightPanelOpen: (val: boolean) => void;
  userProfile?: any;
  onSignOut?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  setTitle,
  collaborators,
  isStarred,
  setIsStarred,
  onOpenFileMenu,
  onOpenSearch,
  onOpenShare,
  onOpenCopilot,
  onOpenAccount,
  onOpenScreensModal,
  onOpenAssetUpload,
  commentsCount,
  rightPanelOpen,
  setRightPanelOpen,
  userProfile,
  onSignOut,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showPresenceMenu, setShowPresenceMenu] = useState(false);

  return (
    <header className="h-14 bg-[#fbfaf8] border-b border-[#e6e2da] text-[#2e3230] flex items-center justify-between px-3 md:px-4 shrink-0 z-50 select-none transition-colors">
      {/* Left: Brand icon, Document Title & Cloud status */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          onClick={onOpenFileMenu}
          title="Terra Document File Menu - Click to view document options"
          className="w-8 h-8 rounded-xl bg-[#4a7c59] text-white flex items-center justify-center font-bold text-[14px] shadow-xs cursor-pointer hover:bg-[#3d6749] transition-all transform active:scale-95 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:rotate-6 transition-transform">
            edit_document
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                onChange={(e) => setTitle(e.target.value)}
                className="font-headline font-semibold text-[14px] text-[#2e3230] bg-[#f0ece4] px-1.5 py-0.5 rounded border border-[#4a7c59] outline-none max-w-[260px] md:max-w-md"
              />
            ) : (
              <span
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename document"
                className="font-headline font-semibold text-[14px] text-[#2e3230] tracking-tight truncate max-w-[200px] sm:max-w-[280px] md:max-w-md cursor-pointer hover:bg-[#f0ece4]/70 px-1 py-0.5 rounded transition-colors"
              >
                {title}
              </span>
            )}

            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f0ece4] text-[#6b6358] shrink-0 border border-[#e6e2da]">
              v2.4
            </span>

            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`transition-colors p-0.5 rounded hover:bg-[#f0ece4] ${
                isStarred ? "text-[#c4a66a]" : "text-[#74796e] hover:text-[#4a7c59]"
              }`}
              title={isStarred ? "Unstar document" : "Star document"}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#6b6358] truncate">
            <span className="material-symbols-outlined text-[13px] text-[#4a7c59]">
              cloud_done
            </span>
            <span>Saved to Cloud</span>
            <span>•</span>
            <span className="truncate">Last edit 3m ago by Sarah K.</span>
          </div>
        </div>
      </div>

      {/* Center: Quick omni-search pill */}
      <div className="hidden md:flex items-center max-w-[320px] flex-1 mx-4">
        <div
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 bg-[#f0ece4] hover:bg-[#eae6de] text-[#6b6358] focus-within:bg-[#fbfaf8] focus-within:text-[#2e3230] focus-within:ring-2 focus-within:ring-[#4a7c59]/25 px-3 py-1.5 rounded-xl border border-transparent hover:border-[#e6e2da] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#74796e]">
            search
          </span>
          <span className="text-[12px] font-body text-[#6b6358]/80 select-none">
            Search or jump to...
          </span>
          <kbd className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#e6e2da] text-[#74796e] shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Presence, AI Assistant, Share & Profile */}
      <div className="flex items-center gap-2.5">

        {/* Multiplayer Collaborator Avatars */}
        <div className="relative">
          <div
            onClick={() => setShowPresenceMenu(!showPresenceMenu)}
            className="flex items-center -space-x-2 mr-1 cursor-pointer group"
            title="3 Collaborators Active - Click for details"
          >
            {collaborators.map((c) => (
              <div
                key={c.id}
                style={{ backgroundColor: c.avatarColor }}
                className="w-7 h-7 rounded-full border-2 border-[#fbfaf8] flex items-center justify-center text-white text-[10px] font-bold shadow-xs hover:scale-110 hover:z-20 transition-transform"
                title={`${c.name} (${c.status})`}
              >
                {c.initials}
              </div>
            ))}
          </div>

          {/* Presence Dropdown */}
          {showPresenceMenu && (
            <div className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-3 z-50 text-[12px]">
              <div className="flex items-center justify-between pb-2 border-b border-[#e6e2da] font-bold text-[#2e3230]">
                <span>Active Collaborators</span>
                <span className="text-[10px] font-semibold text-[#4a7c59] bg-[#d8f0de] px-2 py-0.5 rounded-full">
                  3 Live
                </span>
              </div>
              <div className="space-y-2.5 pt-2.5">
                {collaborators.map((c) => (
                  <div key={c.id} className="flex items-center gap-2.5">
                    <div
                      style={{ backgroundColor: c.avatarColor }}
                      className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                    >
                      {c.initials}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2e3230]">{c.name}</span>
                        <span className="w-2 h-2 rounded-full bg-[#4a7c59] animate-pulse"></span>
                      </div>
                      <span className="text-[11px] text-[#6b6358] truncate">
                        {c.status} • {c.currentSection}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doc Hub / Assets Button */}
        <button
          onClick={onOpenAssetUpload}
          className="h-8 px-2.5 rounded-xl hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] hidden md:flex items-center gap-1.5 text-[12px] font-medium transition-colors border border-transparent hover:border-[#e6e2da]"
          title="File & Asset Management (Doc Hub)"
        >
          <span className="material-symbols-outlined text-[17px] text-[#4a7c59]">
            folder_special
          </span>
          <span className="hidden xl:inline">Doc Hub</span>
        </button>

        {/* Comments badge toggle */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className={`h-8 px-2.5 rounded-xl transition-colors relative flex items-center gap-1.5 text-[12px] font-medium ${
            rightPanelOpen
              ? "bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/25"
              : "hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230]"
          }`}
          title="Toggle Comments & Review Rail"
        >
          <span className="material-symbols-outlined text-[17px]">mode_comment</span>
          <span className="font-semibold text-[11px]">{commentsCount}</span>
        </button>

        {/* Copilot AI Action */}
        <button
          onClick={onOpenCopilot}
          className="h-8 px-3 rounded-xl bg-[#eaf2ec] hover:bg-[#dce8df] text-[#4a7c59] border border-[#4a7c59]/20 font-semibold text-[12px] flex items-center gap-1.5 transition-all shadow-xs group"
          title="Terra AI Copilot"
        >
          <span className="material-symbols-outlined text-[16px] text-[#4a7c59] group-hover:rotate-12 transition-transform">
            auto_awesome
          </span>
          <span className="hidden sm:inline">Ask Copilot</span>
        </button>

        {/* Primary Share Button */}
        <button
          onClick={onOpenShare}
          className="h-8 px-3.5 rounded-xl bg-[#4a7c59] hover:bg-[#3d6749] text-white font-semibold text-[12px] flex items-center gap-1.5 shadow-xs transition-colors active:scale-98"
          title="Share document"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          <span>Share</span>
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={onOpenAccount}
          className="w-8 h-8 rounded-full bg-[#705c30] text-white font-bold text-[11px] flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#4a7c59]/40 transition-all select-none overflow-hidden"
          title={`Account & Workspaces (${userProfile?.full_name || userProfile?.email || "Guest"})`}
        >
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
          ) : userProfile?.full_name ? (
            userProfile.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          ) : (
            "ME"
          )}
        </div>
      </div>
    </header>
  );
};
