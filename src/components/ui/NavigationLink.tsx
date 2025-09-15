import { Link, useLocation } from 'react-router';

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const NavigationLink = ({ to, children, className = '' }: NavigationLinkProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to) 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      } ${className}`}
    >
      {children}
    </Link>
  );
};
