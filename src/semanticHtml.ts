import { parse, HTMLElement, type Node as HtmlNode, TextNode } from "node-html-parser";

const ALLOWED_TAGS = new Set([
  "a",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul"
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanText(value: string): string {
  return escapeHtml(value.replace(/\s+/g, " "));
}

function normalizeChildren(node: HTMLElement): string {
  return node.childNodes
    .map((child) => normalizeNode(child))
    .join("");
}

function normalizeNode(node: HtmlNode): string {
  if (node instanceof TextNode) {
    return cleanText(node.text);
  }

  if (!(node instanceof HTMLElement)) {
    return "";
  }

  const tag = node.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) {
    return normalizeChildren(node);
  }

  if (tag === "a") {
    const href = node.getAttribute("href");
    const safeHref = href ? ` href="${escapeHtml(href)}"` : "";
    return `<a${safeHref}>${normalizeChildren(node)}</a>`;
  }

  const childContent = normalizeChildren(node);

  if (tag === "table") {
    const hasHead = node.querySelector("thead") !== null;
    const body = childContent.trim();
    return hasHead ? `<table>${body}</table>` : `<table><tbody>${body}</tbody></table>`;
  }

  return `<${tag}>${childContent}</${tag}>`;
}

export function normalizeSemanticHtml(renderedHtml: string): string {
  const root = parse(renderedHtml, {
    comment: false
  });

  return root.childNodes
    .map((child) => normalizeNode(child))
    .join("")
    .trim();
}
