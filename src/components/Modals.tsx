"use client";

import React, { useState, useRef } from "react";
import { ScreenPreset } from "./types";
import { AuthScreen } from "./auth/AuthScreen";

export type TerraActiveModal =
  | null
  | "modal-doc-file"
  | "modal-search-palette"
  | "modal-copilot-drawer"
  | "modal-share-dialog"
  | "modal-account-popover"
  | "modal-asset-upload"
  | "modal-auth";

interface UploadedFileItem {
  id: string;
  name: string;
  type: "pdf" | "png" | "csv" | "json" | "doc";
  size: string;
  uploadedBy: string;
  timeAgo: string;
  note?: string;
  thumbnailUrl?: string;
}

interface ModalsProps {
  activeModal: TerraActiveModal;
  setActiveModal: (modal: TerraActiveModal) => void;
  onApplyCopilotSuggestion: (text: string) => void;
  onToggleTrackChanges: () => void;
  trackChangesOn?: boolean;
  onExportPdf: () => void;
  screensModalOpen: boolean;
  setScreensModalOpen: (val: boolean) => void;
  onSelectPreset: (preset: ScreenPreset) => void;
  activePreset: ScreenPreset;
  onInsertTable?: (rows: number, cols: number) => void;
  onInsertAsset?: (assetName: string, assetType: string, url?: string) => void;
  userProfile?: any;
  onSignOut?: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  setActiveModal,
  onApplyCopilotSuggestion,
  onToggleTrackChanges,
  trackChangesOn = true,
  onExportPdf,
  screensModalOpen,
  setScreensModalOpen,
  onSelectPreset,
  activePreset,
  onInsertTable,
  onInsertAsset,
  userProfile,
  onSignOut,
}) => {
  // ==========================================
  // 1. SEARCH & COMMAND PALETTE STATE (Stitch: 4e4e342951804c988e9aa72a40ac986b)
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterTab, setSearchFilterTab] = useState<
    "all" | "headings" | "comments" | "collaborators" | "commands"
  >("all");

  // ==========================================
  // 2. FILE & ASSET UPLOAD STATE (Stitch: d7825cd8b01e48218c2d3bf3fc47ce6c)
  // ==========================================
  const [assetTab, setAssetTab] = useState<"upload" | "assets" | "export" | "templates">("upload");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recentUploads, setRecentUploads] = useState<UploadedFileItem[]>([
    {
      id: "file-1",
      name: "Brand_Guidelines_v3.pdf",
      type: "pdf",
      size: "3.2 MB",
      uploadedBy: "Sarah K.",
      timeAgo: "10m ago",
    },
    {
      id: "file-2",
      name: "Market_Segmentation_Chart.png",
      type: "png",
      size: "1.8 MB",
      uploadedBy: "Alex R.",
      timeAgo: "1h ago",
      note: "Hero diagram candidate",
      thumbnailUrl: "/stitch-source/file_upload_modal_d7825.png",
    },
    {
      id: "file-3",
      name: "Competitor_Matrix.csv",
      type: "csv",
      size: "420 KB",
      uploadedBy: "David C.",
      timeAgo: "Yesterday",
    },
    {
      id: "file-4",
      name: "Terra_Design_Tokens_2024.json",
      type: "json",
      size: "88 KB",
      uploadedBy: "Editorial Studio",
      timeAgo: "2 days ago",
      note: "Synced with Figma Tokens",
    },
  ]);

  // ==========================================
  // 3. USER ACCOUNT & PROFILE STATE (Stitch: 154402895d224d1a96e8fca1dbef30ff)
  // ==========================================
  const [userStatus, setUserStatus] = useState<"active" | "away">("active");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [multiplayerCursorsOn, setMultiplayerCursorsOn] = useState(true);
  const [copilotPolishOn, setCopilotPolishOn] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState<"terra" | "personal">("terra");

  // ==========================================
  // 4. SHARE & COPILOT STATE
  // ==========================================
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Can edit");
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<Array<{ email: string; role: string }>>([]);

  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [copilotCustomResponse, setCopilotCustomResponse] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Close all modals
  const closeAll = () => setActiveModal(null);

  // Scroll helper
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

  // Handle File Upload from input or drag
  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: UploadedFileItem[] = Array.from(files).map((file, idx) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      let fileType: "pdf" | "png" | "csv" | "json" | "doc" = "doc";
      if (ext === "pdf") fileType = "pdf";
      else if (["png", "jpg", "jpeg", "svg", "webp"].includes(ext || "")) fileType = "png";
      else if (["csv", "xlsx", "xls"].includes(ext || "")) fileType = "csv";
      else if (["json", "ts", "js"].includes(ext || "")) fileType = "json";

      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        type: fileType,
        size: sizeStr,
        uploadedBy: "Sarah Jenkins (You)",
        timeAgo: "Just now",
        note: "Added from local desk",
      };
    });

    setRecentUploads((prev) => [...newItems, ...prev]);
    setUploadSuccessToast(`Uploaded ${newItems.length} file(s) successfully!`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Handle Web URL Asset insertion
  const handleAddWebUrl = () => {
    const url = prompt("Enter hosted media or document asset URL:", "https://images.unsplash.com/photo-1544816155-12df9643f363");
    if (!url) return;
    const newItem: UploadedFileItem = {
      id: `url-${Date.now()}`,
      name: "Remote_Visual_Asset.jpg",
      type: "png",
      size: "Remote URL",
      uploadedBy: "Sarah Jenkins (You)",
      timeAgo: "Just now",
      note: url,
    };
    setRecentUploads((prev) => [newItem, ...prev]);
    setUploadSuccessToast("Web asset linked into document hub!");
    setTimeout(() => setUploadSuccessToast(null), 3000);
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

  // Filtered counts for Search Modal
  const isMatch = (str: string) => {
    if (!searchQuery.trim()) return true;
    return str.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const showHeadings = (searchFilterTab === "all" || searchFilterTab === "headings") && (
    isMatch("Executive Summary & Market Drivers") ||
    isMatch("Q3 Readiness Deliverables") ||
    isMatch("Launch Architecture & Timeline")
  );

  const showComments = (searchFilterTab === "all" || searchFilterTab === "comments") && (
    isMatch("Sarah K.") ||
    isMatch("APAC-specific deployment benchmarks") ||
    isMatch("Alex M.") ||
    isMatch("customer advisory board early review")
  );

  const showCollaborators = (searchFilterTab === "all" || searchFilterTab === "collaborators") && (
    isMatch("Sarah K.") || isMatch("Alex M.") || isMatch("David C.") || isMatch("Sarah Jenkins")
  );

  const showCommands = (searchFilterTab === "all" || searchFilterTab === "commands") && (
    isMatch("Insert Matrix Table") ||
    isMatch("Export as Publication PDF") ||
    isMatch("Toggle Track Changes") ||
    isMatch("Open Page Setup & Margins") ||
    isMatch("Open File & Asset Management")
  );

  return (
    <>
      {/* ========================================================
          MODAL 1: TERRA EDITOR - SEARCH & COMMAND PALETTE MODAL
          Stitch Screen ID: 4e4e342951804c988e9aa72a40ac986b
          ======================================================== */}
      {activeModal === "modal-search-palette" && (
        <div
          id="palette-overlay"
          className="fixed inset-0 z-50 bg-[#2e3230]/40 backdrop-blur-xs flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-6 animate-in fade-in duration-200 select-none"
          onClick={closeAll}
        >
          {/* Main Floating Card */}
          <div
            className="w-full max-w-2xl bg-[#faf6f0] text-[#2e3230] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-[#e6e2da]/80 border border-[#e6e2da] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Container Bar */}
            <div className="bg-white px-5 pt-4 pb-3.5 flex items-center gap-3.5 border-b border-[#e6e2da]/70">
              <span className="material-symbols-outlined text-[#4a7c59] text-2xl shrink-0">
                search
              </span>
              <input
                autoFocus
                id="command-input"
                className="w-full bg-transparent text-base sm:text-lg font-body text-[#2e3230] placeholder:text-[#6b6358]/70 focus:outline-none focus:ring-0 p-0"
                placeholder="Search headings, comments, collaborators, or commands... (⌘K)"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 shrink-0">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#f0ece4] hover:bg-[#eae6de] text-[#6b6358] hover:text-[#2e3230] transition-colors font-semibold flex items-center gap-1"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#f0ece4] text-[#6b6358] border border-[#e6e2da]">
                  ESC
                </span>
              </div>
            </div>

            {/* Quick Filter Scope Tabs */}
            <div className="bg-[#f5f1ea] px-5 py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs font-semibold border-b border-[#e6e2da] no-scrollbar">
              <button
                onClick={() => setSearchFilterTab("all")}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
                  searchFilterTab === "all"
                    ? "bg-[#4a7c59] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#6b6358] hover:text-[#2e3230]"
                }`}
              >
                <span>All</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    searchFilterTab === "all" ? "bg-white/25 text-white" : "bg-[#f0ece4] text-[#6b6358]"
                  }`}
                >
                  18
                </span>
              </button>

              <button
                onClick={() => setSearchFilterTab("headings")}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
                  searchFilterTab === "headings"
                    ? "bg-[#4a7c59] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#6b6358] hover:text-[#2e3230]"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">format_h1</span>
                <span>Headings</span>
              </button>

              <button
                onClick={() => setSearchFilterTab("comments")}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
                  searchFilterTab === "comments"
                    ? "bg-[#4a7c59] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#6b6358] hover:text-[#2e3230]"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">chat_bubble_outline</span>
                <span>Comments</span>
              </button>

              <button
                onClick={() => setSearchFilterTab("collaborators")}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
                  searchFilterTab === "collaborators"
                    ? "bg-[#4a7c59] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#6b6358] hover:text-[#2e3230]"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">group</span>
                <span>Collaborators</span>
              </button>

              <button
                onClick={() => setSearchFilterTab("commands")}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
                  searchFilterTab === "commands"
                    ? "bg-[#4a7c59] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#6b6358] hover:text-[#2e3230]"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                <span>Commands &amp; Tools</span>
              </button>
            </div>

            {/* Results Scrollable Panel */}
            <div className="overflow-y-auto p-3 sm:p-4 space-y-4 text-sm max-h-[500px]">
              {/* Category 1: Jump to Headings */}
              {showHeadings && (
                <div>
                  <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-[#6b6358] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#705c30]">
                        bookmarks
                      </span>
                      Jump to Heading
                    </span>
                    <span className="text-[10px] font-normal lowercase tracking-normal text-[#74796e]">
                      3 matching
                    </span>
                  </div>

                  <div className="space-y-1">
                    {/* Active Selected Item */}
                    <div
                      onClick={() => scrollTo("section-1")}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#c8e8d0] text-[#002110] cursor-pointer transition-all shadow-xs border border-[#78a886]/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#4a7c59] text-white flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            turn_sharp_right
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline font-semibold text-sm sm:text-base truncate flex items-center gap-2">
                            <span>1. Executive Summary &amp; Market Drivers</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-body font-bold bg-[#4a7c59] text-white">
                              Active
                            </span>
                          </div>
                          <div className="text-xs text-[#2a6038] flex items-center gap-2 mt-0.5">
                            <span>Section 1</span>
                            <span>•</span>
                            <span>Page 1</span>
                            <span>•</span>
                            <span className="text-[#705c30] font-semibold">
                              Matched: &ldquo;market drivers&rdquo;
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold px-2 py-1 rounded bg-white/70 text-[#002110] shadow-2xs">
                          ↵ Jump
                        </span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div
                      onClick={() => scrollTo("section-2")}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all border border-transparent hover:border-[#e6e2da]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#6b6358] group-hover:text-[#4a7c59] flex items-center justify-center shrink-0 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            turn_sharp_right
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline font-semibold text-sm sm:text-base truncate group-hover:text-[#4a7c59] transition-colors">
                            2. Q3 Readiness Deliverables
                          </div>
                          <div className="text-xs text-[#6b6358] flex items-center gap-2 mt-0.5">
                            <span>Section 2</span>
                            <span>•</span>
                            <span>Page 2</span>
                            <span>•</span>
                            <span>Regional milestones</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#6b6358] opacity-0 group-hover:opacity-100 transition-opacity">
                        Jump
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div
                      onClick={() => scrollTo("section-1")}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all border border-transparent hover:border-[#e6e2da]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#6b6358] group-hover:text-[#4a7c59] flex items-center justify-center shrink-0 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            turn_sharp_right
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline font-semibold text-sm sm:text-base truncate group-hover:text-[#4a7c59] transition-colors">
                            Launch Architecture &amp; Timeline
                          </div>
                          <div className="text-xs text-[#6b6358] flex items-center gap-2 mt-0.5">
                            <span>Section 3</span>
                            <span>•</span>
                            <span>Page 3</span>
                            <span>•</span>
                            <span className="text-[#4a7c59] font-semibold">
                              Matched: <span className="underline">Launch</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#6b6358] opacity-0 group-hover:opacity-100 transition-opacity">
                        Jump
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 2: Comments & Discussions */}
              {showComments && (
                <div>
                  <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-[#6b6358] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#705c30]">
                        comment
                      </span>
                      Comments &amp; Discussions
                    </span>
                    <span className="text-[10px] font-normal lowercase tracking-normal text-[#74796e]">
                      2 open threads
                    </span>
                  </div>

                  <div className="space-y-1">
                    {/* Comment 1 */}
                    <div
                      onClick={() => scrollTo("sarah-comment-highlight")}
                      className="group flex items-start justify-between p-3 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all border border-transparent hover:border-[#e6e2da]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#78a886] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          SK
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#2e3230]">Sarah K.</span>
                            <span className="text-[11px] text-[#6b6358]">Marketing Lead</span>
                            <span className="text-[10px] text-[#6b6358] px-1.5 py-0.5 bg-[#f0ece4] rounded">
                              Page 1
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#4a4e4a] mt-1 line-clamp-1">
                            &ldquo;Should we include APAC-specific deployment benchmarks before finalizing{" "}
                            <mark className="bg-[#f8e0a8] text-[#221a05] font-semibold px-1 rounded">
                              launch
                            </mark>{" "}
                            milestones?&rdquo;
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#6b6358] shrink-0 ml-2">
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                      </div>
                    </div>

                    {/* Comment 2 */}
                    <div
                      onClick={closeAll}
                      className="group flex items-start justify-between p-3 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all border border-transparent hover:border-[#e6e2da]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#c4a66a] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          AM
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#2e3230]">Alex M.</span>
                            <span className="text-[11px] text-[#6b6358]">Product Strategist</span>
                            <span className="text-[10px] text-[#6b6358] px-1.5 py-0.5 bg-[#f0ece4] rounded">
                              Page 2
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#4a4e4a] mt-1 line-clamp-1">
                            &ldquo;Added customer advisory board early review feedback into the sensory packaging appendix.&rdquo;
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#6b6358] shrink-0 ml-2">
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 3: Collaborators */}
              {showCollaborators && (
                <div>
                  <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-[#6b6358] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#705c30]">
                        group
                      </span>
                      Collaborators Online
                    </span>
                    <span className="text-[10px] font-normal lowercase tracking-normal text-[#74796e]">
                      3 active
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div
                      onClick={closeAll}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#78a886] text-white font-bold text-xs flex items-center justify-center">
                          SK
                        </div>
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-2">
                            <span>Sarah K.</span>
                            <span className="w-2 h-2 rounded-full bg-[#4a7c59]"></span>
                          </div>
                          <div className="text-[11px] text-[#6b6358]">Editing paragraph 2 • Section 1</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#4a7c59] font-medium">Jump to caret</span>
                    </div>

                    <div
                      onClick={closeAll}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c4a66a] text-white font-bold text-xs flex items-center justify-center">
                          AM
                        </div>
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-2">
                            <span>Alex M.</span>
                            <span className="w-2 h-2 rounded-full bg-[#c4a66a]"></span>
                          </div>
                          <div className="text-[11px] text-[#6b6358]">Reviewing tasks • Section 2</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#4a7c59] font-medium">Jump to caret</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 4: Quick Actions & Commands */}
              {showCommands && (
                <div>
                  <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-[#6b6358] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#705c30]">bolt</span>
                      Document Commands &amp; Tools
                    </span>
                    <span className="text-[10px] font-normal lowercase tracking-normal text-[#74796e]">
                      Direct execution
                    </span>
                  </div>

                  <div className="space-y-1">
                    {/* Command 1: Insert Matrix Table */}
                    <div
                      onClick={() => {
                        onInsertTable?.(3, 3);
                        closeAll();
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#6b6358] group-hover:text-[#4a7c59] flex items-center justify-center shrink-0 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">table_chart</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Insert Matrix Table (3 × 3)</div>
                          <div className="text-xs text-[#6b6358]">Creates an organic grid for competitor analysis</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#6b6358] bg-[#f0ece4] px-2 py-1 rounded-md">
                        <span>⌥⌘T</span>
                      </div>
                    </div>

                    {/* Command 2: Export PDF */}
                    <div
                      onClick={() => {
                        onExportPdf();
                        closeAll();
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#6b6358] group-hover:text-[#4a7c59] flex items-center justify-center shrink-0 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Export as Publication PDF</div>
                          <div className="text-xs text-[#6b6358]">Paginated or Pageless layout with high-res typography</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#6b6358] bg-[#f0ece4] px-2 py-1 rounded-md">
                        <span>⇧⌘E</span>
                      </div>
                    </div>

                    {/* Command 3: Toggle Track Changes */}
                    <div
                      onClick={() => {
                        onToggleTrackChanges();
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#4a7c59] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">track_changes</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span>Toggle Track Changes</span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                trackChangesOn
                                  ? "bg-[#c8e8d0] text-[#2a6038]"
                                  : "bg-[#e4e0d8] text-[#6b6358]"
                              }`}
                            >
                              Currently {trackChangesOn ? "ON" : "OFF"}
                            </span>
                          </div>
                          <div className="text-xs text-[#6b6358]">Record insertions, deletions, and reviewer remarks</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#6b6358] bg-[#f0ece4] px-2 py-1 rounded-md">
                        <span>⌘⇧C</span>
                      </div>
                    </div>

                    {/* Command 4: Open File & Asset Hub */}
                    <div
                      onClick={() => {
                        setActiveModal("modal-asset-upload");
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#4a7c59] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">folder_special</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span>File &amp; Asset Management</span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#f0e8db] text-[#705c30]">
                              Doc Hub
                            </span>
                          </div>
                          <div className="text-xs text-[#6b6358]">Upload external media, import documents, manage versioned assets</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#6b6358] bg-[#f0ece4] px-2 py-1 rounded-md">
                        <span>⌘U</span>
                      </div>
                    </div>

                    {/* Command 5: Page Setup */}
                    <div
                      onClick={closeAll}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f0ece4] text-[#6b6358] group-hover:text-[#4a7c59] flex items-center justify-center shrink-0 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">tune</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Open Page Setup &amp; Margins</div>
                          <div className="text-xs text-[#6b6358]">Set warm margins, orientation, and tactile bleed zones</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#6b6358] text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar Inside Modal */}
            <div className="bg-[#f5f1ea] px-5 py-3 border-t border-[#e6e2da] flex flex-wrap items-center justify-between text-xs text-[#6b6358]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] font-bold text-[#2e3230] border border-[#e6e2da]">
                    ↵
                  </kbd>
                  <span>Jump / Select</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] font-bold text-[#2e3230] border border-[#e6e2da]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] font-bold text-[#2e3230] border border-[#e6e2da]">
                    ↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] font-bold text-[#2e3230] border border-[#e6e2da]">
                    Tab
                  </kbd>
                  <span>Filter Type</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]"></span>
                <span className="font-medium text-[11px]">Terra Engine v2.4</span>
                <span className="text-[#e6e2da]">•</span>
                <button
                  onClick={closeAll}
                  className="flex items-center gap-1 hover:text-[#2e3230] font-semibold transition-colors"
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] font-bold text-[#2e3230] border border-[#e6e2da]">
                    Esc
                  </kbd>
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: TERRA EDITOR - FILE & ASSET UPLOAD MODAL
          Stitch Screen ID: d7825cd8b01e48218c2d3bf3fc47ce6c
          ======================================================== */}
      {activeModal === "modal-asset-upload" && (
        <div
          id="file-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#2e3230]/40 backdrop-blur-md transition-opacity duration-300 select-none animate-in fade-in"
          onClick={closeAll}
        >
          {/* Main Modal Card */}
          <div
            className="relative w-full max-w-4xl bg-white text-[#2e3230] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#e6e2da] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Header */}
            <div className="px-6 sm:px-7 pt-5 sm:pt-6 pb-4 bg-[#f5f1ea] flex items-start justify-between gap-4 border-b border-[#e6e2da]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4a7c59]/10 text-[#4a7c59] flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[26px]">folder_special</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-xl font-bold tracking-tight text-[#2e3230]">
                      File &amp; Asset Management
                    </h2>
                    <span className="bg-[#e4e0d8] text-[#6b6358] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      Doc Hub
                    </span>
                  </div>
                  <p className="text-xs text-[#6b6358] mt-0.5">
                    Upload external media, import documents, or manage versioned assets for this story.
                  </p>
                </div>
              </div>

              <button
                onClick={closeAll}
                className="w-9 h-9 rounded-xl bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] hover:bg-[#eae6de] transition-colors flex items-center justify-center shrink-0"
                title="Close Modal (Esc)"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 sm:px-7 bg-[#f5f1ea] flex items-center justify-between text-xs font-semibold border-b border-[#e6e2da]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setAssetTab("upload")}
                  className={`relative py-3 px-3 flex items-center gap-2 transition-colors ${
                    assetTab === "upload" ? "text-[#4a7c59] font-bold" : "text-[#6b6358] hover:text-[#2e3230]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">cloud_upload</span>
                  <span>Upload &amp; Import</span>
                  {assetTab === "upload" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4a7c59] rounded-t-full"></span>
                  )}
                </button>

                <button
                  onClick={() => setAssetTab("assets")}
                  className={`py-3 px-3 flex items-center gap-2 transition-colors ${
                    assetTab === "assets" ? "text-[#4a7c59] font-bold" : "text-[#6b6358] hover:text-[#2e3230]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">perm_media</span>
                  <span>Document Assets</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f0ece4] text-[#2e3230] font-bold">
                    {recentUploads.length + 10}
                  </span>
                </button>

                <button
                  onClick={() => setAssetTab("export")}
                  className={`py-3 px-3 flex items-center gap-2 transition-colors ${
                    assetTab === "export" ? "text-[#4a7c59] font-bold" : "text-[#6b6358] hover:text-[#2e3230]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">output</span>
                  <span>Export &amp; Formats</span>
                </button>

                <button
                  onClick={() => setAssetTab("templates")}
                  className={`py-3 px-3 flex items-center gap-2 transition-colors ${
                    assetTab === "templates" ? "text-[#4a7c59] font-bold" : "text-[#6b6358] hover:text-[#2e3230]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">dataset</span>
                  <span>Templates</span>
                </button>
              </div>

              {/* Storage Bar Pill */}
              <div className="hidden md:flex items-center gap-2.5 bg-[#f0ece4] px-3 py-1.5 rounded-full text-[11px] text-[#6b6358]">
                <span className="material-symbols-outlined text-[15px] text-[#4a7c59]">pie_chart</span>
                <span>482 MB of 2 GB used</span>
                <div className="w-16 h-1.5 bg-[#e4e0d8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4a7c59] rounded-full" style={{ width: "24%" }}></div>
                </div>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 bg-white max-h-[calc(92vh-180px)]">
              {/* Toast Notification */}
              {uploadSuccessToast && (
                <div className="p-3 bg-[#eaf2ec] border border-[#4a7c59]/30 text-[#1e4a2c] rounded-xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#4a7c59]">
                      check_circle
                    </span>
                    <span>{uploadSuccessToast}</span>
                  </div>
                  <button onClick={() => setUploadSuccessToast(null)}>
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              )}

              {/* DRAG & DROP ZONE */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFilesAdded(e.dataTransfer.files);
                }}
                className={`group relative rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer shadow-xs border-2 border-dashed ${
                  isDragOver
                    ? "bg-[#eaf2ec] border-[#4a7c59] scale-[1.01]"
                    : "bg-[#f5f1ea]/70 hover:bg-[#f5f1ea] border-[#78a886]/40 hover:border-[#4a7c59]"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Organic Dotted Aesthetic Backdrop */}
                <div
                  className="absolute inset-2 rounded-xl pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, #78a886 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                    opacity: 0.35,
                  }}
                ></div>

                {/* Hidden Native File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesAdded(e.target.files)}
                />

                <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                  {/* Organic Graphic Motif Upload Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white text-[#4a7c59] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-lg transition-transform duration-200">
                    <div className="relative">
                      <span className="material-symbols-outlined text-[34px]">upload_file</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-[#c4a66a] absolute -bottom-1 -right-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        eco
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="font-headline text-lg font-bold text-[#2e3230]">
                      Drag &amp; drop files here, or browse
                    </p>
                    <p className="text-xs text-[#6b6358] mt-1">
                      Supports DOCX, Markdown, PDF, PNG, JPG, and SVG (up to 50MB each)
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-[#4a7c59] hover:bg-[#3d6749] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                      <span>Browse Files</span>
                    </button>

                    <button
                      onClick={handleAddWebUrl}
                      className="px-4 py-2.5 rounded-xl bg-[#f0ece4] hover:bg-[#eae6de] text-[#6b6358] hover:text-[#2e3230] font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">link</span>
                      <span>From Web URL</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* QUICK CLOUD IMPORT BAR */}
              <div className="bg-[#f5f1ea] p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs border border-[#e6e2da]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#705c30] text-[18px]">hub</span>
                  <span className="font-bold text-[#2e3230]">Connected Cloud Pipelines</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setUploadSuccessToast("Imported draft sync from Google Drive!");
                      setTimeout(() => setUploadSuccessToast(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f0ece4] text-[#2e3230] font-medium flex items-center gap-2 shadow-2xs border border-[#e6e2da] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#4285F4]">
                      description
                    </span>
                    <span>Import Google Doc</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadSuccessToast("Imported workspace block from Notion!");
                      setTimeout(() => setUploadSuccessToast(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f0ece4] text-[#2e3230] font-medium flex items-center gap-2 shadow-2xs border border-[#e6e2da] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#2e3230]">notes</span>
                    <span>Import Notion Page</span>
                  </button>

                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4a7c59]/10 text-[#4a7c59] font-semibold">
                    <span className="material-symbols-outlined text-[15px]">sync</span>
                    <span>Cloud Drive Active</span>
                  </div>
                </div>
              </div>

              {/* RECENT UPLOADS & ATTACHMENTS LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-[#2e3230]">
                      Recent Uploads &amp; Attachments
                    </h3>
                    <span className="text-xs text-[#6b6358]">
                      (Select to insert into current cursor location)
                    </span>
                  </div>
                  <button
                    onClick={() => setAssetTab("assets")}
                    className="text-xs font-semibold text-[#4a7c59] hover:underline flex items-center gap-1"
                  >
                    <span>View all files</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {recentUploads.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 bg-[#f5f1ea] hover:bg-[#f0ece4] rounded-xl flex items-center justify-between gap-4 transition-colors group cursor-pointer border border-[#e6e2da]/70"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail or File Type Icon */}
                        {file.type === "png" && file.thumbnailUrl ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs shrink-0 bg-[#e4e0d8] border border-[#e6e2da]">
                            <img
                              src={file.thumbnailUrl}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        ) : file.type === "pdf" ? (
                          <div className="w-10 h-10 rounded-xl bg-[#b83230]/10 text-[#b83230] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">
                              picture_as_pdf
                            </span>
                          </div>
                        ) : file.type === "csv" ? (
                          <div className="w-10 h-10 rounded-xl bg-[#c4a66a]/20 text-[#705c30] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">
                              table_chart
                            </span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#f0ece4] text-[#6b6358] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">code</span>
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-xs text-[#2e3230] truncate">
                              {file.name}
                            </p>
                            <span
                              className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                                file.type === "pdf"
                                  ? "bg-[#ffdad8] text-[#b83230]"
                                  : file.type === "png"
                                  ? "bg-[#4a7c59]/15 text-[#4a7c59]"
                                  : file.type === "csv"
                                  ? "bg-[#f8e0a8] text-[#705c30]"
                                  : "bg-[#e4e0d8] text-[#6b6358]"
                              }`}
                            >
                              {file.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6b6358] mt-0.5 truncate">
                            {file.size} • Uploaded {file.timeAgo} by{" "}
                            <span className="font-medium text-[#2e3230]">{file.uploadedBy}</span>
                            {file.note && (
                              <>
                                {" "}
                                •{" "}
                                <span className="text-[#705c30] font-semibold">{file.note}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {file.type === "csv" ? (
                          <button
                            onClick={() => {
                              onInsertTable?.(3, 3);
                              closeAll();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#4a7c59] hover:text-white text-[#2e3230] font-semibold text-xs flex items-center gap-1.5 transition-colors border border-[#e6e2da]"
                          >
                            <span className="material-symbols-outlined text-[15px]">table_rows</span>
                            <span>Convert to Terra Table</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onInsertAsset?.(file.name, file.type, file.thumbnailUrl);
                              closeAll();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#4a7c59] hover:bg-[#3d6749] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">input</span>
                            <span>Insert into Doc</span>
                          </button>
                        )}

                        <button
                          className="w-8 h-8 rounded-lg bg-white hover:bg-[#f0ece4] text-[#6b6358] hover:text-[#2e3230] flex items-center justify-center transition-colors border border-[#e6e2da]"
                          title="Options"
                        >
                          <span className="material-symbols-outlined text-[17px]">more_vert</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASSET STATS CARD (Micro-visualization) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-[#f5f1ea] flex items-center gap-3 border border-[#e6e2da]">
                  <div className="w-9 h-9 rounded-lg bg-[#4a7c59]/10 text-[#4a7c59] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">photo_library</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b6358] font-medium">Inline Media</p>
                    <p className="font-headline font-bold text-sm text-[#2e3230]">8 High-res Photos</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f5f1ea] flex items-center gap-3 border border-[#e6e2da]">
                  <div className="w-9 h-9 rounded-lg bg-[#705c30]/10 text-[#705c30] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">attachment</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b6358] font-medium">External References</p>
                    <p className="font-headline font-bold text-sm text-[#2e3230]">5 Attached Docs</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f5f1ea] flex items-center gap-3 border border-[#e6e2da]">
                  <div className="w-9 h-9 rounded-lg bg-[#4a7c59]/15 text-[#4a7c59] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6b6358] font-medium">Compliance Check</p>
                    <p className="font-headline font-bold text-sm text-[#4a7c59]">All Safe &amp; Scanned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="px-6 sm:px-7 py-3.5 sm:py-4 bg-[#f5f1ea] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-[#e6e2da]">
              <div className="flex items-center gap-2 text-[#6b6358]">
                <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">info</span>
                <span>Assets are automatically backed up to workspace cloud storage.</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={closeAll}
                  className="px-4 py-2 rounded-xl hover:bg-[#eae6de] text-[#6b6358] font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={closeAll}
                  className="px-5 py-2.5 rounded-xl bg-[#4a7c59] hover:bg-[#3d6749] text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2.5: PROMPTMARK AUTHENTICATION & GOOGLE SIGN-IN
          Stitch Screen ID: 20ba192ce49e4a1b9e986368c5740394
          ======================================================== */}
      {activeModal === "modal-auth" && (
        <AuthScreen isModal onClose={closeAll} />
      )}

      {/* ========================================================
          MODAL 3: TERRA EDITOR - USER ACCOUNT & PROFILE POPOVER MODAL
          Stitch Screen ID: 154402895d224d1a96e8fca1dbef30ff
          ======================================================== */}
      {activeModal === "modal-account-popover" && (
        <>
          {/* Subtle Dismiss Backdrop */}
          <div
            id="popover-backdrop"
            className="fixed inset-0 z-40 bg-[#2e3230]/20 backdrop-blur-[1.5px] transition-opacity"
            onClick={closeAll}
          ></div>

          {/* User Account Controls Popover Modal */}
          <div
            id="user-profile-popover"
            className="fixed top-14 right-3 sm:right-4 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-[#faf8f5] rounded-2xl shadow-2xl flex flex-col text-[#2e3230] overflow-hidden border border-[#e6e2da] transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2 select-none"
          >
            {/* Top Accent Subtle Tint Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#4a7c59] via-[#78a886] to-[#c4a66a]"></div>

            <div className="p-4 space-y-3.5">
              {/* SECTION 1: USER IDENTITY & ROLE HEADER */}
              <div className="bg-[#f5f1ea] rounded-xl p-3.5 flex items-start gap-3.5 relative border border-[#e6e2da]">
                {/* Profile Badge with Active Presence Ring */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#705c30] text-white font-headline font-bold text-base flex items-center justify-center shadow-xs overflow-hidden">
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
                      "SJ"
                    )}
                  </div>
                  {/* Online status indicator dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-[#faf8f5] flex items-center justify-center ${
                      userStatus === "active" ? "bg-[#4a7c59]" : "bg-[#c4a66a]"
                    }`}
                    title={`Status: ${userStatus === "active" ? "Online & Active" : "Away"}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                </div>

                {/* User Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="font-headline font-bold text-[15px] text-[#2e3230] leading-snug truncate">
                      {userProfile?.full_name || "Sarah Jenkins"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c8e8d0] text-[#2a6038] tracking-wide shrink-0">
                      {userProfile ? "Pro" : "Admin"}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b6358] truncate mt-0.5 font-body">
                    {userProfile?.email || "sarah.j@terra.design"}
                  </p>

                  {/* Quick Status Badge Action */}
                  <div className="mt-2 flex items-center gap-1.5 relative">
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4a7c59] hover:text-[#3d6749] bg-[#eaf2ec] px-2 py-0.5 rounded-md transition-colors border border-[#4a7c59]/20"
                      title="Change your online status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          userStatus === "active" ? "bg-[#4a7c59]" : "bg-[#c4a66a]"
                        }`}
                      ></span>
                      <span className="capitalize">{userStatus}</span>
                      <span className="material-symbols-outlined text-[13px]">expand_more</span>
                    </button>

                    <button
                      onClick={() => setUserStatus(userStatus === "active" ? "away" : "active")}
                      className="text-[11px] text-[#6b6358] hover:text-[#2e3230] font-medium hover:underline px-1 transition-colors"
                    >
                      Set {userStatus === "active" ? "away" : "active"}
                    </button>

                    {showStatusDropdown && (
                      <div className="absolute left-0 top-7 w-32 bg-white rounded-xl shadow-lg border border-[#e6e2da] p-1.5 z-50 text-xs">
                        <button
                          onClick={() => {
                            setUserStatus("active");
                            setShowStatusDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#f0ece4] text-[#2e3230]"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#4a7c59]"></span>
                          <span>Active</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserStatus("away");
                            setShowStatusDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#f0ece4] text-[#2e3230]"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#c4a66a]"></span>
                          <span>Away</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: STORAGE & SUBSCRIPTION METRIC */}
              <div className="bg-[#f5f1ea] rounded-xl p-3 space-y-2 border border-[#e6e2da]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2e3230] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#705c30]">
                      cloud
                    </span>
                    Terra Pro Cloud
                  </span>
                  <span className="text-[#6b6358] font-medium">14.2 / 25 GB</span>
                </div>
                {/* Storage Bar Meter */}
                <div className="w-full h-2 rounded-full bg-[#e4e0d8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4a7c59] transition-all duration-500"
                    style={{ width: "56.8%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6b6358]">
                  <span>56.8% space utilized</span>
                  <button className="text-[#4a7c59] hover:underline font-semibold transition-colors">
                    Manage plan
                  </button>
                </div>
              </div>

              {/* SECTION 3: CORE NAVIGATION & SETTINGS LIST */}
              <div className="space-y-0.5 text-xs font-medium">
                <button
                  onClick={closeAll}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#6b6358] group-hover:text-[#4a7c59] transition-colors">
                      person
                    </span>
                    <span>My Profile &amp; Preferences</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-[#6b6358]/60">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={closeAll}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#6b6358] group-hover:text-[#4a7c59] transition-colors">
                      tune
                    </span>
                    <span>Workspace Typography &amp; Defaults</span>
                  </div>
                  <span className="text-[10px] text-[#6b6358] font-semibold bg-[#f0ece4] px-1.5 py-0.5 rounded border border-[#e6e2da]">
                    Nunito
                  </span>
                </button>

                <button
                  onClick={closeAll}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#6b6358] group-hover:text-[#4a7c59] transition-colors">
                      notifications
                    </span>
                    <span>Notifications &amp; Activity Log</span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#4a7c59] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                    3
                  </span>
                </button>

                <button
                  onClick={() => {
                    closeAll();
                    setActiveModal("modal-search-palette");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#6b6358] group-hover:text-[#4a7c59] transition-colors">
                      keyboard
                    </span>
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#f0ece4] text-[#6b6358] font-semibold border border-[#e6e2da]">
                    ⌘ /
                  </kbd>
                </button>
              </div>

              {/* SECTION 4: LIVE SESSION & COLLABORATION TOGGLES */}
              <div className="bg-[#f5f1ea] rounded-xl p-3 space-y-3 border border-[#e6e2da]">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#6b6358]">
                  Live Session Controls
                </p>

                {/* Toggle 1: Cursor Visibility */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#2e3230]">Multiplayer Cursors</span>
                    <span className="text-[11px] text-[#6b6358]">See Sarah K. &amp; David in document</span>
                  </div>
                  <button
                    onClick={() => setMultiplayerCursorsOn(!multiplayerCursorsOn)}
                    className={`w-10 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${
                      multiplayerCursorsOn ? "bg-[#4a7c59]" : "bg-[#e4e0d8]"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-2xs transform transition-transform ${
                        multiplayerCursorsOn ? "translate-x-4" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Toggle 2: AI Copilot Assistant */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#2e3230] flex items-center gap-1">
                      AI Copilot Polish
                      <span className="material-symbols-outlined text-[13px] text-[#705c30]">
                        auto_awesome
                      </span>
                    </span>
                    <span className="text-[11px] text-[#6b6358]">Suggest inline tone &amp; grammar</span>
                  </div>
                  <button
                    onClick={() => setCopilotPolishOn(!copilotPolishOn)}
                    className={`w-10 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${
                      copilotPolishOn ? "bg-[#4a7c59]" : "bg-[#e4e0d8]"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-2xs transform transition-transform ${
                        copilotPolishOn ? "translate-x-4" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              {/* SECTION 5: WORKSPACE SWITCHER */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6b6358]">
                    Active Workspaces
                  </span>
                  <button className="text-[11px] font-semibold text-[#4a7c59] hover:underline">
                    + New team
                  </button>
                </div>

                <div className="space-y-1">
                  {/* Primary Workspace */}
                  <button
                    onClick={() => setActiveWorkspace("terra")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors group ${
                      activeWorkspace === "terra"
                        ? "bg-[#eaf2ec] border border-[#4a7c59]/30"
                        : "hover:bg-[#f0ece4] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[#4a7c59] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        T
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[#2e3230] leading-tight truncate">
                          Terra Design Core
                        </p>
                        <p className="text-[10px] text-[#6b6358] leading-tight truncate">
                          24 collaborators • Enterprise
                        </p>
                      </div>
                    </div>
                    {activeWorkspace === "terra" && (
                      <span className="material-symbols-outlined text-[17px] text-[#4a7c59] shrink-0">
                        check_circle
                      </span>
                    )}
                  </button>

                  {/* Secondary Workspace */}
                  <button
                    onClick={() => setActiveWorkspace("personal")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors group ${
                      activeWorkspace === "personal"
                        ? "bg-[#eaf2ec] border border-[#4a7c59]/30"
                        : "hover:bg-[#f0ece4] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[#6b6358] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        P
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[#2e3230] leading-tight truncate">
                          Personal Workspace
                        </p>
                        <p className="text-[10px] text-[#6b6358] leading-tight truncate">
                          3 private documents
                        </p>
                      </div>
                    </div>
                    {activeWorkspace === "personal" ? (
                      <span className="material-symbols-outlined text-[17px] text-[#4a7c59] shrink-0">
                        check_circle
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6b6358] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Switch
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* SECTION 6: FOOTER ACTIONS & SIGN OUT */}
              <div className="pt-2 border-t border-[#e6e2da] space-y-1">
                {/* Stitch Project Screens Button */}
                <button
                  onClick={() => {
                    closeAll();
                    setScreensModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#4a7c59] hover:bg-[#eaf2ec] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">gallery_thumbnail</span>
                    View Stitch Project Screens
                  </span>
                  <span className="text-[10px] font-bold bg-[#c8e8d0] px-1.5 py-0.5 rounded text-[#2a6038]">
                    7 Screens
                  </span>
                </button>

                <button
                  onClick={() => {
                    closeAll();
                    setActiveModal("modal-auth");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#4a7c59] hover:bg-[#eaf2ec] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">account_circle</span>
                    Switch or Sign in with Google
                  </span>
                  <span className="text-[11px] font-medium text-[#4a7c59] group-hover:underline">
                    Connect
                  </span>
                </button>

                <button
                  onClick={() => {
                    closeAll();
                    onSignOut?.();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#b83230] hover:bg-[#ffdad8]/40 transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    {userProfile?.full_name ? `Sign out of ${userProfile.full_name}` : "Sign out & Exit"}
                  </span>
                  <span className="text-[11px] font-normal text-[#b83230]/80 group-hover:underline">
                    Disconnect
                  </span>
                </button>

                <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-[#6b6358]">
                  <span>Terra Engine v2.4.1 (Clean Build)</span>
                  <div className="flex gap-2">
                    <button className="hover:underline">Privacy</button>
                    <span>•</span>
                    <button className="hover:underline">Help docs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          MODAL 4: FILE / APP MENU (modal-doc-file)
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
                onClick={() => {
                  closeAll();
                  setActiveModal("modal-asset-upload");
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#f0ece4] text-[#2e3230] text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">folder_special</span>
                <span className="flex-1 font-semibold">Open Asset &amp; File Hub...</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#eaf2ec] rounded text-[#4a7c59] font-bold">
                  New
                </span>
              </button>

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
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          MODAL 5: COPILOT AI DRAWER (modal-copilot-drawer)
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
                <span className="material-symbols-outlined text-[18px] text-[#4a7c59] animate-spin-slow">
                  auto_awesome
                </span>
                <h3 className="font-headline font-bold text-[13px] text-[#2e3230]">
                  Terra Copilot Assistant
                </h3>
              </div>
              <button
                onClick={closeAll}
                className="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center text-[#6b6358] hover:text-[#2e3230]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="p-4 max-h-[360px] overflow-y-auto space-y-3 text-[12px]">
              <div className="p-3 bg-[#eaf2ec]/70 rounded-xl border border-[#4a7c59]/20 text-[#2e3230]">
                <div className="flex items-center gap-1.5 text-[#4a7c59] font-bold mb-1">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span>Document Intelligence</span>
                </div>
                <p>
                  I’ve analyzed the 1,420 words in{" "}
                  <strong className="font-semibold text-[#1e4a2c]">
                    &ldquo;Q3 Brand Positioning&rdquo;
                  </strong>
                  . Would you like me to refine section 1 tone, generate bulleted executive takeaways,
                  or check alignment?
                </p>
              </div>

              {/* Action Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => handleAskCopilot("Summarize Section 1 Market Drivers")}
                  className="px-2.5 py-1 bg-[#f0ece4] hover:bg-[#eaf2ec] hover:text-[#4a7c59] rounded-lg text-[#2e3230] font-medium border border-[#e6e2da] transition-colors"
                >
                  ⚡ Summarize Section 1
                </button>
                <button
                  onClick={() => handleAskCopilot("Draft Executive Takeaways")}
                  className="px-2.5 py-1 bg-[#f0ece4] hover:bg-[#eaf2ec] hover:text-[#4a7c59] rounded-lg text-[#2e3230] font-medium border border-[#e6e2da] transition-colors"
                >
                  📝 Draft Takeaways
                </button>
                <button
                  onClick={() => handleAskCopilot("Check consistency with Sarah's comment")}
                  className="px-2.5 py-1 bg-[#f0ece4] hover:bg-[#eaf2ec] hover:text-[#4a7c59] rounded-lg text-[#2e3230] font-medium border border-[#e6e2da] transition-colors"
                >
                  💬 Review Sarah&apos;s feedback
                </button>
              </div>

              {/* Thinking Indicator */}
              {isCopilotThinking && (
                <div className="p-3 bg-white rounded-xl border border-[#e6e2da] flex items-center gap-2 text-[#4a7c59] animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  <span className="font-medium">Synthesizing document context...</span>
                </div>
              )}

              {/* Dynamic Copilot Result */}
              {copilotCustomResponse && (
                <div className="p-3 bg-white rounded-xl border border-[#4a7c59]/30 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#4a7c59] font-bold text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      Copilot Suggestion
                    </span>
                    <span className="text-[#6b6358] font-normal">Ready to insert</span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-[#2e3230] italic">
                    {copilotCustomResponse}
                  </p>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        onApplyCopilotSuggestion(copilotCustomResponse);
                        closeAll();
                      }}
                      className="px-2.5 py-1 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-lg font-semibold text-[11px] shadow-2xs"
                    >
                      Insert into Callout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-[#f5f1ea] border-t border-[#e6e2da] flex items-center gap-2">
              <input
                className="flex-1 bg-white border border-[#e6e2da] rounded-xl px-3 py-1.5 text-[12px] text-[#2e3230] focus:outline-none focus:border-[#4a7c59] placeholder-[#6b6358]"
                placeholder="Ask Copilot to rewrite, draft, or cite..."
                type="text"
                value={copilotPrompt}
                onChange={(e) => setCopilotPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskCopilot()}
              />
              <button
                onClick={() => handleAskCopilot()}
                className="w-8 h-8 rounded-xl bg-[#4a7c59] hover:bg-[#3d6749] text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          MODAL 6: SHARE DOCUMENT DIALOG (modal-share-dialog)
          ======================================================== */}
      {activeModal === "modal-share-dialog" && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={closeAll}
        >
          <div
            id="modal-share-dialog"
            className="w-[520px] max-w-[95vw] bg-white border border-[#e6e2da] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#e6e2da] flex items-center justify-between bg-[#fbfaf8]">
              <div>
                <h3 className="font-headline font-bold text-[15px] text-[#2e3230]">
                  Share &ldquo;Q3 Brand Positioning &amp; Launch Strategy&rdquo;
                </h3>
                <div className="text-[11px] text-[#6b6358]">
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
                    <span className="text-[11px] font-semibold text-[#4a7c59] px-2 py-0.5 bg-[#eaf2ec] rounded-lg">
                      Can edit
                    </span>
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
                    <span className="text-[11px] font-semibold text-[#705c30] px-2 py-0.5 bg-[#f0e8db] rounded-lg">
                      Can comment
                    </span>
                  </div>

                  {/* Dynamic invited members */}
                  {invitedMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#f0ece4] animate-in fade-in"
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
              <button
                onClick={closeAll}
                className="px-3.5 py-1.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white text-[12px] font-semibold rounded-xl shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 7: STITCH PROJECT SCREENS GALLERY
          Showcases all 7 screens of Project 1139688462927240715
          ======================================================== */}
      {screensModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setScreensModalOpen(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#e6e2da] overflow-hidden flex flex-col animate-in fade-in select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#e6e2da] flex items-center justify-between bg-[#fbfaf8]">
              <div>
                <h3 className="font-bold text-[16px] text-[#2e3230] flex items-center gap-2">
                  <span>Multiplayer Collaborative Writing Workspace</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#c8e8d0] text-[#2a6038]">
                    7 Screens Synchronized
                  </span>
                </h3>
                <span className="text-[12px] text-[#74796e]">
                  Stitch Project ID: 1139688462927240715 • Click any screen to preview or launch modal
                </span>
              </div>
              <button
                onClick={() => setScreensModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#f0ece4] flex items-center justify-center text-[#74796e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Core Editor Viewports */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#705c30] mb-3">
                  Core Document Viewports (Screens 1 - 4)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Screen 1 */}
                  <div
                    onClick={() => {
                      onSelectPreset(1);
                      setScreensModalOpen(false);
                    }}
                    className={`border rounded-xl p-2.5 cursor-pointer transition-all hover:shadow-md ${
                      activePreset === 1
                        ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20"
                        : "border-[#e6e2da]"
                    }`}
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/screen1_document_editor.png"
                        alt="Screen 1 Preview"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Screen 1
                      </span>
                    </div>
                    <div className="font-bold text-[12px] text-[#2e3230] leading-snug">
                      1. Document Editor
                    </div>
                    <p className="text-[10px] text-[#6b6358] mt-0.5">
                      Home ribbon, real-time caret, comment cards.
                    </p>
                  </div>

                  {/* Screen 2 */}
                  <div
                    onClick={() => {
                      onSelectPreset(2);
                      setScreensModalOpen(false);
                    }}
                    className={`border rounded-xl p-2.5 cursor-pointer transition-all hover:shadow-md ${
                      activePreset === 2
                        ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20"
                        : "border-[#e6e2da]"
                    }`}
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/screen2_layout_tools.png"
                        alt="Screen 2 Preview"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Screen 2
                      </span>
                    </div>
                    <div className="font-bold text-[12px] text-[#2e3230] leading-snug">
                      2. Layout &amp; Tools Tab
                    </div>
                    <p className="text-[10px] text-[#6b6358] mt-0.5">
                      Dual rulers &amp; document outline sidebar.
                    </p>
                  </div>

                  {/* Screen 3 */}
                  <div
                    onClick={() => {
                      onSelectPreset(3);
                      setScreensModalOpen(false);
                    }}
                    className={`border rounded-xl p-2.5 cursor-pointer transition-all hover:shadow-md ${
                      activePreset === 3
                        ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20"
                        : "border-[#e6e2da]"
                    }`}
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/screen3_insert_tab.png"
                        alt="Screen 3 Preview"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Screen 3
                      </span>
                    </div>
                    <div className="font-bold text-[12px] text-[#2e3230] leading-snug">
                      3. Insert Tab Tools
                    </div>
                    <p className="text-[10px] text-[#6b6358] mt-0.5">
                      Milestone table &amp; callout box blocks.
                    </p>
                  </div>

                  {/* Screen 4 */}
                  <div
                    onClick={() => {
                      onSelectPreset(4);
                      setScreensModalOpen(false);
                    }}
                    className={`border rounded-xl p-2.5 cursor-pointer transition-all hover:shadow-md ${
                      activePreset === 4
                        ? "border-[#4a7c59] ring-2 ring-[#4a7c59]/25 bg-[#eaf2ec]/20"
                        : "border-[#e6e2da]"
                    }`}
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/screen4_review_changes.png"
                        alt="Screen 4 Preview"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Screen 4
                      </span>
                    </div>
                    <div className="font-bold text-[12px] text-[#2e3230] leading-snug">
                      4. Review &amp; Changes
                    </div>
                    <p className="text-[10px] text-[#6b6358] mt-0.5">
                      Review ribbon &amp; suggestions diff rail.
                    </p>
                  </div>
                </div>
              </div>

              {/* Newly Pulled Interactive Modals */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4a7c59] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  <span>Newly Integrated Modals (Screens 5 - 7)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Screen 5: Search & Command Palette Modal */}
                  <div
                    onClick={() => {
                      setScreensModalOpen(false);
                      setActiveModal("modal-search-palette");
                    }}
                    className="border border-[#e6e2da] hover:border-[#4a7c59] rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg bg-[#fbfaf8] group"
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/search_palette_modal_4e4e3.png"
                        alt="Search Modal Preview"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-[#4a7c59] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Open Modal ↵
                      </span>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        ID: 4e4e3429
                      </span>
                    </div>
                    <div className="font-bold text-[13px] text-[#2e3230] flex items-center justify-between">
                      <span>5. Search &amp; Command Palette</span>
                      <span className="text-[11px] text-[#4a7c59] font-mono">⌘K</span>
                    </div>
                    <p className="text-[11px] text-[#6b6358] mt-1">
                      Omni-search, category filter tabs (Headings, Comments, Collaborators, Tools), direct shortcuts.
                    </p>
                  </div>

                  {/* Screen 6: File & Asset Upload Modal */}
                  <div
                    onClick={() => {
                      setScreensModalOpen(false);
                      setActiveModal("modal-asset-upload");
                    }}
                    className="border border-[#e6e2da] hover:border-[#4a7c59] rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg bg-[#fbfaf8] group"
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/file_upload_modal_d7825.png"
                        alt="File Upload Modal Preview"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-[#4a7c59] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Open Modal ↵
                      </span>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        ID: d7825cd8
                      </span>
                    </div>
                    <div className="font-bold text-[13px] text-[#2e3230] flex items-center justify-between">
                      <span>6. File &amp; Asset Management</span>
                      <span className="text-[10px] font-bold bg-[#f0e8db] text-[#705c30] px-1.5 py-0.5 rounded">
                        Doc Hub
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b6358] mt-1">
                      Drag &amp; drop zone, Google Docs &amp; Notion cloud imports, recent asset rows, media metrics.
                    </p>
                  </div>

                  {/* Screen 7: User Account & Profile Modal */}
                  <div
                    onClick={() => {
                      setScreensModalOpen(false);
                      setActiveModal("modal-account-popover");
                    }}
                    className="border border-[#e6e2da] hover:border-[#4a7c59] rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg bg-[#fbfaf8] group"
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/account_profile_modal_15440.png"
                        alt="Account Modal Preview"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-[#4a7c59] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Open Modal ↵
                      </span>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        ID: 15440289
                      </span>
                    </div>
                    <div className="font-bold text-[13px] text-[#2e3230] flex items-center justify-between">
                      <span>7. User Account &amp; Profile</span>
                      <span className="text-[10px] font-bold bg-[#c8e8d0] text-[#2a6038] px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b6358] mt-1">
                      Identity header, cloud storage meter, multiplayer cursor toggles, workspace switcher.
                    </p>
                  </div>

                  {/* Screen 8: Terra - Sign Up with Google (Promptmark Auth) */}
                  <div
                    onClick={() => {
                      setScreensModalOpen(false);
                      setActiveModal("modal-auth");
                    }}
                    className="border border-[#e6e2da] hover:border-[#4a7c59] rounded-xl p-3 cursor-pointer transition-all hover:shadow-lg bg-[#fbfaf8] group"
                  >
                    <div className="aspect-video bg-[#ede8e0] rounded-lg overflow-hidden mb-2 relative border border-[#e6e2da]">
                      <img
                        src="/stitch-source/login_signup_google_20ba1.png"
                        alt="Sign Up with Google Preview"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-[#4a7c59] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Open Screen ↵
                      </span>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        ID: 20ba192c
                      </span>
                    </div>
                    <div className="font-bold text-[13px] text-[#2e3230] flex items-center justify-between">
                      <span>8. Sign Up with Google</span>
                      <span className="text-[10px] font-bold bg-[#c8e8d0] text-[#2a6038] px-1.5 py-0.5 rounded">
                        Auth Hub
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b6358] mt-1">
                      Collaborative sanctuary onboarding, Google OAuth one-click, password strength meter, social proof.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
