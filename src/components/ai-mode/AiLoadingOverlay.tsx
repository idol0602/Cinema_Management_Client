'use client';

export function AiLoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center p-3 sm:p-4">
      <div className="w-full max-w-xs rounded-2xl border border-orange-100/70 bg-white/90 p-5 shadow-xl shadow-orange-500/10 backdrop-blur-sm dark:border-orange-900/40 dark:bg-gray-900/85">
        <div className="flex flex-col items-center gap-4">
          {/* Animated rings */}
          <div className="relative h-14 w-14 sm:h-16 sm:w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20" />
            <div className="absolute inset-1 animate-pulse rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-9 w-9 animate-spin text-orange-500 sm:h-10 sm:w-10"
                viewBox="0 0 24 24"
                fill="none"
              >
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
            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500">
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
    </div>
  );
}
