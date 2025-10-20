import type { ReactNode } from 'react'

interface DragOverlayProps {
  isDragging: boolean
  position?: 'left' | 'right' | 'full'
  className?: string
  children?: ReactNode
}

export function DragOverlay({
  isDragging,
  position = 'full',
  className = 'bg-blue-500/20 border-2 border-blue-500 border-dashed',
  children,
}: DragOverlayProps) {
  if (!isDragging) return null

  const positionClasses = {
    left: 'absolute top-0 left-0 w-1/2 h-full',
    right: 'absolute top-0 right-0 w-1/2 h-full',
    full: 'absolute inset-0',
  }

  const overlayClassName = `
    ${positionClasses[position]}
    pointer-events-none transition-all duration-200 z-50
    ${className}
  `.trim()

  return (
    <div className={overlayClassName}>
      {children && (
        <div className="flex items-center justify-center h-full">
          {children}
        </div>
      )}
    </div>
  )
}

interface DragIndicatorProps {
  children: ReactNode
  className?: string
}

export function DragIndicator({
  children,
  className = 'bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg',
}: DragIndicatorProps) {
  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
        {children}
      </div>
    </div>
  )
}
