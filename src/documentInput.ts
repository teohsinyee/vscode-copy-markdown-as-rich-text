import * as vscode from "vscode";

export interface MarkdownInput {
  markdown: string;
  mode: "selection" | "document";
}

export function getMarkdownInput(editor: vscode.TextEditor): MarkdownInput {
  const selectedText = editor.document.getText(editor.selection);

  if (selectedText.trim().length > 0) {
    return {
      markdown: selectedText,
      mode: "selection"
    };
  }

  return {
    markdown: editor.document.getText(),
    mode: "document"
  };
}
