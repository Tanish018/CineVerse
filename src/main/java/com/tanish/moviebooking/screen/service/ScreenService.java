package com.tanish.moviebooking.screen.service;

import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.screen.dto.ScreenRequest;
import com.tanish.moviebooking.screen.dto.ScreenResponse;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.screen.mapper.ScreenMapper;
import com.tanish.moviebooking.screen.repository.ScreenRepository;
import com.tanish.moviebooking.seat.entity.SeatType;
import com.tanish.moviebooking.seat.service.SeatService;
import com.tanish.moviebooking.theatre.entity.Theatre;
import com.tanish.moviebooking.theatre.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenMapper screenMapper;

    private final SeatService seatService;

    private void validateSeatConfiguration (ScreenRequest request) {
        int capacity = request.getRegularSeats() + request.getPremiumSeats() + request.getReclinerSeats();
        if (capacity < 100) {
            throw new BadRequestException("Screen capacity must be at least 100 seats");
        }
    }

    @Transactional
    public ScreenResponse createScreen(Long theatreId, ScreenRequest screenRequest) {
        Theatre theatre = getActiveTheatre(theatreId);
        validateSeatConfiguration(screenRequest);
        if (screenRequest.getScreenNumber() > theatre.getNumberOfScreens()) {
            throw new BadRequestException("Screen number cannot exceed theatre's number of screens");
        }
        if (screenRepository.findByTheatreIdAndScreenNumber(theatreId, screenRequest.getScreenNumber()).isPresent()) {
            throw new BadRequestException("Screen with this number already exists in this theatre");
        }
        Screen screen = screenMapper.toEntity(screenRequest, theatre);
        Screen savedScreen = screenRepository.save(screen);
        seatService.createSeatsForScreen(screen);
        return screenMapper.toResponse(savedScreen);
    }

    public void synchronizeScreens(Theatre theatre, Integer oldCount, Integer newCount) {
        if (newCount > oldCount) {
            for (int i=oldCount+1 ; i<=newCount ; i++) {
                Screen screen = screenMapper.createDefaultScreen(theatre,i);
                screenRepository.save(screen);
            }
        } else if  (newCount < oldCount) {
            List<Screen> screens = screenRepository.findByTheatreIdAndActiveTrueOrderByScreenNumberDesc(theatre.getId());
            int deactivateScreens = oldCount - newCount;
            for (int i=0 ; i<deactivateScreens && i<screens.size() ; i++) {
                Screen screen = screens.get(i);
                screen.setActive(false);
                screenRepository.save(screen);
            }
        }
    }

    private Theatre getActiveTheatre(Long theatreId){
        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + theatreId));

        if (!theatre.getActive()) {
            throw new ResourceNotFoundException("Theatre not found with id: " + theatreId);
        }
        return theatre;
    }

    public List<ScreenResponse> getScreensByTheatre(Long theatreId){
        Theatre theatre = getActiveTheatre(theatreId);
        return screenRepository.findByTheatreIdAndActiveTrueOrderByScreenNumberAsc(theatre.getId())
                .stream()
                .map(screenMapper::toResponse)
                .toList();
    }

    public ScreenResponse getScreenById(Long id){
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + id));

        if (!screen.getActive()) {
            throw new ResourceNotFoundException("Screen not found with id: " + id);
        }
        return screenMapper.toResponse(screen);
    }

    @Transactional
    public ScreenResponse updateScreen(Long id, ScreenRequest request){
        Screen screen = getActiveScreen(id);
        validateSeatConfiguration(request);
        int oldCapacity = screen.getCapacity();
        int newCapacity = request.getRegularSeats() + request.getPremiumSeats() + request.getReclinerSeats();
        screen.setName(request.getName());
        screen.setScreenNumber(request.getScreenNumber());
        screen.setCapacity(newCapacity);
        screen.setRegularSeats(request.getRegularSeats());
        screen.setPremiumSeats(request.getPremiumSeats());
        screen.setReclinerSeats(request.getReclinerSeats());
        screen.setScreenType(request.getScreenType());
        Screen updatedScreen = screenRepository.save(screen);
        seatService.synchronizeSeats(updatedScreen, oldCapacity, newCapacity);
        return screenMapper.toResponse(updatedScreen);
    }

    public void deactivateScreen(Long id){
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + id));

        if (!screen.getActive()) {
            throw new ResourceNotFoundException("Screen not found with id: " + id);
        }
        screen.setActive(false);
        screenRepository.save(screen);
    }

    private Screen getActiveScreen(Long screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));

        if (!screen.getActive()) {
            throw new ResourceNotFoundException("Screen not found with id: " + screenId);
        }
        return screen;
    }

}
