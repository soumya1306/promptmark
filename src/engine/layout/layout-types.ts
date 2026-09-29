import { RunProperties } from "../ast/schema";

export interface RenderRun {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: RunProperties;
  astParagraphId: string;
  astRunId: string;
}

export interface LineBox {
  runs: RenderRun[];
  x: number;
  y: number;
  width: number;
  height: number;
  baseline: number; // Y offset for text alignment
}

export interface PageBox {
  lines: LineBox[];
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export interface RenderTree {
  pages: PageBox[];
}
