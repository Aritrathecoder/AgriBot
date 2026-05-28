export interface ParsedProduct {
  query: string;
}

export interface ParsedCropDetail {
  crop: string;
}

export interface ParsedResponse {
  textContent: string;
  products: ParsedProduct[] | null;
  cropDetail: ParsedCropDetail[] | null;
  quickReplies: string[] | null;
}

export function parseResponse(content: string): ParsedResponse {
  if (!content) {
    return { textContent: "", products: null, cropDetail: null, quickReplies: null };
  }

  let textContent = content;
  let products: ParsedProduct[] | null = null;
  let cropDetail: ParsedCropDetail[] | null = null;
  let quickReplies: string[] | null = null;

  // Extract products block
  const productsMatch = content.match(/```products\s*\n([\s\S]*?)\n```/);
  if (productsMatch) {
    try {
      products = JSON.parse(productsMatch[1]);
      textContent = textContent.replace(productsMatch[0], "").trim();
    } catch {
      // ignore parse errors
    }
  }

  // Extract crop detail block
  const cropMatch = content.match(/```cropdetail\s*\n([\s\S]*?)\n```/);
  if (cropMatch) {
    try {
      cropDetail = JSON.parse(cropMatch[1]);
      textContent = textContent.replace(cropMatch[0], "").trim();
    } catch {
      // ignore parse errors
    }
  }

  // Extract quick replies block
  const quickRepliesMatch = content.match(
    /```quickreplies\s*\n([\s\S]*?)\n```/
  );
  if (quickRepliesMatch) {
    try {
      quickReplies = JSON.parse(quickRepliesMatch[1]);
      textContent = textContent.replace(quickRepliesMatch[0], "").trim();
    } catch {
      // ignore parse errors
    }
  }

  return { textContent, products, cropDetail, quickReplies };
}

// Simple markdown to basic HTML converter for chat messages
export function renderMarkdown(text: string): string {
  if (!text) return "";
  
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-surface-elevated px-1 py-0.5 rounded text-sm">$1</code>')
    // Unordered lists
    .replace(/^- (.*)/gm, "<li>$1</li>")
    // Headers
    .replace(/^### (.*)/gm, '<h3 class="font-semibold text-base mt-3 mb-1">$1</h3>')
    .replace(/^## (.*)/gm, '<h2 class="font-semibold text-lg mt-3 mb-1">$1</h2>')
    // Line breaks
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  // Wrap lists
  html = html.replace(
    /(<li>.*?<\/li>)+/gs,
    '<ul class="list-disc pl-5 space-y-1 my-2">$&</ul>'
  );

  return `<p>${html}</p>`;
}
