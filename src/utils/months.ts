// Italian month names mapped to their numeric order
export const ITALIAN_MONTHS: Record<string, number> = {
  gennaio: 1,
  febbraio: 2,
  marzo: 3,
  aprile: 4,
  maggio: 5,
  giugno: 6,
  luglio: 7,
  agosto: 8,
  settembre: 9,
  ottobre: 10,
  novembre: 11,
  dicembre: 12,
};

// Expected file pattern: {number}_ExportData_{month}.csv (e.g., 01_ExportData_gennaio.csv)
export const FILE_PATTERN = /^\d+_ExportData_(\w+)\.csv$/i;

/**
 * Extracts the Italian month name from a filename.
 * Returns null if the filename doesn't match the expected pattern.
 */
export function extractMonthFromFilename(filename: string): string | null {
  const match = filename.match(FILE_PATTERN);
  if (!match) return null;
  const monthName = match[1].toLowerCase();
  return ITALIAN_MONTHS[monthName] ? monthName : null;
}

/**
 * Returns the month number (1-12) from an Italian month name.
 */
export function getMonthNumber(monthName: string): number | undefined {
  return ITALIAN_MONTHS[monthName.toLowerCase()];
}
