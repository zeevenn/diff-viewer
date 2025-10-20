import type { ReactNode } from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors ${className}`}
    >
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
