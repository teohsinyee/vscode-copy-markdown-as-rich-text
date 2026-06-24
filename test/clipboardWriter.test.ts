import test from "node:test";
import assert from "node:assert/strict";
import { isWslEnvironment } from "../src/environment";
import { buildWindowsNativePowerShellArgs } from "../src/windowsClipboardCommand";

test("buildWindowsNativePowerShellArgs uses encoded command instead of script file execution", () => {
  const payloadPath = "C:\\temp\\clipboard-payload.json";
  const args = buildWindowsNativePowerShellArgs(payloadPath);

  assert.deepEqual(args.slice(0, 4), ["-NoProfile", "-NonInteractive", "-STA", "-EncodedCommand"]);
  assert.equal(args.length, 5);
  assert.ok(!args.includes("-File"));

  const encodedCommand = args[4];
  const decodedCommand = Buffer.from(encodedCommand, "base64").toString("utf16le");

  assert.match(decodedCommand, /ConvertFrom-Json/);
  assert.match(decodedCommand, /System\.Windows\.Forms\.Clipboard/);
  assert.match(decodedCommand, /clipboard-payload\.json/);
});

test("isWslEnvironment detects WSL-specific environments", () => {
  assert.equal(isWslEnvironment({ WSL_DISTRO_NAME: "Ubuntu" }), true);
  assert.equal(isWslEnvironment({ WSL_INTEROP: "/run/WSL/9-intercepting" }), true);
  assert.equal(isWslEnvironment({ WSLENV: "WT_SESSION:foo" }), true);
  assert.equal(isWslEnvironment({}), false);
});
