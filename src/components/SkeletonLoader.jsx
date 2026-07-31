import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function SkeletonLoader() {
  const [statusIdx, setStatusIdx] = useState(0);
  const statusMessages = [
    "Analyzing your ingredients...",
    "Searching culinary database...",
    "Calculating nutrition macros & calories...",
    "Crafting step-by-step instructions & chef tips..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statusMessages.length);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-start fade-up">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl rounded-bl-md p-6 max-w-[92%] w-full shadow-md border border-emerald-100/60 dark:border-slate-700/60 space-y-4">
        {/* Status Header */}
        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
          <span className="text-xs font-semibold tracking-wide animate-pulse">
            {statusMessages[statusIdx]}
          </span>
        </div>

        {/* Title Skeleton */}
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3 shimmer"></div>

        {/* Macros Grid Skeleton */}
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          <div className="h-14 bg-slate-100 dark:bg-slate-700/60 rounded-xl shimmer"></div>
          <div className="h-14 bg-slate-100 dark:bg-slate-700/60 rounded-xl shimmer"></div>
          <div className="h-14 bg-slate-100 dark:bg-slate-700/60 rounded-xl shimmer"></div>
          <div className="h-14 bg-slate-100 dark:bg-slate-700/60 rounded-xl shimmer"></div>
        </div>

        {/* Time Tags Skeleton */}
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700/60 rounded-lg shimmer"></div>
          <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700/60 rounded-lg shimmer"></div>
        </div>

        {/* Ingredients Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-4 w-28 bg-emerald-100/60 dark:bg-emerald-950/40 rounded shimmer"></div>
          <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-700/60 rounded shimmer"></div>
          <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-700/60 rounded shimmer"></div>
          <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-700/60 rounded shimmer"></div>
        </div>
      </div>
    </div>
  );
}
