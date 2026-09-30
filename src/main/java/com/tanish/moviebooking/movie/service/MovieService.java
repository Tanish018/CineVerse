package com.tanish.moviebooking.movie.service;

import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.movie.dto.MovieRequest;
import com.tanish.moviebooking.movie.dto.MovieResponse;
import com.tanish.moviebooking.movie.entity.Movie;
import com.tanish.moviebooking.movie.mapper.MovieMapper;
import com.tanish.moviebooking.movie.repository.MovieRepository;
import com.tanish.moviebooking.redis.service.RedisMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    private final RedisMovieService redisMovieService;

    public MovieResponse createMovie(MovieRequest request) {
        if (movieRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new BadRequestException("Movie with this title already exists");
        }
        Movie movie = movieMapper.toEntity(request);
        Movie savedMovie =  movieRepository.save(movie);
        return movieMapper.toResponse(savedMovie);
    }

    public List<MovieResponse> getAllMovies() {
        List<MovieResponse> cachedMovies = redisMovieService.getAllMovies();
        if (cachedMovies != null) return cachedMovies;
        List<MovieResponse> movies = movieRepository.findByActiveTrueOrderByReleaseDateDesc()
                .stream()
                .map(movieMapper::toResponse)
                .toList();
        redisMovieService.saveAllMovies(movies);
        return movies;
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        if (!movie.getActive()) {
            throw new ResourceNotFoundException("Movie not found with id: " + id);
        }
        return movieMapper.toResponse(movie);
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        if (!movie.getTitle().equalsIgnoreCase(request.getTitle())
                && movieRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new ResourceNotFoundException("Movie with this title already exists: " + id);
        }
        movieMapper.updateEntity(movie, request);
        Movie updatedMovie = movieRepository.save(movie);
        return movieMapper.toResponse(updatedMovie);
    }

    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        movie.setActive(false);
        movieRepository.save(movie);
    }

}
