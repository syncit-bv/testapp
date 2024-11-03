import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import type { SupportedFile } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface PDFPreviewProps {
  file: SupportedFile;
  previewSize: number;
  onError: (error: string) => void;
}

export function PDFPreview({ file, previewSize, onError }: PDFPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setIsLoading(false);
    setError(null);
    setNumPages(numPages);
  };

  const handleLoadError = (err: Error) => {
    setIsLoading(false);
    const errorMessage = 'Failed to load PDF preview';
    setError(errorMessage);
    onError(errorMessage);
    console.error('PDF Load Error:', err);
  };

  if (!file.previewUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="text-sm text-gray-600">Preview not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Document
        file={file.previewUrl}
        loading={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">Loading preview...</span>
            </div>
          </div>
        }
        error={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <span className="text-sm text-gray-600">{error || 'Failed to load preview'}</span>
            </div>
          </div>
        }
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
      >
        {!error && (
          <Page
            pageNumber={1}
            width={previewSize}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={null}
          />
        )}
      </Document>
      {numPages > 0 && (
        <div className="absolute bottom-2 right-2 bg-gray-800/75 text-white px-2 py-1 rounded text-xs">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </div>
      )}
    </div>
  );
}