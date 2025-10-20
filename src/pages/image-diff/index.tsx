import { useState } from 'react'

import { ComingSoon } from '../../components/ui'
import { OverlayView, SideBySideView, SliderView } from './components'

interface ImageDiffProps {
  className?: string
}

type ComparisonMode = 'side-by-side' | 'overlay' | 'slider' | 'difference'

const COMPARISON_MODES = {
  SIDE_BY_SIDE: 'side-by-side' as const,
  OVERLAY: 'overlay' as const,
  SLIDER: 'slider' as const,
  DIFFERENCE: 'difference' as const,
} satisfies Record<string, ComparisonMode>

export function ImageDiff({ className = '' }: ImageDiffProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [modifiedImage, setModifiedImage] = useState<string | null>(null)
  const [originalImageInfo, setOriginalImageInfo] = useState<{
    name: string
    size: number
    dimensions: { width: number; height: number }
  } | null>(null)
  const [modifiedImageInfo, setModifiedImageInfo] = useState<{
    name: string
    size: number
    dimensions: { width: number; height: number }
  } | null>(null)
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>(
    COMPARISON_MODES.SIDE_BY_SIDE,
  )
  const [sliderPosition, setSliderPosition] = useState(50)
  const [overlayOpacity, setOverlayOpacity] = useState(50)

  const getImageInfo = (
    file: File,
    imageUrl: string,
  ): Promise<{
    name: string
    size: number
    dimensions: { width: number; height: number }
  }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          name: file.name,
          size: file.size,
          dimensions: { width: img.width, height: img.height },
        })
      }
      img.src = imageUrl
    })
  }

  const handleOriginalImageSelect = async (files: FileList) => {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      // eslint-disable-next-line no-alert
      alert('请选择图片文件')
      return
    }

    if (originalImage) {
      URL.revokeObjectURL(originalImage)
    }

    const imageUrl = URL.createObjectURL(file)
    const imageInfo = await getImageInfo(file, imageUrl)
    setOriginalImage(imageUrl)
    setOriginalImageInfo(imageInfo)
  }

  const handleModifiedImageSelect = async (files: FileList) => {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      // eslint-disable-next-line no-alert
      alert('请选择图片文件')
      return
    }

    if (modifiedImage) {
      URL.revokeObjectURL(modifiedImage)
    }

    const imageUrl = URL.createObjectURL(file)
    const imageInfo = await getImageInfo(file, imageUrl)
    setModifiedImage(imageUrl)
    setModifiedImageInfo(imageInfo)
  }

  const clearImages = () => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage)
    }
    if (modifiedImage) {
      URL.revokeObjectURL(modifiedImage)
    }
    setOriginalImage(null)
    setModifiedImage(null)
    setOriginalImageInfo(null)
    setModifiedImageInfo(null)
  }

  const renderCurrentView = () => {
    switch (comparisonMode) {
      case COMPARISON_MODES.SIDE_BY_SIDE:
        return (
          <SideBySideView
            originalImage={originalImage}
            modifiedImage={modifiedImage}
            onOriginalImageSelect={handleOriginalImageSelect}
            onModifiedImageSelect={handleModifiedImageSelect}
          />
        )
      case COMPARISON_MODES.OVERLAY:
        return (
          <OverlayView
            originalImage={originalImage}
            modifiedImage={modifiedImage}
            overlayOpacity={overlayOpacity}
            onOpacityChange={setOverlayOpacity}
          />
        )
      case COMPARISON_MODES.SLIDER:
        return (
          <SliderView
            originalImage={originalImage}
            modifiedImage={modifiedImage}
            sliderPosition={sliderPosition}
            onPositionChange={setSliderPosition}
          />
        )
      case COMPARISON_MODES.DIFFERENCE:
        return <ComingSoon />
      default:
        return (
          <SideBySideView
            originalImage={originalImage}
            modifiedImage={modifiedImage}
            onOriginalImageSelect={handleOriginalImageSelect}
            onModifiedImageSelect={handleModifiedImageSelect}
          />
        )
    }
  }

  return (
    <div
      className={`flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
    >
      {/* Toolbar */}
      {originalImageInfo && modifiedImageInfo && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Comparison Mode Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                对比模式:
              </span>
              <select
                value={comparisonMode}
                onChange={(e) =>
                  setComparisonMode(e.target.value as ComparisonMode)
                }
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <option value={COMPARISON_MODES.SIDE_BY_SIDE}>
                  Side by Side
                </option>
                <option value={COMPARISON_MODES.OVERLAY}>Overlay</option>
                <option value={COMPARISON_MODES.SLIDER}>Slider</option>
                <option value={COMPARISON_MODES.DIFFERENCE}>Difference</option>
              </select>
            </div>

            {/* Image Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              {originalImageInfo && (
                <span>
                  原图: {originalImageInfo.dimensions.width}×
                  {originalImageInfo.dimensions.height}
                </span>
              )}
              {modifiedImageInfo && (
                <span>
                  对比图: {modifiedImageInfo.dimensions.width}×
                  {modifiedImageInfo.dimensions.height}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={clearImages}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md cursor-pointer transition-colors"
            >
              清空
            </button>
          </div>
        </div>
      )}

      {/* Image Comparison Area */}
      <div className="flex-1 flex flex-col relative">{renderCurrentView()}</div>
    </div>
  )
}
