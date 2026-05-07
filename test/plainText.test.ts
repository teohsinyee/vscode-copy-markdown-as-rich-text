import test from "node:test";
import assert from "node:assert/strict";
import { buildPlainTextFromHtml } from "../src/plainText";

test("buildPlainTextFromHtml keeps headings and paragraphs readable", () => {
  const result = buildPlainTextFromHtml("<h1>Title</h1><p>Body copy.</p>");

  assert.match(result, /TITLE/i);
  assert.match(result, /Body copy\./);
});

test("buildPlainTextFromHtml keeps links readable", () => {
  const result = buildPlainTextFromHtml('<p><a href="https://example.com">Example</a></p>');

  assert.match(result, /Example/);
  assert.match(result, /https:\/\/example\.com/);
});
