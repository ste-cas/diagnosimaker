import { MonthData } from '../types';

interface DataTableProps {
  data: MonthData | null;
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

export default function DataTable({ data }: DataTableProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
        <div className="text-4xl mb-2">👈</div>
        <p>Select a month to view its data</p>
      </div>
    );
  }

  const { headers, rows, monthName, filename } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700">
            {MONTH_LABELS[monthName]} ({monthName})
          </h3>
          <p className="text-xs text-gray-400">{filename} • {rows.length} rows × {headers.length} columns</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">#</th>
              {headers.map((header, i) => (
                <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 200).map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100">{rowIdx + 1}</td>
                {headers.map((header, colIdx) => (
                  <td key={colIdx} className="px-3 py-1.5 text-gray-700 border-b border-gray-100 whitespace-nowrap max-w-[200px] truncate">
                    {row[header] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {rows.length > 200 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 text-center">
          Showing first 200 of {rows.length} rows
        </div>
      )}
    </div>
  );
}
