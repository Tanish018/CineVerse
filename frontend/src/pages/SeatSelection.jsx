import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showService } from '../services/showService';
import { movieService } from '../services/movieService';
import { screenService } from '../services/screenService';
import { theatreService } from '../services/theatreService';
import SeatMap from '../components/SeatMap';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Clock, Calendar, MapPin, Film, ArrowRight, ArrowLeft, Ticket } from 'lucide-react';
import { formatTime, formatDate, formatCurrency } from '../utils/formatters';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [screen, setScreen] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatObjects, setSelectedSeatObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadShowAndSeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [showRes, seatsRes] = await Promise.all([
        showService.getShowById(showId),
        showService.getSeatsByShow(showId),
      ]);

      if (showRes && showRes.data) {
        const showData = showRes.data;
        setShow(showData);

        const [movieRes, screenRes] = await Promise.all([
          movieService.getMovieById(showData.movieId).catch(() => null),
          screenService.getScreenById(showData.screenId).catch(() => null),
        ]);

        if (movieRes && movieRes.data) setMovie(movieRes.data);
        if (screenRes && screenRes.data) {
          setScreen(screenRes.data);
          if (screenRes.data.theatreId) {
            const theatreRes = await theatreService.getTheatreById(screenRes.data.theatreId).catch(() => null);
            if (theatreRes && theatreRes.data) setTheatre(theatreRes.data);
          }
        }
      }

      if (seatsRes && seatsRes.data) {
        setSeats(seatsRes.data);
      }
    } catch (err) {
      console.error('Failed to load show seats:', err);
      setError(err.response?.data?.message || 'Unable to retrieve seat layout for this show.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShowAndSeats();
  }, [showId]);

  const handleToggleSeat = (seat) => {
    const isAlreadySelected = selectedSeatObjects.some((s) => s.seatId === seat.seatId);

    if (isAlreadySelected) {
      setSelectedSeatObjects(selectedSeatObjects.filter((s) => s.seatId !== seat.seatId));
    } else {
      if (selectedSeatObjects.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeatObjects([...selectedSeatObjects, seat]);
    }
  };

  const selectedSeatIds = selectedSeatObjects.map((s) => s.seatId);

  const totalAmount = selectedSeatObjects.reduce((sum, seat) => {
    return sum + (Number(seat.price) || 0);
  }, 0);

  const handleProceedToSummary = () => {
    if (selectedSeatObjects.length === 0) return;
    navigate('/booking/summary', {
      state: {
        show,
        movie,
        screen,
        theatre,
        selectedSeats: selectedSeatObjects,
      },
    });
  };

  if (loading) return <Loading message="Preparing auditorium seating plan..." />;
  if (error) return <ErrorState message={error} onRetry={loadShowAndSeats} />;

  return (
    <div className="min-h-screen pb-32">
      <div className="bg-[#0D1117] border-b border-gray-800 py-4 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {movie?.title || 'Selected Movie'}
                {(show?.language || movie?.language) && (
                  <span className="text-[10px] font-bold uppercase text-blue-300 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {show?.language || movie?.language}
                  </span>
                )}
                {screen?.screenType && (
                  <span className="text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {screen.screenType}
                  </span>
                )}
              </h1>
              <p className="text-xs text-gray-400 flex flex-wrap items-center gap-2 mt-0.5">
                {theatre?.name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#EF233C]" />
                    {theatre.name} ({theatre.city})
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  {formatDate(show?.showDate)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  {formatTime(show?.startTime)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SeatMap
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          onToggleSeat={handleToggleSeat}
        />
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-[#0D1117]/95 border-t border-gray-800 backdrop-blur-md py-4 px-4 sm:px-8 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-gray-400 block text-[11px]">Selected Seats</span>
              <div className="font-bold text-white text-sm">
                {selectedSeatObjects.length > 0 ? (
                  <span className="text-[#EF233C]">
                    {selectedSeatObjects.map((s) => s.seatNumber).join(', ')} ({selectedSeatObjects.length})
                  </span>
                ) : (
                  <span className="text-gray-500">None selected</span>
                )}
              </div>
            </div>

            <div className="border-l border-gray-800 pl-6">
              <span className="text-gray-400 block text-[11px]">Total Price</span>
              <div className="text-lg font-extrabold text-white">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          <button
            onClick={handleProceedToSummary}
            disabled={selectedSeatObjects.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Ticket className="w-4 h-4" />
            Proceed to Summary
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
