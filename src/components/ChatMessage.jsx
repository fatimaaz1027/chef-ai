import React from 'react';
import ReactMarkdown from 'react-markdown';

import RecipeCard from './RecipeCard';
import SkeletonLoader from './SkeletonLoader';

export default function ChatMessage({ message, onOpenGrocery, onSelectSimilar }) {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end fade-up">
        <div className="user-bubble text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl rounded-tr-md max-w-[85%] sm:max-w-[80%] shadow-md">
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  if (message.type === 'typing') {
    return <SkeletonLoader />;
  }

  if (message.type === 'bot' || message.type === 'text') {
    return (
      <div className="flex justify-start fade-up">
        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 sm:px-5 py-3 rounded-2xl rounded-tl-md max-w-[85%] sm:max-w-[80%] shadow-md border border-gray-100 dark:border-slate-700/80">
          <div className="text-xs sm:text-sm font-medium leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'recipe' && message.recipe) {
    return (
      <div className="flex justify-start fade-up">
        <RecipeCard
          recipe={message.recipe}
          onOpenGrocery={onOpenGrocery}
          onSelectSimilar={onSelectSimilar}
        />
      </div>
    );
  }

  return null;
}
