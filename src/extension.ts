import * as vscode from "vscode";
import { writeClipboard } from "./clipboardWriter";
import { getMarkdownInput } from "./documentInput";
import { renderMarkdown } from "./markdownRenderer";
import { buildOneNoteHtml } from "./oneNoteHtml";
import { buildPlainTextFromHtml } from "./plainText";
import { normalizeSemanticHtml } from "./semanticHtml";

const COPY_COMMAND = "copyMarkdownAsRichText.copy";
const MAX_DOCUMENT_BYTES = 1024 * 1024;

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand(COPY_COMMAND, async () => {
    await runCopyCommand(context);
  });

  context.subscriptions.push(command);
}

export function deactivate(): void {
  // No-op: the extension has no long-lived resources to clean up.
}

async function runCopyCommand(context: vscode.ExtensionContext): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("Open a Markdown file before copying as rich text.");
    return;
  }

  if (editor.document.languageId !== "markdown") {
    vscode.window.showErrorMessage("Copy Markdown as Rich Text is only available for Markdown files.");
    return;
  }

  const { markdown, mode } = getMarkdownInput(editor);

  if (markdown.trim().length === 0) {
    vscode.window.showWarningMessage("There is no Markdown content to copy.");
    return;
  }

  const markdownBytes = Buffer.byteLength(markdown, "utf8");
  if (markdownBytes > MAX_DOCUMENT_BYTES) {
    vscode.window.showWarningMessage("This Markdown file is larger than the 1 MB MVP target. Copy performance may be slower.");
  }

  let renderedHtml: string;
  let normalizedHtml: string;
  let plainText: string;
  let richHtml: string;

  try {
    renderedHtml = renderMarkdown(markdown);
    normalizedHtml = normalizeSemanticHtml(renderedHtml);
    plainText = buildPlainTextFromHtml(normalizedHtml);
    richHtml = buildOneNoteHtml(normalizedHtml);
  } catch (error) {
    await vscode.env.clipboard.writeText(markdown);
    const message = error instanceof Error ? error.message : "Unknown Markdown rendering error.";
    vscode.window.showErrorMessage(`Rich copy failed during Markdown rendering. Plain text was copied instead. ${message}`);
    return;
  }

  if (plainText.trim().length === 0) {
    plainText = markdown;
  }

  try {
    const result = await writeClipboard(context, richHtml, plainText);
    const suffix = mode === "selection" ? " from selection" : "";

    if (result.strategy === "plainText") {
      vscode.window.showWarningMessage(`Rich clipboard was unavailable, so plain text${suffix} was copied instead. See Output -> Copy Markdown as Rich Text for backend details.`);
      return;
    }

    vscode.window.showInformationMessage(`Copied Markdown${suffix} as rich text.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown clipboard error.";
    await vscode.env.clipboard.writeText(plainText);
    vscode.window.showErrorMessage(`Rich clipboard failed. Plain text was copied instead. ${message}`);
  }
}
