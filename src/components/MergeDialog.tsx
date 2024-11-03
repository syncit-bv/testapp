import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MergeDialogProps {
  sourceFile: string;
  targetFile: string;
  onMerge: (position: 'before' | 'after') => void;
  onCancel: () => void;
}

export function MergeDialog({ sourceFile, targetFile, onMerge, onCancel }: MergeDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Merge PDFs</h3>
        <p className="text-gray-600 mb-6">
          Where would you like to merge "{sourceFile}" relative to "{targetFile}"?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => onMerge('before')}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 
              text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            Before
          </button>
          <button
            onClick={() => onMerge('after')}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 
              text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
            After
          </button>
        </div>
        <button
          onClick={onCancel}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}