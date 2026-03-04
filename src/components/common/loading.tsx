import { Skeleton } from '@/components/ui/skeleton'

export const Loading = () => {
  return (
    <div className="flex space-x-1.5">
      <Skeleton className="size-2 rounded-full" />
      <Skeleton className="size-2 rounded-full [animation-delay:0.2s]" />
      <Skeleton className="size-2 rounded-full [animation-delay:0.4s]" />
    </div>
  )
}
