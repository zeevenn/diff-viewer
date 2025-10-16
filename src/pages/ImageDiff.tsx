import { useRef, useState } from 'react'

import { ComingSoon } from '../components/ui'
import { useDragAndDrop } from '../hooks/useDragAndDrop'

interface ImageDiffProps {
  className?: string
}

type DropZone = 'original' | 'modified'
type ComparisonMode = 'side-by-side' | 'overlay' | 'slider' | 'difference'

const DROP_ZONE = {
  ORIGINAL: 'original' as const,
  MODIFIED: 'modified' as const,
} satisfies Record<string, DropZone>

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

  const originalDropZoneRef = useRef<HTMLDivElement | null>(null)
  const modifiedDropZoneRef = useRef<HTMLDivElement | null>(null)

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

  const readImageFile = async (file: File, side: DropZone) => {
    if (!file.type.startsWith('image/')) {
      // eslint-disable-next-line no-alert
      alert('请选择图片文件')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    const imageInfo = await getImageInfo(file, imageUrl)

    if (side === DROP_ZONE.ORIGINAL) {
      if (originalImage) {
        URL.revokeObjectURL(originalImage)
      }
      setOriginalImage(imageUrl)
      setOriginalImageInfo(imageInfo)
    } else {
      if (modifiedImage) {
        URL.revokeObjectURL(modifiedImage)
      }
      setModifiedImage(imageUrl)
      setModifiedImageInfo(imageInfo)
    }
  }

  const { isDragging, activeDropZone, registerDropZone } =
    useDragAndDrop<DropZone>({
      onFilesDrop: (files, dropZone) => {
        const file = files[0]
        readImageFile(file, dropZone)
      },
    })

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: DropZone,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      readImageFile(file, side)
    }
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const renderSideBySideView = () => (
    <div className="flex-1 flex">
      {/* Original Image */}
      <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Original
          </span>
          {originalImageInfo && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {originalImageInfo.name} • {originalImageInfo.dimensions.width}×
              {originalImageInfo.dimensions.height} •{' '}
              {formatFileSize(originalImageInfo.size)}
            </div>
          )}
        </div>
        <div
          ref={originalDropZoneRef}
          className={`flex-1 flex items-center justify-center relative ${
            !originalImage
              ? 'border-2 border-dashed border-gray-300 dark:border-gray-600'
              : ''
          }`}
        >
          {originalImage ? (
            <img
              src={originalImage}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center">
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
              <div className="mt-2">
                <label htmlFor="original-file" className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500">
                    上传图片
                  </span>
                  <input
                    id="original-file"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleFileInput(e, DROP_ZONE.ORIGINAL)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">或拖拽图片到此处</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modified Image */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            对比图
          </span>
          {modifiedImageInfo && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {modifiedImageInfo.name} • {modifiedImageInfo.dimensions.width}×
              {modifiedImageInfo.dimensions.height} •{' '}
              {formatFileSize(modifiedImageInfo.size)}
            </div>
          )}
        </div>
        <div
          ref={modifiedDropZoneRef}
          className={`flex-1 flex items-center justify-center relative ${
            !modifiedImage
              ? 'border-2 border-dashed border-gray-300 dark:border-gray-600'
              : ''
          }`}
        >
          {modifiedImage ? (
            <img
              src={modifiedImage}
              alt="Modified"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center">
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
              <div className="mt-2">
                <label htmlFor="modified-file" className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500">
                    上传图片
                  </span>
                  <input
                    id="modified-file"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleFileInput(e, DROP_ZONE.MODIFIED)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">或拖拽图片到此处</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderOverlayView = () => (
    <div className="flex-1 flex flex-col">
      <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          叠加对比
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">透明度:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-xs text-gray-500 w-8">{overlayOpacity}%</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative bg-gray-100 dark:bg-gray-900">
        {originalImage && modifiedImage ? (
          <div className="relative">
            <img
              src={originalImage}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
            <img
              src={modifiedImage}
              alt="Modified"
              className="absolute top-0 left-0 max-w-full max-h-full object-contain"
              style={{ opacity: overlayOpacity / 100 }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>请先上传两张图片以使用叠加对比功能</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderSliderView = () => (
    <div className="flex-1 flex flex-col">
      <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          滑动对比
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">位置:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-xs text-gray-500 w-8">{sliderPosition}%</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {originalImage && modifiedImage ? (
          <div className="relative">
            <img
              src={originalImage}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%`, height: '100%' }}
            >
              <img
                src={modifiedImage}
                alt="Modified"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div
              className="absolute top-0 w-0.5 h-full bg-red-500 shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>请先上传两张图片以使用滑动对比功能</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderCurrentView = () => {
    switch (comparisonMode) {
      case COMPARISON_MODES.SIDE_BY_SIDE:
        return renderSideBySideView()
      case COMPARISON_MODES.OVERLAY:
        return renderOverlayView()
      case COMPARISON_MODES.SLIDER:
        return renderSliderView()
      case COMPARISON_MODES.DIFFERENCE:
        return <ComingSoon />
      default:
        return renderSideBySideView()
    }
  }

  // 注册拖拽区域
  if (originalDropZoneRef.current) {
    registerDropZone(originalDropZoneRef.current, DROP_ZONE.ORIGINAL)
  }
  if (modifiedDropZoneRef.current) {
    registerDropZone(modifiedDropZoneRef.current, DROP_ZONE.MODIFIED)
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
      <div className="flex-1 flex flex-col relative">
        {renderCurrentView()}

        {/* Drag Overlay */}
        {isDragging && (
          <>
            <div
              className={`absolute top-0 left-0 w-1/2 h-full pointer-events-none transition-all duration-200 ${
                activeDropZone === DROP_ZONE.ORIGINAL
                  ? 'bg-blue-500/20 border-2 border-blue-500 border-dashed'
                  : 'bg-gray-500/10'
              }`}
            >
              {activeDropZone === DROP_ZONE.ORIGINAL && (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
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
                      <span>拖拽更新原图</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-all duration-200 ${
                activeDropZone === DROP_ZONE.MODIFIED
                  ? 'bg-green-500/20 border-2 border-green-500 border-dashed'
                  : 'bg-gray-500/10'
              }`}
            >
              {activeDropZone === DROP_ZONE.MODIFIED && (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
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
                      <span>拖拽更新对比图</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
