import { useState } from 'react';
import { ProcessedVariable } from '../types';

interface VariableCombinationProps {
  variables: ProcessedVariable[];
  onCombine: (name: string, operations: Array<{ variable: string; sign: '+' | '-' }>) => void;
}

export default function VariableCombination({ variables, onCombine }: VariableCombinationProps) {
  const [operations, setOperations] = useState<Array<{ variable: string; sign: '+' | '-' }>>([]);
  const [resultName, setResultName] = useState('');
  const [draggedVariable, setDraggedVariable] = useState<string | null>(null);

  const handleDragStart = (variable: string) => {
    setDraggedVariable(variable);
  };

  const handleDrop = (sign: '+' | '-') => {
    if (draggedVariable) {
      setOperations([...operations, { variable: draggedVariable, sign }]);
      setDraggedVariable(null);
    }
  };

  const handleRemoveOperation = (index: number) => {
    setOperations(operations.filter((_, i) => i !== index));
  };

  const handleCombine = () => {
    if (!resultName.trim()) {
      alert('Please enter a name for the result variable.');
      return;
    }
    if (operations.length === 0) {
      alert('Please add at least one variable to combine.');
      return;
    }
    onCombine(resultName.trim(), operations);
    setResultName('');
    setOperations([]);
  };

  return (
    <div className="space-y-4">
      {/* Available variables */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Available Variables</h3>
        {variables.length === 0 ? (
          <p className="text-gray-400 text-sm">No variables available. Import files first.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {variables.map((v) => (
              <div
                key={v.name}
                draggable
                onDragStart={() => handleDragStart(v.name)}
                className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-700">{v.name}</div>
                <div className="text-xs text-blue-500">{v.dates.length} dates</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drop zones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Operations</h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('+')}
            className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50 hover:bg-green-100 transition-colors"
          >
            <div className="text-4xl mb-2">➕</div>
            <div className="text-sm text-green-700 font-medium">Drop to ADD</div>
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('-')}
            className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center bg-red-50 hover:bg-red-100 transition-colors"
          >
            <div className="text-4xl mb-2">➖</div>
            <div className="text-sm text-red-700 font-medium">Drop to SUBTRACT</div>
          </div>
        </div>

        {/* Operations list */}
        {operations.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-gray-700">Formula:</div>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
              {operations.map((op, idx) => (
                <span key={idx}>
                  {idx > 0 && <span className="text-gray-500 mx-2">{op.sign}</span>}
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded">
                    {op.variable}
                    <button
                      onClick={() => handleRemoveOperation(idx)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result name and combine button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Result Variable Name
            </label>
            <input
              type="text"
              value={resultName}
              onChange={(e) => setResultName(e.target.value)}
              placeholder="e.g., combined_variable"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCombine}
            disabled={operations.length === 0 || !resultName.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            = Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
