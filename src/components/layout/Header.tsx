import { SiGithub } from '@icons-pack/react-simple-icons'
import { Link, useLocation } from 'react-router'

import { Logo } from '../common/logo'
import { Button } from '../ui/button'
import { Typography } from '../ui/typography'

interface HeaderProps {
  className?: string
}

export function Header({ className = '' }: HeaderProps) {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`bg-background border-b border-border shadow-sm ${className}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <Typography variant="h4" className="text-foreground">
                Diff Viewer
              </Typography>
            </Link>

            {/* Navigation */}
            <nav className="flex space-x-1">
              <Button
                variant={isActive('/') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/">Text Diff</Link>
              </Button>
              <Button
                variant={isActive('/image') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/image">Image Diff</Link>
              </Button>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/zeevenn/diff-viewer"
                target="_blank"
                rel="noopener noreferrer"
                title="View on GitHub"
              >
                <SiGithub />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
