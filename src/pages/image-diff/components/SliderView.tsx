import { useImageContainerSize } from '../../../hooks/useImageContainerSize'

interface SliderViewProps {
  originalImage: string | null
  modifiedImage: string | null
  sliderPosition: number
  onPositionChange: (position: number) => void
}

export function SliderView({
  originalImage,
  modifiedImage,
  sliderPosition,
  onPositionChange,
}: SliderViewProps) {
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
          value={sliderPosition}
          onChange={(e) => onPositionChange(Number(e.target.value))}
          className="w-50"
        />
      </div>
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative bg-gray-100 dark:bg-gray-900 overflow-hidden"
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
              className="absolute inset-0"
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
            {/* Modified Image Container - positioned from right */}
            <div
              className="absolute right-0 top-0 bottom-0 overflow-hidden border-l border-red-500"
              style={{
                width: `${100 - sliderPosition}%`,
              }}
            >
              <div
                className="absolute right-0 top-0 bottom-0"
                style={{
                  width: `${containerSize.width}px`,
                  height: `${containerSize.height}px`,
                }}
              >
                <img
                  src={modifiedImage}
                  alt="Modified"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
