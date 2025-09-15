interface FooterProps {
  className?: string;
}

export const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer
      className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            Diff Viewer - A simple real-time diff viewer built with monaco
            editor.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com/zeevenn/diff-viewer/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
            >
              Report Bug
            </a>
            <a
              href="https://github.com/zeevenn/diff-viewer/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
            >
              Feature Request
            </a>
            <a
              href="https://github.com/zeevenn/diff-viewer/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
            >
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
