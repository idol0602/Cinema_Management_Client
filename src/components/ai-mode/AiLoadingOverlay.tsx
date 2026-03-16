'use client';

export function AiLoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-transparent backdrop-blur-0">
      <div className="flex flex-col items-center gap-4">
        {/* Animated rings */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20" />
          <div className="absolute inset-1 animate-pulse rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-10 w-10 animate-spin text-orange-500" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="31.42 31.42"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/50" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            AI đang xử lý
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>
              ●
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>
              ●
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>
              ●
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
