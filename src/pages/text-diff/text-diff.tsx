import type { MonacoDiffEditor } from '@monaco-editor/react'
import { DiffEditor } from '@monaco-editor/react'
import { CloudUpload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

import { useTheme } from '../../context/theme-provider'
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
  const editorRef = useRef<MonacoDiffEditor | null>(null)
  const originalDropZoneRef = useRef<HTMLElement | null>(null)
  const modifiedDropZoneRef = useRef<HTMLElement | null>(null)
  const { resolvedTheme } = useTheme()

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

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor
    originalDropZoneRef.current = editor.getOriginalEditor().getDomNode()
    modifiedDropZoneRef.current = editor.getModifiedEditor().getDomNode()

    if (originalDropZoneRef.current) {
      registerOriginalDropZone(originalDropZoneRef.current)
    }
    if (modifiedDropZoneRef.current) {
      registerModifiedDropZone(modifiedDropZoneRef.current)
    }

    const originalEditor = editor.getOriginalEditor()
    const modifiedEditor = editor.getModifiedEditor()

    originalEditor.onDidPaste(() => {
      const content = originalEditor.getValue()
      const formattedContent = formatContentIfJSON(content)
      if (content !== formattedContent) {
        originalEditor.setValue(formattedContent)
        setOriginalText(formattedContent)
      }
    })

    modifiedEditor.onDidPaste(() => {
      const content = modifiedEditor.getValue()
      const formattedContent = formatContentIfJSON(content)
      if (content !== formattedContent) {
        modifiedEditor.setValue(formattedContent)
        setModifiedText(formattedContent)
      }
    })
  }

  return (
    <Card className="flex-1 flex flex-col py-0 gap-0">
      {/* Diff Editor */}
      <CardContent className="flex-1 flex flex-col relative p-0">
        <DiffEditor
          wrapperProps={{
            className: 'flex-1',
          }}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
          original={originalText}
          modified={modifiedText}
          onMount={handleEditorDidMount}
          options={{
            readOnly: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            enableSplitViewResizing: false,
            ignoreTrimWhitespace: false,
            renderIndicators: true,
            originalEditable: true,
          }}
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
      </CardContent>
    </Card>
  )
}
