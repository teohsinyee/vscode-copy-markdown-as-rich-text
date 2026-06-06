import { parse, HTMLElement } from "node-html-parser";

const TAG_STYLES: Record<string, string> = {
  h1: "font-size:28px;font-weight:700;margin:0 0 14px 0;line-height:1.25;",
  h2: "font-size:22px;font-weight:700;margin:20px 0 12px 0;line-height:1.3;",
  h3: "font-size:18px;font-weight:700;margin:18px 0 10px 0;line-height:1.35;",
  p: "font-size:16px;line-height:1.5;margin:0 0 14px 0;",
  ul: "margin:0 0 14px 0;padding:0 0 0 32px;line-height:1.5;",
  ol: "margin:0 0 14px 0;padding:0 0 0 32px;line-height:1.5;",
  li: "margin:0 0 6px 0;",
  table: "border-collapse:collapse;width:100%;margin:0 0 14px 0;font-size:15px;",
  thead: "",
  tbody: "",
  tr: "",
  th: "border:1px solid #999999;padding:6px 8px;background-color:#92D050;font-weight:700;text-align:left;vertical-align:top;",
  td: "border:1px solid #999999;padding:6px 8px;text-align:left;vertical-align:top;",
  pre: "font-family:Consolas,'Courier New',monospace;font-size:14px;line-height:1.45;margin:0 0 14px 0;padding:10px 12px;border:1px solid #d0d7de;background-color:#f6f8fa;white-space:pre-wrap;",
  code: "font-family:Consolas,'Courier New',monospace;font-size:0.95em;background-color:#f6f8fa;padding:1px 4px;border-radius:3px;",
  strong: "font-weight:700;",
  em: "font-style:italic;",
  a: "color:#0f6cbd;text-decoration:underline;"
};

function replaceOrderedLists(container: HTMLElement): void {
  const orderedLists = container.querySelectorAll("ol");

  for (const orderedList of orderedLists) {
    const items = orderedList.querySelectorAll(":scope > li");
    if (items.length === 0) {
      continue;
    }

    const replacementHtml = items
      .map((item, index) => `<p data-list-paragraph="ordered" style="font-size:16px;line-height:1.5;margin:0 0 6px 48px;text-indent:-24px;">${index + 1}. ${item.innerHTML.trim()}</p>`)
      .join("");

    orderedList.replaceWith(replacementHtml);
  }
}

function applyStyles(element: HTMLElement): void {
  const tag = element.tagName.toLowerCase();
  const style = TAG_STYLES[tag];

  if (style !== undefined && !element.getAttribute("data-list-paragraph")) {
    element.setAttribute("style", style);
  }

  if (tag === "pre") {
    const nestedCode = element.querySelector("code");
    if (nestedCode) {
      nestedCode.removeAttribute("style");
      nestedCode.setAttribute("style", "font-family:inherit;font-size:inherit;background-color:transparent;padding:0;border-radius:0;");
    }
  }

  if (tag === "a" && !element.getAttribute("href")) {
    element.removeAttribute("style");
  }

  for (const child of element.childNodes) {
    if (child instanceof HTMLElement) {
      applyStyles(child);
    }
  }
}

export function buildOneNoteHtml(normalizedHtml: string): string {
  const root = parse(`<div>${normalizedHtml}</div>`, {
    comment: false
  });

  const container = root.querySelector("div");
  if (!container) {
    return normalizedHtml;
  }

  replaceOrderedLists(container);
  applyStyles(container);
  container.setAttribute("style", "font-family:'Segoe UI',Arial,sans-serif;color:#1f1f1f;background-color:#ffffff;");

  return container.innerHTML.trim();
}
