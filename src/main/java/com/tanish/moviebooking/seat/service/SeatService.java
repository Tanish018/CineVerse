package com.tanish.moviebooking.seat.service;

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
import org.springframework.transaction.annotation.Transactional;

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

//    public void generateSeats (Long screenId) {
//        Screen screen = getActiveScreen(screenId);
//        if (seatRepository.countByScreenIdAndActiveTrue(screenId) > 0) {
//            throw new BadRequestException("Seats have already been generated for this screen");
//        }
//        int capacity = screen.getCapacity();
//        List<Seat> seats = new ArrayList<>();
//        for (int i=0 ; i<capacity ; i++) {
//            int rowi = i/SEATS_PER_ROW;
//            int seati = i % SEATS_PER_ROW + 1;
//            String rowLabel = generateRowLabel(rowi);
//            String seatNumber = rowLabel + seati;
//            Seat seat = Seat.builder()
//                    .screen(screen)
//                    .seatNumber(seatNumber)
//                    .rowLabel(rowLabel)
//                    .seatType(SeatType.REGULAR)
//                    .active(true)
//                    .build();
//            seats.add(seat);
//        }
//        seatRepository.saveAll(seats);
//    }

    @Transactional
    public void createSeatsForScreen(Screen screen) {
        List<Seat> existingSeats = seatRepository.findByScreenIdOrderByIdAsc(screen.getId());
        if (!existingSeats.isEmpty()) return;
        List<Seat> seats = new ArrayList<>();
        for (int i=1 ; i<=screen.getCapacity() ; i++) {
            SeatType seatType = getSeatType(i, screen);
            String rowLabel = generateRowLabel((i-1)/10);
            String seatNumber = rowLabel + ((i-1) % 10 + 1);
            Seat seat = Seat.builder()
                        .screen(screen)
                        .seatNumber(seatNumber)
                        .rowLabel(rowLabel)
                        .seatType(seatType)
                        .active(true)
                        .build();
            seats.add(seat);
        }
        seatRepository.saveAll(seats);
    }

    @Transactional
    public void synchronizeSeats(Screen screen, int oldCapacity, int newCapacity) {
        List<Seat> existingSeats = seatRepository.findByScreenIdOrderByIdAsc(screen.getId());
        if (newCapacity > oldCapacity) {
            List<Seat> newSeats = new ArrayList<>();
            for (int i=oldCapacity+1 ; i<=newCapacity ; i++) {
                SeatType seatType = getSeatType(i, screen);
                String rowLabel = generateRowLabel((i-1)/10);
                String seatNumber = rowLabel + ((i-1) % 10 + 1);
                Seat seat = Seat.builder()
                            .screen(screen)
                            .seatNumber(seatNumber)
                            .rowLabel(rowLabel)
                            .seatType(seatType)
                            .active(true)
                            .build();
                newSeats.add(seat);
            }
            seatRepository.saveAll(newSeats);
        }
        for (Seat seat : existingSeats) {
            int position = getSeatPosition(seat);
            if (position <= newCapacity) {
                seat.setActive(true);
                seat.setSeatType(getSeatType(position,screen));
            } else {
                seat.setActive(false);
            }
        }
        seatRepository.saveAll(existingSeats);
    }

    private int getSeatPosition(Seat seat) {
        String row =  seat.getRowLabel();
        int rowNumber = 0;
        for (int i=0 ; i<row.length() ; i++) {
            rowNumber = rowNumber * 26 + (row.charAt(i) - 'A' + 1);
        }
        String seatNumber = seat.getSeatNumber().substring(row.length());
        int seatInRow = Integer.parseInt(seatNumber);
        return (rowNumber - 1) * SEATS_PER_ROW + seatInRow;
    }

    private SeatType getSeatType(int position,Screen screen) {
        if (position <= screen.getRegularSeats()) return SeatType.REGULAR;
        if (position <= screen.getRegularSeats() + screen.getPremiumSeats()) return SeatType.PREMIUM;
        return SeatType.RECLINER;
    }

}