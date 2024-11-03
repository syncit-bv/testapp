import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PDFThumbnail } from './PDFThumbnail';
import { PreviewSizeSlider } from './PreviewSizeSlider';
import type { PDFFile } from '../types';

const dropAnimationConfig = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

interface PDFListProps {
  files: PDFFile[];
  previewSize: number;
  onPreviewSizeChange: (size: number) => void;
  onFilesReorder: (files: PDFFile[]) => void;
  onRotate: (fileId: string, degrees: number) => void;
  onExtract: (file: File) => void;
  onDelete: (fileId: string) => void;
}

export function PDFList({
  files,
  previewSize,
  onPreviewSizeChange,
  onFilesReorder,
  onRotate,
  onExtract,
  onDelete,
}: PDFListProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      const newFiles = arrayMove(files, oldIndex, newIndex);
      onFilesReorder(newFiles);
    }
    
    setActiveId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PreviewSizeSlider
          value={previewSize}
          onChange={onPreviewSizeChange}
          min={150}
          max={300}
          step={10}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${previewSize}px, 1fr))`,
            justifyItems: 'center'
          }}
        >
          <SortableContext
            items={files.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {files.map((file, index) => (
              <PDFThumbnail
                key={file.id}
                file={file}
                index={index}
                previewSize={previewSize}
                onRotate={(degrees) => onRotate(file.id, degrees)}
                onExtract={() => onExtract(file)}
                onDelete={() => onDelete(file.id)}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId ? (
            <PDFThumbnail
              key={`overlay-${activeId}`}
              file={files.find(f => f.id === activeId)!}
              index={-1}
              previewSize={previewSize}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}