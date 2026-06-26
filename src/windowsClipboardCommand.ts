interface WindowsNativePowerShellOptions {
  isWsl?: boolean;
  env?: NodeJS.ProcessEnv;
}

function toWindowsReadablePath(payloadPath: string, options: WindowsNativePowerShellOptions = {}): string {
  if (!options.isWsl || !payloadPath.startsWith("/")) {
    return payloadPath;
  }

  const distroName = options.env?.WSL_DISTRO_NAME;
  if (!distroName) {
    return payloadPath;
  }

  return `\\\\wsl$\\${distroName}${payloadPath.replace(/\//g, "\\")}`;
}

export function buildWindowsNativePowerShellArgs(
  payloadPath: string,
  options: WindowsNativePowerShellOptions = {}
): string[] {
  const windowsReadablePayloadPath = toWindowsReadablePath(payloadPath, options);
  const escapedPayloadPath = windowsReadablePayloadPath.replace(/'/g, "''");
  const script = [
    "$ErrorActionPreference = 'Stop'",
    "Add-Type -AssemblyName System.Windows.Forms",
    `$payloadPath = '${escapedPayloadPath}'`,
    "$payload = Get-Content -LiteralPath $payloadPath -Raw | ConvertFrom-Json",
    "$data = New-Object System.Windows.Forms.DataObject",
    "$data.SetData([System.Windows.Forms.DataFormats]::Html, [string]$payload.html)",
    "$data.SetData([System.Windows.Forms.DataFormats]::UnicodeText, [string]$payload.text)",
    "[System.Windows.Forms.Clipboard]::SetDataObject($data, $true)"
  ].join("\r\n");

  const encodedScript = Buffer.from(script, "utf16le").toString("base64");
  return ["-NoProfile", "-NonInteractive", "-STA", "-EncodedCommand", encodedScript];
}
