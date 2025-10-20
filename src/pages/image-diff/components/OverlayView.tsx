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
  return (
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
            onChange={(e) => onOpacityChange(Number(e.target.value))}
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
}
