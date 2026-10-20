import { useState } from 'react';

interface DirectorySelectorProps {
  onDirectorySelected: (files: Map<string, File>) => void;
  isLoading: boolean;
}

export default function DirectorySelector({ onDirectorySelected, isLoading }: DirectorySelectorProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDirectoryPicker = async () => {
    try {
      // Use File System Access API (Chrome/Edge)
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        const files = new Map<string, File>();

        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            if (file.name.toLowerCase().startsWith('exportdata_') && file.name.toLowerCase().endsWith('.csv')) {
              files.set(file.name, file);
            }
          }
        }

        if (files.size === 0) {
          alert('No ExportData_*.csv files found in the selected directory.');
          return;
        }

        onDirectorySelected(files);
      } else {
        alert('Your browser does not support directory selection. Please use Chrome or Edge.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error selecting directory:', err);
        alert('Error selecting directory: ' + err.message);
      }
    }
  };

  const handleFallbackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const files = new Map<string, File>();
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.name.toLowerCase().startsWith('exportdata_') && file.name.toLowerCase().endsWith('.csv')) {
        files.set(file.name, file);
      }
    }

    if (files.size === 0) {
      alert('No ExportData_*.csv files found in the selected files.');
      return;
    }

    onDirectorySelected(files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
    >
      <div className="text-5xl mb-4">📂</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Select Data Directory
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Choose the folder containing your <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">ExportData_*.csv</code> files
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {/* Primary: Directory Picker */}
        <button
          onClick={handleDirectoryPicker}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLoading ? '⏳ Loading...' : '📁 Select Directory'}
        </button>

        {/* Fallback: File Input (multiple) */}
        <label className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 cursor-pointer transition-colors shadow-sm inline-block">
          📄 Select Files
          <input
            type="file"
            multiple
            accept=".csv"
            className="hidden"
            onChange={handleFallbackInput}
            disabled={isLoading}
          />
        </label>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Expected: 12 files named ExportData_gennaio.csv through ExportData_dicembre.csv
      </p>
    </div>
  );
}
