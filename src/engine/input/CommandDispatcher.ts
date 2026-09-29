import { DocumentAst } from '../ast/schema';
import { CaretPosition, HitTester } from './HitTester';
import { DocumentMutator } from '../state/DocumentMutator';
import { TypesettingEngine } from '../layout/TypesettingEngine';
import { CanvasRenderer } from '../render/CanvasRenderer';
import { SyncProvider } from '../state/SyncProvider';

export class CommandDispatcher {
  private ast: DocumentAst;
  private engine: TypesettingEngine;
  private renderer: CanvasRenderer;
  private hitTester: HitTester;
  private syncProvider?: SyncProvider;
  
  // Callback for React to track the caret and position the hidden textarea
  public onCaretMoved?: (caret: CaretPosition) => void;

  constructor(ast: DocumentAst, engine: TypesettingEngine, renderer: CanvasRenderer, hitTester: HitTester, syncProvider?: SyncProvider) {
    this.ast = ast;
    this.engine = engine;
    this.renderer = renderer;
    this.hitTester = hitTester;
    this.syncProvider = syncProvider;
  }

  public setAst(ast: DocumentAst): void {
    this.ast = ast;
  }

  public handleInput(text: string, caret: CaretPosition | null, canvasLogicalWidth: number): CaretPosition | null {
    if (!caret) return null;
    
    // 1. Mutate AST structurally
    DocumentMutator.insertText(this.ast, caret, text);
    
    // 2. Re-layout and re-render
    return this.rebuild(caret, canvasLogicalWidth);
  }

  public handleBackspace(caret: CaretPosition | null, canvasLogicalWidth: number): CaretPosition | null {
    if (!caret) return null;
    
    // 1. Mutate AST structurally
    DocumentMutator.deleteBackward(this.ast, caret);
    
    // 2. Re-layout and re-render
    return this.rebuild(caret, canvasLogicalWidth);
  }

  private rebuild(caret: CaretPosition, canvasLogicalWidth: number): CaretPosition | null {
    // 1. Relayout the document after the AST mutation
    const renderTree = this.engine.layout(this.ast);
    this.renderer.setRenderTree(renderTree);
    
    // 2. Sync to peers
    if (this.syncProvider) {
      this.syncProvider.commitAst(this.ast);
    }

    // After re-layout, the text width changed. Ask HitTester to calculate the new visual X/Y coordinate.
    const newCaret = this.hitTester.recalculateCaret(
      renderTree, 
      canvasLogicalWidth, 
      caret.astParagraphId, 
      caret.astRunId, 
      caret.charIndex
    );

    if (newCaret) {
      this.renderer.setCaretPosition(newCaret);
      if (this.onCaretMoved) {
        this.onCaretMoved(newCaret);
      }
    }
    
    return newCaret;
  }
}
