"use client";

import React, { useState, useEffect } from "react";
import { TopAppBar } from "@/components/TopAppBar";
import { WordRibbon } from "@/components/WordRibbon";
import { DocumentSheet } from "@/components/DocumentSheet";
import { LeftOutlineSidebar } from "@/components/LeftOutlineSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { StatusBar } from "@/components/StatusBar";
import { Modals, TerraActiveModal } from "@/components/Modals";
import { RibbonTab, ScreenPreset, Collaborator, CommentItem, ChecklistItem, TableRow } from "@/components/types";

export default function DocumentEditorPage() {
  // Preset and Tab state
  const [activePreset, setActivePreset] = useState<ScreenPreset>(1);
  const [activeTab, setActiveTab] = useState<RibbonTab>("home");

  // Document metadata
  const [title, setTitle] = useState("Q3 Brand Positioning & Launch Strategy");
  const [isStarred, setIsStarred] = useState(false);

  // Layout & View toggles
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [isPageless, setIsPageless] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [reviewPaneOpen, setReviewPaneOpen] = useState(false);

  // Content blocks state
  const [showCallout, setShowCallout] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Track Changes state
  const [trackChangesOn, setTrackChangesOn] = useState(true);
  const [trackedChangesState, setTrackedChangesState] = useState({
    diff1Accepted: false,
    diff1Rejected: false,
    checklistDiffAccepted: false,
    checklistDiffRejected: false,
  });

  // Selected item / highlight focus
  const [activeSelectionId, setActiveSelectionId] = useState<string | null>("sarah-comment");

  // Collaborators
  const collaborators: Collaborator[] = [
    {
      id: "sk",
      name: "Sarah K.",
      initials: "SK",
      avatarColor: "#4a7c59",
      caretColor: "#4a7c59",
      selectionBg: "#d8f0de",
      selectionText: "#1e4a2c",
      status: "Editing paragraph 2",
      currentSection: "1. Executive Summary",
    },
    {
      id: "am",
      name: "Alex M.",
      initials: "AM",
      avatarColor: "#c4a66a",
      caretColor: "#705c30",
      selectionBg: "#f0e8db",
      selectionText: "#4a4538",
      status: "Reviewing tasks",
      currentSection: "2. Q3 Deliverables",
    },
    {
      id: "dc",
      name: "David C.",
      initials: "DC",
      avatarColor: "#6b6358",
      caretColor: "#6b6358",
      selectionBg: "#f0ece4",
      selectionText: "#2e3230",
      status: "Viewing document",
      currentSection: "Document Head",
    },
  ];

  // Comments
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "comment-1",
      author: "Sarah K.",
      initials: "SK",
      avatarColor: "#4a7c59",
      timeAgo: "12m ago",
      quotedText: "“...accelerating enterprise time-to-value...”",
      text: "Should we include APAC-specific deployment benchmarks here before Thursday’s review?",
      replies: [],
      resolved: false,
    },
  ]);

  // Checklist items
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "task-1",
      text: "Publish revised Developer API specifications for Live Sync v2",
      subtext: "(Approved by Infra Leads)",
      completed: true,
    },
    {
      id: "task-2",
      text: "Finalize interactive pricing calculator for tiered multiplayer seats",
      completed: true,
    },
    {
      id: "task-3",
      text: "Customer advisory board early review & live feedback clinic",
      completed: false,
      isAlexFocus: true,
    },
    {
      id: "task-4",
      text: "Deploy telemetry dashboards for team invite velocity tracking",
      completed: false,
    },
    {
      id: "task-5",
      text: "Execute legal sign-off on enterprise SLA and data residency guarantees",
      completed: true,
    },
  ]);

  // Milestone Table Data
  const [tableData, setTableData] = useState<TableRow[]>([
    {
      milestone: "Live Sync v2 Protocol Spec",
      owner: "Infra Core Team",
      status: "Complete (Jul 18)",
      statusType: "complete",
    },
    {
      milestone: "Interactive Pricing Calculator",
      owner: "Alex M. & Finance",
      status: "Reviewing (Aug 04)",
      statusType: "reviewing",
    },
    {
      milestone: "Enterprise Customer Feedback Clinic",
      owner: "Sarah K.",
      status: "Scheduled (Aug 12)",
      statusType: "scheduled",
    },
  ]);

  // Modals state: follows Stitch prototype IDs
  const [activeModal, setActiveModal] = useState<TerraActiveModal>(null);
  const [screensModalOpen, setScreensModalOpen] = useState(false);

  // Switch preset configuration
  const handleSelectPreset = (preset: ScreenPreset) => {
    setActivePreset(preset);
    if (preset === 1) {
      setActiveTab("home");
      setOutlineOpen(false);
      setShowRulers(false);
      setShowCallout(false);
      setShowTable(false);
      setReviewPaneOpen(false);
      setRightPanelOpen(true);
      setActiveSelectionId("sarah-comment");
    } else if (preset === 2) {
      setActiveTab("layout");
      setOutlineOpen(true);
      setShowRulers(true);
      setShowCallout(false);
      setShowTable(false);
      setReviewPaneOpen(false);
      setRightPanelOpen(true);
      setActiveSelectionId(null);
    } else if (preset === 3) {
      setActiveTab("insert");
      setOutlineOpen(false);
      setShowRulers(false);
      setShowCallout(true);
      setShowTable(true);
      setReviewPaneOpen(false);
      setRightPanelOpen(true);
      setActiveSelectionId(null);
    } else if (preset === 4) {
      setActiveTab("review");
      setOutlineOpen(false);
      setShowRulers(false);
      setShowCallout(false);
      setShowTable(false);
      setReviewPaneOpen(true);
      setRightPanelOpen(true);
      setActiveSelectionId("tracked-diff");
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveModal((prev) => (prev === "modal-search-palette" ? null : "modal-search-palette"));
      } else if (e.key === "Escape") {
        setActiveModal(null);
        setScreensModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Comments handlers
  const handleAddReply = (commentId: string, replyText: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `reply-${Date.now()}`,
                  author: "Soumya (You)",
                  text: replyText,
                  timeAgo: "Just now",
                },
              ],
            }
          : c
      )
    );
  };

  const handleResolveComment = (commentId: string) => {
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c)));
  };

  // Checklist toggle
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // Track changes accept / reject
  const handleAcceptDiff = (diffId: string) => {
    if (diffId === "diff-1") {
      setTrackedChangesState((prev) => ({ ...prev, diff1Accepted: true, diff1Rejected: false }));
    } else if (diffId === "diff-checklist") {
      setTrackedChangesState((prev) => ({
        ...prev,
        checklistDiffAccepted: true,
        checklistDiffRejected: false,
      }));
    }
  };

  const handleRejectDiff = (diffId: string) => {
    if (diffId === "diff-1") {
      setTrackedChangesState((prev) => ({ ...prev, diff1Rejected: true, diff1Accepted: false }));
    } else if (diffId === "diff-checklist") {
      setTrackedChangesState((prev) => ({
        ...prev,
        checklistDiffRejected: true,
        checklistDiffAccepted: false,
      }));
    }
  };

  const handleAcceptAll = () => {
    setTrackedChangesState({
      diff1Accepted: true,
      diff1Rejected: false,
      checklistDiffAccepted: true,
      checklistDiffRejected: false,
    });
  };

  const handleRejectAll = () => {
    setTrackedChangesState({
      diff1Accepted: false,
      diff1Rejected: true,
      checklistDiffAccepted: false,
      checklistDiffRejected: true,
    });
  };

  // Export handler
  const handleExport = (format: string) => {
    if (format === "pdf") {
      window.print();
    } else if (format === "md" || format === "docx") {
      const content = `# ${title}\n\nSarah K. • Product Lead\n\n## 1. Executive Summary & Market Drivers\nAs category boundaries dissolve across modern productivity suites, our growth vector pivots from single-player utility to synchronous workspace density.\n\n## 2. Q3 Readiness Deliverables\n- Publish revised Developer API specifications for Live Sync v2\n- Finalize interactive pricing calculator\n- Customer advisory board clinic`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.${format === "docx" ? "docx" : "md"}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Insert Callout & Table
  const handleInsertCallout = () => {
    setShowCallout(true);
    setTimeout(() => {
      document.getElementById("callout-block")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInsertTable = (rows: number, cols: number) => {
    setShowTable(true);
    setTimeout(() => {
      document.getElementById("table-block")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleApplyCopilotSuggestion = (text: string) => {
    setShowCallout(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f4f1ea] text-[#2e3230] font-body select-none text-[13px]">
      {/* 1. TOP APP BAR */}
      <TopAppBar
        title={title}
        setTitle={setTitle}
        collaborators={collaborators}
        isStarred={isStarred}
        setIsStarred={setIsStarred}
        onOpenFileMenu={() => setActiveModal(activeModal === "modal-doc-file" ? null : "modal-doc-file")}
        onOpenSearch={() => setActiveModal(activeModal === "modal-search-palette" ? null : "modal-search-palette")}
        onOpenShare={() => setActiveModal(activeModal === "modal-share-dialog" ? null : "modal-share-dialog")}
        onOpenCopilot={() => setActiveModal(activeModal === "modal-copilot-drawer" ? null : "modal-copilot-drawer")}
        onOpenAccount={() => setActiveModal(activeModal === "modal-account-popover" ? null : "modal-account-popover")}
        onOpenScreensModal={() => setScreensModalOpen(true)}
        commentsCount={comments.filter((c) => !c.resolved).length + (trackedChangesState.diff1Accepted ? 0 : 2)}
        rightPanelOpen={rightPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
      />

      {/* 2. FULL WORD RIBBON */}
      <WordRibbon
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "layout") {
            setOutlineOpen(true);
            setShowRulers(true);
          } else if (tab === "review") {
            setReviewPaneOpen(true);
            setRightPanelOpen(true);
          }
        }}
        trackChangesOn={trackChangesOn}
        setTrackChangesOn={setTrackChangesOn}
        outlineOpen={outlineOpen}
        setOutlineOpen={setOutlineOpen}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        onOpenShortcuts={() => setActiveModal("modal-search-palette")}
        onOpenCopilot={() => setActiveModal(activeModal === "modal-copilot-drawer" ? null : "modal-copilot-drawer")}
        onOpenComment={() => {
          setRightPanelOpen(true);
          setActiveSelectionId("sarah-comment");
        }}
        onInsertCallout={handleInsertCallout}
        onInsertTable={handleInsertTable}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
        onExport={handleExport}
        onOpenWordStats={() => setActiveModal("modal-doc-file")}
        reviewPaneOpen={reviewPaneOpen}
        setReviewPaneOpen={setReviewPaneOpen}
      />

      {/* 3. MAIN WORKSPACE CANVAS */}
      <main className="flex-1 overflow-y-auto overflow-x-auto bg-[#ede8e0] py-8 px-4 flex justify-center items-start">
        <div className="flex gap-6 max-w-full items-start justify-center">
          {/* Collapsible Left Outline & Stats Sidebar (Layout & Tools mode) */}
          <LeftOutlineSidebar
            isOpen={outlineOpen}
            onClose={() => setOutlineOpen(false)}
            showCallout={showCallout}
            showTable={showTable}
            onOpenStatsModal={() => setActiveModal("modal-doc-file")}
          />

          {/* Paginated Document Canvas */}
          <DocumentSheet
            showRulers={showRulers}
            activeTab={activeTab}
            isPageless={isPageless}
            zoomLevel={zoomLevel}
            showCallout={showCallout}
            showTable={showTable}
            trackedChangesState={trackedChangesState}
            checklist={checklist}
            onToggleChecklist={handleToggleChecklist}
            tableData={tableData}
            onSelectSarahComment={() => {
              setRightPanelOpen(true);
              setActiveSelectionId("sarah-comment");
            }}
            onSelectTrackedDiff={() => {
              setRightPanelOpen(true);
              setReviewPaneOpen(true);
              setActiveSelectionId("tracked-diff");
            }}
            activeSelectionId={activeSelectionId}
          />

          {/* Right Margin Rail: Comment card or Full Review & Suggestions Pane */}
          <RightSidebar
            isOpen={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            activeTab={activeTab}
            reviewPaneOpen={reviewPaneOpen}
            comments={comments}
            onAddReply={handleAddReply}
            onResolveComment={handleResolveComment}
            trackedChangesState={trackedChangesState}
            onAcceptDiff={handleAcceptDiff}
            onRejectDiff={handleRejectDiff}
            activeSelectionId={activeSelectionId}
          />
        </div>
      </main>

      {/* 4. BOTTOM STATUS BAR */}
      <StatusBar
        isPageless={isPageless}
        setIsPageless={setIsPageless}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        wordCount={1420}
        readingTimeMinutes={5}
        onOpenWordStats={() => setActiveModal("modal-doc-file")}
      />

      {/* 5. MODALS & POPUPS (Stitch Prototype: node-id=f87b97b1b3b046dbb6046d06e8967813) */}
      <Modals
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        onApplyCopilotSuggestion={handleApplyCopilotSuggestion}
        onToggleTrackChanges={() => setTrackChangesOn(!trackChangesOn)}
        onExportPdf={() => handleExport("pdf")}
        screensModalOpen={screensModalOpen}
        setScreensModalOpen={setScreensModalOpen}
        onSelectPreset={handleSelectPreset}
        activePreset={activePreset}
      />
    </div>
  );
}
