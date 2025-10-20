import { useLayoutEffect, useRef, useState } from 'react'

interface OverlayViewProps {
  originalImage: string | null
  modifiedImage: string | null
  overlayOpacity: number
  onOpacityChange: (opacity: number) => void
}

interface ImageDimensions {
  width: number
  height: number
}

export function OverlayView({
  originalImage,
  modifiedImage,
  overlayOpacity,
  onOpacityChange,
}: OverlayViewProps) {
  const [containerSize, setContainerSize] = useState<ImageDimensions | null>(
    null,
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!originalImage || !modifiedImage) {
      return
    }

    const loadImage = (src: string): Promise<ImageDimensions> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight })
        }
        img.src = src
      })
    }

    Promise.all([loadImage(originalImage), loadImage(modifiedImage)]).then(
      ([img1, img2]) => {
        const containerRect = containerRef.current?.getBoundingClientRect()
        const maxWidth = containerRect?.width || window.innerWidth
        const maxHeight = containerRect?.height || window.innerHeight

        const maxImageWidth = Math.max(img1.width, img2.width)
        const maxImageHeight = Math.max(img1.height, img2.height)
        const aspectRatio = maxImageWidth / maxImageHeight

        const availableWidth = maxWidth * 0.9
        const availableHeight = maxHeight * 0.9

        let width: number
        let height: number

        if (availableWidth / availableHeight > aspectRatio) {
          // wider, use height as base
          height = availableHeight
          width = height * aspectRatio
        } else {
          // higher, use width as base
          width = availableWidth
          height = width / aspectRatio
        }

        setContainerSize({ width, height })
      },
    )
  }, [originalImage, modifiedImage])

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
