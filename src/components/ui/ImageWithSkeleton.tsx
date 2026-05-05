'use client'

import { useEffect, useState, type ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string
}

export default function ImageWithSkeleton({
  className = '',
  skeletonClassName = '',
  onLoad,
  onError,
  alt = '',
  src,
  ...rest
}: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    setState('loading')
  }, [src])

  return (
    <>
      {state !== 'loaded' && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 overflow-hidden ${skeletonClassName}`}
        >
          {state === 'loading' ? (
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-brand-50 via-slate-100 to-brand-50 dark:from-slate-800 dark:via-slate-700/60 dark:to-slate-800">
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-56 w-[150%] -translate-x-1/2 animate-[water-wave_3.6s_ease-in-out_infinite] rounded-[50%] bg-brand-200/40 blur-2xl dark:bg-brand-500/15" />
              <div
                className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[180%] -translate-x-1/2 animate-[water-wave_4.8s_ease-in-out_infinite] rounded-[50%] bg-brand-300/30 blur-3xl dark:bg-brand-500/10"
                style={{ animationDelay: '0.6s' }}
              />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <span className="absolute inset-0 m-auto h-12 w-12 animate-[ripple_2.4s_ease-out_infinite] rounded-2xl bg-brand-500/40 dark:bg-brand-400/40" />
                  <span
                    className="absolute inset-0 m-auto h-12 w-12 animate-[ripple_2.4s_ease-out_infinite] rounded-2xl bg-brand-500/30 dark:bg-brand-400/30"
                    style={{ animationDelay: '0.8s' }}
                  />
                  <span
                    className="absolute inset-0 m-auto h-12 w-12 animate-[ripple_2.4s_ease-out_infinite] rounded-2xl bg-brand-500/20 dark:bg-brand-400/20"
                    style={{ animationDelay: '1.6s' }}
                  />
                  <span className="relative flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-900/30 ring-1 ring-white/40 dark:bg-brand-500 dark:shadow-black/50">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path d="M12 2.5l9 4.5v5c0 5-3.8 9.4-9 10.5-5.2-1.1-9-5.5-9-10.5v-5l9-4.5z" />
                      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                  </svg>
                </span>
                <span className="text-[11px] font-medium">
                  Image unavailable
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      <img
        {...rest}
        src={src}
        alt={alt}
        className={`${className} ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        onLoad={(e) => {
          setState('loaded')
          onLoad?.(e)
        }}
        onError={(e) => {
          setState('error')
          onError?.(e)
        }}
      />
    </>
  )
}
