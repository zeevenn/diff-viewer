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
  return (
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
            onChange={(e) => onPositionChange(Number(e.target.value))}
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
}
