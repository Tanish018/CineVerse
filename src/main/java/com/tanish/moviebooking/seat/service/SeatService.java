package com.tanish.moviebooking.seat.service;

import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.screen.repository.ScreenRepository;
import com.tanish.moviebooking.seat.dto.SeatResponse;
import com.tanish.moviebooking.seat.entity.Seat;
import com.tanish.moviebooking.seat.mapper.SeatMapper;
import com.tanish.moviebooking.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public List<SeatResponse> getSeatsByScreen(Long screenId) {
        Screen screen = getActiveScreen(screenId);
        return seatRepository.findByScreenIdAndActiveTrueOrderBySeatNumberAsc(screenId)
                .stream().map(seatMapper::toResponse).toList();
    }

}