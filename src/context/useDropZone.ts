import { use } from 'react'
import { DropZoneContext } from '../components/ui/DropZone'

export function useDropZone() {
  const context = use(DropZoneContext)
  if (!context) {
    throw new Error('useDropZone must be used within a DropZone component')
  }
  return context
}
