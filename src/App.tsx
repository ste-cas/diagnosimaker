import { useState } from 'react';
import DirectorySelector from './components/DirectorySelector';
import DataTable from './components/DataTable';
import VariableList from './components/VariableList';
import LongFormatTable from './components/LongFormatTable';
import { parseCSV, getCSVHeaders } from './utils/csvParser';
import { extractMonthFromFilename, getMonthNumber } from './utils/months';
import { processFilesToVariable, convertToLongFormat } from './utils/dataProcessor';
import { MonthData, ProcessedVariable } from './types';

export default function App() {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Variable creation flow
  const [variableName, setVariableName] = useState('');
  const [isCreatingVariable, setIsCreatingVariable] = useState(false);

  // Saved variables
  const [variables, setVariables] = useState<ProcessedVariable[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [showLongFormat, setShowLongFormat] = useState(false);

  // Create new variable - start the flow
  const handleCreateVariable = () => {
    const name = variableName.trim();
    if (!name) {
      alert('Please enter a variable name.');
      return;
    }
    if (variables.some((v) => v.name === name)) {
      if (!confirm(`Variable "${name}" already exists. Overwrite?`)) return;
    }
    setIsCreatingVariable(true);
    setError(null);
  };

  // Load files and process them into the variable
  const handleDirectorySelected = async (files: Map<string, File>) => {
    if (!isCreatingVariable) return;

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

      // Process and save as variable
      const processed = processFilesToVariable(variableName.trim(), results);

      // Add or replace variable
      setVariables((prev) => {
        const filtered = prev.filter((v) => v.name !== processed.name);
        return [...filtered, processed];
      });

      setSelectedVariable(processed.name);
      setIsCreatingVariable(false);
      setVariableName('');
    } catch (err: any) {
      setError('Error processing files: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a variable
  const handleDeleteVariable = (name: string) => {
    if (!confirm(`Delete variable "${name}"?`)) return;
    setVariables((prev) => prev.filter((v) => v.name !== name));
    if (selectedVariable === name) {
      setSelectedVariable(null);
      setShowLongFormat(false);
    }
  };

  // Get the currently selected variable's data
  const currentVariable = variables.find((v) => v.name === selectedVariable) || null;
  const longFormatData = currentVariable ? convertToLongFormat(currentVariable) : null;

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
            Create variables from monthly export data
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

        {/* Step 1: Create Variable */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Step 1 — Create Variable
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                  disabled={isCreatingVariable}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateVariable();
                  }}
                />
              </div>
              <button
                onClick={handleCreateVariable}
                disabled={isCreatingVariable || !variableName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
              >
                Create Variable
              </button>
            </div>
          </div>
        </section>

        {/* Step 2: Upload Files */}
        {isCreatingVariable && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Step 2 — Upload Files for "{variableName}"
            </h2>
            <DirectorySelector
              onDirectorySelected={handleDirectorySelected}
              isLoading={isLoading}
            />
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
              onSelect={(name) => {
                setSelectedVariable(name);
                setShowLongFormat(false);
              }}
              onDelete={handleDeleteVariable}
            />

            {/* Variable preview and actions */}
            {currentVariable && (
              <div className="mt-4 space-y-4">
                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLongFormat(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !showLongFormat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📊 Preview (Wide Format)
                  </button>
                  <button
                    onClick={() => setShowLongFormat(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      showLongFormat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📋 Convert to 3 Columns
                  </button>
                </div>

                {/* Data table */}
                {!showLongFormat ? (
                  <DataTable data={currentVariable} />
                ) : (
                  <LongFormatTable data={longFormatData} variableName={currentVariable.name} />
                )}
              </div>
            )}
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
