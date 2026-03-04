<<<<<<< HEAD:src/pages/text-diff/text-diff.tsx
import type { MonacoDiffEditor } from '@monaco-editor/react'
import { DiffEditor } from '@monaco-editor/react'
import { useRef, useState } from 'react'

<<<<<<<< HEAD:src/pages/text-diff/index.tsx
import { DragIndicator, DragOverlay } from '../../components/ui'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useTheme } from '../../hooks/useTheme'
========
import { useDragAndDrop } from '../../hooks/use-drag-and-drop'
import { useTheme } from '../../hooks/use-theme'
>>>>>>>> c2557cf (chore: integrate shadcn/ui):src/pages/text-diff/text-diff.tsx
=======
import { DiffEditor, type MonacoDiffEditor } from '@monaco-editor/react'
import { CloudUpload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

import { useTheme } from '../../context/theme-provider'
import { useDragAndDrop } from '../../hooks/use-drag-and-drop'

interface TextDiffProps {
  className?: string
}
>>>>>>> 1eb466a (chore: migrate to shadcn/ui):src/components/diff/text-diff.tsx

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
    } catch {
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
      } else {
        setModifiedText(content)
      }
    }
    reader.readAsText(file)
  }

<<<<<<< HEAD:src/pages/text-diff/text-diff.tsx
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

  const refreshEditor = () => {
    if (
      editorRef.current &&
      editorRef.current.getOriginalEditor &&
      editorRef.current.getModifiedEditor
    ) {
      editorRef.current.getOriginalEditor().setValue(originalText)
      editorRef.current.getModifiedEditor().setValue(modifiedText)
    }
  }

  const clearContent = () => {
    setOriginalText('')
    setModifiedText('')
    refreshEditor()
  }

  const loadSampleData = () => {
    const newOriginal = 'function hello() {\n  console.log("Hello World");\n}'
    const newModified =
      'function hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}'

    setOriginalText(newOriginal)
    setModifiedText(newModified)
    refreshEditor()
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Original: {originalText.split('\n').length} lines</span>
          <span>Modified: {modifiedText.split('\n').length} lines</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadSampleData}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md cursor-pointer transition-colors"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={clearContent}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md cursor-pointer transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

=======
  return (
    <Card className={`flex-1 flex flex-col py-0 gap-0 ${className}`}>
>>>>>>> 1eb466a (chore: migrate to shadcn/ui):src/components/diff/text-diff.tsx
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

<<<<<<< HEAD:src/pages/text-diff/text-diff.tsx
        <DragOverlay
          isDragging={isOriginalDragging}
          position="left"
          className="bg-blue-500/20 border-2 border-blue-500 border-dashed"
        >
          <DragIndicator className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <span>Drag to update original content</span>
          </DragIndicator>
        </DragOverlay>

        <DragOverlay
          isDragging={isModifiedDragging}
          position="right"
          className="bg-green-500/20 border-2 border-green-500 border-dashed"
        >
          <DragIndicator className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <span>Drag to update modified content</span>
          </DragIndicator>
        </DragOverlay>
      </div>
    </div>
=======
        {isDragging && (
          <>
            <div
              className={`absolute top-0 left-0 w-1/2 h-full pointer-events-none transition-all duration-200 ${
                activeDropZone === DROP_ZONE.ORIGINAL
                  ? 'bg-primary/20 border-2 border-primary border-dashed'
                  : 'bg-muted/50'
              }`}
            >
              {activeDropZone === DROP_ZONE.ORIGINAL && (
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
              )}
            </div>

            <div
              className={`absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-all duration-200 ${
                activeDropZone === DROP_ZONE.MODIFIED
                  ? 'bg-accent/20 border-2 border-accent-foreground border-dashed'
                  : 'bg-muted/50'
              }`}
            >
              {activeDropZone === DROP_ZONE.MODIFIED && (
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
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
>>>>>>> 1eb466a (chore: migrate to shadcn/ui):src/components/diff/text-diff.tsx
  )
}
