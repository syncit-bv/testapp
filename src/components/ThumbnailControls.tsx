import React from 'react';
import { RotateCw, RotateCcw, Download, Trash2, Info, Loader2 } from 'lucide-react';

interface ThumbnailControlsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onExtract: () => void;
  onDelete: () => void;
  onToggleMetadata: () => void;
  isExtracting?: boolean;
  error?: string | null;
  darkMode?: boolean;
}

export function ThumbnailControls({
  onRotateLeft,
  onRotateRight,
  onExtract,
  onDelete,
  onToggleMetadata,
  isExtracting = false,
  error = null,
  darkMode,
}: ThumbnailControlsProps) {
  return (
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <ControlButton onClick={onRotateLeft} title="Rotate Left" icon={RotateCcw} darkMode={darkMode} />
      <ControlButton onClick={onRotateRight} title="Rotate Right" icon={RotateCw} darkMode={darkMode} />
      <ControlButton onClick={onToggleMetadata} title="File Details" icon={Info} darkMode={darkMode} />
      <ControlButton 
        onClick={onExtract} 
        title="Extract PDF" 
        icon={isExtracting ? Loader2 : Download} 
        darkMode={darkMode}
        disabled={isExtracting}
        className={isExtracting ? 'animate-spin' : ''}
      />
      <ControlButton onClick={onDelete} title="Delete" icon={Trash2} darkMode={darkMode} />
    </div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  title: string;
  icon: React.ElementType;
  darkMode?: boolean;
  disabled?: boolean;
  className?: string;
}

function ControlButton({ onClick, title, icon: Icon, darkMode, disabled = false, className = '' }: ControlButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={`p-2 rounded-full ${
        darkMode
          ? 'bg-gray-800 hover:bg-gray-700'
          : 'bg-white hover:bg-gray-100'
      } transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
      disabled={disabled}
    >
      <Icon className={`w-4 h-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'} ${className}`} />
    </button>
  );
}