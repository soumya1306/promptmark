import { RenderTree, LineBox, RenderRun } from '../layout/layout-types';
import { FontManager } from '../layout/FontManager';

export interface CaretPosition {
  pageIndex: number;
  lineIndex: number;
  runIndex: number;
  charIndex: number;
  // Absolute canvas coordinates where the renderer should paint the blinking cursor
  x: number;
  y: number;
  height: number;
  // Structural mapping
  astParagraphId: string;
  astRunId: string;
}

/**
 * Resolves screen coordinates to document Abstract Syntax Tree positions.
 */
export class HitTester {
  private fontManager: FontManager;

  constructor(fontManager: FontManager) {
    this.fontManager = fontManager;
  }

  /**
   * Translates an (X, Y) logical canvas coordinate into a structural CaretPosition.
   */
  public hitTest(x: number, y: number, renderTree: RenderTree, canvasLogicalWidth: number): CaretPosition | null {
    const gapBetweenPages = 40;
    let currentYOffset = 40;

    // 1. Spatial Search: Find which page was clicked
    for (let pIdx = 0; pIdx < renderTree.pages.length; pIdx++) {
      const page = renderTree.pages[pIdx];
      const pageX = Math.max((canvasLogicalWidth - page.width) / 2, 20);
      const pageY = currentYOffset;

      if (y >= pageY && y <= pageY + page.height) {

        // 2. Spatial Search: Find which line was clicked
        for (let lIdx = 0; lIdx < page.lines.length; lIdx++) {
          const line = page.lines[lIdx];
          const lineAbsoluteY = pageY + line.y;

          if (y >= lineAbsoluteY && y <= lineAbsoluteY + line.height) {

            // 3. Spatial Search: Find which run was clicked
            for (let rIdx = 0; rIdx < line.runs.length; rIdx++) {
              const run = line.runs[rIdx];
              const runAbsoluteX = pageX + run.x;

              // If click is to the left of the line, snap to index 0
              if (x < runAbsoluteX && rIdx === 0) {
                return {
                  pageIndex: pIdx, lineIndex: lIdx, runIndex: rIdx, charIndex: 0,
                  x: runAbsoluteX, y: lineAbsoluteY, height: line.height,
                  astParagraphId: run.astParagraphId, astRunId: run.astRunId
                };
              }

              // If click is within the run bounds horizontally, or we overflowed past the last run (snap to end)
              if ((x >= runAbsoluteX && x <= runAbsoluteX + run.width) || rIdx === line.runs.length - 1) {
                return this.findCharIndex(x, runAbsoluteX, lineAbsoluteY, line, run, pIdx, lIdx, rIdx);
              }
            }
          }
        }

        // If clicked on page whitespace below the text, snap to the absolute end of the document text
        if (page.lines.length > 0) {
          const lastLineIdx = page.lines.length - 1;
          const lastLine = page.lines[lastLineIdx];
          if (lastLine.runs.length > 0) {
            const lastRunIdx = lastLine.runs.length - 1;
            const lastRun = lastLine.runs[lastRunIdx];
            return {
              pageIndex: pIdx, lineIndex: lastLineIdx, runIndex: lastRunIdx,
              charIndex: lastRun.text.length,
              x: pageX + lastRun.x + lastRun.width,
              y: pageY + lastLine.y,
              height: lastLine.height,
              astParagraphId: lastRun.astParagraphId,
              astRunId: lastRun.astRunId
            };
          }
        }
      }

      currentYOffset += page.height + gapBetweenPages;
    }

    return null;
  }

  /**
   * Performs sub-pixel font measurement to determine exactly which character the mouse is hovering over.
   */
  private findCharIndex(
    mouseX: number,
    runAbsoluteX: number,
    lineAbsoluteY: number,
    line: LineBox,
    run: RenderRun,
    pIdx: number,
    lIdx: number,
    rIdx: number
  ): CaretPosition {
    const fontName = run.properties.bold ? 'Arial-Bold' : 'Arial';
    const font = this.fontManager.getFont(fontName);

    let currentX = runAbsoluteX;

    for (let i = 0; i < run.text.length; i++) {
      const char = run.text[i];
      // Accurate geometric width of this single character
      const charWidth = font.getAdvanceWidth(char, run.properties.fontSize);

      // If mouse is in the left half of the character, snap before it.
      if (mouseX <= currentX + (charWidth / 2)) {
        return {
          pageIndex: pIdx, lineIndex: lIdx, runIndex: rIdx, charIndex: i,
          x: currentX, y: lineAbsoluteY, height: line.height,
          astParagraphId: run.astParagraphId, astRunId: run.astRunId
        };
      }
      currentX += charWidth;
    }

    // Mouse was past the middle of the last character, snap to the very end of the run
    return {
      pageIndex: pIdx, lineIndex: lIdx, runIndex: rIdx, charIndex: run.text.length,
      x: currentX, y: lineAbsoluteY, height: line.height,
      astParagraphId: run.astParagraphId, astRunId: run.astRunId
    };
  }

  /**
   * Reverse lookup: Translates an AST structural position back into a visual CaretPosition.
   * Called after the TypesettingEngine finishes re-layouting due to a typing mutation.
   */
  public recalculateCaret(tree: RenderTree, canvasLogicalWidth: number, targetParagraphId: string, targetRunId: string, targetCharIndex: number): CaretPosition | null {
    const gapBetweenPages = 40;
    let currentYOffset = 40;

    for (let pIdx = 0; pIdx < tree.pages.length; pIdx++) {
      const page = tree.pages[pIdx];
      const pageX = Math.max((canvasLogicalWidth - page.width) / 2, 20);
      const pageY = currentYOffset;

      for (let lIdx = 0; lIdx < page.lines.length; lIdx++) {
        const line = page.lines[lIdx];
        const lineAbsoluteY = pageY + line.y;

        for (let rIdx = 0; rIdx < line.runs.length; rIdx++) {
          const run = line.runs[rIdx];

          if (run.astParagraphId === targetParagraphId && run.astRunId === targetRunId) {
            // Is the targetCharIndex inside this visual chunk?
            // Since a single AST run might be split across lines, we check if targetCharIndex is valid for this string length.
            // In Phase 4, we assume our runs aren't deeply split, or we just measure up to the target length.

            const fontName = run.properties.bold ? 'Arial-Bold' : 'Arial';
            const font = this.fontManager.getFont(fontName);

            let currentX = pageX + run.x;

            // Loop up to targetCharIndex to calculate geometric offset
            const limit = Math.min(targetCharIndex, run.text.length);
            for (let i = 0; i < limit; i++) {
              currentX += font.getAdvanceWidth(run.text[i], run.properties.fontSize);
            }

            return {
              pageIndex: pIdx, lineIndex: lIdx, runIndex: rIdx, charIndex: limit,
              x: currentX, y: lineAbsoluteY, height: line.height,
              astParagraphId: run.astParagraphId, astRunId: run.astRunId
            };
          }
        }
      }
      currentYOffset += page.height + gapBetweenPages;
    }
    return null;
  }
}
