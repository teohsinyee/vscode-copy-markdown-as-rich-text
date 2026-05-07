import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSemanticHtml } from "../src/semanticHtml";

test("normalizeSemanticHtml keeps supported semantic tags", () => {
  const html = "<h1>Hello</h1><p>World <strong>bold</strong> <script>alert(1)</script></p>";
  const result = normalizeSemanticHtml(html);

  assert.equal(result, "<h1>Hello</h1><p>World <strong>bold</strong> alert(1)</p>");
});

test("normalizeSemanticHtml preserves links and tables", () => {
  const html = '<table><tr><td><a href="https://example.com">Link</a></td></tr></table>';
  const result = normalizeSemanticHtml(html);

  assert.match(result, /<table>/);
  assert.match(result, /href="https:\/\/example\.com"/);
});
