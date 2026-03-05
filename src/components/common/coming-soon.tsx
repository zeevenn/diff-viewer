import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Loading } from './loading'

interface ComingSoonProps {
  title?: string
  description?: string
  className?: string
}

export function ComingSoon({
  title = 'Coming Soon',
  description = 'This feature is under development and will be available soon.',
}: ComingSoonProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loading />
        </CardContent>
      </Card>
    </div>
  )
}
