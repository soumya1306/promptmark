import * as opentype from 'opentype.js';

export class FontManager {
  private static instance: FontManager;
  private fonts: Map<string, opentype.Font> = new Map();

  private constructor() {}

  public static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  /**
   * Loads a font from a URL and caches it in memory.
   * @param name The internal name for the font (e.g., 'Arial', 'Times New Roman-Bold')
   * @param url The URL to the .ttf or .woff file
   */
  public async loadFont(name: string, url: string): Promise<opentype.Font> {
    if (this.fonts.has(name)) {
      return this.fonts.get(name)!;
    }

    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const font = opentype.parse(buffer);
      this.fonts.set(name, font);
      return font;
    } catch (error) {
      console.error(`Failed to load font ${name} from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves a loaded font by name.
   */
  public getFont(name: string): opentype.Font {
    const font = this.fonts.get(name);
    if (!font) {
      throw new Error(`Font ${name} has not been loaded. Call loadFont() first.`);
    }
    return font;
  }

  /**
   * Helper to ensure all required baseline fonts are loaded before typesetting.
   */
  public async loadBaselineFonts(): Promise<void> {
    // Loads the local font binaries we committed to /public/fonts
    await Promise.all([
      this.loadFont('Arial', '/fonts/Roboto-Regular.woff'), // Mapping Arial default to Roboto
      this.loadFont('Arial-Bold', '/fonts/Roboto-Bold.woff'),
      this.loadFont('Times New Roman', '/fonts/Roboto-Regular.woff'), // Fallback mapping
    ]);
  }
}
