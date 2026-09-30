package com.tanish.moviebooking.redis.service;

import com.tanish.moviebooking.movie.dto.MovieResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisMovieService {

    private static final String ALL_MOVIES_KEY = "movies:all";
    private static final String MOVIE_KEY_PREFIX = "movies:";
    private static final Duration CACHE_DURATION = Duration.ofMinutes(30);

    private final RedisService redisService;
    private final ObjectMapper  objectMapper;

    public void saveAllMovies(List<MovieResponse> movies) {
        try {
            String data = objectMapper.writeValueAsString(movies);
            redisService.set(ALL_MOVIES_KEY, data, CACHE_DURATION);
        } catch (JacksonException e) {
            throw new RuntimeException("Unable to cache movies");
        }
    }

    public List<MovieResponse> getAllMovies() {
        String data = redisService.get(ALL_MOVIES_KEY);
        if (data == null) {
            return null;
        }
        try {
            return objectMapper.readValue(data, objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, MovieResponse.class));
        } catch (JacksonException e) {
            throw new RuntimeException("Unable to read movies frfom cache");
        }
    }

    public void saveMovie(MovieResponse movie) {
        try {
            String data = objectMapper.writeValueAsString(movie);
            redisService.set(MOVIE_KEY_PREFIX + movie.getId(), data, CACHE_DURATION);
        } catch (JacksonException e) {
            throw new RuntimeException("Unable to cache movie");
        }
    }

    public MovieResponse getMovie(Long id) {
        String data = redisService.get(MOVIE_KEY_PREFIX + id);
        if (data == null) {
            return null;
        }
        try {
            return objectMapper.readValue(data, MovieResponse.class);
        } catch (JacksonException e) {
            throw new RuntimeException("Unable to read movie from cache");
        }
    }

    public void deleteAllMovies() {
        redisService.delete(ALL_MOVIES_KEY);
    }

    public void deleteMovie(Long id) {
        redisService.delete(MOVIE_KEY_PREFIX + id);
    }

}