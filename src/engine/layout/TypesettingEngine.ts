import { DocumentAst, Paragraph, Section } from '../ast/schema';
import { FontManager } from './FontManager';
import { RenderTree, PageBox, LineBox, RenderRun } from './layout-types';

export class TypesettingEngine {
  private fontManager: FontManager;

  constructor(fontManager: FontManager) {
    this.fontManager = fontManager;
  }

  /**
   * The core layout loop. Translates a JSON AST into absolute mathematical PageBoxes.
   */
  public layout(ast: DocumentAst): RenderTree {
    const pages: PageBox[] = [];
    
    for (const section of ast.document.sections) {
      // Initialize first page
      let currentPage = this.createPageBox(section);
      pages.push(currentPage);

      let currentY = section.pageSetup.margins.top;
      const contentWidth = section.pageSetup.width - section.pageSetup.margins.left - section.pageSetup.margins.right;
      const contentHeightMax = section.pageSetup.height - section.pageSetup.margins.bottom;

      for (const paragraph of section.paragraphs) {
        currentY += paragraph.paragraphProperties.spacing.before;

        const lines = this.layoutParagraph(paragraph, contentWidth, section.pageSetup.margins.left, currentY);
        
        for (const line of lines) {
          // Vertical Pagination (Step 2.4): Hard break if line exceeds bottom margin
          if (line.y + line.height > contentHeightMax) {
            currentPage = this.createPageBox(section);
            pages.push(currentPage);
            
            const prevY = line.y;
            currentY = section.pageSetup.margins.top;
            
            // Rebase line coordinates to the top of the new page
            const yOffset = prevY - currentY;
            line.y = currentY;
            line.runs.forEach(r => r.y -= yOffset);
          }
          
          currentPage.lines.push(line);
          currentY = line.y + line.height;
        }

        currentY += paragraph.paragraphProperties.spacing.after;
      }
    }

    return { pages };
  }

  private createPageBox(section: Section): PageBox {
    return {
      lines: [],
      width: section.pageSetup.width,
      height: section.pageSetup.height,
      marginTop: section.pageSetup.margins.top,
      marginBottom: section.pageSetup.margins.bottom,
      marginLeft: section.pageSetup.margins.left,
      marginRight: section.pageSetup.margins.right,
    };
  }

  /**
   * Performs horizontal word wrapping for a single paragraph. (Step 2.3)
   */
  private layoutParagraph(paragraph: Paragraph, maxWidth: number, startX: number, startY: number): LineBox[] {
    const lines: LineBox[] = [];
    let currentLine: LineBox = { runs: [], x: startX, y: startY, width: 0, height: 0, baseline: 0 };
    let currentX = startX;
    
    // Simplistic line height calculation based on font size and spacing multiplier
    const maxFontSize = Math.max(...paragraph.runs.map(r => r.runProperties.fontSize), 12);
    const lineHeight = maxFontSize * paragraph.paragraphProperties.spacing.line;
    currentLine.height = lineHeight;
    currentLine.baseline = lineHeight * 0.8; // Roughly 80% down for alphabetic baseline

    for (const run of paragraph.runs) {
      // Split by spaces but preserve them for exact measurement
      const words = run.text.split(/(\s+)/); 
      
      const fontName = run.runProperties.bold ? 'Arial-Bold' : 'Arial';
      const font = this.fontManager.getFont(fontName);
      
      for (const word of words) {
        if (!word) continue;
        
        // Measure exact string width using TrueType glyph metrics (Step 2.2)
        const wordWidth = font.getAdvanceWidth(word, run.runProperties.fontSize);
        
        // Line-breaking check (Wrap if it overflows the right margin)
        if (currentX + wordWidth > startX + maxWidth && word.trim() !== '') {
          lines.push(currentLine);
          const nextY = currentLine.y + currentLine.height;
          currentLine = { runs: [], x: startX, y: nextY, width: 0, height: lineHeight, baseline: lineHeight * 0.8 };
          currentX = startX;
        }

        currentLine.runs.push({
          text: word,
          x: currentX,
          y: currentLine.y,
          width: wordWidth,
          height: lineHeight,
          properties: run.runProperties,
          astParagraphId: paragraph.id,
          astRunId: run.id
        });

        currentX += wordWidth;
        currentLine.width = currentX - startX;
      }
    }

    if (currentLine.runs.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }
}
