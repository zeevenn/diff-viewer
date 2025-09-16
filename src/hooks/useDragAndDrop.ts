import { useState, useCallback, useRef, useEffect } from "react";

interface DragHandlers {
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
}

interface HTMLElementWithDragHandlers extends HTMLElement {
  _dragHandlers?: DragHandlers;
}

interface UseDragAndDropOptions {
  onFilesDrop?: (files: FileList, dropZone: string) => void;
  onDragEnter?: (dropZone: string) => void;
  onDragLeave?: () => void;
}

/**
 * Register multiple drop zones and handle drag and drop events for them.
 * @param options - {@link UseDragAndDropOptions}.
 * @example
 * const { isDragging, activeDropZone, registerDropZone, unregisterDropZone } = useDragAndDrop({
 *   onFilesDrop: (files, dropZone) => {
 *     console.log(files, dropZone);
 *   }
 * });
 * 
 * useEffect(() => {
 *   registerDropZone(document.getElementById('drop-zone'), 'drop-zone');
 *   return () => {
 *     unregisterDropZone('drop-zone');
 *   };
 * }, []);
 */
export const useDragAndDrop = (options: UseDragAndDropOptions = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const dropZonesRef = useRef<Map<string, HTMLElement>>(new Map());

  const { onFilesDrop, onDragEnter, onDragLeave } = options;

  const setupDropZone = useCallback((element: HTMLElement, zoneId: string) => {
    console.log('setupDropZone', element, zoneId);
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isDragging) {
        setIsDragging(true);
        setActiveDropZone(zoneId);
        onDragEnter?.(zoneId);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // check if the drag event really left the drag zone
      const rect = element.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragging(false);
        setActiveDropZone(null);
        onDragLeave?.();
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setActiveDropZone(null);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        onFilesDrop?.(files, zoneId);
      }
    };

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // store the event handlers for cleanup
    (element as HTMLElementWithDragHandlers)._dragHandlers = {
      handleDragOver,
      handleDragLeave,
      handleDrop
    };
  }, [isDragging, onFilesDrop, onDragEnter, onDragLeave]);

  const cleanupDropZone = useCallback((element: HTMLElementWithDragHandlers) => {
    const handlers = element._dragHandlers;
    if (handlers) {
      element.removeEventListener('dragover', handlers.handleDragOver);
      element.removeEventListener('dragleave', handlers.handleDragLeave);
      element.removeEventListener('drop', handlers.handleDrop);
      delete element._dragHandlers;
    }
  }, []);

  const registerDropZone = useCallback((element: HTMLElement, zoneId: string) => {
    dropZonesRef.current.set(zoneId, element);
    setupDropZone(element, zoneId);
  }, [setupDropZone]);

  const unregisterDropZone = useCallback((zoneId: string) => {
    const element = dropZonesRef.current.get(zoneId);
    if (element) {
      cleanupDropZone(element as HTMLElementWithDragHandlers);
      dropZonesRef.current.delete(zoneId);
    }
  }, [cleanupDropZone]);

  // cleanup drop zones
  useEffect(() => {
    const dropZones = dropZonesRef.current;

    return () => {
      dropZones.forEach((element) => {
        cleanupDropZone(element as HTMLElementWithDragHandlers);
      });
      dropZones.clear();
    };
  }, [cleanupDropZone]);

  return {
    isDragging,
    activeDropZone,
    registerDropZone,
    unregisterDropZone,
  };
};