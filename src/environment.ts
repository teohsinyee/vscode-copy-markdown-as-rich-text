export function isWslEnvironment(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    env.WSL_DISTRO_NAME ||
    env.WSL_INTEROP ||
    env.WSLENV
  );
}
