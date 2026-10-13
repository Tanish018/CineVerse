import React, { useState, useEffect } from 'react';
import { theatreService } from '../services/theatreService';
import { screenService } from '../services/screenService';
import { seatService } from '../services/seatService';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Armchair, MapPin, Tv } from 'lucide-react';

const AdminSeats = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTheatres = async () => {
      try {
        const res = await theatreService.getAllTheatres();
        if (res && res.data && res.data.length > 0) {
          setTheatres(res.data);
          setSelectedTheatreId(res.data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load theatres:', err);
      }
    };
    loadTheatres();
  }, []);

  useEffect(() => {
    const loadScreens = async () => {
      if (!selectedTheatreId) return;
      try {
        const res = await screenService.getScreensByTheatre(selectedTheatreId);
        if (res && res.data) {
          setScreens(res.data);
          if (res.data.length > 0) {
            setSelectedScreenId(res.data[0].id.toString());
          } else {
            setSelectedScreenId('');
            setSeats([]);
          }
        }
      } catch (err) {
        console.error('Failed to load screens:', err);
      }
    };
    loadScreens();
  }, [selectedTheatreId]);

  useEffect(() => {
    const loadSeats = async () => {
      if (!selectedScreenId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await seatService.getSeatsByScreen(selectedScreenId);
        if (res && res.data) {
          setSeats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch seats.');
      } finally {
        setLoading(false);
      }
    };
    loadSeats();
  }, [selectedScreenId]);

  const regularCount = seats.filter((s) => s.seatType === 'REGULAR').length;
  const premiumCount = seats.filter((s) => s.seatType === 'PREMIUM').length;
  const reclinerCount = seats.filter((s) => s.seatType === 'RECLINER').length;

  const rowsMap = seats.reduce((acc, seat) => {
    const row = seat.rowLabel || 'A';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(rowsMap).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Armchair className="w-6 h-6 text-[#EF233C]" />
          Seat Layout Matrix
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Inspect generated physical seats and layout categories for any screen
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0D1117] border border-gray-800 rounded-2xl p-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#EF233C]" />
            Theatre Venue
          </label>
          <select
            value={selectedTheatreId}
            onChange={(e) => setSelectedTheatreId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:outline-none focus:border-[#EF233C]"
          >
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} - {t.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-1.5 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-[#EF233C]" />
            Auditorium Screen
          </label>
          <select
            value={selectedScreenId}
            onChange={(e) => setSelectedScreenId(e.target.value)}
            disabled={screens.length === 0}
            className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:outline-none focus:border-[#EF233C] disabled:opacity-50"
          >
            {screens.length === 0 ? (
              <option value="">No screens in this theatre</option>
            ) : (
              screens.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (#{s.screenNumber}) - {s.screenType} ({s.capacity} seats)
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {seats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0D1117] border border-gray-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Active Seats</span>
            <span className="text-xl font-extrabold text-white">{seats.length}</span>
          </div>
          <div className="bg-[#0D1117] border border-gray-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-400 block">Regular Tier</span>
            <span className="text-xl font-extrabold text-white">{regularCount}</span>
          </div>
          <div className="bg-[#0D1117] border border-gray-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Premium Tier</span>
            <span className="text-xl font-extrabold text-white">{premiumCount}</span>
          </div>
          <div className="bg-[#0D1117] border border-gray-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">Recliner Tier</span>
            <span className="text-xl font-extrabold text-white">{reclinerCount}</span>
          </div>
        </div>
      )}

      {loading ? (
        <Loading message="Loading seat matrix..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : seats.length === 0 ? (
        <div className="text-center py-12 bg-[#0D1117] border border-gray-800 rounded-2xl text-gray-500 text-xs">
          Select a theatre and screen to inspect the generated seats.
        </div>
      ) : (
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
          <div className="flex items-center justify-center gap-6 mb-8 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-blue-500/20 border border-blue-500/40"></div>
              <span className="text-gray-300">Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/40"></div>
              <span className="text-gray-300">Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-purple-500/20 border border-purple-500/40"></div>
              <span className="text-gray-300">Recliner</span>
            </div>
          </div>

          <div className="min-w-[600px] flex flex-col items-center space-y-2">
            {sortedRows.map((rowKey) => {
              const rowSeats = rowsMap[rowKey];
              return (
                <div key={rowKey} className="flex items-center gap-2.5">
                  <span className="w-6 text-xs font-bold text-gray-500 text-center">{rowKey}</span>
                  <div className="flex items-center gap-1.5">
                    {rowSeats.map((seat, idx) => {
                      const isAisle = idx === 4;
                      const badgeClass =
                        seat.seatType === 'RECLINER'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : seat.seatType === 'PREMIUM'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/30';

                      return (
                        <React.Fragment key={seat.id}>
                          <div
                            className={`w-7 h-7 rounded border text-[10px] font-bold flex items-center justify-center ${badgeClass}`}
                            title={`${seat.seatNumber} (${seat.seatType})`}
                          >
                            {seat.seatNumber.replace(/\D/g, '')}
                          </div>
                          {isAisle && <div className="w-4" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <span className="w-6 text-xs font-bold text-gray-500 text-center">{rowKey}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeats;
