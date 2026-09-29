import { DocumentAst, Run, Paragraph, Section } from '../ast/schema';
import { CaretPosition } from '../input/HitTester';

export class DocumentMutator {
  /**
   * Inserts text into the AST at the given exact structural caret position.
   */
  public static insertText(ast: DocumentAst, caret: CaretPosition, text: string): void {
    const run = this.getRun(ast, caret);
    if (!run) return;

    run.text = run.text.substring(0, caret.charIndex) + text + run.text.substring(caret.charIndex);
    // Shift caret forward
    caret.charIndex += text.length;
  }

  /**
   * Deletes a single character backwards (Backspace).
   */
  public static deleteBackward(ast: DocumentAst, caret: CaretPosition): void {
    const run = this.getRun(ast, caret);
    if (!run) return;

    if (caret.charIndex > 0) {
      run.text = run.text.substring(0, caret.charIndex - 1) + run.text.substring(caret.charIndex);
      caret.charIndex -= 1;
    } else {
      // Complex case: Caret is at the start of a word.
      // In Phase 4, we perform a basic deletion on the previous run (e.g. the space before the word)
      const paragraph = this.getParagraph(ast, caret);
      if (!paragraph) return;

      const runIndex = paragraph.runs.findIndex(r => r.id === caret.astRunId);
      if (runIndex > 0) {
        const prevRun = paragraph.runs[runIndex - 1];
        if (prevRun.text.length > 0) {
          prevRun.text = prevRun.text.substring(0, prevRun.text.length - 1);
          // Shift caret to the end of the previous run
          caret.astRunId = prevRun.id;
          caret.charIndex = prevRun.text.length;
        }
      }
    }
  }

  // --- Helpers ---

  private static getParagraph(ast: DocumentAst, caret: CaretPosition): Paragraph | null {
    for (const section of ast.document.sections) {
      for (const p of section.paragraphs) {
        if (p.id === caret.astParagraphId) {
          return p;
        }
      }
    }
    return null;
  }

  private static getRun(ast: DocumentAst, caret: CaretPosition): Run | null {
    const p = this.getParagraph(ast, caret);
    if (!p) return null;
    return p.runs.find(r => r.id === caret.astRunId) || null;
  }
}
