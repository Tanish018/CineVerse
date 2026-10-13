import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Armchair, Ticket } from 'lucide-react';
import { formatTime, formatCurrency } from '../utils/formatters';

const ShowCard = ({ show, screenInfo, theatreName }) => {
  return (
    <div className="bg-[#111827] border border-gray-800 hover:border-gray-700 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[#EF233C] text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(show.startTime)}</span>
            </div>
            <span className="text-xs text-gray-500">to {formatTime(show.endTime)}</span>
          </div>

          {screenInfo?.screenType && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-amber-400 border border-amber-500/20">
              {screenInfo.screenType}
            </span>
          )}
        </div>

        {theatreName && (
          <h4 className="text-sm font-semibold text-white truncate mb-1">
            {theatreName}
          </h4>
        )}

        {show.language && (
          <span className="inline-flex mb-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {show.language}
          </span>
        )}

        <div className="text-xs text-gray-400 mb-4">
          <span>{screenInfo?.name || `Screen ${show.screenId}`}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-2 bg-gray-900/60 rounded-xl border border-gray-800/80 mb-4 text-center">
          <div>
            <span className="block text-[10px] text-gray-500 uppercase">Regular</span>
            <span className="text-xs font-semibold text-white">{formatCurrency(show.regularPrice)}</span>
          </div>
          <div className="border-x border-gray-800">
            <span className="block text-[10px] text-amber-400/80 uppercase">Premium</span>
            <span className="text-xs font-semibold text-amber-300">{formatCurrency(show.premiumPrice)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-purple-400/80 uppercase">Recliner</span>
            <span className="text-xs font-semibold text-purple-300">{formatCurrency(show.reclinerPrice)}</span>
          </div>
        </div>
      </div>

      <Link
        to={`/shows/${show.id}/seats`}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
      >
        <Ticket className="w-3.5 h-3.5" />
        Select Seats
      </Link>
    </div>
  );
};

export default ShowCard;
