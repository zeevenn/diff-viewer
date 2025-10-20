import type { ReactNode } from 'react'
import type { FileValidation, ValidationResult } from '../../utils'

import { createContext, useCallback, useEffect, useMemo, useRef } from 'react'
import { useDropZone } from '../../context/useDropZone'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { validateFiles } from '../../utils'
import { DragIndicator, DragOverlay } from './DragOverlay'

interface DragState {
  isDragging: boolean
  isActive: boolean
  validationResult: ValidationResult
}

interface DropZoneContextValue {
  dragState: DragState
  onFileSelect: (files: FileList) => void
  registerDropZone: (element: HTMLElement) => void
}

const DropZoneContext = createContext<DropZoneContextValue | null>(null)

interface DropZoneProps {
  children: ReactNode
  onFilesSelect: (
    files: FileList,
    validation: ValidationResult,
    dropPosition?: { x: number; y: number },
  ) => void
  validation?: FileValidation
  disabled?: boolean
  className?: string
}

export function DropZone({
  children,
  onFilesSelect,
  validation,
  disabled = false,
  className = '',
}: DropZoneProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const { isDragging, activeDropZone, registerDropZone } =
    useDragAndDrop<'main'>({
      onFilesDrop: (files) => {
        if (disabled) return

        const validationResult = validateFiles(files, validation)
        onFilesSelect(files, validationResult)
      },
      onDragEnter: () => {},
      onDragOver: () => {},
      onDragLeave: () => {},
    })

  const handleFileSelect = useCallback(
    (files: FileList) => {
      if (disabled) return

      const validationResult = validateFiles(files, validation)
      onFilesSelect(files, validationResult)
    },
    [disabled, validation, onFilesSelect],
  )

  const handleRegisterDropZone = useCallback(
    (element: HTMLElement) => {
      registerDropZone(element, 'main')
    },
    [registerDropZone],
  )

  const dragState: DragState = useMemo(
    () => ({
      isDragging,
      isActive: activeDropZone === 'main',
      validationResult: { isValid: true, errors: [] },
    }),
    [isDragging, activeDropZone],
  )

  const contextValue: DropZoneContextValue = useMemo(
    () => ({
      dragState,
      onFileSelect: handleFileSelect,
      registerDropZone: handleRegisterDropZone,
    }),
    [dragState, handleFileSelect, handleRegisterDropZone],
  )

  useEffect(() => {
    if (dropZoneRef.current) {
      handleRegisterDropZone(dropZoneRef.current)
    }
  }, [handleRegisterDropZone])

  return (
    <DropZoneContext value={contextValue}>
      <div ref={dropZoneRef} className={`relative ${className}`}>
        {children}
      </div>
    </DropZoneContext>
  )
}

interface DropZoneContentProps {
  children: ReactNode
  className?: string
}

function DropZoneContent({ children, className = '' }: DropZoneContentProps) {
  return <div className={`relative ${className}`}>{children}</div>
}

interface DropZoneOverlayProps {
  children?: ReactNode
  className?: string
  position?: 'left' | 'right' | 'full'
}

function DropZoneOverlay({
  children,
  className = '',
  position = 'full',
}: DropZoneOverlayProps) {
  const { dragState } = useDropZone()

  return (
    <DragOverlay
      isDragging={dragState.isDragging}
      position={position}
      className={className}
    >
      {children}
    </DragOverlay>
  )
}

interface DropZoneInputProps {
  accept?: string
  multiple?: boolean
  className?: string
  children: ReactNode
}

function DropZoneInput({
  accept,
  multiple = false,
  className = '',
  children,
}: DropZoneInputProps) {
  const { onFileSelect } = useDropZone()
  const inputId = `file-input-${Math.random().toString(36).substr(2, 9)}`

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      onFileSelect(files)
    }
    event.target.value = ''
  }

  return (
    <>
      <label htmlFor={inputId} className={`cursor-pointer ${className}`}>
        {children}
      </label>
      <input
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
      />
    </>
  )
}

interface DropZoneMessageProps {
  icon?: ReactNode
  title?: string
  description?: string
  className?: string
}

function DropZoneMessage({
  icon,
  title = '拖拽文件到此处',
  description = '或点击选择文件',
  className = '',
}: DropZoneMessageProps) {
  const defaultIcon = (
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      stroke="currentColor"
      fill="none"
      viewBox="0 0 48 48"
    >
      <path
        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div className={`text-center ${className}`}>
      {icon || defaultIcon}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  )
}

function DropZoneDragIndicator({
  children,
  className = 'bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg',
}: {
  children: ReactNode
  className?: string
}) {
  return <DragIndicator className={className}>{children}</DragIndicator>
}

DropZone.Content = DropZoneContent
DropZone.Overlay = DropZoneOverlay
DropZone.Input = DropZoneInput
DropZone.Message = DropZoneMessage
DropZone.DragIndicator = DropZoneDragIndicator

export {
  type DragState,
  DropZoneContext,
  type FileValidation,
  type ValidationResult,
}
