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
    <div className="flex-1 flex gap-2">
      {/* Original Image */}
      <DropZone
        onFilesSelect={(files: FileList) => onOriginalImageSelect(files)}
        validation={{ accept: ['image/*'], maxCount: 1 }}
        className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <DropZone.Content
          className={`flex-1 flex items-center justify-center rounded-lg shadow-lg ${
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
                title="Drop image here"
                description="jpg, png, webp, gif, etc."
              />
            </DropZone.Input>
          )}
        </DropZone.Content>
        <DropZone.Overlay className="rounded-lg" />
      </DropZone>

      {/* Modified Image */}
      <DropZone
        onFilesSelect={(files: FileList) => onModifiedImageSelect(files)}
        validation={{ accept: ['image/*'], maxCount: 1 }}
        className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <DropZone.Content
          className={`flex-1 flex items-center justify-center rounded-lg shadow-lg ${
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
                title="Drop image here"
                description="jpg, png, webp, gif, etc."
              />
            </DropZone.Input>
          )}
        </DropZone.Content>
        <DropZone.Overlay className="rounded-lg" />
      </DropZone>
    </div>
  )
}
