import { useNavigate } from 'react-router'

export const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md shadow-lg">
      <div className="flex-1 p-3 sm:p-4 md:p-6 text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
            404
          </h1>
        </div>

        {/* Title and Description */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs sm:max-w-none mx-auto">
          <button
            onClick={handleGoHome}
            className="flex-1 sm:flex-none px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[44px] sm:min-h-[48px]"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-sm sm:text-base">Go Home</span>
          </button>

          <button
            onClick={handleGoBack}
            className="flex-1 sm:flex-none px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[44px] sm:min-h-[48px]"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
            Available pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Text Diff
            </button>
            <button
              onClick={() => navigate('/image')}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Image Diff
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
