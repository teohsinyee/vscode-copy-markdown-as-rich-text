import { htmlToText } from "html-to-text";

export function buildPlainTextFromHtml(normalizedHtml: string): string {
  return htmlToText(normalizedHtml, {
    selectors: [
      { selector: "a", options: { hideLinkHrefIfSameAsText: true } },
      { selector: "pre", format: "block" },
      { selector: "table", options: { uppercaseHeaderCells: false } }
    ],
    wordwrap: false,
    preserveNewlines: true
  }).trim();
}
