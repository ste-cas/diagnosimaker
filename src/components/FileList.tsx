import { MonthData } from '../types';

interface FileListProps {
  files: MonthData[];
  selectedMonth: string | null;
  onSelectMonth: (monthName: string) => void;
}

const MONTH_LABELS: Record<string, string> = {
  gennaio: 'January',
  febbraio: 'February',
  marzo: 'March',
  aprile: 'April',
  maggio: 'May',
  giugno: 'June',
  luglio: 'July',
  agosto: 'August',
  settembre: 'September',
  ottobre: 'October',
  novembre: 'November',
  dicembre: 'December',
};

export default function FileList({ files, selectedMonth, onSelectMonth }: FileListProps) {
  // Sort by month number
  const sorted = [...files].sort((a, b) => a.monthNumber - b.monthNumber);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span>📋</span> Loaded Files
        <span className="text-sm font-normal text-gray-400">({files.length} files)</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sorted.map((file) => (
          <button
            key={file.monthName}
            onClick={() => onSelectMonth(file.monthName)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMonth === file.monthName
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            <div className="font-semibold">{MONTH_LABELS[file.monthName]}</div>
            <div className={`text-xs ${selectedMonth === file.monthName ? 'text-blue-200' : 'text-gray-400'}`}>
              {file.rows.length} rows
            </div>
          </button>
        ))}
      </div>

      {/* Missing months indicator */}
      {files.length < 12 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
          ⚠️ {12 - files.length} month(s) missing. Found {files.length} of 12 expected files.
        </div>
      )}
    </div>
  );
}
