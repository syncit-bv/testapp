import React from 'react';
import { FileUp } from 'lucide-react';

interface UploadAreaProps {
  isDraggingOver: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadArea({
  isDraggingOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileUpload,
}: UploadAreaProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative w-full p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer bg-white
        ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.msg"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onFileUpload}
      />
      <div className="flex flex-col items-center pointer-events-none">
        <FileUp className={`w-12 h-12 mb-4 transition-colors ${isDraggingOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <span className={`text-sm transition-colors ${isDraggingOver ? 'text-blue-600' : 'text-gray-600'}`}>
          {isDraggingOver ? 'Drop files here' : 'Drop files here or click to upload'}
        </span>
        <span className="text-xs text-gray-500 mt-2">
          Supported formats: PDF, Word, Excel, MSG
        </span>
      </div>
    </div>
  );
}