"use client";

import React, { useState } from "react";
import { ChecklistItem, TableRow, RibbonTab } from "./types";

interface DocumentSheetProps {
  showRulers: boolean;
  activeTab: RibbonTab;
  isPageless: boolean;
  zoomLevel: number;
  showCallout: boolean;
  showTable: boolean;
  trackedChangesState: {
    diff1Accepted: boolean;
    diff1Rejected: boolean;
    checklistDiffAccepted: boolean;
    checklistDiffRejected: boolean;
  };
  checklist: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  tableData: TableRow[];
  onSelectSarahComment: () => void;
  onSelectTrackedDiff: () => void;
  activeSelectionId: string | null;
  insertedAssets?: Array<{ name: string; type: string; url?: string }>;
}

export const DocumentSheet: React.FC<DocumentSheetProps> = ({
  showRulers,
  isPageless,
  zoomLevel,
  showCallout,
  showTable,
  trackedChangesState,
  checklist,
  onToggleChecklist,
  tableData,
  onSelectSarahComment,
  onSelectTrackedDiff,
  activeSelectionId,
  insertedAssets = [],
}) => {
  const [executiveSummaryText, setExecutiveSummaryText] = useState(
    "As category boundaries dissolve across modern productivity suites, our growth vector pivots from single-player utility to synchronous workspace density. Market telemetry underscores a deliberate enterprise migration away from siloed tools toward composable real-time canvases."
  );

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div
      style={{
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: "top center",
        transition: "transform 0.15s ease-out",
      }}
      className="flex flex-col items-center select-text"
    >
      {/* 1. HORIZONTAL TOP RULER (Layout mode or enabled) */}
      {showRulers && !isPageless && (
        <div className="w-[816px] h-4 bg-[#fbfaf8] border border-[#dcd7cc] border-b-0 rounded-t flex items-center px-16 sm:px-20 text-[9px] text-[#8e897e] select-none justify-between overflow-hidden shadow-2xs">
          <div className="flex items-center w-full justify-between opacity-80 font-mono">
            <span>| 1"</span>
            <span>·</span>
            <span>·</span>
            <span>| 2"</span>
            <span>·</span>
            <span>·</span>
            <span>| 3"</span>
            <span>·</span>
            <span>·</span>
            <span>| 4"</span>
            <span>·</span>
            <span>·</span>
            <span>| 5"</span>
            <span>·</span>
            <span>·</span>
            <span>| 6"</span>
            <span>·</span>
            <span>·</span>
            <span>| 7"</span>
            <span>| 8.5"</span>
          </div>
        </div>
      )}

      <div className="relative flex">
        {/* 2. VERTICAL LEFT RULER (Layout mode or enabled) */}
        {showRulers && !isPageless && (
          <div className="w-4 bg-[#fbfaf8] border border-[#dcd7cc] border-r-0 rounded-l flex flex-col items-center py-16 sm:py-20 text-[9px] text-[#8e897e] select-none justify-between overflow-hidden shadow-2xs font-mono">
            <div className="flex flex-col h-full justify-between items-center opacity-80">
              <span>1"</span>
              <span>·</span>
              <span>2"</span>
              <span>·</span>
              <span>3"</span>
              <span>·</span>
              <span>4"</span>
              <span>·</span>
              <span>5"</span>
              <span>·</span>
              <span>6"</span>
              <span>·</span>
              <span>7"</span>
              <span>·</span>
              <span>8"</span>
              <span>·</span>
              <span>9"</span>
              <span>11"</span>
            </div>
          </div>
        )}

        {/* 3. PAGINATED DOCUMENT SHEET */}
        <div
          id="terra-document-sheet"
          className={`bg-white text-[#2e3230] border border-[#dcd7cc] relative transition-all font-body ${
            isPageless
              ? "w-full max-w-[940px] min-h-[900px] p-8 sm:p-14 rounded-2xl shadow-sm"
              : "w-[816px] min-h-[1056px] p-14 sm:p-20 rounded-xl doc-sheet-shadow"
          }`}
        >
          {/* Margin Calibration Corner Indicators (Terra Sage Green) */}
          <div className="absolute top-14 left-14 sm:top-20 sm:left-20 w-3.5 h-3.5 border-t-2 border-l-2 border-[#4a7c59]/50 pointer-events-none"></div>
          <div className="absolute top-14 right-14 sm:top-20 sm:right-20 w-3.5 h-3.5 border-t-2 border-r-2 border-[#4a7c59]/50 pointer-events-none"></div>

          {/* Watermark/Header Area margin guide line */}
          <div className="border-b border-dashed border-[#e4e0d8] pb-2 mb-8 flex justify-between text-[11px] text-[#8e897e] select-none">
            <span className="font-headline tracking-wide">Header: Q3 Strategy Working Draft</span>
            <span className="font-medium text-[#705c30]">Confidential • Internal Only</span>
          </div>

          {/* Document Title */}
          <h1 className="font-headline text-[28px] sm:text-[30px] font-bold text-[#2d4e36] tracking-tight leading-snug mb-3 pb-2 border-b border-[#c8e8d0]">
            Q3 Brand Positioning &amp; Launch Strategy
          </h1>

          {/* Metadata / Authorship */}
          <div className="flex items-center gap-3 text-[12px] text-[#6b6358] mb-8 pb-3 border-b border-[#e4e0d8]">
            <span className="font-bold text-[#2e3230]">Sarah K.</span>
            <span>•</span>
            <span>Product Lead</span>
            <span>•</span>
            <span>Last modified 3 mins ago</span>
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#eaf2ec] text-[#4a7c59] rounded-full text-[11px] font-bold border border-[#4a7c59]/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] animate-pulse"></span>
              3 active collaborators
            </span>
          </div>

          {/* Section 1: Executive Summary */}
          <div id="section-1" className="mb-8 scroll-mt-24">
            <h2 className="font-headline text-[19px] sm:text-[20px] font-bold text-[#2d4e36] mb-3">
              1. Executive Summary &amp; Market Drivers
            </h2>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setExecutiveSummaryText(e.currentTarget.textContent || "")}
              className="text-[14px] text-[#2e3230] leading-relaxed mb-4 text-justify outline-none focus:bg-[#fbfaf8] focus:ring-1 focus:ring-[#4a7c59]/20 rounded p-1"
            >
              {executiveSummaryText}
            </p>

            {/* Multiplayer Active Selection & Caret: Sarah K. (Terra Earthy Sage) */}
            <div className="relative group my-2">
              <p className="text-[14px] text-[#2e3230] leading-relaxed text-justify">
                Our initial user research demonstrates that the threshold for buyer conversion depends on{" "}
                <span
                  onClick={onSelectSarahComment}
                  className={`px-1 py-0.5 rounded relative border-b-2 cursor-pointer transition-colors ${
                    activeSelectionId === "sarah-comment"
                      ? "bg-[#c4e8cc] text-[#1e4a2c] border-[#2d4e36] ring-2 ring-[#4a7c59]/30"
                      : "bg-[#d8f0de] text-[#1e4a2c] border-[#4a7c59] hover:bg-[#c4e8cc]"
                  }`}
                  title="Active multiplayer selection by Sarah K. - Click to view comment"
                >
                  accelerating enterprise time-to-value across our tier-1 accounts
                  {/* Sarah K. Caret tag */}
                  <span className="absolute -top-5 right-0 bg-[#4a7c59] text-white text-[9px] font-bold px-2 py-0.5 rounded-t-md flex items-center gap-1 shadow-2xs pointer-events-none select-none">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                    Sarah K.
                  </span>
                </span>{" "}
                while simultaneously lowering setup friction. Retention doubles whenever teams launch their first collaborative session within forty-eight hours of onboarding.
              </p>
            </div>
          </div>

          {/* Track Changes Revision Markup Block */}
          <div
            onClick={onSelectTrackedDiff}
            className={`mb-8 p-3.5 border-l-4 rounded-r-xl border transition-all cursor-pointer ${
              activeSelectionId === "tracked-diff"
                ? "bg-[#eaf2ec]/80 border-[#4a7c59] ring-2 ring-[#4a7c59]/20"
                : "bg-[#fbfaf8] border-l-[#4a7c59] border-y-[#e6e2da] border-r-[#e6e2da] hover:bg-[#f5f1ea]"
            }`}
            title="Track Changes Revision - Click to view resolution controls in Review pane"
          >
            <div className="flex items-center justify-between mb-1.5 text-[11px] text-[#6b6358]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#4a7c59]">Track Changes:</span>
                <span>Suggested revision by Sarah K. (8m ago)</span>
              </div>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/20">
                {trackedChangesState.diff1Accepted
                  ? "Accepted"
                  : trackedChangesState.diff1Rejected
                  ? "Rejected"
                  : "Pending Review"}
              </span>
            </div>

            <p className="text-[14px] leading-relaxed text-[#2e3230]">
              Instead of relying strictly on{" "}
              {!trackedChangesState.diff1Accepted && (
                <span
                  className="line-through text-[#b83230] bg-[#ffdad8]/60 px-1 py-0.5 rounded font-medium"
                  title="Deleted by Sarah K."
                >
                  our legacy direct outbound playbook
                </span>
              )}
              {trackedChangesState.diff1Accepted && (
                <span className="text-[#8e897e] line-through text-[12px] opacity-40 mr-1 select-none">
                  (outbound playbook deleted)
                </span>
              )}
              , we will anchor quarterly acquisition in{" "}
              {!trackedChangesState.diff1Rejected && (
                <span
                  className="underline text-[#4a7c59] bg-[#eaf2ec] font-semibold px-1 py-0.5 rounded decoration-2"
                  title="Inserted by Sarah K."
                >
                  a customer-led community flywheel
                </span>
              )}
              {trackedChangesState.diff1Rejected && (
                <span className="text-[#b83230] text-[12px] italic opacity-60 ml-1">
                  (community flywheel rejected)
                </span>
              )}{" "}
              supported by verified collaborative project templates.
            </p>
          </div>

          {/* INSERT TAB ITEM 1: Strategic Alignment Callout Box */}
          {showCallout && (
            <div
              id="callout-block"
              className="mb-8 p-4 bg-[#eaf2ec]/70 border-l-4 border-[#4a7c59] rounded-r-xl border border-[#4a7c59]/20 shadow-2xs animate-fadeIn scroll-mt-24"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[#4a7c59] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[17px] text-[#4a7c59]">
                    lightbulb
                  </span>
                  <span>Strategic Alignment Note</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#4a7c59] border border-[#4a7c59]/25 shadow-2xs">
                  Recently Inserted
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#2e3230]">
                All executive summaries must align with the revised Q3 multiplayer conversion funnel before progressing to legal review and external go-to-market execution.
              </p>
            </div>
          )}

          {/* INSERT TAB ITEM 2: Deliverables & Milestones Table 3x3 */}
          {showTable && (
            <div id="table-block" className="mb-8 animate-fadeIn scroll-mt-24">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14.5px] font-headline font-bold text-[#2e3230] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">
                    table_chart
                  </span>
                  Deliverables &amp; Target Milestones
                </h3>
                <span className="text-[11px] font-semibold text-[#6b6358] bg-[#f0ece4] px-2 py-0.5 rounded-md border border-[#e6e2da]">
                  Table (3 × 3)
                </span>
              </div>
              <div className="overflow-x-auto border border-[#e6e2da] rounded-xl shadow-2xs bg-white">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead className="bg-[#f5f1ea] border-b border-[#e6e2da] text-[#6b6358]">
                    <tr>
                      <th className="p-2.5 font-bold text-[#2e3230] border-r border-[#e6e2da]">
                        Phase / Milestone
                      </th>
                      <th className="p-2.5 font-bold text-[#2e3230] border-r border-[#e6e2da]">
                        Owner
                      </th>
                      <th className="p-2.5 font-bold text-[#2e3230]">
                        Status &amp; Target Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6e2da] text-[#2e3230]">
                    {tableData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#f0ece4]/40 transition-colors ${
                          idx % 2 === 1 ? "bg-[#fbfaf8]" : ""
                        }`}
                      >
                        <td
                          contentEditable
                          suppressContentEditableWarning
                          className="p-2.5 font-semibold border-r border-[#e6e2da] outline-none focus:bg-white"
                        >
                          {row.milestone}
                        </td>
                        <td
                          contentEditable
                          suppressContentEditableWarning
                          className="p-2.5 text-[#6b6358] border-r border-[#e6e2da] outline-none focus:bg-white"
                        >
                          {row.owner}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              row.statusType === "complete"
                                ? "bg-[#d8f0de] text-[#4a7c59]"
                                : row.statusType === "reviewing"
                                ? "bg-[#f0e8db] text-[#705c30]"
                                : "bg-[#f0ece4] text-[#6b6358]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                row.statusType === "complete"
                                  ? "bg-[#4a7c59]"
                                  : row.statusType === "reviewing"
                                  ? "bg-[#705c30]"
                                  : "bg-[#74796e]"
                              }`}
                            ></span>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INSERTED VISUAL ASSETS (From File & Asset Upload Modal) */}
          {insertedAssets && insertedAssets.length > 0 && (
            <div className="mb-8 space-y-4 animate-in fade-in duration-200">
              {insertedAssets.map((asset, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#f5f1ea] rounded-xl border border-[#e6e2da] shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#4a7c59]">
                        {asset.type === "png" ? "image" : asset.type === "pdf" ? "picture_as_pdf" : "attachment"}
                      </span>
                      <span className="font-semibold text-xs text-[#2e3230]">{asset.name}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eaf2ec] text-[#4a7c59] border border-[#4a7c59]/20">
                      Inserted Asset
                    </span>
                  </div>
                  {asset.url && (
                    <div className="rounded-lg overflow-hidden border border-[#e6e2da] max-h-72 bg-white flex items-center justify-center">
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[#6b6358] mt-2 italic">
                    Referenced in Q3 Strategic Launch Asset Library • Terra Cloud Storage Verified
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Section 2: Deliverables Checklist & Alex M. Caret */}
          <div id="section-2" className="mb-8 scroll-mt-24">
            <h2 className="font-headline text-[19px] sm:text-[20px] font-bold text-[#2d4e36] mb-3 flex items-center justify-between">
              <span>2. Q3 Readiness Deliverables</span>
              <span className="text-[12px] font-normal text-[#6b6358] font-body bg-[#f0ece4] px-2.5 py-0.5 rounded-full border border-[#e6e2da]">
                {completedCount} of {checklist.length} items completed
              </span>
            </h2>

            <div className="space-y-2.5 text-[13px]">
              {checklist.map((item) => (
                <div key={item.id} className="relative">
                  <label
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                      item.isAlexFocus
                        ? "bg-[#f0e8db]/60 border-l-3 border-[#c4a66a] shadow-2xs"
                        : "hover:bg-[#f5f1ea]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => onToggleChecklist(item.id)}
                      className="mt-0.5 w-4 h-4 text-[#4a7c59] rounded border-[#c4c8bc] focus:ring-0 accent-[#4a7c59]"
                    />
                    <span
                      className={`leading-normal ${
                        item.completed ? "line-through text-[#6b6358]" : "text-[#2e3230] font-medium"
                      }`}
                    >
                      {item.text}{" "}
                      {item.subtext && (
                        <span className="text-[11px] text-[#74796e] font-normal">
                          {item.subtext}
                        </span>
                      )}
                    </span>
                  </label>

                  {/* Caret tag for Alex M. at item 3 */}
                  {item.isAlexFocus && (
                    <div className="absolute -top-3.5 right-4 bg-[#705c30] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 pointer-events-none select-none">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                      Alex M.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer / Page Number indicator */}
          <div className="mt-16 pt-4 border-t border-dashed border-[#e4e0d8] flex justify-between text-[11px] text-[#6b6358] select-none">
            <span>Q3 Brand Positioning &amp; Launch Strategy.docx</span>
            <span className="font-semibold">Page 1 of 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
