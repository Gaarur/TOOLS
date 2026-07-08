/**
 * Storage helper for saving files (e.g. generated images)
 */
export async function storagePut(
  path: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ url: string }> {
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;
  return { url: dataUrl };
}
