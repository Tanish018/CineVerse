package com.tanish.moviebooking.show.service;

import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.screen.dto.ScreenResponse;
import com.tanish.moviebooking.screen.entity.Screen;
import com.tanish.moviebooking.screen.repository.ScreenRepository;
import com.tanish.moviebooking.show.dto.ShowRequest;
import com.tanish.moviebooking.show.dto.ShowResponse;
import com.tanish.moviebooking.show.entity.Show;
import com.tanish.moviebooking.show.mapper.ShowMapper;
import com.tanish.moviebooking.show.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;
    private final ScreenRepository screenRepository;
    private final ShowMapper showMapper;

    private Screen getActiveScreen(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id " + id));
        if (!screen.getActive()) {
            throw new ResourceNotFoundException("Screen is not active with id " + id);
        }
        return screen;
    }

    private void validateShowTime(ShowRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Start time should be before end time");
        }
        if (request.getShowDate().isBefore(LocalDate.now())) {
            throw new BadRequestException(
                    "Show date cannot be in the past"
            );
        }
    }

    public ShowResponse createShow (ShowRequest request) {
        Screen screen = getActiveScreen(request.getScreenId());
        validateShowTime(request);
        if (showRepository.existsOverlappingShow(request.getScreenId(), request.getShowDate(), request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Another show is already scheduled on this screen during this time");
        }
        Show show = Show.builder()
                .movieId(request.getMovieId())
                .screen(screen)
                .showDate(request.getShowDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .regularPrice(request.getRegularPrice())
                .premiumPrice(request.getPremiumPrice())
                .reclinerPrice(request.getReclinerPrice())
                .active(true)
                .build();
        Show savedShow = showRepository.save(show);
        return showMapper.toResponse(savedShow);
    }

    private Show getActiveShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id " + id));
        if (!show.getActive()) {
            throw new ResourceNotFoundException("Show is not active with id " + id);
        }
        return show;
    }

    public ShowResponse getShowById(Long id) {
        Show show = getActiveShow(id);
        return showMapper.toResponse(show);
    }

    public List<ShowResponse> getShowsByScreen(Long screenId) {
        getActiveScreen(screenId);
        return showRepository
                .findByScreenIdAndActiveTrueOrderByShowDateAscStartTimeAsc(screenId)
                .stream().map(showMapper::toResponse).toList();
    }

    public List<ShowResponse> getShowsByScreenAndDate(Long screenId, LocalDate showDate) {
        getActiveScreen(screenId);
        return showRepository
                .findByScreenIdAndShowDateAndActiveTrueOrderByStartTimeAsc(screenId, showDate)
                .stream().map(showMapper::toResponse).toList();
    }

    public List<ShowResponse> getShowsByMovie(Long movieId) {
        return showRepository
                .findByMovieIdAndActiveTrueOrderByShowDateAscStartTimeAsc(movieId)
                .stream().map(showMapper::toResponse).toList();
    }

    public List<ShowResponse> getShowsByMovieAndDate(Long movieId, LocalDate showDate) {
        return showRepository
                .findByMovieIdAndShowDateAndActiveTrueOrderByStartTimeAsc(movieId, showDate)
                .stream().map(showMapper::toResponse).toList();
    }

    public void DeleteShow(Long id) {
        Show show = getActiveShow(id);
        show.setActive(false);
        showRepository.save(show);
    }

    public ShowResponse updateShow(Long id, ShowRequest request) {
        Show show = getActiveShow(id);
        Screen screen = getActiveScreen(request.getScreenId());
        validateShowTime(request);
        if (showRepository.existsOverlappingShowForUpdate(id, request.getScreenId(), request.getShowDate(), request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Another show is already scheduled on this screen during this time");
        }
        show.setMovieId(request.getMovieId());
        show.setScreen(screen);
        show.setShowDate(request.getShowDate());
        show.setStartTime(request.getStartTime());
        show.setEndTime(request.getEndTime());
        show.setRegularPrice(request.getRegularPrice());
        show.setPremiumPrice(request.getPremiumPrice());
        show.setReclinerPrice(request.getReclinerPrice());
        Show updatedShow = showRepository.save(show);
        return showMapper.toResponse(updatedShow);
    }

}
