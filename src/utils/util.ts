export function cleanUpFilename(filename: string): string {
  return filename.normalize("NFC").replace(/\u00AD/g, "");
}
