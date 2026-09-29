import { RenderTree } from '../layout/layout-types';
import { CaretPosition } from '../input/HitTester';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private isDestroyed = false;
  private renderTree: RenderTree | null = null;
  private caretPosition: CaretPosition | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error("Failed to initialize 2D canvas context");
    }
    this.ctx = context;

    // Handle initial resize and scaling
    this.resize();

    // Start the render loop
    this.startLoop();
  }

  public setRenderTree(tree: RenderTree): void {
    this.renderTree = tree;
  }

  public setCaretPosition(pos: CaretPosition | null): void {
    this.caretPosition = pos;
  }

  /**
   * Adjusts the internal canvas resolution to match device pixel ratio for crisp text (Retina displays).
   */
  public resize(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    // Get the logical CSS dimensions of the parent container
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set actual internal canvas resolution scaled by DPR
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Set the CSS size to the logical size
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // Scale the rendering context so all subsequent drawing operations are automatically scaled
    this.ctx.scale(dpr, dpr);
  }

  private startLoop(): void {
    const loop = () => {
      if (this.isDestroyed) return;

      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private render(): void {
    // 1. Clear the entire canvas
    const logicalWidth = this.canvas.width / window.devicePixelRatio;
    const logicalHeight = this.canvas.height / window.devicePixelRatio;

    // Fill background with the workspace color
    this.ctx.fillStyle = '#ede8e0';
    this.ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    if (!this.renderTree) {
      // Draw Loading State
      this.ctx.fillStyle = '#6b6358';
      this.ctx.font = '14px Arial';
      this.ctx.fillText("Loading fonts & typesetting engine...", 40, 40);
      return;
    }

    const gapBetweenPages = 40;
    let currentYOffset = 40;

    for (const page of this.renderTree.pages) {
      const pageX = Math.max((logicalWidth - page.width) / 2, 20); // Center the page
      const pageY = currentYOffset;

      // Draw Page Shadow
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 4;

      // Draw Page Fill
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(pageX, pageY, page.width, page.height);

      this.ctx.shadowColor = 'transparent';
      this.ctx.shadowBlur = 0;

      // Draw Text Runs
      for (const line of page.lines) {
        for (const run of line.runs) {
          const style = [];
          if (run.properties.italic) style.push("italic");
          if (run.properties.bold) style.push("bold");
          style.push(`${run.properties.fontSize}px`);
          style.push(run.properties.fontFamily);

          this.ctx.font = style.join(" ");
          this.ctx.fillStyle = run.properties.color;

          // fillText parameters: text, x, y (baseline)
          this.ctx.fillText(run.text, pageX + run.x, pageY + line.y + line.baseline);
        }
      }

      currentYOffset += page.height + gapBetweenPages;
    }

    // 3. Draw Interactive Caret
    if (this.caretPosition) {
      // Blinks every 500ms
      const isCaretVisible = Math.floor(Date.now() / 500) % 2 === 0;
      if (isCaretVisible) {
        this.ctx.fillStyle = '#000000'; // Pure black Microsoft Word style cursor
        // Draw 1px wide vertical line
        this.ctx.fillRect(this.caretPosition.x, this.caretPosition.y, 1.5, this.caretPosition.height);
      }
    }
  }

  /**
   * Cleanup method when the React component unmounts.
   */
  public destroy(): void {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
