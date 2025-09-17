import { useState, useCallback, useRef, useEffect } from "react";

interface DragHandlers {
  handleDragEnter: (e: DragEvent) => void;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
}

interface HTMLElementWithDragHandlers extends HTMLElement {
  _dragHandlers?: DragHandlers;
}

interface UseDragAndDropOptions<T extends string> {
  onFilesDrop?: (files: FileList, dropZone: T) => void;
  onDragEnter?: (dropZone: T, e: DragEvent) => void;
  onDragOver?: (dropZone: T, e: DragEvent) => void;
  onDragLeave?: (dropZone: T, e: DragEvent) => void;
}

/**
 * Register multiple drop zones and handle drag and drop events for them.
 * @param options - {@link UseDragAndDropOptions}.
 * @example
 * const { isDragging, activeDropZone, registerDropZone } = useDragAndDrop({
 *   onFilesDrop: (files, dropZone) => {
 *     console.log(files, dropZone);
 *   }
 * });
 * 
 * registerDropZone(document.getElementById('drop-zone'), 'drop-zone');
 */
export const useDragAndDrop = <T extends string>(options: UseDragAndDropOptions<T> = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<T | null>(null);
  const dropZonesRef = useRef<Map<T, HTMLElement>>(new Map());

  const { onFilesDrop, onDragEnter, onDragOver, onDragLeave } = options;

  const setupDropZone = useCallback((element: HTMLElement, zoneId: T) => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setActiveDropZone(zoneId);
      onDragEnter?.(zoneId, e);
    };

    // must update drag state in drag over, otherwise async event will trigger wrong state
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setActiveDropZone(zoneId);
      onDragOver?.(zoneId, e);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setActiveDropZone(null);
      onDragLeave?.(zoneId, e);
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

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // store the event handlers for cleanup
    (element as HTMLElementWithDragHandlers)._dragHandlers = {
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop
    };
  }, [onFilesDrop, onDragEnter, onDragOver, onDragLeave]);

  const cleanupDropZone = useCallback((element: HTMLElementWithDragHandlers) => {
    const handlers = element._dragHandlers;
    if (handlers) {
      element.removeEventListener('dragenter', handlers.handleDragEnter);
      element.removeEventListener('dragover', handlers.handleDragOver);
      element.removeEventListener('dragleave', handlers.handleDragLeave);
      element.removeEventListener('drop', handlers.handleDrop);
      delete element._dragHandlers;
    }
  }, []);

  const registerDropZone = useCallback((element: HTMLElement, zoneId: T) => {
    dropZonesRef.current.set(zoneId, element);
    setupDropZone(element, zoneId);
  }, [setupDropZone]);

  const unregisterDropZone = useCallback((zoneId: T) => {
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
      dropZones.forEach((_, zoneId) => {
        unregisterDropZone(zoneId);
      });
      dropZones.clear();
    };
  }, [unregisterDropZone]);

  return {
    isDragging,
    activeDropZone,
    registerDropZone,
  };
};