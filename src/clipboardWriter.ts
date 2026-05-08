import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { buildWindowsClipboardHtml } from "./htmlClipboard";
import { buildWindowsNativePowerShellArgs } from "./windowsClipboardCommand";

const execFileAsync = promisify(execFile);

type ClipboardStrategy = "windowsNative" | "electron" | "webview" | "plainText";

interface ClipboardWriteResult {
  strategy: ClipboardStrategy;
}

interface ElectronClipboardModule {
  clipboard?: {
    write?: (data: { html?: string; text?: string }) => void;
  };
}

const outputChannel = vscode.window.createOutputChannel("Copy Markdown as Rich Text");

function logClipboard(message: string): void {
  outputChannel.appendLine(`[clipboard] ${message}`);
}

async function tryWriteWithWindowsNative(html: string, text: string): Promise<ClipboardWriteResult | undefined> {
  if (process.platform !== "win32") {
    return undefined;
  }

  const clipboardHtml = buildWindowsClipboardHtml(html);
  const tempDir = await mkdtemp(join(tmpdir(), "copy-markdown-as-rich-text-"));
  const payloadPath = join(tempDir, "clipboard-payload.json");

  try {
    await writeFile(payloadPath, JSON.stringify({ html: clipboardHtml, text }), "utf8");

    await execFileAsync("powershell.exe", buildWindowsNativePowerShellArgs(payloadPath), {
      windowsHide: true,
      maxBuffer: 1024 * 1024
    });
    logClipboard("Windows native clipboard write succeeded.");
    return { strategy: "windowsNative" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logClipboard(`Windows native clipboard write failed: ${message}`);
    return undefined;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function getNodeRequire(): NodeJS.Require | undefined {
  try {
    return eval("require") as NodeJS.Require;
  } catch {
    return undefined;
  }
}

function tryWriteWithElectron(html: string, text: string): ClipboardWriteResult | undefined {
  const localRequire = getNodeRequire();
  if (!localRequire) {
    logClipboard("Electron clipboard path unavailable: require is not accessible.");
    return undefined;
  }

  try {
    const electron = localRequire("electron") as ElectronClipboardModule;
    electron.clipboard?.write?.({ html, text });
    if (electron.clipboard?.write) {
      logClipboard("Electron clipboard write succeeded.");
      return { strategy: "electron" };
    }

    logClipboard("Electron clipboard path unavailable: clipboard.write missing.");
    return undefined;
  } catch {
    logClipboard("Electron clipboard write failed.");
    return undefined;
  }
}

async function writeWithWebview(context: vscode.ExtensionContext, html: string, text: string): Promise<ClipboardWriteResult> {
  return new Promise<ClipboardWriteResult>((resolve, reject) => {
    let settled = false;
    let disposed = false;
    const panel = vscode.window.createWebviewPanel(
      "copyMarkdownAsRichTextClipboard",
      "Copy Markdown as Rich Text Clipboard",
      {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true
      },
      {
        enableScripts: true
      }
    );

    const cleanup = () => {
      messageSubscription.dispose();
      disposeSubscription.dispose();
      if (!disposed) {
        disposed = true;
        panel.dispose();
      }
    };

    const timeout = setTimeout(() => {
      settled = true;
      cleanup();
      reject(new Error("Clipboard webview timed out."));
    }, 5000);

    const messageSubscription = panel.webview.onDidReceiveMessage((message) => {
      if (message?.type === "success") {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        resolve({ strategy: "webview" });
      }

      if (message?.type === "error") {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        reject(new Error(typeof message.error === "string" ? message.error : "Clipboard write failed."));
      }
    });

    const disposeSubscription = panel.onDidDispose(() => {
      disposed = true;
      clearTimeout(timeout);
      if (!settled) {
        settled = true;
        reject(new Error("Clipboard webview was closed before the copy completed."));
      }
    });

    const nonce = String(Date.now());
    const htmlPayload = JSON.stringify(html);
    const textPayload = JSON.stringify(text);

    panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Copy Markdown as Rich Text Clipboard</title>
  <style>
    body { font-family: sans-serif; padding: 12px; color: #666; }
  </style>
</head>
<body>
  Preparing clipboard...
  <script nonce="${nonce}">
    const vscodeApi = acquireVsCodeApi();
    const html = ${htmlPayload};
    const text = ${textPayload};

    async function run() {
      try {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" })
        });

        await navigator.clipboard.write([item]);
        vscodeApi.postMessage({ type: "success" });
      } catch (error) {
        vscodeApi.postMessage({
          type: "error",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    run();
  </script>
</body>
</html>`;
  });
}

export async function writeClipboard(
  context: vscode.ExtensionContext,
  html: string,
  text: string
): Promise<ClipboardWriteResult> {
  const windowsNativeResult = await tryWriteWithWindowsNative(html, text);
  if (windowsNativeResult) {
    return windowsNativeResult;
  }

  const electronResult = tryWriteWithElectron(html, text);
  if (electronResult) {
    return electronResult;
  }

  try {
    const result = await writeWithWebview(context, html, text);
    logClipboard("Webview clipboard write succeeded.");
    return result;
  } catch {
    logClipboard("Webview clipboard write failed. Falling back to plain text.");
    await vscode.env.clipboard.writeText(text);
    logClipboard("Plain text clipboard write succeeded.");
    return { strategy: "plainText" };
  }
}
