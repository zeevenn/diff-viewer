import type { MonacoDiffEditor } from '@monaco-editor/react'
import { DiffEditor } from '@monaco-editor/react'
import { useRef, useState } from 'react'

import { DragIndicator, DragOverlay } from '../components/ui/DragOverlay'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { useTheme } from '../hooks/useTheme'

interface TextDiffProps {
  className?: string
}

type DropZone = 'original' | 'modified'

const DROP_ZONE = {
  ORIGINAL: 'original' as const,
  MODIFIED: 'modified' as const,
} satisfies Record<string, DropZone>

export function TextDiff({ className = '' }: TextDiffProps) {
  const [originalText, setOriginalText] = useState(
    'function hello() {\n  console.log("Hello World");\n}',
  )
  const [modifiedText, setModifiedText] = useState(
    'function hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}',
  )
  const editorRef = useRef<MonacoDiffEditor | null>(null)
  const originalDropZoneRef = useRef<HTMLElement | null>(null)
  const modifiedDropZoneRef = useRef<HTMLElement | null>(null)
  const { theme } = useTheme()

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
    <div
      className={`flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
    >
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

      {/* Diff Editor */}
      <div className="flex-1 flex flex-col relative">
        <DiffEditor
          wrapperProps={{
            className: 'flex-1',
          }}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
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
  )
}
