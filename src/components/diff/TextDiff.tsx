import { DiffEditor, type MonacoDiffEditor } from '@monaco-editor/react'
import { useRef, useState } from 'react'

import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useTheme } from '../../hooks/useTheme'

interface TextDiffProps {
  className?: string
}

type DropZone = 'original' | 'modified'

const DROP_ZONE = {
  ORIGINAL: 'original' as const,
  MODIFIED: 'modified' as const,
} satisfies Record<string, DropZone>

export const TextDiff = ({ className = '' }: TextDiffProps) => {
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

  const { isDragging, activeDropZone, registerDropZone } =
    useDragAndDrop<DropZone>({
      onFilesDrop: (files, dropZone) => {
        const file = files[0]
        readFile(file, dropZone)
      },
    })

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor
    originalDropZoneRef.current = editor.getOriginalEditor().getDomNode()
    modifiedDropZoneRef.current = editor.getModifiedEditor().getDomNode()
    if (originalDropZoneRef.current) {
      registerDropZone(originalDropZoneRef.current, DROP_ZONE.ORIGINAL)
    }
    if (modifiedDropZoneRef.current) {
      registerDropZone(modifiedDropZoneRef.current, DROP_ZONE.MODIFIED)
    }
  }

  const readFile = (file: File, side: DropZone) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (side === DROP_ZONE.ORIGINAL) {
        setOriginalText(content)
      } else {
        setModifiedText(content)
      }
    }
    reader.readAsText(file)
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
            onClick={loadSampleData}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md cursor-pointer transition-colors"
          >
            Load Sample
          </button>
          <button
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
                      <span>Drag to update original content</span>
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
                      <span>Drag to update modified content</span>
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
