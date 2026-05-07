import test from "node:test";
import assert from "node:assert/strict";
import { buildOneNoteHtml } from "../src/oneNoteHtml";

test("buildOneNoteHtml applies inline styles to headings and paragraphs", () => {
  const result = buildOneNoteHtml("<h1>Title</h1><p>Body</p>");

  assert.match(result, /<h1 style="font-size:28px/);
  assert.match(result, /<p style="font-size:16px/);
});

test("buildOneNoteHtml styles tables for paste targets", () => {
  const result = buildOneNoteHtml("<table><tbody><tr><th>H</th><td>C</td></tr></tbody></table>");

  assert.match(result, /border-collapse:collapse/);
  assert.match(result, /background-color:#92D050/);
});
