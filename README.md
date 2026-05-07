# Copy Markdown to Rich Text

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

## Supported Markdown

- H1 / H2 / H3
- Paragraphs
- Bold / italic
- Inline code
- Fenced code blocks
- Tables
- Bullet lists
- Numbered lists
- Links

## Known limitations

- Images are not supported in v1.
- Mermaid is not supported in v1.
- Footnotes are not supported in v1.
- Rich clipboard behavior still depends on the clipboard and paste behavior of the target editor.
- OneNote Desktop is the primary validation target today.

## Privacy

- Local-only processing
- No remote fetches
- No telemetry
- No external script execution beyond the internal clipboard bridge
