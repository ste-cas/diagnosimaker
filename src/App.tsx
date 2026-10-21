import { useState } from 'react';
import DirectorySelector from './components/DirectorySelector';
import FileList from './components/FileList';
import DataTable from './components/DataTable';
import VariableList from './components/VariableList';
import { parseCSV, getCSVHeaders } from './utils/csvParser';
import { extractMonthFromFilename, getMonthNumber } from './utils/months';
import { processFilesToVariable } from './utils/dataProcessor';
import { MonthData, ProcessedVariable } from './types';

export default function App() {
  // Current loading state
  const [loadedFiles, setLoadedFiles] = useState<MonthData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Variable name input
  const [variableName, setVariableName] = useState('');

  // Saved variables
  const [variables, setVariables] = useState<ProcessedVariable[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);

  // Load files from directory
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

      // Auto-select first month for preview
      if (results.length > 0) {
        setSelectedMonth(results[0].monthName);
      }
    } catch (err: any) {
      setError('Error reading files: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save current loaded files as a named variable
  const handleSaveVariable = () => {
    const name = variableName.trim();
    if (!name) {
      alert('Please enter a variable name.');
      return;
    }
    if (variables.some((v) => v.name === name)) {
      if (!confirm(`Variable "${name}" already exists. Overwrite?`)) return;
    }

    const processed = processFilesToVariable(name, loadedFiles);

    // Add or replace variable
    setVariables((prev) => {
      const filtered = prev.filter((v) => v.name !== name);
      return [...filtered, processed];
    });

    setSelectedVariable(name);
    setVariableName('');
  };

  // Delete a variable
  const handleDeleteVariable = (name: string) => {
    if (!confirm(`Delete variable "${name}"?`)) return;
    setVariables((prev) => prev.filter((v) => v.name !== name));
    if (selectedVariable === name) {
      setSelectedVariable(null);
    }
  };

  // Get the currently selected variable's data
  const currentVariable = variables.find((v) => v.name === selectedVariable) || null;

  // Get preview data for the selected month (raw, unprocessed)
  const previewData = selectedMonth
    ? loadedFiles.find((f) => f.monthName === selectedMonth)
    : null;

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
            Load monthly export data, process and save as named variables
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

        {/* Step 1: Directory Selection */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Step 1 — Load Files
          </h2>
          <DirectorySelector
            onDirectorySelected={handleDirectorySelected}
            isLoading={isLoading}
          />
        </section>

        {/* Step 2: Preview loaded files */}
        {loadedFiles.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Step 2 — Preview & Save
            </h2>

            <FileList
              files={loadedFiles}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
            />

            {/* Save as Variable */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variable Name
                  </label>
                  <input
                    type="text"
                    value={variableName}
                    onChange={(e) => setVariableName(e.target.value)}
                    placeholder="e.g., energy_consumption_2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveVariable();
                    }}
                  />
                </div>
                <button
                  onClick={handleSaveVariable}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  💾 Save as Variable
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Stacks all {loadedFiles.length} monthly files chronologically and merges duplicate dates (sum).
              </p>
            </div>

            {/* Raw data preview for selected month */}
            {previewData && (
              <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700 text-sm">
                    📄 Raw Preview: {previewData.filename}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {previewData.rows.length} rows × {previewData.headers.length} columns
                  </p>
                </div>
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        {previewData.headers.slice(0, 10).map((h, i) => (
                          <th key={i} className="px-2 py-1.5 text-left font-semibold text-gray-600 border-b whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                        {previewData.headers.length > 10 && (
                          <th className="px-2 py-1.5 text-gray-400 border-b">
                            +{previewData.headers.length - 10} cols
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.slice(0, 20).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-blue-50">
                          {previewData.headers.slice(0, 10).map((h, cIdx) => (
                            <td key={cIdx} className="px-2 py-1 text-gray-700 border-b border-gray-100 whitespace-nowrap">
                              {row[h] || '-'}
                            </td>
                          ))}
                          {previewData.headers.length > 10 && (
                            <td className="px-2 py-1 text-gray-400 border-b border-gray-100">...</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Step 3: Saved Variables */}
        {variables.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Step 3 — Variables
            </h2>

            <VariableList
              variables={variables}
              selectedVariable={selectedVariable}
              onSelect={setSelectedVariable}
              onDelete={handleDeleteVariable}
            />

            {/* Data table for selected variable */}
            <div className="mt-4">
              <DataTable data={currentVariable} />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        Data Analysis Tool — {variables.length} variable{variables.length !== 1 ? 's' : ''} saved
      </footer>
    </div>
  );
}
