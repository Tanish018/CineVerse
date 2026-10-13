import React from 'react';
import { Armchair, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const SeatMap = ({ seats, selectedSeatIds, onToggleSeat }) => {
  const rowsMap = seats.reduce((acc, seat) => {
    const row = seat.rowLabel || 'A';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRowKeys = Object.keys(rowsMap).sort();

  sortedRowKeys.forEach((rowKey) => {
    rowsMap[rowKey].sort((a, b) => {
      const numA = parseInt(a.seatNumber.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.seatNumber.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  });

  const getSeatStyle = (seat, isSelected) => {
    if (!seat.available) {
      return 'bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed opacity-50';
    }
    if (isSelected) {
      return 'bg-[#EF233C] text-white border-[#EF233C] shadow-lg shadow-red-500/40 scale-110 z-10';
    }
    switch (seat.seatType) {
      case 'PREMIUM':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/20';
      case 'RECLINER':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/40 hover:border-purple-400 hover:bg-purple-500/20';
      case 'REGULAR':
      default:
        return 'bg-blue-500/10 text-blue-300 border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/20';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col items-center my-6">
        <div className="screen-curve mb-3"></div>
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-500">
          Cinema Screen — All Eyes This Way
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 px-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 mb-8 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border border-blue-500/40 bg-blue-500/10"></div>
          <span className="text-gray-300">Regular</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border border-amber-500/40 bg-amber-500/10"></div>
          <span className="text-gray-300">Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md border border-purple-500/40 bg-purple-500/10"></div>
          <span className="text-gray-300">Recliner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-[#EF233C] border border-[#EF233C]"></div>
          <span className="text-white font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-gray-800 border border-gray-700 opacity-50"></div>
          <span className="text-gray-500">Sold Out</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-6 flex justify-center">
        <div className="min-w-[600px] flex flex-col items-center space-y-2.5">
          {sortedRowKeys.map((rowKey) => {
            const rowSeats = rowsMap[rowKey];
            const rowType = rowSeats[0]?.seatType;

            return (
              <div key={rowKey} className="flex items-center gap-3">
                <span className="w-6 text-xs font-bold text-gray-500 text-center uppercase">
                  {rowKey}
                </span>

                <div className="flex items-center gap-2">
                  {rowSeats.map((seat, index) => {
                    const isSelected = selectedSeatIds.includes(seat.seatId);
                    const isAisleGap = index === 4;

                    return (
                      <React.Fragment key={seat.seatId}>
                        <button
                          type="button"
                          disabled={!seat.available}
                          onClick={() => onToggleSeat(seat)}
                          title={`${seat.seatNumber} (${seat.seatType}) - ${formatCurrency(seat.price)}`}
                          className={`w-8 h-8 rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all duration-150 ${getSeatStyle(
                            seat,
                            isSelected
                          )}`}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            seat.seatNumber.replace(/\D/g, '')
                          )}
                        </button>
                        {isAisleGap && <div className="w-5" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                <span className="w-6 text-xs font-bold text-gray-500 text-center uppercase">
                  {rowKey}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
