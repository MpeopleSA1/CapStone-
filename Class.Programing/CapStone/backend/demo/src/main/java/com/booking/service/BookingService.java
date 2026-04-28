package com.booking.service;

import com.booking.dto.BookingDTO;
import com.booking.entity.Booking;
import com.booking.entity.User;
import com.booking.repository.BookingRepository;
import com.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingDTO createBooking(BookingDTO bookingDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = Booking.builder()
                .customerName(bookingDTO.getCustomerName())
                .date(bookingDTO.getDate())
                .seats(bookingDTO.getSeats())
                .status("PENDING")
                .notes(bookingDTO.getNotes())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }

    public BookingDTO updateBooking(Long id, BookingDTO bookingDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (bookingDTO.getCustomerName() != null) {
            booking.setCustomerName(bookingDTO.getCustomerName());
        }
        if (bookingDTO.getDate() != null) {
            booking.setDate(bookingDTO.getDate());
        }
        if (bookingDTO.getSeats() != null) {
            booking.setSeats(bookingDTO.getSeats());
        }
        if (bookingDTO.getStatus() != null) {
            booking.setStatus(bookingDTO.getStatus());
        }
        if (bookingDTO.getNotes() != null) {
            booking.setNotes(bookingDTO.getNotes());
        }

        booking.setUpdatedAt(LocalDateTime.now());
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    public BookingDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepository.delete(booking);
    }

    private BookingDTO convertToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .customerName(booking.getCustomerName())
                .date(booking.getDate())
                .seats(booking.getSeats())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .userId(booking.getUser().getId())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}