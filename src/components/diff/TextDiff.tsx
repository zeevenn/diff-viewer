import { useState, useRef } from 'react';
import { DiffEditor, type MonacoDiffEditor } from '@monaco-editor/react';
import { useTheme } from '../../hooks/useTheme';

interface TextDiffProps {
  className?: string;
}

export const TextDiff = ({ className = '' }: TextDiffProps) => {
  const [originalText, setOriginalText] = useState('function hello() {\n  console.log("Hello World");\n}');
  const [modifiedText, setModifiedText] = useState('function hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}');
  const editorRef = useRef<MonacoDiffEditor | null>(null);
  const { theme } = useTheme();

  const handleEditorDidMount = (editor: MonacoDiffEditor) => {
    editorRef.current = editor;
  };

  const refreshEditor = () => {
    if (editorRef.current && editorRef.current.getOriginalEditor && editorRef.current.getModifiedEditor) {
      editorRef.current.getOriginalEditor().setValue(originalText);
      editorRef.current.getModifiedEditor().setValue(modifiedText);
    }
  };

  const clearContent = () => {
    setOriginalText('');
    setModifiedText('');
    refreshEditor();
  };

  const loadSampleData = () => {
    const newOriginal = 'function hello() {\n  console.log("Hello World");\n}';
    const newModified = 'function hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}';
    
    setOriginalText(newOriginal);
    setModifiedText(newModified);
    refreshEditor();
  };

  return (
    <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
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
          renderSideBySide: true,
          enableSplitViewResizing: true,
          ignoreTrimWhitespace: false,
          renderIndicators: true,
          originalEditable: true,
        }}
      />
    </div>
  );
};
