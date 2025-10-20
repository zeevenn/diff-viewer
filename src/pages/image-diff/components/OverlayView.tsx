import { useImageContainerSize } from '../../../hooks/useImageContainerSize'

interface OverlayViewProps {
  originalImage: string | null
  modifiedImage: string | null
  overlayOpacity: number
  onOpacityChange: (opacity: number) => void
}

export function OverlayView({
  originalImage,
  modifiedImage,
  overlayOpacity,
  onOpacityChange,
}: OverlayViewProps) {
  const { containerSize, containerRef } = useImageContainerSize(
    originalImage,
    modifiedImage,
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-center space-x-2 py-2">
        <input
          type="range"
          min="0"
          max="100"
          value={overlayOpacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-50"
        />
      </div>
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative bg-gray-100 dark:bg-gray-900"
      >
        {originalImage && modifiedImage && containerSize && (
          <div
            className="relative"
            style={{
              width: `${containerSize.width}px`,
              height: `${containerSize.height}px`,
            }}
          >
            {/* Original Image Container */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
              }}
            >
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full"
              />
            </div>
            {/* Modified Image Container */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
                opacity: 1 - overlayOpacity / 100,
              }}
            >
              <img
                src={modifiedImage}
                alt="Modified"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
