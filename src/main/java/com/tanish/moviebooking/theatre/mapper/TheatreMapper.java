package com.tanish.moviebooking.theatre.mapper;

import com.tanish.moviebooking.theatre.dto.TheatreRequest;
import com.tanish.moviebooking.theatre.dto.TheatreResponse;
import com.tanish.moviebooking.theatre.entity.Theatre;

import org.springframework.stereotype.Component;

@Component
public class TheatreMapper {

    public Theatre toEntity(TheatreRequest request) {
        return Theatre.builder()
                .name(request.getName())
                .city(request.getCity())
                .address(request.getAddress())
                .pincode(request.getPincode())
                .active(true)
                .build();
    }

    public TheatreResponse toResponse(Theatre theatre) {
        return TheatreResponse.builder()
                .id(theatre.getId())
                .name(theatre.getName())
                .city(theatre.getCity())
                .address(theatre.getAddress())
                .pincode(theatre.getPincode())
                .active(theatre.getActive())
                .build();
    }

    public void updateEntity(Theatre theatre, TheatreRequest request) {
        theatre.setName(request.getName());
        theatre.setCity(request.getCity());
        theatre.setAddress(request.getAddress());
        theatre.setPincode(request.getPincode());
    }

}