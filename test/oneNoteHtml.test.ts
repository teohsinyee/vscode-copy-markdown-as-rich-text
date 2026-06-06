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

test("buildOneNoteHtml converts ordered lists into content-indented paragraphs for paste targets", () => {
  const result = buildOneNoteHtml("<ol><li>a</li><li>b</li></ol>");

  assert.doesNotMatch(result, /<ol/);
  assert.match(result, /<p data-list-paragraph="list" style="font-size:16px;line-height:1\.5;margin:0 0 6px 0;">&nbsp;&nbsp;&nbsp;&nbsp;1\.&nbsp;&nbsp;a<\/p>/);
  assert.match(result, /<p data-list-paragraph="list" style="font-size:16px;line-height:1\.5;margin:0 0 6px 0;">&nbsp;&nbsp;&nbsp;&nbsp;2\.&nbsp;&nbsp;b<\/p>/);
});

test("buildOneNoteHtml converts bullet lists into content-indented paragraphs for paste targets", () => {
  const result = buildOneNoteHtml("<ul><li>a</li><li>b</li></ul>");

  assert.doesNotMatch(result, /<ul/);
  assert.match(result, /<p data-list-paragraph="list" style="font-size:16px;line-height:1\.5;margin:0 0 6px 0;">&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;a<\/p>/);
  assert.match(result, /<p data-list-paragraph="list" style="font-size:16px;line-height:1\.5;margin:0 0 6px 0;">&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;b<\/p>/);
});
