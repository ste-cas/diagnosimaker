import { ProcessedVariable } from '../types';

interface DataTableProps {
  data: ProcessedVariable | null;
}

export default function DataTable({ data }: DataTableProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
        <div className="text-4xl mb-2">👈</div>
        <p>Select a variable to view its data</p>
      </div>
    );
  }

  const { name, dates, timeColumns, data: matrixData } = data;
  const totalRows = dates.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700">
            Variable: <span className="text-blue-600">{name}</span>
          </h3>
          <p className="text-xs text-gray-400">
            {totalRows} dates × {timeColumns.length} time columns
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b sticky left-0 bg-gray-100">
                Date
              </th>
              {timeColumns.slice(0, 20).map((time, i) => (
                <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b whitespace-nowrap">
                  {time}
                </th>
              ))}
              {timeColumns.length > 20 && (
                <th className="px-3 py-2 text-xs text-gray-400 border-b">
                  +{timeColumns.length - 20} more
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dates.slice(0, 100).map((date, rowIdx) => {
              const values = matrixData[date];
              return (
                <tr key={rowIdx} className="hover:bg-blue-50 transition-colors">
                  <td className="px-3 py-1.5 text-gray-700 border-b border-gray-100 font-medium sticky left-0 bg-white">
                    {date}
                  </td>
                  {values.slice(0, 20).map((val, colIdx) => (
                    <td key={colIdx} className="px-3 py-1.5 text-gray-700 border-b border-gray-100 whitespace-nowrap text-right font-mono text-xs">
                      {val.toFixed(2)}
                    </td>
                  ))}
                  {values.length > 20 && (
                    <td className="px-3 py-1.5 text-gray-400 border-b border-gray-100 text-xs text-center">
                      ...
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {totalRows > 100 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 text-center">
          Showing first 100 of {totalRows} dates
        </div>
      )}
    </div>
  );
}
