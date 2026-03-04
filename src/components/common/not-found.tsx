import { ArrowLeft, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="max-w-lg text-center">
        <CardHeader>
          <Typography variant="h1">404</Typography>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription className="leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link to="/">
              <Home />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft />
            Go Back
          </Button>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Separator />
          <Typography variant="muted">Available pages:</Typography>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="link" size="sm" asChild>
              <Link to="/">Text Diff</Link>
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link to="/image">Image Diff</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
