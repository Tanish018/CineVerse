import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Ticket, Film } from 'lucide-react';
import { formatDuration, formatDate } from '../utils/formatters';

const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-[#101a2b] border border-white/5 hover:border-[#EF233C]/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col h-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-600 p-4 text-center">
            <Film className="w-12 h-12 mb-2 text-gray-500 group-hover:text-[#EF233C] transition-colors" />
            <span className="text-xs font-semibold text-gray-400 line-clamp-2">{movie.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
            {movie.language || 'English'}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-[#EF233C]/80 backdrop-blur-md text-white shadow-sm">
            {movie.genre?.split(',')[0]}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
          <Link
            to={`/movies/${movie.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] shadow-lg shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Ticket className="w-4 h-4" />
            Book Tickets
          </Link>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-grow">
        <Link to={`/movies/${movie.id}`}>
          <h3 className="text-sm font-bold text-white group-hover:text-[#EF233C] transition-colors line-clamp-1 mb-1.5">
            {movie.title}
          </h3>
        </Link>

        {movie.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {movie.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            {formatDuration(movie.durationMinutes)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            {formatDate(movie.releaseDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
