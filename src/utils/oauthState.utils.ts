const STATE_SEPARATOR = ".";

export function buildOAuthState(from: string | undefined, randomBytes: (size: number) => Buffer): string {
  const random = randomBytes(16).toString("hex");
  if (!from || from === "/") return random;
  return `${random}${STATE_SEPARATOR}${Buffer.from(from).toString("base64url")}`;
}

export function parseOAuthState(state: string | undefined): string | undefined {
  if (!state) return undefined;
  const separatorIndex = state.lastIndexOf(STATE_SEPARATOR);
  if (separatorIndex === -1) return undefined;
  const encoded = state.slice(separatorIndex + 1);
  if (!encoded) return undefined;
  try {
    return Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return undefined;
  }
}
