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

test("buildOneNoteHtml converts ordered lists into indented numbered paragraphs for paste targets", () => {
  const result = buildOneNoteHtml("<ol><li>a</li><li>b</li></ol>");

  assert.doesNotMatch(result, /<ol/);
  assert.match(result, /<p data-list-paragraph="ordered" style="font-size:16px;line-height:1\.5;margin:0 0 6px 48px;text-indent:-24px;">1\. a<\/p>/);
  assert.match(result, /<p data-list-paragraph="ordered" style="font-size:16px;line-height:1\.5;margin:0 0 6px 48px;text-indent:-24px;">2\. b<\/p>/);
});
