package com.tanish.moviebooking.booking.controller;

import com.tanish.moviebooking.booking.dto.BookingRequest;
import com.tanish.moviebooking.booking.dto.BookingResponse;
import com.tanish.moviebooking.booking.dto.BookingSearchRequest;
import com.tanish.moviebooking.booking.service.BookingService;
import com.tanish.moviebooking.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request){
        BookingResponse res = bookingService.createBooking(request);
        return new ApiResponse<>(true, "Show Booked Successfully", res);
    }

    @GetMapping("/{bookingId}")
    public ApiResponse<BookingResponse> getBookingById(@PathVariable Long bookingId){
        BookingResponse res = bookingService.getBookingById(bookingId);
        return new ApiResponse<>(true, "Booking fetched Successfully", res);
    }

    @GetMapping("/user/{userId}/history")
    public ApiResponse<List<BookingResponse>> getBookingByUserId(@PathVariable Long userId){
        List<BookingResponse> res = bookingService.getBookingHistory(userId);
        return new ApiResponse<>(true, "Bookings fetched Successfully", res);
    }

    @DeleteMapping("/{bookingId}")
    public ApiResponse<Void> cancelBooking(@PathVariable Long bookingId){
        bookingService.cancelBooking(bookingId);
        return new ApiResponse<>(true, "Booking cancelled successfully", null);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> res = bookingService.getAllBookings();
        return new ApiResponse<>(true, "Bookings fetched Successfully", res);
    }

    @GetMapping("/admin/show/{showId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<BookingResponse>> getBookingByShowId(@PathVariable Long showId){
        List<BookingResponse> res = bookingService.getBookingsByShow(showId);
        return new ApiResponse<>(true, "Bookings fetched Successfully", res);
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<BookingResponse>> searchBookings(@ModelAttribute BookingSearchRequest request){
        List<BookingResponse> res = bookingService.searchBookings(request);
        return new ApiResponse<>(true, "Bookings fetched Successfully", res);
    }

}