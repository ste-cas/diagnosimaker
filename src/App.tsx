import { useState } from 'react';
import DirectorySelector from './components/DirectorySelector';
import FileList from './components/FileList';
import DataTable from './components/DataTable';
import { parseCSV, getCSVHeaders } from './utils/csvParser';
import { extractMonthFromFilename, getMonthNumber } from './utils/months';
import { MonthData } from './types';

export default function App() {
  const [loadedFiles, setLoadedFiles] = useState<MonthData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDirectorySelected = async (files: Map<string, File>) => {
    setIsLoading(true);
    setError(null);
    const results: MonthData[] = [];

    try {
      for (const [filename, file] of files) {
        const monthName = extractMonthFromFilename(filename);
        if (!monthName) {
          console.warn(`Skipping file with unexpected name: ${filename}`);
          continue;
        }

        const monthNumber = getMonthNumber(monthName)!;
        const content = await file.text();
        const headers = getCSVHeaders(content);
        const rows = parseCSV(content);

        results.push({
          monthName,
          monthNumber,
          filename,
          headers,
          rows,
        });
      }

      // Sort by month number
      results.sort((a, b) => a.monthNumber - b.monthNumber);
      setLoadedFiles(results);

      // Auto-select first month
      if (results.length > 0) {
        setSelectedMonth(results[0].monthName);
      }
    } catch (err: any) {
      setError('Error reading files: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedData = loadedFiles.find((f) => f.monthName === selectedMonth) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Data Analysis Tool
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Load and analyze monthly export data (ExportData_*.csv)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Directory Selector - always visible */}
        <DirectorySelector
          onDirectorySelected={handleDirectorySelected}
          isLoading={isLoading}
        />

        {/* Loaded files & data table - shown after loading */}
        {loadedFiles.length > 0 && (
          <>
            <FileList
              files={loadedFiles}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
            />

            <DataTable data={selectedData} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        Data Analysis Tool — Step 1: File Loading
      </footer>
    </div>
  );
}
