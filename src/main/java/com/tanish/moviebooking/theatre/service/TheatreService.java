package com.tanish.moviebooking.theatre.service;

import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.screen.mapper.ScreenMapper;
import com.tanish.moviebooking.screen.repository.ScreenRepository;
import com.tanish.moviebooking.screen.service.ScreenService;
import com.tanish.moviebooking.theatre.dto.TheatreRequest;
import com.tanish.moviebooking.theatre.dto.TheatreResponse;
import com.tanish.moviebooking.theatre.entity.Theatre;
import com.tanish.moviebooking.theatre.mapper.TheatreMapper;
import com.tanish.moviebooking.theatre.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheatreService {

    private final TheatreRepository theatreRepository;
    private final TheatreMapper theatreMapper;

    private final ScreenService screenService;

    @Transactional
    public TheatreResponse createTheatre(TheatreRequest request) {
        if (theatreRepository.existsByNameIgnoreCaseAndCityIgnoreCaseAndActiveTrue(request.getName(), request.getCity())) {
            throw new BadRequestException("Theatre with this name already exists in this city");
        }
        Theatre theatre = theatreMapper.toEntity(request);
        Theatre savedTheatre = theatreRepository.save(theatre);
        return theatreMapper.toResponse(savedTheatre);
    }

    public List<TheatreResponse> getAllTheatres() {
        return theatreRepository.findByActiveTrueOrderByNameAsc()
                .stream().map(theatreMapper::toResponse).toList();
    }

    public List<TheatreResponse> getTheatresByCity(String city) {
        return theatreRepository.findByCityIgnoreCaseAndActiveTrueOrderByNameAsc(city)
                .stream().map(theatreMapper::toResponse).toList();
    }

    public TheatreResponse getTheatreById(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + id));
        if (!theatre.getActive()) {
            throw new ResourceNotFoundException("Theatre not found with id: " + id);
        }
        return theatreMapper.toResponse(theatre);
    }

    @Transactional
    public TheatreResponse updateTheatre(Long id, TheatreRequest request) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + id));
        if (theatreRepository.existsByNameIgnoreCaseAndCityIgnoreCaseAndActiveTrueAndIdNot(request.getName(), request.getCity(), id)) {
            throw new BadRequestException("Theatre with this name already exists in this city");
        }
        Integer oldScreensCount = theatre.getNumberOfScreens();
        theatreMapper.updateEntity(theatre,request);
        Theatre updatedTheatre = theatreRepository.save(theatre);
        screenService.synchronizeScreens(theatre, oldScreensCount, request.getNumberOfScreens());
        return theatreMapper.toResponse(updatedTheatre);
    }

    public void deleteTheatre(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + id));
        theatre.setActive(false);
        theatreRepository.save(theatre);
    }

}
