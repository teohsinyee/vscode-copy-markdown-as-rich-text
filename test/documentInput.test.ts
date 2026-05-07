import test from "node:test";
import assert from "node:assert/strict";
import { getMarkdownInput } from "../src/documentInput";

test("getMarkdownInput prefers selection when non-empty", () => {
  const editor = {
    selection: {},
    document: {
      getText: (selection?: unknown) => (selection ? "# Selected" : "# Whole")
    }
  };

  const result = getMarkdownInput(editor as never);

  assert.deepEqual(result, { markdown: "# Selected", mode: "selection" });
});

test("getMarkdownInput falls back to full document", () => {
  const editor = {
    selection: {},
    document: {
      getText: (selection?: unknown) => (selection ? "   " : "# Whole")
    }
  };

  const result = getMarkdownInput(editor as never);

  assert.deepEqual(result, { markdown: "# Whole", mode: "document" });
});
