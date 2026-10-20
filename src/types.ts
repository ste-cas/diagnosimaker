export interface MonthData {
  monthName: string;    // Italian month name (e.g., "gennaio")
  monthNumber: number;  // Numeric month (1-12)
  filename: string;     // Original filename
  headers: string[];    // CSV column headers
  rows: Record<string, string>[]; // Parsed data rows
}

export interface AppState {
  loadedFiles: MonthData[];
  selectedMonth: string | null;
  isLoading: boolean;
  error: string | null;
}
