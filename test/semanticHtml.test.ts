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

test("normalizeSemanticHtml does not double-escape heading text entities", () => {
  const html = "<h1>Slides &amp; Notes</h1>";
  const result = normalizeSemanticHtml(html);

  assert.equal(result, "<h1>Slides &amp; Notes</h1>");
});

test("normalizeSemanticHtml preserves code block structure", () => {
  const html = "<pre><code>line 1\n  line 2\nline 3</code></pre>";
  const result = normalizeSemanticHtml(html);

  assert.equal(result, "<pre><code>line 1\n  line 2\nline 3</code></pre>");
});
