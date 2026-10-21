import { ProcessedVariable } from '../types';

interface VariableListProps {
  variables: ProcessedVariable[];
  selectedVariable: string | null;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function VariableList({
  variables,
  selectedVariable,
  onSelect,
  onDelete,
}: VariableListProps) {
  if (variables.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span>🗂️</span> Saved Variables
        <span className="text-sm font-normal text-gray-400">({variables.length})</span>
      </h3>

      <div className="space-y-2">
        {variables.map((v) => (
          <div
            key={v.name}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
              selectedVariable === v.name
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <button
              onClick={() => onSelect(v.name)}
              className="flex-1 text-left"
            >
              <div className="font-semibold text-gray-800">{v.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {v.dates.length} dates × {v.timeColumns.length} time columns
                <span className="ml-2 text-gray-400">
                  Created: {v.createdAt.toLocaleString()}
                </span>
              </div>
            </button>

            <button
              onClick={() => onDelete(v.name)}
              className="ml-3 px-2 py-1 text-red-500 hover:bg-red-50 rounded text-sm"
              title="Delete variable"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
