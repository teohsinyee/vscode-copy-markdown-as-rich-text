import test from "node:test";
import assert from "node:assert/strict";
import { buildWindowsClipboardHtml } from "../src/htmlClipboard";

test("buildWindowsClipboardHtml creates CF_HTML markers and offsets", () => {
  const result = buildWindowsClipboardHtml("<h1>Hello</h1><p>World</p>");

  assert.match(result, /^Version:0\.9\r\nStartHTML:\d{10}\r\nEndHTML:\d{10}\r\nStartFragment:\d{10}\r\nEndFragment:\d{10}\r\n<html><body><!--StartFragment-->/);
  assert.match(result, /<!--EndFragment--><\/body><\/html>$/);
  assert.match(result, /<h1>Hello<\/h1><p>World<\/p>/);
});
