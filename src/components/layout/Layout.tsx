import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors ${className}`}>
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
