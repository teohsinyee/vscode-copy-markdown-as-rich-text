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

test("normalizeSemanticHtml turns escaped br tags into line breaks", () => {
  const html = "<table><tbody><tr><td>line 1&lt;br&gt;line 2</td></tr></tbody></table>";
  const result = normalizeSemanticHtml(html);

  assert.equal(result, "<table><tbody><tr><td>line 1<br>line 2</td></tr></tbody></table>");
});

test("normalizeSemanticHtml keeps escaped br text outside table cells", () => {
  const html = "<pre><code>line 1&lt;br&gt;line 2</code></pre>";
  const result = normalizeSemanticHtml(html);

  assert.equal(result, "<pre><code>line 1&lt;br&gt;line 2</code></pre>");
});

test("normalizeSemanticHtml only treats direct tbody children as table bodies", () => {
  const html = "<table><tr><td><table><tbody><tr><td>nested</td></tr></tbody></table></td></tr></table>";
  const result = normalizeSemanticHtml(html);

  assert.equal(
    result,
    "<table><tbody><tr><td><table><tbody><tr><td>nested</td></tr></tbody></table></td></tr></tbody></table>"
  );
});

test("normalizeSemanticHtml only treats direct thead children as table heads", () => {
  const html = "<table><tr><td><table><thead><tr><th>nested</th></tr></thead></table></td></tr></table>";
  const result = normalizeSemanticHtml(html);

  assert.equal(
    result,
    "<table><tbody><tr><td><table><thead><tr><th>nested</th></tr></thead></table></td></tr></tbody></table>"
  );
});

test("normalizeSemanticHtml preserves comparison operators in list text", () => {
  const html = "<ol><li>&lt;=6 and &gt;6.</li></ol>";
  const result = normalizeSemanticHtml(html);

  assert.equal(result, "<ol><li>&lt;=6 and &gt;6.</li></ol>");
});
