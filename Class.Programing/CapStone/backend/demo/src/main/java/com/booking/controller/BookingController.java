package com.booking.controller;

import com.booking.dto.BookingDTO;
import com.booking.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5500"}, allowCredentials = "true")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // POST - Create new booking
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO,
                                                    HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        BookingDTO createdBooking = bookingService.createBooking(bookingDTO, userId);
        return ResponseEntity.ok(createdBooking);
    }

    // GET - Get current user's bookings
    @GetMapping("/user")
    public ResponseEntity<List<BookingDTO>> getUserBookings(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<BookingDTO> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    // GET - Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id,
                                                     HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        BookingDTO booking = bookingService.getBookingById(id);

        if (!booking.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(booking);
    }

    // GET - Get all bookings (Admin only)
    @GetMapping("/all")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // PUT - Update booking
    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable Long id,
                                                    @RequestBody BookingDTO bookingDTO,
                                                    HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        BookingDTO existingBooking = bookingService.getBookingById(id);

        if (!existingBooking.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        BookingDTO updatedBooking = bookingService.updateBooking(id, bookingDTO);
        return ResponseEntity.ok(updatedBooking);
    }

    // PUT - Update booking status
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(@PathVariable Long id,
                                                          @RequestBody StatusUpdate statusUpdate) {
        BookingDTO updatedBooking = bookingService.updateBookingStatus(id, statusUpdate.getStatus());
        return ResponseEntity.ok(updatedBooking);
    }

    // DELETE - Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id,
                                              HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        BookingDTO existingBooking = bookingService.getBookingById(id);

        if (!existingBooking.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        bookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }
}

class StatusUpdate {
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}