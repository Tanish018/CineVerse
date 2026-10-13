import React from 'react';
import { Film } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Film,
  title = 'No items found',
  description = 'There are no records available at this moment.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center bg-[#0D1117]/60 border border-gray-800/80 rounded-2xl max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-gray-400 mb-5 leading-relaxed max-w-xs">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-500/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
