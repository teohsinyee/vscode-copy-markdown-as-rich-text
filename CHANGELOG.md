# Changelog

## 0.1.6

- Bumped the extension package version to `0.1.6`.

## 0.1.5

- Fixed truncation in rich-text clipboard payloads by generating correct UTF-8 byte offsets for Windows `CF_HTML`.
- Fixed heading text so ampersands paste as `&` instead of HTML entities like `&amp;`.
- Fixed comparison operators so content such as `<=6` and `>6` pastes as intended instead of escaped entity text.
- Fixed code blocks so multi-line structure and tree-style formatting are preserved during rich-text normalization.
- Improved ordered-list paste formatting for OneNote-targeted output. The result is more acceptable for this release, though list indentation may still vary by paste target.

## 0.1.4

- Fixed the `0.1.3` Windows clipboard regression where `powershell.exe -EncodedCommand` was given an extra payload argument and failed before writing rich text.
- Repackaged the extension with the current README badges so the VSIX no longer carries the retired Marketplace badge markup.

## 0.1.3

- Fixed the Windows native clipboard path to avoid executing a temporary `.ps1` file.
- Reduced rich-copy failures on machines where PowerShell script execution is blocked by `ExecutionPolicy` or enterprise policy.
- Added a test that locks the Windows clipboard command to `-EncodedCommand` instead of `-File`.

## 0.1.2

- Standardized the public extension name to `Copy Markdown to Rich Text`.
- Rewrote the Marketplace intro so the first instruction is to open a Markdown file and click the star button.
- Added an animated GIF demo to the README and Marketplace listing content.

## 0.1.1

- Standardized public branding, command id, and repository metadata for release preparation.
- Simplified Marketplace-facing installation guidance for end users.

## 0.1.0

- Initial MVP for copying Markdown as rich text into OneNote, Word, Outlook, and similar editors.
- Added staged Markdown rendering, semantic normalization, OneNote inline styling, and HTML-to-text fallback.
- Added clipboard strategy order: Electron-backed if available, then webview rich copy, then plain text.
- Refreshed extension branding for Marketplace-facing generic rich-text copy positioning.
