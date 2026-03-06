import type { LanguageSupport } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { defaultHighlightStyle, foldGutter, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { MergeView } from '@codemirror/merge'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, lineNumbers } from '@codemirror/view'
import { useEffect, useRef } from 'react'

import { useTheme } from '@/context/theme-provider'

export interface CodeMirrorMergeProps {
  originalValue: string
  modifiedValue: string
  onOriginalChange?: (value: string) => void
  onModifiedChange?: (value: string) => void
  onOriginalPaste?: (value: string) => string | void
  onModifiedPaste?: (value: string) => string | void
  originalExtensions?: Extension[]
  modifiedExtensions?: Extension[]
  language?: LanguageSupport
  className?: string
  onMount?: (view: MergeView) => void
}

export function CodeMirrorMerge({
  originalValue,
  modifiedValue,
  onOriginalChange,
  onModifiedChange,
  onOriginalPaste,
  onModifiedPaste,
  originalExtensions = [],
  modifiedExtensions = [],
  language,
  className,
  onMount,
}: CodeMirrorMergeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mergeViewRef = useRef<MergeView | null>(null)
  const { resolvedTheme } = useTheme()

  // Store latest callbacks in refs to avoid recreation
  const callbacksRef = useRef({
    onOriginalChange,
    onModifiedChange,
    onOriginalPaste,
    onModifiedPaste,
  })
  callbacksRef.current = {
    onOriginalChange,
    onModifiedChange,
    onOriginalPaste,
    onModifiedPaste,
  }

  const getBaseExtensions = (): Extension[] => {
    const baseExtensions: Extension[] = [
      lineNumbers(),
      foldGutter(),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.lineWrapping,
      EditorState.allowMultipleSelections.of(true),
    ]

    if (language) {
      baseExtensions.push(language)
    }

    if (resolvedTheme === 'dark') {
      return [...baseExtensions, oneDark]
    }
    return baseExtensions
  }

  // Create and manage the MergeView
  useEffect(() => {
    if (!containerRef.current)
      return

    // Clean up previous instance
    if (mergeViewRef.current) {
      mergeViewRef.current.destroy()
    }

    const baseExtensions = getBaseExtensions()

    const mergeView = new MergeView({
      a: {
        doc: originalValue,
        extensions: [
          ...baseExtensions,
          ...originalExtensions,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              callbacksRef.current.onOriginalChange?.(update.state.doc.toString())
            }
          }),
          EditorView.domEventHandlers({
            paste: (_event, view) => {
              queueMicrotask(() => {
                const content = view.state.doc.toString()
                const transformed = callbacksRef.current.onOriginalPaste?.(content)
                if (typeof transformed === 'string' && content !== transformed) {
                  view.dispatch({
                    changes: { from: 0, to: content.length, insert: transformed },
                  })
                  callbacksRef.current.onOriginalChange?.(transformed)
                }
              })
              return false
            },
          }),
        ],
      },
      b: {
        doc: modifiedValue,
        extensions: [
          ...baseExtensions,
          ...modifiedExtensions,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              callbacksRef.current.onModifiedChange?.(update.state.doc.toString())
            }
          }),
          EditorView.domEventHandlers({
            paste: (_event, view) => {
              queueMicrotask(() => {
                const content = view.state.doc.toString()
                const transformed = callbacksRef.current.onModifiedPaste?.(content)
                if (typeof transformed === 'string' && content !== transformed) {
                  view.dispatch({
                    changes: { from: 0, to: content.length, insert: transformed },
                  })
                  callbacksRef.current.onModifiedChange?.(transformed)
                }
              })
              return false
            },
          }),
        ],
      },
      parent: containerRef.current,
      gutter: true,
      highlightChanges: true,
    })

    mergeViewRef.current = mergeView
    onMount?.(mergeView)

    return () => {
      mergeView.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme])

  // Update content when props change externally
  useEffect(() => {
    if (!mergeViewRef.current)
      return

    const currentOriginal = mergeViewRef.current.a.state.doc.toString()
    if (currentOriginal !== originalValue) {
      mergeViewRef.current.a.dispatch({
        changes: { from: 0, to: currentOriginal.length, insert: originalValue },
      })
    }
  }, [originalValue])

  useEffect(() => {
    if (!mergeViewRef.current)
      return

    const currentModified = mergeViewRef.current.b.state.doc.toString()
    if (currentModified !== modifiedValue) {
      mergeViewRef.current.b.dispatch({
        changes: { from: 0, to: currentModified.length, insert: modifiedValue },
      })
    }
  }, [modifiedValue])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className ?? ''}`}
    />
  )
}

export { type MergeView }
