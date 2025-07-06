import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragEndEvent, closestCenter } from '@dnd-kit/core';

interface DraggableItemProps {
  id: string;
  content: React.ReactNode;
  className?: string;
}

interface DroppableZoneProps {
  id: string;
  content?: React.ReactNode;
  placeholder?: string;
  className?: string;
  isCorrectPlacement?: boolean;
}

interface DragDropZoneProps {
  draggableItems: DraggableItemProps[];
  droppableZones: DroppableZoneProps[];
  onDrop: (event: DragEndEvent) => void;
  layout?: 'horizontal' | 'vertical' | 'grid';
  itemsPerRow?: number;
  snapOnHover?: boolean;
  showFeedback?: boolean;
  highlightOnHover?: boolean;
  showLabels?: boolean;
}

// Simplified interface for direct use in games
interface SimpleDragDropZoneProps {
  id: string;
  onDrop: (itemId: string) => void;
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
}

// Item that can be dragged
const DraggableItem: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    cursor: 'grab'
  } : undefined;
  
  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${className} transition-shadow duration-200`}
      style={style}
      id={id}
    >
      {children}
    </div>
  );
};

// Zone where items can be dropped
const DroppableZone: React.FC<{
  id: string;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  isOver?: boolean;
  isCorrect?: boolean;
  highlightOnHover?: boolean;
  activeClassName?: string;
}> = ({ 
  id, 
  children,
  placeholder = 'Drop here',
  className = '',
  isOver = false,
  isCorrect = false,
  highlightOnHover = true,
  activeClassName = ''
}) => {
  const { isOver: dndIsOver, setNodeRef } = useDroppable({ id });
  const isHovering = isOver || dndIsOver;
  
  // Styling based on hover state and correctness
  const baseStyles = "transition-all duration-200";
  const hoverStyles = isHovering && highlightOnHover ? activeClassName || "ring-4 ring-blue-400 bg-blue-50" : "";
  const correctStyles = isCorrect ? "ring-4 ring-green-400 bg-green-50" : "";
  
  return (
    <div
      ref={setNodeRef}
      className={`${baseStyles} ${hoverStyles} ${correctStyles} ${className}`}
      data-dropzone-id={id}
    >
      {children || (
        <div className="flex items-center justify-center h-full text-gray-400">
          {placeholder}
        </div>
      )}
    </div>
  );
};

// Main component that coordinates drag and drop
const DragDropZone: React.FC<DragDropZoneProps | SimpleDragDropZoneProps> = (props) => {
  // Check if we're using the simple interface
  if ('draggableItems' in props) {
    return <ComplexDragDropZone {...props as DragDropZoneProps} />;
  } else {
    return <SimpleDragDropZone {...props as SimpleDragDropZoneProps} />;
  }
};

// Original complex implementation
const ComplexDragDropZone: React.FC<DragDropZoneProps> = ({
  draggableItems,
  droppableZones,
  onDrop,
  layout = 'horizontal',
  itemsPerRow = 3,
  snapOnHover = true,
  showFeedback = true,
  highlightOnHover = true,
  showLabels = false
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<{[key: string]: string}>({});

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over) {
      // Update local state
      setPlacedItems(prev => ({
        ...prev,
        [active.id]: over.id
      }));
      
      // Trigger parent callback
      onDrop(event);
    }
    
    setActiveId(null);
    setHoveredZoneId(null);
  };
  
  // Handle drag move for hover effects
  const handleDragMove = (event) => {
    const { over } = event;
    if (over) {
      setHoveredZoneId(over.id);
    } else {
      setHoveredZoneId(null);
    }
  };
  
  // Layout styles
  const layoutClasses = {
    horizontal: 'flex flex-row flex-wrap justify-center gap-4',
    vertical: 'flex flex-col items-center gap-4',
    grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(itemsPerRow, 6)} gap-4`
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={snapOnHover ? handleDragMove : undefined}
      collisionDetection={closestCenter}
    >
      {draggableItems.length > 0 && (
        <>
          {showLabels && <div className="dnd-items-label font-bold mb-2">Items</div>}
          <div className={layoutClasses[layout]}>
            {draggableItems.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                className={item.className || 'cursor-grab'}
              >
                {item.content}
              </DraggableItem>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-6">
        {droppableZones.length > 0 && (
          <>
            {showLabels && <div className="dnd-zones-label font-bold mb-2">Drop Zones</div>}
            <div className={layoutClasses[layout]}>
              {droppableZones.map((zone) => {
                // Find which item is placed in this zone
                const placedItemId = Object.entries(placedItems)
                  .find(([_, zoneId]) => zoneId === zone.id)?.[0];
                
                // Find the content of the placed item
                const placedItemContent = placedItemId ? 
                  draggableItems.find(item => item.id === placedItemId)?.content : 
                  null;
                  
                return (
                  <DroppableZone
                    key={zone.id}
                    id={zone.id}
                    className={`${zone.className || 'min-h-[100px] min-w-[100px] border-2 border-dashed border-gray-300 rounded-lg p-4'}`}
                    placeholder={zone.placeholder}
                    isOver={hoveredZoneId === zone.id}
                    isCorrect={showFeedback && zone.isCorrectPlacement && placedItemId !== undefined}
                    highlightOnHover={highlightOnHover}
                  >
                    {placedItemContent || zone.content}
                  </DroppableZone>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DndContext>
  );
};

export default DragDropZone; 