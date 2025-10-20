import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

interface DragHandlers {
  handleDragEnter: (e: DragEvent) => void
  handleDragOver: (e: DragEvent) => void
  handleDragLeave: (e: DragEvent) => void
  handleDrop: (e: DragEvent) => void
}

interface HTMLElementWithDragHandlers extends HTMLElement {
  _dragHandlers?: DragHandlers
}

interface UseDragAndDropOptions {
  onFilesDrop?: (files: FileList, e: DragEvent) => void
  onDragEnter?: (e: DragEvent) => void
  onDragOver?: (e: DragEvent) => void
  onDragLeave?: (e: DragEvent) => void
}

/**
 * Handle drag and drop events for a single drop zone.
 * @param targetRef - RefObject<HTMLElement> pass it will auto register event
 * @param options - {@link UseDragAndDropOptions}.
 * @example
 * const dropZoneRef = useRef<HTMLElement>(null)
 * const { isDragging } = useDragAndDrop(dropZoneRef, {
 *   onFilesDrop: (files, e) => {
 *     console.log(files, e);
 *   }
 * })
 */
export function useDragAndDrop(
  targetRef: React.RefObject<HTMLElement | null> | null,
  options: UseDragAndDropOptions = {},
) {
  const [isDragging, setIsDragging] = useState(false)

  const { onFilesDrop, onDragEnter, onDragOver, onDragLeave } = options

  const handleSetDragging = useCallback((dragging: boolean) => {
    setIsDragging(dragging)
  }, [])

  const setupDropZone = useCallback(
    (element: HTMLElement) => {
      const handleDragEnter = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleSetDragging(true)
        onDragEnter?.(e)
      }

      // must update drag state in drag over, otherwise async event will trigger wrong state
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleSetDragging(true)
        onDragOver?.(e)
      }

      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleSetDragging(false)
        onDragLeave?.(e)
      }

      const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleSetDragging(false)

        const files = e.dataTransfer?.files
        if (files && files.length > 0) {
          onFilesDrop?.(files, e)
        }
      }

      element.addEventListener('dragenter', handleDragEnter)
      element.addEventListener('dragover', handleDragOver)
      element.addEventListener('dragleave', handleDragLeave)
      element.addEventListener('drop', handleDrop)

      // store the event handlers for cleanup
      ;(element as HTMLElementWithDragHandlers)._dragHandlers = {
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDrop,
      }
    },
    [handleSetDragging, onFilesDrop, onDragEnter, onDragOver, onDragLeave],
  )

  const cleanupDropZone = useCallback(
    (element: HTMLElementWithDragHandlers) => {
      const handlers = element._dragHandlers
      if (handlers) {
        element.removeEventListener('dragenter', handlers.handleDragEnter)
        element.removeEventListener('dragover', handlers.handleDragOver)
        element.removeEventListener('dragleave', handlers.handleDragLeave)
        element.removeEventListener('drop', handlers.handleDrop)
        delete element._dragHandlers
      }
    },
    [],
  )

  // register manually
  const registerDropZone = useCallback(
    (element: HTMLElement) => {
      setupDropZone(element)
    },
    [setupDropZone],
  )

  useEffect(() => {
    const element = targetRef?.current
    if (element) {
      setupDropZone(element)

      return () => {
        cleanupDropZone(element as HTMLElementWithDragHandlers)
      }
    }
  }, [targetRef, setupDropZone, cleanupDropZone])

  return { isDragging, registerDropZone }
}
