"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChecklistItem, TableRow, RibbonTab } from "./types";
import { CanvasRenderer } from "../engine/render/CanvasRenderer";
import { FontManager } from "../engine/layout/FontManager";
import { TypesettingEngine } from "../engine/layout/TypesettingEngine";
import { HitTester, CaretPosition } from "../engine/input/HitTester";
import { CommandDispatcher } from "../engine/input/CommandDispatcher";
import { DocxParser } from "../engine/parser/DocxParser";
import { SyncProvider } from "../engine/state/SyncProvider";
import { DocumentAst } from "../engine/ast/schema";
import { RenderTree } from "../engine/layout/layout-types";

interface DocumentSheetProps {
  showRulers: boolean;
  activeTab: RibbonTab;
  isPageless: boolean;
  zoomLevel: number;
  showCallout: boolean;
  showTable: boolean;
  trackedChangesState: any;
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
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const engineRef = useRef<TypesettingEngine | null>(null);
  const renderTreeRef = useRef<RenderTree | null>(null);
  const hitTesterRef = useRef<HitTester | null>(null);

  // Phase 4 State & Dispatcher
  const astRef = useRef<DocumentAst | null>(null);
  const dispatcherRef = useRef<CommandDispatcher | null>(null);
  const syncProviderRef = useRef<SyncProvider | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [activeCaret, setActiveCaret] = useState<CaretPosition | null>(null);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || initializedRef.current) return;
    initializedRef.current = true;

    rendererRef.current = new CanvasRenderer(canvasRef.current);

    let isMounted = true;

    // Async Engine Initialization
    const initEngine = async () => {
      try {
        const fontManager = FontManager.getInstance();
        await fontManager.loadBaselineFonts();

        // Prevent race conditions: if React unmounted us while we were awaiting fonts, abort!
        if (!isMounted) return;

        engineRef.current = new TypesettingEngine(fontManager);
        hitTesterRef.current = new HitTester(fontManager);

        // Phase 2 Sample Document AST
        const sampleAst: DocumentAst = {
          document: {
            sections: [
              {
                id: 's-1', type: 'section',
                pageSetup: { width: 816, height: 1056, margins: { top: 96, bottom: 96, left: 96, right: 96, header: 36, footer: 36 } },
                paragraphs: [
                  {
                    id: 'p-1', type: 'paragraph',
                    paragraphProperties: { align: 'left', spacing: { before: 0, after: 16, line: 1.15 }, indent: { left: 0, right: 0, firstLine: 0 } },
                    runs: [
                      { id: 'r-1', type: 'run', text: 'Typesetting Engine Active', runProperties: { fontFamily: 'Arial', fontSize: 24, bold: true, italic: false, underline: false, color: '#2d4e36' } }
                    ]
                  },
                  {
                    id: 'p-2', type: 'paragraph',
                    paragraphProperties: { align: 'left', spacing: { before: 0, after: 12, line: 1.15 }, indent: { left: 0, right: 0, firstLine: 0 } },
                    runs: [
                      { id: 'r-2', type: 'run', text: 'This text is mathematically positioned by calculating exact bounding boxes using opentype.js instead of relying on DOM reflow. The engine performs word wrapping based on the page setup margins.', runProperties: { fontFamily: 'Arial', fontSize: 12, bold: false, italic: false, underline: false, color: '#2e3230' } }
                    ]
                  },
                  {
                    id: 'p-3', type: 'paragraph',
                    paragraphProperties: { align: 'left', spacing: { before: 0, after: 12, line: 1.15 }, indent: { left: 0, right: 0, firstLine: 0 } },
                    runs: [
                      { id: 'r-3', type: 'run', text: 'Notice how this very long paragraph wraps accurately. '.repeat(40), runProperties: { fontFamily: 'Times New Roman', fontSize: 12, bold: false, italic: false, underline: false, color: '#6b6358' } }
                    ]
                  }
                ]
              }
            ]
          }
        };

        // Initialize Multiplayer Sync & Offline Storage
        syncProviderRef.current = new SyncProvider();
        const initialAst = syncProviderRef.current.getAst(sampleAst);
        astRef.current = initialAst;

        const renderTree = engineRef.current.layout(initialAst);
        renderTreeRef.current = renderTree;
        rendererRef.current?.setRenderTree(renderTree);

        // Initialize Command Dispatcher
        dispatcherRef.current = new CommandDispatcher(initialAst, engineRef.current, rendererRef.current!, hitTesterRef.current, syncProviderRef.current);
        dispatcherRef.current.onCaretMoved = (caret) => {
          setActiveCaret(caret);
          renderTreeRef.current = engineRef.current!.layout(astRef.current!);

          // Broadcast our cursor to peers
          if (syncProviderRef.current && canvasRef.current) {
            syncProviderRef.current.broadcastCursor("user-1", caret.x, caret.y, caret.height);
          }
        };

        // Listen for Remote Multiplayer Edits or IndexedDB offline loads
        syncProviderRef.current.onRemoteUpdate = () => {
          if (!engineRef.current || !rendererRef.current || !syncProviderRef.current) return;
          const freshAst = syncProviderRef.current.getAst(sampleAst);
          astRef.current = freshAst;
          dispatcherRef.current?.setAst(freshAst);

          const newRenderTree = engineRef.current.layout(freshAst);
          renderTreeRef.current = newRenderTree;
          rendererRef.current.setRenderTree(newRenderTree);
        };

      } catch (err) {
        console.error("Engine failed to initialize", err);
      }
    };

    initEngine();

    return () => {
      isMounted = false;
      initializedRef.current = false;
      rendererRef.current?.destroy();
      syncProviderRef.current?.destroy();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || !hitTesterRef.current || !renderTreeRef.current || !canvasRef.current) return;

    // Native offset gives the logical coordinate inside the scaled container!
    const logicalX = e.nativeEvent.offsetX;
    const logicalY = e.nativeEvent.offsetY;
    const logicalWidth = canvasRef.current.width / (window.devicePixelRatio || 1);

    const pos = hitTesterRef.current.hitTest(logicalX, logicalY, renderTreeRef.current, logicalWidth);
    if (pos) {
      rendererRef.current.setCaretPosition(pos);
      setActiveCaret(pos);

      // Focus hidden textarea for mobile keyboard / typing capture
      setTimeout(() => textAreaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!dispatcherRef.current || !activeCaret || !canvasRef.current) return;
    const logicalWidth = canvasRef.current.width / (window.devicePixelRatio || 1);

    if (e.key === 'Backspace') {
      const newCaret = dispatcherRef.current.handleBackspace(activeCaret, logicalWidth);
      if (newCaret) setActiveCaret(newCaret);
      e.preventDefault();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Normal character typing
      const newCaret = dispatcherRef.current.handleInput(e.key, activeCaret, logicalWidth);
      if (newCaret) setActiveCaret(newCaret);
      e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.docx')) {
      try {
        const buffer = await file.arrayBuffer();
        const parser = new DocxParser();
        const newAst = await parser.parse(buffer);

        astRef.current = newAst;
        if (dispatcherRef.current) {
          dispatcherRef.current.setAst(newAst);
        }

        if (engineRef.current && rendererRef.current) {
          const renderTree = engineRef.current.layout(newAst);
          renderTreeRef.current = renderTree;
          rendererRef.current.setRenderTree(renderTree);
        }
      } catch (err) {
        console.error("Failed to parse docx", err);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: "top center",
        transition: "transform 0.15s ease-out",
      }}
      className="flex flex-col items-center select-text"
    >
      {/* TOP RULER ROW */}
      {showRulers && !isPageless && (
        <div className="w-[816px] h-4 bg-[#fbfaf8] border border-[#dcd7cc] border-b-0 rounded-t flex items-center px-16 sm:px-20 text-[9px] text-[#8e897e] select-none justify-between overflow-hidden shadow-2xs">
          <div className="flex items-center w-full justify-between opacity-80 font-mono">
            <span>| 1"</span><span>·</span><span>·</span><span>| 2"</span><span>·</span><span>·</span>
            <span>| 3"</span><span>·</span><span>·</span><span>| 4"</span><span>·</span><span>·</span>
            <span>| 5"</span><span>·</span><span>·</span><span>| 6"</span><span>·</span><span>·</span>
            <span>| 7"</span><span>| 8.5"</span>
          </div>
        </div>
      )}

      <div className="relative flex w-full justify-center">
        {/* 2. VERTICAL LEFT RULER */}
        {showRulers && !isPageless && (
          <div className="w-4 bg-[#fbfaf8] border border-[#dcd7cc] border-r-0 rounded-l flex flex-col items-center py-16 sm:py-20 text-[9px] text-[#8e897e] select-none justify-between overflow-hidden shadow-2xs font-mono">
            <div className="flex flex-col h-full justify-between items-center opacity-80">
              <span>1"</span><span>·</span><span>2"</span><span>·</span><span>3"</span><span>·</span>
              <span>4"</span><span>·</span><span>5"</span><span>·</span><span>6"</span><span>·</span>
              <span>7"</span><span>·</span><span>8"</span><span>·</span><span>9"</span><span>11"</span>
            </div>
          </div>
        )}

        {/* 3. THE CANVAS ENGINE (Replaces DOM Document) */}
        <div
          className={`relative transition-all font-body ${isPageless
            ? "w-full max-w-[940px] min-h-[900px] shadow-sm"
            : "w-[816px] h-[1056px] doc-sheet-shadow" // Fixed height for page 1 in this phase
            }`}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            className="w-full h-full block rounded-xl cursor-text touch-none"
            style={{ width: '100%', height: '100%' }}
          />

          {/* HIDDEN TEXTAREA FOR KEYBOARD/IME CAPTURE */}
          <textarea
            ref={textAreaRef}
            onKeyDown={handleKeyDown}
            style={{
              position: 'absolute',
              left: activeCaret ? activeCaret.x : -9999,
              top: activeCaret ? activeCaret.y : -9999,
              width: '1px',
              height: activeCaret ? activeCaret.height : '16px',
              opacity: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
