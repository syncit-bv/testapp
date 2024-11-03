import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PDFThumbnailProps } from '../types';
import { PDFPreview } from './PDFPreview';
import { ThumbnailControls } from './ThumbnailControls';
import { FileMetadata } from './FileMetadata';

export function PDFThumbnail({
  file,
  index,
  onRotate,
  onExtract,
  onDelete,
  previewSize = 200,
  darkMode,
}: PDFThumbnailProps) {
  const [error, setError] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: file.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: previewSize,
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleExtract = async () => {
    if (!file || file.type !== 'application/pdf') {
      handleError('Invalid file type. Only PDF files can be extracted.');
      return;
    }

    setIsExtracting(true);
    try {
      await onExtract?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract PDF';
      handleError(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-lg shadow-md overflow-hidden
        ${isDragging ? 'z-50' : 'z-0'}`}
      {...attributes}
      {...listeners}
    >
      <div 
        className="aspect-[3/4] bg-gray-50 relative flex items-center justify-center"
        style={{ 
          transform: file.rotation ? `rotate(${file.rotation}deg)` : undefined,
        }}
      >
        <PDFPreview
          file={file}
          previewSize={previewSize}
          onError={handleError}
        />
        
        {showMetadata ? (
          <FileMetadata
            file={file}
            onClose={() => setShowMetadata(false)}
            darkMode={darkMode}
          />
        ) : (
          <ThumbnailControls
            onRotateLeft={() => onRotate?.(-90)}
            onRotateRight={() => onRotate?.(90)}
            onExtract={handleExtract}
            onDelete={onDelete}
            onToggleMetadata={() => setShowMetadata(true)}
            isExtracting={isExtracting}
            error={error}
            darkMode={darkMode}
          />
        )}
      </div>
      <div className={`p-2 text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {file.name}
      </div>
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
          {error}
        </div>
      )}
    </div>
  );
}