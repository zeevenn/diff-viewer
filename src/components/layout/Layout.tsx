import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${className}`}>
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
