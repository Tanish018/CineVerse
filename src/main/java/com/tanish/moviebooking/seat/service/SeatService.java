package com.tanish.moviebooking.seat.service;

import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.screen.repository.ScreenRepository;
import com.tanish.moviebooking.seat.dto.SeatResponse;
import com.tanish.moviebooking.seat.entity.Seat;
import com.tanish.moviebooking.seat.entity.SeatType;
import com.tanish.moviebooking.seat.mapper.SeatMapper;
import com.tanish.moviebooking.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private static final int SEATS_PER_ROW = 10;

    private final SeatRepository seatRepository;
    private final ScreenRepository screenRepository;
    private final SeatMapper seatMapper;

    private Screen getActiveScreen(Long screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));

        if (!screen.getActive()) {
            throw new ResourceNotFoundException("Screen not found with id: " + screenId);
        }
        return screen;
    }

    private String generateRowLabel(int i) {
        StringBuilder res = new StringBuilder();
        i++;
        while (i>0) {
            i--;
            res.insert(0, (char)('A' + (i % 26)));
            i /= 26;
        }
        return res.toString();
    }

    public List<SeatResponse> getSeatsByScreen(Long screenId) {
        Screen screen = getActiveScreen(screenId);
        return seatRepository.findByScreenIdAndActiveTrueOrderBySeatNumberAsc(screenId)
                .stream().map(seatMapper::toResponse).toList();
    }

    public void generateSeats (Long screenId) {
        Screen screen = getActiveScreen(screenId);
        if (seatRepository.countByScreenIdAndActiveTrue(screenId) > 0) {
            throw new BadRequestException("Seats have already been generated for this screen");
        }
        int capacity = screen.getCapacity();
        List<Seat> seats = new ArrayList<>();
        for (int i=0 ; i<capacity ; i++) {
            int rowi = i/SEATS_PER_ROW;
            int seati = i % SEATS_PER_ROW + 1;
            String rowLabel = generateRowLabel(rowi);
            String seatNumber = rowLabel + seati;
            Seat seat = Seat.builder()
                    .screen(screen)
                    .seatNumber(seatNumber)
                    .rowLabel(rowLabel)
                    .seatType(SeatType.REGULAR)
                    .active(true)
                    .build();
            seats.add(seat);
        }
        seatRepository.saveAll(seats);
    }

}