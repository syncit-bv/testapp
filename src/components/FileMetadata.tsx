import React from 'react';
import { X, File, Calendar, HardDrive, Layers } from 'lucide-react';
import type { SupportedFile } from '../types';

interface FileMetadataProps {
  file: SupportedFile;
  onClose: () => void;
  darkMode?: boolean;
}

function formatSize(bytes: number | undefined): string {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return 'Unknown size';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatDate(date: Date | number | undefined): string {
  if (!date) {
    return 'Unknown date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
}

export function FileMetadata({ file, onClose, darkMode = false }: FileMetadataProps) {
  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-200' : 'text-gray-700';
  const labelColor = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`absolute inset-0 ${bgColor} rounded-lg shadow-lg z-10`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-lg font-semibold ${textColor}`}>File Details</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            <X className={`w-4 h-4 ${textColor}`} />
          </button>
        </div>

        <div className={`space-y-3 ${textColor}`}>
          <MetadataItem
            icon={File}
            label="Name"
            value={file.name || 'Unnamed file'}
            darkMode={darkMode}
          />
          
          <MetadataItem
            icon={HardDrive}
            label="Size"
            value={formatSize(file.size)}
            darkMode={darkMode}
          />
          
          <MetadataItem
            icon={Calendar}
            label="Modified"
            value={formatDate(file.lastModified)}
            darkMode={darkMode}
          />

          {typeof file.numPages === 'number' && (
            <MetadataItem
              icon={Layers}
              label="Pages"
              value={`${file.numPages} ${file.numPages === 1 ? 'page' : 'pages'}`}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface MetadataItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  darkMode?: boolean;
}

function MetadataItem({ icon: Icon, label, value, darkMode }: MetadataItemProps) {
  const labelColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className={`${labelColor} min-w-[80px]`}>{label}:</span>
      <span className="break-all">{value}</span>
    </div>
  );
}