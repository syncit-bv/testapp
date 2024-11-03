import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import type { Message } from '../types';

interface MessageToastProps {
  messages: Message[];
  onDismiss: (id: string) => void;
}

export function MessageToast({ messages, onDismiss }: MessageToastProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 space-y-2 pointer-events-none z-50">
      <div className="max-w-xl mx-auto space-y-2">
        {messages.map(({ id, text, type }) => (
          <div
            key={id}
            className={`
              rounded-lg shadow-lg p-4 flex items-center justify-between pointer-events-auto
              ${type === 'error' ? 'bg-red-500 text-white' : ''}
              ${type === 'success' ? 'bg-green-500 text-white' : ''}
              ${type === 'info' ? 'bg-amber-500 text-white' : ''}
            `}
            role={type === 'error' ? 'alert' : 'status'}
          >
            <div className="flex items-center gap-2">
              {type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
              <span>{text}</span>
            </div>
            <button
              onClick={() => onDismiss(id)}
              className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}