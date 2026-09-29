"use client";

import React, { useState } from "react";
import { RibbonTab, CommentItem } from "./types";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: RibbonTab;
  reviewPaneOpen: boolean;
  comments: CommentItem[];
  onAddReply: (commentId: string, replyText: string) => void;
  onResolveComment: (commentId: string) => void;
  trackedChangesState: {
    diff1Accepted: boolean;
    diff1Rejected: boolean;
    checklistDiffAccepted: boolean;
    checklistDiffRejected: boolean;
  };
  onAcceptDiff: (diffId: string) => void;
  onRejectDiff: (diffId: string) => void;
  activeSelectionId: string | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  reviewPaneOpen,
  comments,
  onAddReply,
  onResolveComment,
  trackedChangesState,
  onAcceptDiff,
  onRejectDiff,
  activeSelectionId,
}) => {
  const [replyText, setReplyText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "comments" | "edits">("all");

  if (!isOpen) return null;

  const isReviewMode = activeTab === "review" || reviewPaneOpen;
  const activeComment = comments[0];

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(commentId, replyText);
    setReplyText("");
  };

  // 1. HOME / LAYOUT / INSERT COMPACT COMMENT CALLOUT CARD
  if (!isReviewMode) {
    if (!activeComment || activeComment.resolved) return null;

    return (
      <div className="w-72 shrink-0 hidden xl:flex flex-col gap-3 sticky top-4 select-none animate-fadeIn">
        <div className="bg-[#fbfaf8] rounded-xl p-3.5 border border-[#e4e0d8] shadow-[0_4px_12px_rgba(74,124,89,0.08)] relative">
          {/* Comment connector indicator line */}
          <div className="absolute -left-3 top-4 w-3 h-0.5 bg-[#4a7c59]"></div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: activeComment.avatarColor }}
                className="w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-2xs"
              >
                {activeComment.initials}
              </div>
              <div>
                <span className="font-bold text-[12px] text-[#2e3230] block leading-tight">
                  {activeComment.author}
                </span>
                <span className="text-[10px] text-[#74796e] block">{activeComment.timeAgo}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onResolveComment(activeComment.id)}
                className="w-6 h-6 rounded-lg hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#4a7c59] flex items-center justify-center transition-colors"
                title="Resolve Thread"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-lg hover:bg-[#f0ece4] text-[#6b6358] flex items-center justify-center transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>

          <div className="bg-[#f0ece4] p-2 rounded-lg text-[11px] text-[#5e5548] italic mb-2 border-l-2 border-[#4a7c59]">
            {activeComment.quotedText}
          </div>

          <p className="text-[12px] text-[#2e3230] mb-3 leading-snug">
            {activeComment.text}
          </p>

          {/* Existing replies */}
          {activeComment.replies.length > 0 && (
            <div className="space-y-1.5 mb-2.5 pt-1 border-t border-[#e6e2da]">
              {activeComment.replies.map((reply) => (
                <div key={reply.id} className="text-[11px] bg-white p-1.5 rounded-lg border border-[#e6e2da]">
                  <span className="font-bold text-[#2e3230] mr-1">{reply.author}:</span>
                  <span className="text-[#5e5548]">{reply.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reply input */}
          <form onSubmit={(e) => handleReplySubmit(e, activeComment.id)}>
            <div className="flex items-center gap-1.5 bg-white border border-[#e6e2da] rounded-xl px-2.5 py-1.5 focus-within:border-[#4a7c59] focus-within:ring-2 focus-within:ring-[#4a7c59]/20 transition-all">
              <input
                className="bg-transparent text-[11px] w-full focus:outline-none placeholder-[#8e897e] font-body text-[#2e3230]"
                placeholder="Reply or @mention..."
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="text-[#4a7c59] hover:text-[#3d6749] flex items-center">
                <span className="material-symbols-outlined text-[15px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. FULL REVIEW & SUGGESTIONS PANEL (Review tab active)
  return (
    <div className="w-80 shrink-0 hidden xl:flex flex-col gap-3 sticky top-4 select-none animate-fadeIn">
      <div className="bg-[#fbfaf8] rounded-2xl border border-[#e6e2da] shadow-[0_4px_16px_rgba(46,50,48,0.06)] overflow-hidden">
        {/* Panel Header */}
        <div className="px-4 py-3 bg-[#f5f1ea] border-b border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-[#4a7c59]">rate_review</span>
            <span className="font-extrabold text-[13px] text-[#2e3230]">Review &amp; Suggestions</span>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/25">
              4
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setFilterType(filterType === "all" ? "edits" : filterType === "edits" ? "comments" : "all")
              }
              className={`w-6 h-6 rounded-lg hover:bg-[#eae6de] flex items-center justify-center transition-colors ${
                filterType !== "all" ? "text-[#4a7c59]" : "text-[#6b6358]"
              }`}
              title={`Filter: currently ${filterType}`}
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
            </button>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-lg hover:bg-[#eae6de] text-[#6b6358] flex items-center justify-center transition-colors"
              title="Close Panel"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Suggestion Cards List */}
        <div className="p-3.5 flex flex-col gap-3 max-h-[780px] overflow-y-auto no-scrollbar">
          {/* CARD 1: Sarah K. Comment Thread */}
          {(filterType === "all" || filterType === "comments") && activeComment && !activeComment.resolved && (
            <div
              className={`bg-white rounded-xl p-3 border transition-all relative shadow-2xs ${
                activeSelectionId === "sarah-comment"
                  ? "border-[#705c30] ring-2 ring-[#705c30]/20"
                  : "border-[#e6e2da] hover:border-[#705c30]"
              }`}
            >
              <div className="absolute -left-1 top-3.5 w-1 h-6 bg-[#705c30] rounded-r"></div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: activeComment.avatarColor }}
                    className="w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-2xs"
                  >
                    {activeComment.initials}
                  </div>
                  <div>
                    <span className="font-bold text-[12px] text-[#2e3230] block leading-tight">
                      {activeComment.author}
                    </span>
                    <span className="text-[10px] text-[#74796e] block">{activeComment.timeAgo}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f0e8db] text-[#705c30] border border-[#705c30]/20">
                  Comment
                </span>
              </div>

              <div className="bg-[#f5f1ea] p-2 rounded-lg text-[11px] text-[#5e5548] italic mb-2 border-l-2 border-[#705c30]">
                {activeComment.quotedText}
              </div>

              <p className="text-[12px] text-[#2e3230] mb-2.5 leading-snug">
                {activeComment.text}
              </p>

              {/* Replies */}
              {activeComment.replies.length > 0 && (
                <div className="space-y-1.5 mb-2 pt-1 border-t border-[#e6e2da]">
                  {activeComment.replies.map((reply) => (
                    <div key={reply.id} className="text-[11px] bg-[#fbfaf8] p-1.5 rounded-lg border border-[#e6e2da]">
                      <span className="font-bold text-[#2e3230] mr-1">{reply.author}:</span>
                      <span className="text-[#5e5548]">{reply.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={(e) => handleReplySubmit(e, activeComment.id)}>
                <div className="flex items-center gap-1.5 bg-white border border-[#e6e2da] rounded-xl px-2.5 py-1 focus-within:border-[#4a7c59]">
                  <input
                    className="bg-transparent text-[11px] w-full focus:outline-none placeholder-[#8e897e]"
                    placeholder="Reply or @mention..."
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="text-[#4a7c59] hover:text-[#3d6749]">
                    <span className="material-symbols-outlined text-[15px]">send</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CARD 2: Tracked Replacement Diff (Selected/Active) */}
          {(filterType === "all" || filterType === "edits") && (
            <div
              className={`bg-white rounded-xl p-3 border-2 transition-all relative shadow-2xs ${
                activeSelectionId === "tracked-diff"
                  ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/20"
                  : "border-[#4a7c59]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#4a7c59] text-white font-bold text-[10px] flex items-center justify-center">
                    SK
                  </div>
                  <div>
                    <span className="font-bold text-[12px] text-[#2e3230] block leading-tight">Sarah K.</span>
                    <span className="text-[10px] text-[#74796e] block">8m ago</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/30">
                  Replacement
                </span>
              </div>

              <div className="space-y-1 mb-2.5 text-[11px]">
                {!trackedChangesState.diff1Accepted && (
                  <div className="flex items-start gap-1.5 bg-[#ffdad8]/50 text-[#b83230] p-1.5 rounded-lg border border-[#b83230]/20">
                    <span className="material-symbols-outlined text-[13px] mt-0.5 shrink-0">remove</span>
                    <span className="line-through">our legacy direct outbound playbook</span>
                  </div>
                )}
                {!trackedChangesState.diff1Rejected && (
                  <div className="flex items-start gap-1.5 bg-[#eaf2ec] text-[#4a7c59] p-1.5 rounded-lg font-bold border border-[#4a7c59]/20">
                    <span className="material-symbols-outlined text-[13px] mt-0.5 shrink-0">add</span>
                    <span>a customer-led community flywheel</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#e6e2da]">
                <button
                  onClick={() => onAcceptDiff("diff-1")}
                  className={`flex-1 h-7 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs ${
                    trackedChangesState.diff1Accepted
                      ? "bg-[#2d4e36] text-white cursor-default"
                      : "bg-[#4a7c59] hover:bg-[#3d6749] text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>{trackedChangesState.diff1Accepted ? "Accepted" : "Accept"}</span>
                </button>
                <button
                  onClick={() => onRejectDiff("diff-1")}
                  className={`flex-1 h-7 rounded-xl border border-[#e6e2da] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors ${
                    trackedChangesState.diff1Rejected
                      ? "bg-[#b83230] text-white cursor-default"
                      : "bg-white hover:bg-[#ffdad8]/40 text-[#b83230]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  <span>{trackedChangesState.diff1Rejected ? "Rejected" : "Reject"}</span>
                </button>
              </div>
            </div>
          )}

          {/* CARD 3: Alex M. Proposed Scope Edit */}
          {(filterType === "all" || filterType === "edits") && (
            <div className="bg-white hover:bg-[#fbfaf8] rounded-xl p-3 border border-[#e6e2da] hover:border-[#c4a66a] transition-all relative shadow-2xs">
              <div className="absolute -left-1 top-3.5 w-1 h-6 bg-[#c4a66a] rounded-r"></div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#c4a66a] text-white font-bold text-[10px] flex items-center justify-center">
                    AM
                  </div>
                  <div>
                    <span className="font-bold text-[12px] text-[#2e3230] block leading-tight">Alex M.</span>
                    <span className="text-[10px] text-[#74796e] block">5m ago</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f0e8db] text-[#705c30] border border-[#705c30]/20">
                  Checklist Addition
                </span>
              </div>
              <p className="text-[12px] text-[#2e3230] mb-2 leading-snug">
                Added customer advisory board early review &amp; live feedback clinic to Q3 Readiness deliverables.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAcceptDiff("diff-checklist")}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#eaf2ec] border border-[#e6e2da] text-[#4a7c59] font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[13px]">check</span>
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => onRejectDiff("diff-checklist")}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#ffdad8]/40 border border-[#e6e2da] text-[#b83230] font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                  <span>Reject</span>
                </button>
              </div>
            </div>
          )}

          {/* CARD 4: Format & Spacing Note */}
          {(filterType === "all" || filterType === "edits") && (
            <div className="bg-white rounded-xl p-3 border border-[#e6e2da] relative shadow-2xs text-[11px] text-[#6b6358]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-[#2e3230]">
                  <span className="material-symbols-outlined text-[15px] text-[#4a7c59]">auto_fix_high</span>
                  <span>Style Standard Applied</span>
                </div>
                <span className="text-[10px] text-[#74796e]">System</span>
              </div>
              <p className="text-[#2e3230] leading-snug mb-2">
                Terra Modern style tokens applied. Line height adjusted to 1.15 with 1-inch margins.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
