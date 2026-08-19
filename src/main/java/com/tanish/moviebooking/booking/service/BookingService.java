package com.tanish.moviebooking.booking.service;

import com.tanish.moviebooking.booking.dto.BookingRequest;
import com.tanish.moviebooking.booking.dto.BookingResponse;
import com.tanish.moviebooking.booking.entity.Booking;
import com.tanish.moviebooking.booking.entity.BookingSeat;
import com.tanish.moviebooking.booking.entity.BookingStatus;
import com.tanish.moviebooking.booking.mapper.BookingMapper;
import com.tanish.moviebooking.booking.repository.BookingRepository;
import com.tanish.moviebooking.booking.repository.BookingSeatRepository;
import com.tanish.moviebooking.exception.BadRequestException;
import com.tanish.moviebooking.exception.ResourceNotFoundException;
import com.tanish.moviebooking.payment.service.PaymentService;
import com.tanish.moviebooking.seat.entity.Seat;
import com.tanish.moviebooking.seat.entity.SeatType;
import com.tanish.moviebooking.seat.repository.SeatRepository;
import com.tanish.moviebooking.show.entity.Show;
import com.tanish.moviebooking.show.repository.ShowRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final BookingMapper bookingMapper;

    private final PaymentService  paymentService;

    private Show getActiveShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show Not found : " + id));
        if (!show.getActive()) {
            throw new ResourceNotFoundException("Show Not found : " + id);
        }
        return show;
    }

    private void validateSeats(Show show, List<Seat> seats) {
        for (Seat seat : seats) {
            if (!seat.getActive()) {
                throw new ResourceNotFoundException("Seat Not Active : " + seat.getId());
            }
            if (!seat.getScreen().getId().equals(show.getScreen().getId())) {
                throw new BadRequestException("Seat does not belong to show screen : " + seat.getScreen().getId());
            }
        }
    }

    private BigDecimal getSeatPrice(Show show, SeatType seatType) {
        return switch (seatType) {
            case REGULAR -> show.getRegularPrice();
            case PREMIUM -> show.getPremiumPrice();
            case RECLINER -> show.getReclinerPrice();
        };
    }

    private Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not found : " + id));
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Show show = getActiveShow(request.getShowId());
        List<Long> seatIds = request.getSeatIds();
        List<Seat> seats = seatRepository.findAllById(seatIds);
        if (seats.size() != seatIds.size()) {
            throw new ResourceNotFoundException("One or More Seats Not Found");
        }
        validateSeats(show,seats);
        List<Long> bookedSeatsIds = bookingSeatRepository.findBookedSeatIds(
                show.getId(),
                List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED),
                seatIds);
        if (!bookedSeatsIds.isEmpty()) {
            throw new BadRequestException("One or More Seats are already booked");
        }
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<BookingSeat> bookingSeats = new ArrayList<>();
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .show(show)
                .status(BookingStatus.PENDING_PAYMENT)
                .totalAmount(BigDecimal.ZERO)
                .build();
        for (Seat seat : seats) {
            BigDecimal price = getSeatPrice(show, seat.getSeatType());
            totalAmount = totalAmount.add(price);
            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(booking)
                    .seat(seat)
                    .price(price)
                    .build();
            bookingSeats.add(bookingSeat);
        }
        booking.setTotalAmount(totalAmount);
        booking.setBookingSeats(bookingSeats);
        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponse(savedBooking);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = getBooking(id);
        return bookingMapper.toResponse(booking);
    }

    public List<BookingResponse> getBookingByUser(Long userId) {
        return bookingRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, BookingStatus.CONFIRMED)
                .stream().map(bookingMapper::toResponse).toList();
    }

    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = getBooking(id);
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking already cancelled");
        }
        if (booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            return;
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            paymentService.refundPayment(booking.getId());
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

}