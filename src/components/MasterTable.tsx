import { useState } from 'react';
import { ProcessedVariable } from '../types';
import { parseDate, getDayOfWeek, getFascia, getPkOp } from '../utils/timeUtils';

interface MasterTableProps {
  variables: ProcessedVariable[];
}

export default function MasterTable({ variables }: MasterTableProps) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 100;

  if (variables.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
        <div className="text-4xl mb-2">📋</div>
        <p>No variables available. Import files first to create variables.</p>
      </div>
    );
  }

  // Collect all unique dates across all variables
  const allDates = Array.from(
    new Set(variables.flatMap((v) => v.dates))
  ).sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime());

  // Use time columns from first variable (assuming all have same structure)
  const timeColumns = variables[0]?.timeColumns || [];

  // Generate all rows (date × time interval)
  const allRows: Array<{
    date: string;
    timeInterval: string;
    dayOfWeek: number;
    fascia: string;
    pkOp: string;
    values: Record<string, number>;
  }> = [];

  for (const date of allDates) {
    const dateObj = parseDate(date);
    for (const timeInterval of timeColumns) {
      const values: Record<string, number> = {};
      for (const v of variables) {
        if (v.data[date]) {
          const timeIndex = v.timeColumns.indexOf(timeInterval);
          values[v.name] = timeIndex >= 0 ? v.data[date][timeIndex] : 0;
        } else {
          values[v.name] = 0;
        }
      }

      allRows.push({
        date,
        timeInterval,
        dayOfWeek: getDayOfWeek(dateObj),
        fascia: getFascia(dateObj, timeInterval),
        pkOp: getPkOp(dateObj, timeInterval),
        values,
      });
    }
  }

  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const displayedRows = allRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700">Master Table</h3>
        <p className="text-xs text-gray-400">
          {allRows.length} rows × {5 + variables.length} columns
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 border-b whitespace-nowrap sticky left-0 bg-gray-100 z-10">
                Date
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 border-b whitespace-nowrap">
                Hour
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600 border-b whitespace-nowrap">
                Day of Week
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600 border-b whitespace-nowrap">
                FASCIA
              </th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600 border-b whitespace-nowrap">
                PK/OP
              </th>
              {variables.map((v) => (
                <th key={v.name} className="px-2 py-2 text-right font-semibold text-gray-600 border-b whitespace-nowrap">
                  {v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                <td className="px-2 py-1 text-gray-700 border-b border-gray-100 font-medium sticky left-0 bg-white whitespace-nowrap z-0">
                  {row.date}
                </td>
                <td className="px-2 py-1 text-gray-700 border-b border-gray-100 whitespace-nowrap">
                  {row.timeInterval.split('-')[0]}
                </td>
                <td className="px-2 py-1 text-gray-700 border-b border-gray-100 text-center">
                  {row.dayOfWeek} ({dayNames[row.dayOfWeek]})
                </td>
                <td className="px-2 py-1 text-center border-b border-gray-100">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    row.fascia === 'F1' ? 'bg-red-100 text-red-700' :
                    row.fascia === 'F2' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {row.fascia}
                  </span>
                </td>
                <td className="px-2 py-1 text-center border-b border-gray-100">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    row.pkOp === 'PK' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {row.pkOp}
                  </span>
                </td>
                {variables.map((v) => (
                  <td key={v.name} className="px-2 py-1 text-gray-700 border-b border-gray-100 text-right font-mono">
                    {row.values[v.name]?.toFixed(3) || '0.000'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Page {page + 1} of {totalPages} ({allRows.length} total rows)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
