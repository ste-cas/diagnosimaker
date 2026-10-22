import { useState } from 'react';
import * as XLSX from 'xlsx';
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
    for (let timeIndex = 0; timeIndex < timeColumns.length; timeIndex++) {
      const timeInterval = timeColumns[timeIndex];
      const values: Record<string, number> = {};
      
      for (const v of variables) {
        // Get the time index for this variable's time columns
        const vTimeIndex = v.timeColumns.indexOf(timeInterval);
        
        // Get the value if it exists
        if (v.data[date] && vTimeIndex >= 0 && vTimeIndex < v.data[date].length) {
          values[v.name] = v.data[date][vTimeIndex];
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

  // Export to Excel function
  const handleExportToExcel = () => {
    // Prepare data for Excel
    const excelData = allRows.map((row) => {
      const rowData: Record<string, any> = {
        'Date': row.date,
        'Hour': row.timeInterval.split('-')[0],
        'Day of Week': `${row.dayOfWeek} (${dayNames[row.dayOfWeek]})`,
        'FASCIA': row.fascia,
        'PK/OP': row.pkOp,
      };
      
      // Add variable values
      for (const v of variables) {
        rowData[v.name] = row.values[v.name] || 0;
      }
      
      return rowData;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Table');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `MasterTable_${timestamp}.xlsx`;
    
    // Export
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700">Master Table</h3>
          <p className="text-xs text-gray-400">
            {allRows.length} rows × {5 + variables.length} columns
          </p>
        </div>
        <button
          onClick={handleExportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm text-sm flex items-center gap-2"
        >
          📥 Export to Excel
        </button>
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
