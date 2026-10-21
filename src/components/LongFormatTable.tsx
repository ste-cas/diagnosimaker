interface LongFormatTableProps {
  data: Array<{ date: string; timeInterval: string; value: number }> | null;
  variableName: string;
}

export default function LongFormatTable({ data, variableName }: LongFormatTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  const totalRows = data.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700">
            Variable: <span className="text-blue-600">{variableName}</span> (Long Format)
          </h3>
          <p className="text-xs text-gray-400">
            {totalRows} rows × 3 columns (date, time interval, value)
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border-b">
                Time Interval
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 border-b">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 200).map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                <td className="px-3 py-1.5 text-gray-700 border-b border-gray-100 font-medium">
                  {row.date}
                </td>
                <td className="px-3 py-1.5 text-gray-700 border-b border-gray-100">
                  {row.timeInterval}
                </td>
                <td className="px-3 py-1.5 text-gray-700 border-b border-gray-100 text-right font-mono text-xs">
                  {row.value.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {totalRows > 200 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 text-center">
          Showing first 200 of {totalRows} rows
        </div>
      )}
    </div>
  );
}
