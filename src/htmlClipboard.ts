function padOffset(value: number): string {
  return value.toString().padStart(10, "0");
}

export function buildWindowsClipboardHtml(htmlFragment: string): string {
  const normalizedFragment = htmlFragment.trim();
  const fragmentWithMarkers = `<!--StartFragment-->${normalizedFragment}<!--EndFragment-->`;
  const documentHtml = `<html><body>${fragmentWithMarkers}</body></html>`;

  const headerTemplate = [
    "Version:0.9",
    "StartHTML:0000000000",
    "EndHTML:0000000000",
    "StartFragment:0000000000",
    "EndFragment:0000000000"
  ].join("\r\n") + "\r\n";

  const startHtml = headerTemplate.length;
  const startFragment = startHtml + documentHtml.indexOf("<!--StartFragment-->") + "<!--StartFragment-->".length;
  const endFragment = startHtml + documentHtml.indexOf("<!--EndFragment-->");
  const endHtml = startHtml + documentHtml.length;

  const header = [
    "Version:0.9",
    `StartHTML:${padOffset(startHtml)}`,
    `EndHTML:${padOffset(endHtml)}`,
    `StartFragment:${padOffset(startFragment)}`,
    `EndFragment:${padOffset(endFragment)}`
  ].join("\r\n") + "\r\n";

  return `${header}${documentHtml}`;
}
