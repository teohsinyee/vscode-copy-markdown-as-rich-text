function padOffset(value: number): string {
  return value.toString().padStart(10, "0");
}

function getUtf8ByteLength(value: string): number {
  return Buffer.byteLength(value, "utf8");
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

  const startMarker = "<!--StartFragment-->";
  const endMarker = "<!--EndFragment-->";
  const startMarkerOffset = documentHtml.indexOf(startMarker) + startMarker.length;
  const endMarkerOffset = documentHtml.indexOf(endMarker);
  const startHtml = getUtf8ByteLength(headerTemplate);
  const startFragment = startHtml + getUtf8ByteLength(documentHtml.slice(0, startMarkerOffset));
  const endFragment = startHtml + getUtf8ByteLength(documentHtml.slice(0, endMarkerOffset));
  const endHtml = startHtml + getUtf8ByteLength(documentHtml);

  const header = [
    "Version:0.9",
    `StartHTML:${padOffset(startHtml)}`,
    `EndHTML:${padOffset(endHtml)}`,
    `StartFragment:${padOffset(startFragment)}`,
    `EndFragment:${padOffset(endFragment)}`
  ].join("\r\n") + "\r\n";

  return `${header}${documentHtml}`;
}
