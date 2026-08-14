package com.tanish.moviebooking.screen.mapper;

import com.tanish.moviebooking.screen.dto.ScreenRequest;
import com.tanish.moviebooking.screen.dto.ScreenResponse;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.theatre.entity.Theatre;
import org.springframework.stereotype.Component;

@Component
public class ScreenMapper {

    public Screen createDefaultScreen(Theatre theatre, int screenNumber) {
        return Screen.builder()
                .theatre(theatre)
                .screenNumber(screenNumber)
                .name("Screen " + screenNumber)
                .capacity(100)
                .screenType("2D")
                .active(true)
                .build();
    }

    public Screen toEntity(ScreenRequest request, Theatre theatre) {
        int capacity = request.getRegularSeats() + request.getPremiumSeats() + request.getReclinerSeats();
        return Screen.builder()
                .theatre(theatre)
                .screenNumber(request.getScreenNumber())
                .name(request.getName())
                .capacity(capacity)
                .regularSeats(request.getRegularSeats())
                .premiumSeats(request.getPremiumSeats())
                .reclinerSeats(request.getReclinerSeats())
                .screenType(request.getScreenType())
                .active(true)
                .build();
    }

    public ScreenResponse toResponse(Screen screen) {
        return ScreenResponse.builder()
                .id(screen.getId())
                .theatreId(screen.getTheatre().getId())
                .screenNumber(screen.getScreenNumber())
                .name(screen.getName())
                .capacity(screen.getCapacity())
                .regularSeats(screen.getRegularSeats())
                .premiumSeats(screen.getPremiumSeats())
                .reclinerSeats(screen.getReclinerSeats())
                .screenType(screen.getScreenType())
                .active(screen.getActive())
                .build();
    }

}