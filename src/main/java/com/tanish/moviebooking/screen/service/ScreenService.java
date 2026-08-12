package com.tanish.moviebooking.screen.service;

import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.screen.dto.ScreenRequest;
import com.tanish.moviebooking.screen.dto.ScreenResponse;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.screen.mapper.ScreenMapper;
import com.tanish.moviebooking.screen.repository.ScreenRepository;
import com.tanish.moviebooking.theatre.entity.Theatre;
import com.tanish.moviebooking.theatre.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenMapper screenMapper;

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

    public ScreenResponse updateScreen(Long id, ScreenRequest screenRequest){
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + id));

        if (!screen.getActive()) {
            throw new ResourceNotFoundException("Screen not found with id: " + id);
        }
        screen.setName(screenRequest.getName());
        screen.setCapacity(screenRequest.getCapacity());
        screen.setScreenType(screenRequest.getScreenType());
        Screen updatedScreen = screenRepository.save(screen);
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

}
