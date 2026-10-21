import { MonthData, ProcessedVariable } from '../types';

/**
 * Processes monthly CSV files into a single stacked matrix.
 * - Stacks all rows chronologically by date
 * - Merges duplicate dates by summing their numeric values
 */
export function processFilesToVariable(
  name: string,
  files: MonthData[]
): ProcessedVariable {
  // Sort files by month number to ensure chronological loading
  const sorted = [...files].sort((a, b) => a.monthNumber - b.monthNumber);

  // Determine time columns from the first file's headers (excluding the date column)
  const firstFile = sorted[0];
  const timeColumns = firstFile.headers.slice(1); // Rest are time intervals

  // Collect all rows with their date as key
  const dateMap = new Map<string, number[]>();

  for (const file of sorted) {
    const fileDateCol = file.headers[0];
    const fileTimeCols = file.headers.slice(1);

    for (const row of file.rows) {
      const dateStr = row[fileDateCol]?.trim();
      if (!dateStr) continue;

      // Parse numeric values for each time column
      const values: number[] = [];
      for (const tc of fileTimeCols) {
        const raw = row[tc]?.trim().replace(',', '.'); // Handle European decimal
        const num = parseFloat(raw);
        values.push(isNaN(num) ? 0 : num);
      }

      if (dateMap.has(dateStr)) {
        // Merge: sum values
        const existing = dateMap.get(dateStr)!;
        const merged = existing.map((v, i) => v + (values[i] || 0));
        dateMap.set(dateStr, merged);
      } else {
        dateMap.set(dateStr, values);
      }
    }
  }

  // Sort dates chronologically
  const sortedDates = Array.from(dateMap.keys()).sort((a, b) => {
    return parseDate(a).getTime() - parseDate(b).getTime();
  });

  // Build final data object
  const data: Record<string, number[]> = {};
  for (const date of sortedDates) {
    data[date] = dateMap.get(date)!;
  }

  return {
    name,
    dates: sortedDates,
    timeColumns,
    data,
    createdAt: new Date(),
  };
}

/**
 * Parses a date string (DD/MM/YYYY or similar) into a Date object.
 */
function parseDate(dateStr: string): Date {
  // Try DD/MM/YYYY format (Italian/European)
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    if (day <= 31 && month <= 12) {
      return new Date(year, month - 1, day);
    }
  }
  // Fallback to standard parsing
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

/**
 * Converts a ProcessedVariable from wide format to long format (3 columns).
 * Returns an array of {date, timeInterval, value} objects.
 */
export function convertToLongFormat(variable: ProcessedVariable): Array<{
  date: string;
  timeInterval: string;
  value: number;
}> {
  const result: Array<{ date: string; timeInterval: string; value: number }> = [];

  for (const date of variable.dates) {
    const values = variable.data[date];
    for (let i = 0; i < variable.timeColumns.length; i++) {
      result.push({
        date,
        timeInterval: variable.timeColumns[i],
        value: values[i],
      });
    }
  }

  return result;
}

/**
 * Combines multiple variables using addition/subtraction operations.
 */
export function combineVariables(
  name: string,
  variables: ProcessedVariable[],
  operations: Array<{ variable: string; sign: '+' | '-' }>
): ProcessedVariable {
  // Use first variable as reference for dates and time columns
  const refVar = variables.find((v) => v.name === operations[0].variable);
  if (!refVar) throw new Error('Reference variable not found');

  const data: Record<string, number[]> = {};
  const varMap = new Map(variables.map((v) => [v.name, v]));

  for (const date of refVar.dates) {
    const numCols = refVar.timeColumns.length;
    const result = new Array(numCols).fill(0);

    for (const op of operations) {
      const v = varMap.get(op.variable);
      if (v && v.data[date]) {
        const values = v.data[date];
        for (let i = 0; i < numCols; i++) {
          if (op.sign === '+') {
            result[i] += values[i] || 0;
          } else {
            result[i] -= values[i] || 0;
          }
        }
      }
    }

    data[date] = result;
  }

  return {
    name,
    dates: refVar.dates,
    timeColumns: refVar.timeColumns,
    data,
    createdAt: new Date(),
  };
}
