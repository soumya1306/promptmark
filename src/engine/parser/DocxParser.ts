import JSZip from 'jszip';
import { DocumentAst, Section, Paragraph, Run } from '../ast/schema';

/**
 * DocxParser handles decompressing and extracting the OpenXML contents of a .docx file,
 * strictly transforming its nodes into our deterministic JSON AST.
 */
export class DocxParser {
  /**
   * Parses a binary .docx file into the normalized Canvas JSON AST.
   */
  public async parse(fileBuffer: ArrayBuffer): Promise<DocumentAst> {
    const zip = await JSZip.loadAsync(fileBuffer);
    
    // .docx files store the main text content in word/document.xml
    const documentXmlFile = zip.file('word/document.xml');
    if (!documentXmlFile) {
      throw new Error("Invalid .docx file: missing word/document.xml");
    }

    const xmlString = await documentXmlFile.async('text');
    
    // Note: DOMParser is available in the browser. 
    // If run server-side (Node.js), this would require a polyfill like 'xmldom' or 'jsdom'.
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    return this.buildAst(xmlDoc);
  }

  private buildAst(xmlDoc: Document): DocumentAst {
    // word/document.xml structure: <w:document> -> <w:body> -> <w:p> (paragraphs)
    const body = xmlDoc.getElementsByTagName('w:body')[0];
    if (!body) {
      throw new Error("Invalid document.xml: missing <w:body>");
    }

    const paragraphs: Paragraph[] = [];
    
    // Iterate through all direct children of body, typically <w:p>
    const children = Array.from(body.childNodes);
    let paragraphIndex = 0;

    for (const node of children) {
      if (node.nodeName === 'w:p') {
        const paragraph = this.parseParagraph(node as Element, `p-${paragraphIndex++}`);
        paragraphs.push(paragraph);
      }
      // Note: In full implementation, we also handle <w:tbl> (tables), <w:sectPr> (page setups).
    }

    // Default 8.5x11 inches setup. A full parser reads this from <w:sectPr>.
    const defaultSection: Section = {
      id: 'section-0',
      type: 'section',
      pageSetup: {
        width: 816, // 8.5 inches at 96 DPI
        height: 1056, // 11 inches at 96 DPI
        margins: { top: 96, bottom: 96, left: 96, right: 96, header: 36, footer: 36 }
      },
      paragraphs
    };

    return {
      document: {
        sections: [defaultSection]
      }
    };
  }

  private parseParagraph(pNode: Element, id: string): Paragraph {
    const runs: Run[] = [];
    const children = Array.from(pNode.childNodes);
    let runIndex = 0;

    for (const node of children) {
      if (node.nodeName === 'w:r') {
        const run = this.parseRun(node as Element, `${id}-r-${runIndex++}`);
        if (run) {
          runs.push(run);
        }
      }
    }

    // Minimal implementation: ignoring <w:pPr> (paragraph properties) for the skeleton
    return {
      id,
      type: 'paragraph',
      paragraphProperties: {
        align: 'left',
        spacing: { before: 0, after: 12, line: 1.15 },
        indent: { left: 0, right: 0, firstLine: 0 }
      },
      runs
    };
  }

  private parseRun(rNode: Element, id: string): Run | null {
    // A run typically contains <w:rPr> (properties) and <w:t> (text)
    const textNodes = rNode.getElementsByTagName('w:t');
    if (textNodes.length === 0) return null;

    // Combine text if there are multiple <w:t> inside a run
    let text = '';
    for (let i = 0; i < textNodes.length; i++) {
      text += textNodes[i].textContent || '';
    }

    // Extract OpenXML properties
    const rPr = rNode.getElementsByTagName('w:rPr')[0];
    let bold = false;
    let italic = false;
    let fontSize = 12; // Default 12pt
    let color = '#000000';

    if (rPr) {
      if (rPr.getElementsByTagName('w:b').length > 0) bold = true;
      if (rPr.getElementsByTagName('w:i').length > 0) italic = true;
      
      const szNode = rPr.getElementsByTagName('w:sz')[0];
      if (szNode) {
        const val = szNode.getAttribute('w:val');
        if (val) fontSize = parseInt(val, 10) / 2; // OpenXML w:sz is stored in half-points
      }

      const colorNode = rPr.getElementsByTagName('w:color')[0];
      if (colorNode) {
        const val = colorNode.getAttribute('w:val');
        if (val && val !== 'auto') color = `#${val}`;
      }
    }

    return {
      id,
      type: 'run',
      text,
      runProperties: {
        fontFamily: 'Arial',
        fontSize,
        bold,
        italic,
        underline: false,
        color
      }
    };
  }
}
