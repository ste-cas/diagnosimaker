import { useState } from 'react';
import DirectorySelector from './components/DirectorySelector';
import DataTable from './components/DataTable';
import VariableList from './components/VariableList';
import LongFormatTable from './components/LongFormatTable';
import TabNavigation from './components/TabNavigation';
import DataVisualization from './components/DataVisualization';
import VariableCombination from './components/VariableCombination';
import MasterTable from './components/MasterTable';
import { parseCSV, getCSVHeaders } from './utils/csvParser';
import { extractMonthFromFilename, getMonthNumber } from './utils/months';
import { processFilesToVariable, convertToLongFormat, combineVariables } from './utils/dataProcessor';
import { MonthData, ProcessedVariable } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('import');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variableName, setVariableName] = useState('');
  const [isCreatingVariable, setIsCreatingVariable] = useState(false);
  const [variables, setVariables] = useState<ProcessedVariable[]>([]);

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

      setIsCreatingVariable(false);
      setVariableName('');
      setActiveTab('visualization');
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
  };

  // Combine variables
  const handleCombine = (name: string, operations: Array<{ variable: string; sign: '+' | '-' }>) => {
    try {
      const combined = combineVariables(name, variables, operations);
      setVariables((prev) => [...prev, combined]);
      setActiveTab('visualization');
    } catch (err: any) {
      setError('Error combining variables: ' + err.message);
    }
  };

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
            Create, visualize, and combine variables from monthly export data
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

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            {/* Create Variable */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Create New Variable</h2>
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

            {/* Upload Files */}
            {isCreatingVariable && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Upload Files for "{variableName}"
                </h2>
                <DirectorySelector
                  onDirectorySelected={handleDirectorySelected}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Variable List */}
            {variables.length > 0 && (
              <VariableList
                variables={variables}
                selectedVariable={null}
                onSelect={() => {}}
                onDelete={handleDeleteVariable}
              />
            )}
          </div>
        )}

        {activeTab === 'visualization' && (
          <DataVisualization variables={variables} />
        )}

        {activeTab === 'combination' && (
          <VariableCombination variables={variables} onCombine={handleCombine} />
        )}

        {activeTab === 'table' && (
          <MasterTable variables={variables} />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        Data Analysis Tool — {variables.length} variable{variables.length !== 1 ? 's' : ''} saved
      </footer>
    </div>
  );
}
