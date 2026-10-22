/**
 * Parses a CSV string into an array of objects.
 * Handles quoted fields and different delimiters (comma, semicolon, tab).
 */
export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  // Detect delimiter: use the first line to determine
  const delimiter = detectDelimiter(lines[0]);

  const headers = parseLine(lines[0], delimiter);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line, delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

/**
 * Detects the CSV delimiter from the header line.
 */
function detectDelimiter(line: string): string {
  const delimiters = [';', ',', '\t'];
  let maxCount = 0;
  let detected = ',';

  for (const d of delimiters) {
    const count = line.split(d).length - 1;
    if (count > maxCount) {
      maxCount = count;
      detected = d;
    }
  }

  return detected;
}

/**
 * Parses a single CSV line handling quoted fields.
 */
function parseLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  
  // Remove trailing empty field if line ends with delimiter
  if (fields.length > 0 && fields[fields.length - 1] === '') {
    fields.pop();
  }
  
  return fields;
}

/**
 * Extracts headers from a CSV string.
 */
export function getCSVHeaders(content: string): string[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const delimiter = detectDelimiter(lines[0]);
  return parseLine(lines[0], delimiter);
}
