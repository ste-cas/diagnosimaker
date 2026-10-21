import { useState } from 'react';
import { ProcessedVariable } from '../types';
import { convertToLongFormat } from '../utils/dataProcessor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataVisualizationProps {
  variables: ProcessedVariable[];
}

export default function DataVisualization({ variables }: DataVisualizationProps) {
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'long'>('matrix');

  const currentVariable = variables.find((v) => v.name === selectedVariable);
  const longFormatData = currentVariable ? convertToLongFormat(currentVariable) : null;

  if (variables.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
        <div className="text-4xl mb-2">📊</div>
        <p>No variables available. Import files first to create variables.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Variable selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Variable</label>
        <select
          value={selectedVariable || ''}
          onChange={(e) => {
            setSelectedVariable(e.target.value);
            setViewMode('matrix');
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a variable --</option>
          {variables.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.dates.length} dates × {v.timeColumns.length} intervals)
            </option>
          ))}
        </select>
      </div>

      {currentVariable && (
        <>
          {/* View mode selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'matrix'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗺️ Heatmap (Matrix)
              </button>
              <button
                onClick={() => setViewMode('long')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'long'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📈 Line Plot (3-Column)
              </button>
            </div>
          </div>

          {/* Visualization */}
          {viewMode === 'matrix' ? (
            <HeatmapView variable={currentVariable} />
          ) : (
            <LinePlotView data={longFormatData} variableName={currentVariable.name} />
          )}
        </>
      )}
    </div>
  );
}

// Heatmap component
function HeatmapView({ variable }: { variable: ProcessedVariable }) {
  const maxVal = Math.max(...variable.dates.flatMap((d) => variable.data[d]));
  const minVal = Math.min(...variable.dates.flatMap((d) => variable.data[d]));

  // Show subset of dates and time columns for performance
  const displayDates = variable.dates.slice(0, 30);
  const displayTimeCols = variable.timeColumns.filter((_, i) => i % 4 === 0); // Every 4th column (hourly)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-700 mb-3">Heatmap: {variable.name}</h3>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left text-gray-600 sticky left-0 bg-white">Date</th>
              {displayTimeCols.map((time, i) => (
                <th key={i} className="px-1 py-1 text-center text-gray-600 whitespace-nowrap">
                  {time.split('-')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayDates.map((date, rowIdx) => (
              <tr key={rowIdx}>
                <td className="px-2 py-1 text-gray-700 font-medium sticky left-0 bg-white whitespace-nowrap">
                  {date}
                </td>
                {displayTimeCols.map((time, colIdx) => {
                  const timeIndex = variable.timeColumns.indexOf(time);
                  const value = variable.data[date][timeIndex];
                  const normalized = maxVal > minVal ? (value - minVal) / (maxVal - minVal) : 0;
                  const color = `rgb(${Math.round(255 * (1 - normalized))}, ${Math.round(255 * normalized)}, 100)`;

                  return (
                    <td
                      key={colIdx}
                      className="px-1 py-1 text-center"
                      style={{ backgroundColor: color }}
                      title={`${date} ${time}: ${value.toFixed(3)}`}
                    >
                      {value > 0 ? value.toFixed(2) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {variable.dates.length > 30 && (
        <p className="text-xs text-gray-400 mt-2">Showing first 30 dates and hourly intervals</p>
      )}
    </div>
  );
}

// Line plot component
function LinePlotView({ data, variableName }: { data: any; variableName: string }) {
  if (!data || data.length === 0) return null;

  // Sample data for performance (every 10th point)
  const sampledData = data.filter((_: any, i: number) => i % 10 === 0).map((d: any) => ({
    timestamp: `${d.date} ${d.timeInterval.split('-')[0]}`,
    value: d.value,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-700 mb-3">Line Plot: {variableName}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={sampledData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" angle={-45} textAnchor="end" height={100} fontSize={10} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-2">Sampled every 10th data point for performance</p>
    </div>
  );
}
