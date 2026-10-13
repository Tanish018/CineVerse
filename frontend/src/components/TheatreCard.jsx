import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tv, ChevronRight } from 'lucide-react';

const TheatreCard = ({ theatre }) => {
  return (
    <div className="bg-[#111827] border border-gray-800/80 hover:border-gray-700 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
            {theatre.name}
          </h3>
          <span className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider uppercase bg-gray-800 text-gray-300 border border-gray-700/60">
            {theatre.city}
          </span>
        </div>

        <p className="text-xs text-gray-400 flex items-start gap-1.5 mb-4 line-clamp-2 leading-relaxed">
          <MapPin className="w-3.5 h-3.5 text-[#EF233C] shrink-0 mt-0.5" />
          <span>{theatre.address}{theatre.pincode ? ` - ${theatre.pincode}` : ''}</span>
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 rounded-xl px-3 py-2 border border-gray-800/80 mb-4">
          <Tv className="w-4 h-4 text-amber-400" />
          <span>
            <strong className="text-white font-semibold">{theatre.numberOfScreens}</strong> Premium Screens
          </span>
        </div>
      </div>

      <Link
        to={`/theatres/${theatre.id}`}
        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gray-800 hover:bg-[#EF233C] transition-colors"
      >
        View Theatre Shows
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default TheatreCard;
