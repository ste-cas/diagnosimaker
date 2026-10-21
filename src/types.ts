export interface MonthData {
  monthName: string;    // Italian month name (e.g., "gennaio")
  monthNumber: number;  // Numeric month (1-12)
  filename: string;     // Original filename
  headers: string[];    // CSV column headers (time intervals)
  rows: Record<string, string>[]; // Parsed data rows
}

export interface ProcessedVariable {
  name: string;                    // User-defined variable name
  dates: string[];                 // Sorted unique dates
  timeColumns: string[];           // Time interval headers
  data: Record<string, number[]>;  // date -> array of numeric values (one per time column)
  createdAt: Date;
}
