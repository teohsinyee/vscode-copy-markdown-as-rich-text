import { parse, HTMLElement, type Node as HtmlNode, TextNode } from "node-html-parser";

const ALLOWED_TAGS = new Set([
  "a",
  "br",
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

function cleanText(value: string, restoreLineBreaks = false): string {
  const cleaned = value.replace(/\s+/g, " ");

  if (!restoreLineBreaks) {
    return escapeHtml(cleaned);
  }

  return cleaned
    .split(/<br\s*\/?>/gi)
    .map((part) => escapeHtml(part))
    .join("<br>");
}

function normalizeChildren(node: HTMLElement, restoreLineBreaks = false): string {
  return node.childNodes
    .map((child) => normalizeNode(child, restoreLineBreaks))
    .join("");
}

function normalizePreformattedContent(node: HTMLElement): string {
  return node.childNodes
    .map((child) => {
      if (child instanceof TextNode) {
        return escapeHtml(child.text);
      }

      if (child instanceof HTMLElement) {
        const tag = child.tagName.toLowerCase();
        if (tag === "code") {
          return `<code>${normalizePreformattedContent(child)}</code>`;
        }

        return normalizePreformattedContent(child);
      }

      return "";
    })
    .join("");
}

function normalizePreTag(node: HTMLElement): string {
  const preInnerHtml = node.innerHTML
    .replace(/^&lt;code&gt;/, "")
    .replace(/&lt;\/code&gt;$/, "");

  const parsed = parse(preInnerHtml, {
    comment: false
  });

  const inner = parsed.childNodes
    .map((child) => {
      if (child instanceof TextNode) {
        return escapeHtml(child.text);
      }

      if (child instanceof HTMLElement) {
        const tag = child.tagName.toLowerCase();
        if (tag === "code") {
          return `<code>${normalizePreformattedContent(child)}</code>`;
        }

        return normalizePreformattedContent(child);
      }

      return "";
    })
    .join("");

  return `<pre>${inner}</pre>`;
}

function normalizeNode(node: HtmlNode, restoreLineBreaks = false): string {
  if (node instanceof TextNode) {
    return cleanText(node.text, restoreLineBreaks);
  }

  if (!(node instanceof HTMLElement)) {
    return "";
  }

  const tag = node.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) {
    return normalizeChildren(node, restoreLineBreaks);
  }

  if (tag === "a") {
    const href = node.getAttribute("href");
    const safeHref = href ? ` href="${escapeHtml(href)}"` : "";
    return `<a${safeHref}>${normalizeChildren(node, restoreLineBreaks)}</a>`;
  }

  if (tag === "pre") {
    return normalizePreTag(node);
  }

  if (tag === "code") {
    return `<code>${normalizePreformattedContent(node)}</code>`;
  }

  if (tag === "br") {
    return "<br>";
  }

  const childContent = normalizeChildren(node, restoreLineBreaks || tag === "td" || tag === "th");

  if (tag === "table") {
    const hasHead = node.querySelector("thead") !== null;
    const hasBody = node.childNodes.some(
      (child) => child instanceof HTMLElement && child.tagName.toLowerCase() === "tbody"
    );
    const body = childContent.trim();
    return hasHead || hasBody ? `<table>${body}</table>` : `<table><tbody>${body}</tbody></table>`;
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
