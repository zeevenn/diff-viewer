import { DropZone } from '@/components/common/drop-zone'
import { Card } from '@/components/ui/card'

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
    <div className="flex-1 flex gap-2 p-4">
      {/* Original Image */}
      <DropZone
        onFilesSelect={(files: FileList) => onOriginalImageSelect(files)}
        validation={{ accept: ['image/*'], maxCount: 1 }}
        className="flex-1"
      >
        <DropZone.Content
          className={`flex-1 flex items-center justify-center rounded-lg ${!originalImage ? 'border-2 border-dashed border-border' : ''
          }`}
        >
          {originalImage
            ? (
                <Card className="p-2">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </Card>
              )
            : (
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
        className="flex-1"
      >
        <DropZone.Content
          className={`flex-1 flex items-center justify-center rounded-lg ${!modifiedImage ? 'border-2 border-dashed border-border' : ''
          }`}
        >
          {modifiedImage
            ? (
                <Card className="p-2">
                  <img
                    src={modifiedImage}
                    alt="Modified"
                    className="max-w-full max-h-full object-contain"
                  />
                </Card>
              )
            : (
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
