import { Button } from '../ui/button'
import { Typography } from '../ui/typography'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Typography variant="muted" className="text-center">
            Diff Viewer - A simple real-time diff viewer including text and
            image.
          </Typography>
          <div className="flex mt-4 md:mt-0">
            <Button variant="link" size="sm" asChild>
              <a
                href="https://github.com/zeevenn/diff-viewer/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report Bug
              </a>
            </Button>
            <Button variant="link" size="sm" asChild>
              <a
                href="https://github.com/zeevenn/diff-viewer/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feature Request
              </a>
            </Button>
            <Button variant="link" size="sm" asChild>
              <a
                href="https://github.com/zeevenn/diff-viewer/blob/master/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >
                License
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
