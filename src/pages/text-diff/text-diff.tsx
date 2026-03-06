import type { MergeView } from '@codemirror/merge'
import { CloudUpload } from 'lucide-react'
import { useState } from 'react'

import { CodeMirrorMerge } from '@/components/common'
import { Typography } from '@/components/ui/typography'

import { useDragAndDrop } from '../../hooks/use-drag-and-drop'

type DropZone = 'original' | 'modified'

const DROP_ZONE = {
  ORIGINAL: 'original' as const,
  MODIFIED: 'modified' as const,
} satisfies Record<string, DropZone>

export function TextDiff() {
  const [originalText, setOriginalText] = useState(
    'function hello() {\n  console.log("Hello World");\n}',
  )
  const [modifiedText, setModifiedText] = useState(
    'function hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}',
  )

  const formatContentIfJSON = (content: string): string => {
    try {
      const formatted = JSON.stringify(JSON.parse(content), null, 2)
      return formatted
    }
    catch {
      return content
    }
  }

  const readFile = (file: File, side: DropZone) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const rawContent = e.target?.result as string
      const content = formatContentIfJSON(rawContent)

      if (side === DROP_ZONE.ORIGINAL) {
        setOriginalText(content)
      }
      else {
        setModifiedText(content)
      }
    }
    reader.readAsText(file)
  }

  const {
    isDragging: isOriginalDragging,
    registerDropZone: registerOriginalDropZone,
  } = useDragAndDrop(null, {
    onFilesDrop: (files) => {
      const file = files[0]
      readFile(file, DROP_ZONE.ORIGINAL)
    },
  })

  const {
    isDragging: isModifiedDragging,
    registerDropZone: registerModifiedDropZone,
  } = useDragAndDrop(null, {
    onFilesDrop: (files) => {
      const file = files[0]
      readFile(file, DROP_ZONE.MODIFIED)
    },
  })

  const handleMount = (view: MergeView) => {
    const aEditor = view.a.dom
    const bEditor = view.b.dom

    if (aEditor) {
      registerOriginalDropZone(aEditor)
    }
    if (bEditor) {
      registerModifiedDropZone(bEditor)
    }
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <CodeMirrorMerge
        originalValue={originalText}
        modifiedValue={modifiedText}
        onOriginalChange={setOriginalText}
        onModifiedChange={setModifiedText}
        onOriginalPaste={formatContentIfJSON}
        onModifiedPaste={formatContentIfJSON}
        onMount={handleMount}
      />

      {/* Original Drop Overlay */}
      {isOriginalDragging && (
        <div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none bg-primary/20 border-2 border-primary border-dashed">
          <div className="flex items-center justify-center h-full">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <CloudUpload className="size-5" />
                <Typography variant="small">
                  Drag to update original content
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modified Drop Overlay */}
      {isModifiedDragging && (
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none bg-accent/20 border-2 border-accent-foreground border-dashed">
          <div className="flex items-center justify-center h-full">
            <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <CloudUpload className="size-5" />
                <Typography variant="small">
                  Drag to update modified content
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
