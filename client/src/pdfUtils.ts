import * as pdfjsLib from "pdfjs-dist";

/* Bind worker so pdfjs works in Vite+TS */
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";

/**
 * Extracts plain text from every page of a PDF File
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const { items } = await page.getTextContent();
    text += items.map((it: any) => it.str).join(" ") + "\n";
  }
  return text;
}
