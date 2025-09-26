export function Loading() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <div
        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDelay: '0.2s' }}
      ></div>
      <div
        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDelay: '0.4s' }}
      ></div>
    </div>
  )
}
