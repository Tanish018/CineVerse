package com.tanish.moviebooking.show.mapper;

import com.tanish.moviebooking.show.dto.ShowRequest;
import com.tanish.moviebooking.show.dto.ShowResponse;
import com.tanish.moviebooking.show.entity.Show;
import org.springframework.stereotype.Component;

@Component
public class ShowMapper {

    public ShowResponse toResponse(Show show) {
        return ShowResponse.builder()
                .id(show.getId())
                .movieId(show.getMovieId())
                .screenId(show.getScreen().getId())
                .showDate(show.getShowDate())
                .startTime(show.getStartTime())
                .endTime(show.getEndTime())
                .regularPrice(show.getRegularPrice())
                .premiumPrice(show.getPremiumPrice())
                .reclinerPrice(show.getReclinerPrice())
                .active(show.getActive())
                .build();
    }

}