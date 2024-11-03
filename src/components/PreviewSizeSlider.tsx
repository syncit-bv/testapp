import React from 'react';
import { Minus, Plus, Maximize2, Minimize2 } from 'lucide-react';

interface PreviewSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function PreviewSizeSlider({
  value,
  onChange,
  min,
  max,
  step = 10
}: PreviewSizeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm">
      <button
        onClick={() => onChange(min)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Minimum size"
      >
        <Minimize2 className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Decrease size"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <div className="relative w-32 h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-2 top-2 appearance-none bg-gray-200 rounded-full outline-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
        <div className="absolute -top-6 left-0 right-0 text-center">
          <span className="text-xs text-gray-500">{value}px</span>
        </div>
      </div>
      
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Increase size"
      >
        <Plus className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => onChange(max)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Maximum size"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}