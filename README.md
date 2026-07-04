# Copy Markdown to Rich Text

[![VS Code Marketplace Installs](https://badgen.net/vs-marketplace/i/teohsinyee.copy-markdown-to-rich-text?label=marketplace%20installs)](https://marketplace.visualstudio.com/items?itemName=teohsinyee.copy-markdown-to-rich-text)
[![VS Code Marketplace Rating](https://badgen.net/vs-marketplace/rating/teohsinyee.copy-markdown-to-rich-text?label=marketplace%20rating)](https://marketplace.visualstudio.com/items?itemName=teohsinyee.copy-markdown-to-rich-text)
[![GitHub Release](https://badgen.net/github/release/teohsinyee/vscode-copy-markdown-as-rich-text)](https://github.com/teohsinyee/vscode-copy-markdown-as-rich-text/releases/latest)
[![Open Issues](https://badgen.net/github/open-issues/teohsinyee/vscode-copy-markdown-as-rich-text)](https://github.com/teohsinyee/vscode-copy-markdown-as-rich-text/issues)
[![License](https://badgen.net/github/license/teohsinyee/vscode-copy-markdown-as-rich-text)](https://github.com/teohsinyee/vscode-copy-markdown-as-rich-text/blob/main/LICENSE)

Open a Markdown file in VS Code, then click the star button in the top-right editor toolbar to copy it as rich text.

![Copy Markdown to Rich Text demo](https://raw.githubusercontent.com/teohsinyee/vscode-copy-markdown-as-rich-text/main/media/copy-markdown-to-rich-text-demo.gif)

## Features

- Copies the current Markdown selection, or the full file if nothing is selected
- Writes rich HTML plus plain text to the clipboard
- Falls back to readable plain text when rich clipboard is unavailable
- Adds a command, editor toolbar button, and right-click menu for Markdown files
- Runs locally only with no telemetry, no login, and no backend
- Best tested with OneNote Desktop, and designed to work well with Word, Outlook, and similar editors

## Installation

Install `Copy Markdown to Rich Text` from the VS Code Marketplace, then run it from any Markdown file.

## Usage

1. Open a Markdown file in VS Code.
2. Click the star button in the top-right editor toolbar.
3. Select a portion of text first if you only want to copy part of the file. If nothing is selected, the whole file is copied.
4. You can also run `Copy Markdown to Rich Text` from:
   - the Command Palette,
   - the editor title toolbar,
   - the editor context menu.
5. Paste into your target editor.

## Capabilities

| Area | Status | Notes |
| --- | --- | --- |
| H1 / H2 / H3, paragraphs | Supported | Copied as rich HTML plus plain text. |
| Bold, italic, inline code | Supported | Preserves common inline formatting. |
| Fenced code blocks | Supported | Preserves multiline code block structure. |
| Tables | Supported | Keeps semantic table markup for rich paste targets. |
| Bullet and numbered lists | Supported | Paste indentation may vary by target editor. |
| Links | Supported | Keeps link text and href. |
| Images | Not supported yet | Copied as text fallback content only. |
| Mermaid | Not supported yet | Copied as fenced code text. |
| Footnotes | Not supported yet | Markdown renderer output may paste as plain text structure. |

## Platform notes

| Environment | Clipboard path | Notes |
| --- | --- | --- |
| Windows | Native Windows clipboard bridge | Primary supported path for rich HTML paste. |
| WSL | Native Windows clipboard bridge through WSL path conversion | Supported when Windows PowerShell is reachable from WSL. |
| Other VS Code desktop environments | Electron or webview clipboard, then plain text fallback | Rich clipboard behavior depends on the host and paste target. |

OneNote Desktop is the primary validation target today. Word, Outlook, and similar editors are expected to work, but paste behavior can vary by target editor.

## Privacy

- Local-only processing
- No remote fetches
- No telemetry
- No external script execution beyond the local clipboard bridge
