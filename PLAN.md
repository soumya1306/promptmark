# WYSIWYG Document Editor - Execution Plan & Timeline

This document serves as the master checklist and phased timeline for building the canvas-rendered, pixel-perfect WYSIWYG editor. It follows the strict constraints outlined in `architecture.md`.

## Phase 1: Foundation & AST Design
*Objective: Establish the data structures and the raw canvas drawing loop.*
- [ ] **1.1** Define strict TypeScript interfaces and Zod schemas for the JSON AST (Sections, Paragraphs, Runs, Properties).
- [ ] **1.2** Set up the `DocxParser` skeleton using `jszip` to extract and parse a basic `document.xml` into our AST format.
- [ ] **1.3** Initialize the `CanvasRenderer` class within `DocumentSheet.tsx`, ensuring proper high-DPI (Retina) pixel scaling and `requestAnimationFrame` loop basics.

## Phase 2: The Typesetting & Pagination Engine
*Objective: Mathematically calculate where every word and page break belongs without the DOM.*
- [ ] **2.1** Integrate `opentype.js` to parse and load baseline fonts (e.g., Times New Roman, Arial) into memory.
- [ ] **2.2** Implement `TypesettingEngine.measureText()` to accurately calculate string widths using true font glyph metrics.
- [ ] **2.3** Implement Horizontal Line-Breaking: Accumulate runs into `LineBox`es bounded by page margins.
- [ ] **2.4** Implement Vertical Pagination: Accumulate `LineBox`es into `PageBox`es, inserting hard page breaks when exceeding page height.
- [ ] **2.5** Connect the `RenderTree` output to the `CanvasRenderer` to successfully paint static text, margins, and page boundaries.

## Phase 3: Interaction & Hit-Testing Layer
*Objective: Understand where the user is pointing and render the cursor.*
- [ ] **3.1** Implement DOM-to-Canvas coordinate normalization (handling zoom levels, scroll offsets, and device pixel ratio).
- [ ] **3.2** Build the `HitTester` to resolve an `(X, Y)` coordinate back to a specific AST index (`[PageIndex -> ParagraphIndex -> RunIndex -> CharIndex]`).
- [ ] **3.3** Render a blinking caret directly on the canvas at the resolved character coordinates.
- [ ] **3.4** Implement mouse-drag logic to define a `SelectionRange` and render semi-transparent highlight boxes over selected text.

## Phase 4: React State & Unidirectional Mutation Flow
*Objective: Allow typing and UI interactions to edit the document.*
- [ ] **4.1** Overlay a hidden, focused `<textarea>` on the canvas to intercept native keyboard events (`onInput`, `onKeyDown`, IME composition).
- [ ] **4.2** Implement the Command Dispatcher to handle basic mutations: Insert text, Backspace, Enter (paragraph split).
- [ ] **4.3** Connect mutations to trigger a targeted `TypesettingEngine` recalculation and a `CanvasRenderer` batch redraw.
- [ ] **4.4** Wire up the React UI (e.g., `WordRibbon.tsx`): Selecting "Bold" mutates the AST `runProperties` and triggers a redraw.

## Phase 5: Multiplayer & Synchronization
*Objective: Enable real-time collaboration using CRDTs on the custom AST.*
- [ ] **5.1** Map the internal JSON AST structure to a Yjs shared type (e.g., `Y.Map` containing `Y.Array`s of text).
- [ ] **5.2** Set up `y-websocket` to sync AST mutations with the backend.
- [ ] **5.3** Broadcast local caret/selection positions as Yjs Awareness state.
- [ ] **5.4** Render remote collaborator cursors and nameplates on the canvas using the `HitTester` to resolve remote indices to local `(X,Y)` coordinates.

## Phase 6: Advanced Features & Polish
*Objective: Complete the WYSIWYG feature set.*
- [ ] **6.1** Implement complex node rendering on the canvas (Tables, Floating Images, Callout blocks).
- [ ] **6.2** Render Track Changes (strikethroughs, color overrides) directly in the `CanvasRenderer`.
- [ ] **6.3** Wire the `LeftOutlineSidebar.tsx` to dynamically read Header-level paragraphs from the AST.
- [ ] **6.4** Set up `y-indexeddb` for offline local-first persistence.
