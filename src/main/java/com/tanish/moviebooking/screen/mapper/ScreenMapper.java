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

    public Screen toEntity(ScreenRequest request, Theatre theatre, Integer screenNumber) {
        return Screen.builder()
                .theatre(theatre)
                .screenNumber(screenNumber)
                .name(request.getName())
                .capacity(request.getCapacity())
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
                .screenType(screen.getScreenType())
                .active(screen.getActive())
                .build();
    }

}