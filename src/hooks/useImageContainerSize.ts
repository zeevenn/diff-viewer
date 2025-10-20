import { useLayoutEffect, useRef, useState } from 'react'

interface ImageDimensions {
  width: number
  height: number
}

export function useImageContainerSize(
  image1: string | null,
  image2: string | null,
) {
  const [containerSize, setContainerSize] = useState<ImageDimensions | null>(
    null,
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!image1 || !image2) {
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

    Promise.all([loadImage(image1), loadImage(image2)]).then(([img1, img2]) => {
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
        height = availableHeight
        width = height * aspectRatio
      } else {
        width = availableWidth
        height = width / aspectRatio
      }

      setContainerSize({ width, height })
    })
  }, [image1, image2])

  return { containerSize, containerRef }
}
