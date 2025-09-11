import { Layout } from './components/layout';
import { useDynamicFavicon } from './hooks/useDynamicFavicon';

function App() {
  useDynamicFavicon();

  return (
    <>
      <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome to Diff Viewer
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            A powerful tool for comparing files and visualizing differences. 
            Upload your files and see the changes side by side.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose how you'd like to compare files:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Upload Files
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Paste Text
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">File Comparison</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Compare any text files, code files, or documents side by side
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast & Accurate</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Lightning-fast comparison with precise difference highlighting
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dark Mode</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Beautiful interface with full dark mode support
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}

export default App
