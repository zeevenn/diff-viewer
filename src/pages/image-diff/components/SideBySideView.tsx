import { DropZone } from '../../../components/ui'

interface SideBySideViewProps {
  originalImage: string | null
  modifiedImage: string | null
  onOriginalImageSelect: (files: FileList) => void
  onModifiedImageSelect: (files: FileList) => void
}

export function SideBySideView({
  originalImage,
  modifiedImage,
  onOriginalImageSelect,
  onModifiedImageSelect,
}: SideBySideViewProps) {
  return (
    <div className="flex-1 flex">
      {/* Original Image */}
      <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <DropZone
          onFilesSelect={(files: FileList) => onOriginalImageSelect(files)}
          validation={{ accept: ['image/*'], maxCount: 1 }}
          className="flex-1"
        >
          <DropZone.Content
            className={`flex-1 flex items-center justify-center ${
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
              <DropZone.Input accept="image/*">
                <DropZone.Message
                  title="上传图片"
                  description="或拖拽图片到此处"
                />
              </DropZone.Input>
            )}
          </DropZone.Content>
          <DropZone.Overlay position="full">
            <DropZone.DragIndicator className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <span>拖拽更新原图</span>
            </DropZone.DragIndicator>
          </DropZone.Overlay>
        </DropZone>
      </div>

      {/* Modified Image */}
      <div className="flex-1 flex flex-col">
        <DropZone
          onFilesSelect={(files: FileList) => onModifiedImageSelect(files)}
          validation={{ accept: ['image/*'], maxCount: 1 }}
          className="flex-1"
        >
          <DropZone.Content
            className={`flex-1 flex items-center justify-center ${
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
              <DropZone.Input accept="image/*">
                <DropZone.Message
                  title="上传图片"
                  description="或拖拽图片到此处"
                />
              </DropZone.Input>
            )}
          </DropZone.Content>
          <DropZone.Overlay position="full">
            <DropZone.DragIndicator className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <span>拖拽更新对比图</span>
            </DropZone.DragIndicator>
          </DropZone.Overlay>
        </DropZone>
      </div>
    </div>
  )
}
