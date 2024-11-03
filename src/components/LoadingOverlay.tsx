import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Processing PDFs...</span>
      </div>
    </div>
  );
}