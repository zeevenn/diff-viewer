import { Loading } from './Loading'

interface ComingSoonProps {
  title?: string
  description?: string
  className?: string
}

export function ComingSoon({
  title = 'Coming Soon',
  description = 'This feature is under development and will be available soon.',
  className = '',
}: ComingSoonProps) {
  return (
    <div
      className={`flex-1 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md shadow-lg ${className}`}
    >
      <div className="text-center p-12 max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      </div>
    </div>
  )
}
