# WYSIWYG Document Editor - Canvas Architecture

## 1. System Core Philosophy
The core philosophy of this editor is absolute deterministic rendering. To achieve a true Microsoft Word-like desktop experience in the browser, this application **strictly avoids native browser HTML/CSS text reflow (the DOM)**. 

Instead, the HTML `<canvas>` element acts as a pure visual reflection of an immutable application state. The DOM is used only to capture raw user interactions (keyboard events, scroll events) and to overlay accessible hidden text areas for screen readers. Every pixel, line break, page margin, header, and footer is mathematically calculated and painted directly onto the canvas by a custom typesetting engine.

## 2. Abstract Syntax Tree (AST) & Document Model
The document state is represented as a normalized JSON Abstract Syntax Tree (AST) independent of any specific rendering target. The schema models the exact hierarchical structure of an OpenXML `.docx` file.

```json
{
  "document": {
    "sections": [
      {
        "pageSetup": { "width": 816, "height": 1056, "margins": { "top": 96, "bottom": 96, "left": 96, "right": 96 } },
        "paragraphs": [
          {
            "id": "p-1",
            "paragraphProperties": { "align": "left", "spacing": { "before": 0, "after": 12, "line": 1.15 } },
            "runs": [
              {
                "id": "r-1",
                "text": "The quick brown fox ",
                "runProperties": { "fontFamily": "Times New Roman", "fontSize": 12, "bold": true, "italic": false }
              }
            ]
          }
        ]
      }
    ]
  }
}
```
*Measurements are in standard typographic points or scaled pixels (where 96px = 1 inch).*

## 3. The Typesetting & Pagination Pipeline
The `TypesettingEngine` translates the AST into a `RenderTree` containing exact `(X, Y)` coordinates for every character, line, and page.

- **Horizontal Line-Breaking Math:** The engine iterates through the text runs and calculates word widths using true font metrics derived from `opentype.js` or pre-measured `ctx.measureText()` caches. Words are accumulated into a `LineBox` until the total width exceeds `PageWidth - LeftMargin - RightMargin`.
- **Vertical Pagination Boundaries:** As `LineBox`es are generated, their heights (based on font ascent, descent, and line spacing multipliers) are accumulated. When the total `Y` coordinate exceeds `PageHeight - TopMargin - BottomMargin`, the engine inserts a hard page break, generates a new `PageBox`, and continues typesetting the remaining text on the new page boundary.

## 4. The Interaction & Hit-Testing Layer
Because there are no DOM elements, the editor relies on a highly optimized `HitTester` module. 

When a user clicks on the canvas:
1. The browser's native `(clientX, clientY)` coordinates are intercepted and normalized against the canvas's current scroll offset and zoom scale.
2. The `HitTester` performs a spatial search (using an R-tree or binary search over the `RenderTree` bounding boxes) to map the `(X, Y)` coordinate back to the exact document text boundaries: `[Page Index -> Line Index -> Run Index -> Character Index]`.
3. This exact character index sets the `SelectionRange`. 
4. The custom caret/blinking cursor is then painted explicitly at the `(X, Y)` coordinates of that resolved character index.

## 5. The React State & Unidirectional Mutation Flow
The architecture relies on a strict unidirectional data flow triggered by user events.

1. **Input:** A hidden `<textarea>` intercepts keyboard strokes (`onInput`, `onKeyDown`).
2. **Mutation:** A command dispatcher receives the raw input and applies structural mutations directly to the immutable AST (e.g., splitting a paragraph node on `Enter`, updating text within a run).
3. **Typesetting:** The AST mutation triggers the `TypesettingEngine` to recalculate line breaks and pagination exclusively for the dirtied sections (or the whole document if needed).
4. **Render:** The updated `RenderTree` triggers a full batch-redraw. `ctx.clearRect()` clears the canvas, and the renderer loops over the visible pages and paints text, selection highlights, and cursors.

## 6. Core Technical Stack Constraints
To ensure precision, the following stack constraints and domain-driven module boundaries must be enforced:
- **`jszip`**: Used for decompressing the `.docx` archive natively in the browser or worker.
- **`opentype.js`**: Used for true font glyph measurements (ascent, descent, kerning, advance width) to guarantee pixel-perfect deterministic layout independent of the operating system's native text rendering quirks.
- **`DocxParser`**: The module strictly responsible for transforming `.docx` XML nodes into our internal JSON AST.
- **`TypesettingEngine`**: The pure mathematical engine that converts the AST to a `RenderTree` with absolute `(X, Y)` coordinate boxes.
- **`HitTester`**: The module that resolves pointer coordinates to AST indices.
- **`CanvasRenderer`**: The isolated class responsible solely for invoking native Canvas 2D API calls (`fillText`, `fillRect`).
- **Strict Functional TypeScript:** All data transformations must be pure and strictly typed. Avoid generic utility names (e.g., no `utils.ts` or `helpers.ts`). Modules must reflect explicit domain contexts.
