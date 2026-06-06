import test from "node:test";
import assert from "node:assert/strict";
import { buildWindowsClipboardHtml } from "../src/htmlClipboard";

test("buildWindowsClipboardHtml creates CF_HTML markers and offsets", () => {
  const result = buildWindowsClipboardHtml("<h1>Hello</h1><p>World</p>");

  assert.match(result, /^Version:0\.9\r\nStartHTML:\d{10}\r\nEndHTML:\d{10}\r\nStartFragment:\d{10}\r\nEndFragment:\d{10}\r\n<html><body><!--StartFragment-->/);
  assert.match(result, /<!--EndFragment--><\/body><\/html>$/);
  assert.match(result, /<h1>Hello<\/h1><p>World<\/p>/);
});

test("buildWindowsClipboardHtml uses UTF-8 byte offsets for Unicode content", () => {
  const result = buildWindowsClipboardHtml("<p>Emoji 🚀 and arrow →</p>");
  const startHtml = Number(result.match(/StartHTML:(\d{10})/)?.[1]);
  const endHtml = Number(result.match(/EndHTML:(\d{10})/)?.[1]);
  const startFragment = Number(result.match(/StartFragment:(\d{10})/)?.[1]);
  const endFragment = Number(result.match(/EndFragment:(\d{10})/)?.[1]);
  const htmlStart = result.indexOf("<html>");
  const fragmentStart = result.indexOf("<!--StartFragment-->") + "<!--StartFragment-->".length;
  const fragmentEnd = result.indexOf("<!--EndFragment-->");

  assert.equal(startHtml, Buffer.byteLength(result.slice(0, htmlStart), "utf8"));
  assert.equal(endHtml, Buffer.byteLength(result, "utf8"));
  assert.equal(startFragment, Buffer.byteLength(result.slice(0, fragmentStart), "utf8"));
  assert.equal(endFragment, Buffer.byteLength(result.slice(0, fragmentEnd), "utf8"));
});
