import React from 'react';
import { Film } from 'lucide-react';

const Loading = ({ message = 'Loading MovieVerse experiences...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center animate-in fade-in duration-300">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EF233C]/20 to-[#DC143C]/10 border border-[#EF233C]/30 flex items-center justify-center animate-pulse">
          <Film className="w-8 h-8 text-[#EF233C] animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-[#EF233C] blur-xl opacity-20 animate-pulse"></div>
      </div>
      <p className="text-sm font-medium text-gray-400 tracking-wide">{message}</p>
    </div>
  );
};

export default Loading;
