export function encodeId(id: number): string {
  return Buffer.from(String(id)).toString("base64url");
}

export function decodeId(encoded: string): number | null {
  try {
    return parseInt(Buffer.from(encoded, "base64url").toString("utf-8"));
  } catch (e) {
    return null;
  }
}
