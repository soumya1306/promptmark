import { z } from 'zod';

// ============================================================================
// RUN (Inline Text)
// ============================================================================
export const RunPropertiesSchema = z.object({
  fontFamily: z.string().default('Arial'),
  fontSize: z.number().positive().default(12), // In points
  bold: z.boolean().default(false),
  italic: z.boolean().default(false),
  underline: z.boolean().default(false),
  color: z.string().default('#000000'), // Hex color
});

export const RunSchema = z.object({
  id: z.string(),
  type: z.literal('run'),
  text: z.string(),
  runProperties: RunPropertiesSchema.default({} as any),
});

export type RunProperties = z.infer<typeof RunPropertiesSchema>;
export type Run = z.infer<typeof RunSchema>;

// ============================================================================
// PARAGRAPH (Block level)
// ============================================================================
export const ParagraphSpacingSchema = z.object({
  before: z.number().nonnegative().default(0), // Points
  after: z.number().nonnegative().default(0),  // Points
  line: z.number().positive().default(1.15),   // Multiplier (e.g., 1.15x)
});

export const ParagraphPropertiesSchema = z.object({
  align: z.enum(['left', 'center', 'right', 'justify']).default('left'),
  spacing: ParagraphSpacingSchema.default({} as any),
  indent: z.object({
    left: z.number().nonnegative().default(0),
    right: z.number().nonnegative().default(0),
    firstLine: z.number().default(0),
  }).default({} as any),
});

export const ParagraphSchema = z.object({
  id: z.string(),
  type: z.literal('paragraph'),
  paragraphProperties: ParagraphPropertiesSchema.default({} as any),
  runs: z.array(RunSchema),
});

export type ParagraphProperties = z.infer<typeof ParagraphPropertiesSchema>;
export type Paragraph = z.infer<typeof ParagraphSchema>;

// ============================================================================
// SECTION / PAGE SETUP
// ============================================================================
export const PageMarginsSchema = z.object({
  top: z.number().positive(),
  bottom: z.number().positive(),
  left: z.number().positive(),
  right: z.number().positive(),
  header: z.number().nonnegative().default(36), // 0.5 inch default
  footer: z.number().nonnegative().default(36),
});

export const PageSetupSchema = z.object({
  width: z.number().positive(),  // In points or scaled pixels
  height: z.number().positive(), // In points or scaled pixels
  margins: PageMarginsSchema,
});

export const SectionSchema = z.object({
  id: z.string(),
  type: z.literal('section'),
  pageSetup: PageSetupSchema,
  paragraphs: z.array(ParagraphSchema),
});

export type PageSetup = z.infer<typeof PageSetupSchema>;
export type Section = z.infer<typeof SectionSchema>;

// ============================================================================
// ROOT DOCUMENT
// ============================================================================
export const DocumentAstSchema = z.object({
  document: z.object({
    sections: z.array(SectionSchema),
  }),
});

export type DocumentAst = z.infer<typeof DocumentAstSchema>;

/**
 * Validates and parses an unknown JSON object into a strict DocumentAst.
 */
export function parseDocumentAst(data: unknown): DocumentAst {
  return DocumentAstSchema.parse(data);
}
