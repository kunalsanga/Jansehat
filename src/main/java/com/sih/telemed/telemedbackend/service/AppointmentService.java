package com.sih.telemed.telemedbackend.service;

import com.sih.telemed.telemedbackend.Enums.AppointmentRountingStatus;
import com.sih.telemed.telemedbackend.Enums.AppointmentStatus;
import com.sih.telemed.telemedbackend.Repository.PatientRepository;
import com.sih.telemed.telemedbackend.Repository.AppointmentRepository;
import com.sih.telemed.telemedbackend.dto.Appoinment.AppointmentRequest;
import com.sih.telemed.telemedbackend.dto.Appoinment.AppointmentResponse;
import com.sih.telemed.telemedbackend.model.Appointment;
import com.sih.telemed.telemedbackend.model.Patient;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;

import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    // ---------------------------------------------------------
    // FLEXIBLE DATETIME PARSER (supports: 2025-12-08T10:30Z, with offsets, without seconds)
    // ---------------------------------------------------------
    private LocalDateTime parseFlexible(String input) {
        try {
            // handles: 2025-12-08T10:30:00Z or with +05:30 offset
            return OffsetDateTime.parse(input).toLocalDateTime();
        } catch (Exception e1) {
            try {
                // handles: 2025-12-08T10:30:00 or 2025-12-08T10:30
                return LocalDateTime.parse(input);
            } catch (Exception e2) {
                // fallback: if seconds missing, append :00
                return LocalDateTime.parse(input + ":00");
            }
        }
    }

    // ---------------------------------------------------------
    // CREATE APPOINTMENT (PATIENT REQUESTS)
    // ---------------------------------------------------------
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request) {

        // Validate patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        // Parse times
        LocalDateTime start = parseFlexible(request.getStartTime());
        LocalDateTime end = parseFlexible(request.getEndTime());

        // Validate ordering
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("endTime must be after startTime.");
        }

        // Convert patient input to local timezone for comparison
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));

        if (start.isBefore(now)) {
            throw new IllegalArgumentException(
                    "Cannot book appointment in the past. Start: " + start + ", Now: " + now
            );
        }

        // Save appointment WITHOUT doctorId — doctor will be assigned by routing logic
        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(null) // doctor assigned later
                .appointmentType(request.getAppointmentType())
                .startTime(start)
                .endTime(end)
                .teleSlotId(request.getTeleSlotId())
                .symptoms(request.getSymptoms())
                .routingStatus(AppointmentRountingStatus.REQUESTED)
                .status(AppointmentStatus.SCHEDULED)
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        return AppointmentResponse.builder()
                .id(saved.getId())
                .startTime(saved.getStartTime().toString())
                .endTime(saved.getEndTime().toString())
                .teleSlotId(saved.getTeleSlotId())
                .status(saved.getStatus())
                .appointmentType(saved.getAppointmentType())
                .routingStatus(saved.getRoutingStatus())
                .assignedDoctorId(saved.getDoctorId())  // null for now
                .patientName(patient.getName())
                .doctorName(null)
                .build();
    }

    // ---------------------------------------------------------
    // CANCEL
    // ---------------------------------------------------------
    @Transactional
    public void cancelAppointment(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Unable to cancel a completed appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    // ---------------------------------------------------------
    // GET PATIENT APPOINTMENTS
    // ---------------------------------------------------------
    public List<AppointmentResponse> getUpcomingAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientIdAndStatus(patientId, AppointmentStatus.SCHEDULED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ---------------------------------------------------------
    // GET DOCTOR APPOINTMENTS
    // ---------------------------------------------------------
    public List<AppointmentResponse> getUpcomingAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.SCHEDULED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ---------------------------------------------------------
    // ENTITY → DTO
    // ---------------------------------------------------------
    @Transactional
    public AppointmentResponse assignDoctor(Long appointmentId, Long doctorId) {

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        appt.setDoctorId(doctorId);
        appt.setRoutingStatus(AppointmentRountingStatus.ASSIGNED);

        Appointment saved = appointmentRepository.save(appt);

        return AppointmentResponse.builder()
                .id(saved.getId())
                .startTime(saved.getStartTime().toString())
                .endTime(saved.getEndTime().toString())
                .teleSlotId(saved.getTeleSlotId())
                .status(saved.getStatus())
                .appointmentType(saved.getAppointmentType())
                .routingStatus(saved.getRoutingStatus())
                .assignedDoctorId(saved.getDoctorId())
                .patientName("Patient-" + saved.getPatientId())
                .doctorName("Doctor-" + doctorId)
                .build();
    }
    // ---------------------------------------------------------
// SHARED MAPPER: Appointment → AppointmentResponse
// ---------------------------------------------------------
    private AppointmentResponse toResponse(Appointment a) {

        return AppointmentResponse.builder()
                .id(a.getId())
                .startTime(a.getStartTime() != null ? a.getStartTime().toString() : null)
                .endTime(a.getEndTime() != null ? a.getEndTime().toString() : null)
                .teleSlotId(a.getTeleSlotId())
                .status(a.getStatus())
                .appointmentType(a.getAppointmentType())
                .routingStatus(a.getRoutingStatus())
                .assignedDoctorId(a.getDoctorId())
                .patientName("Patient-" + a.getPatientId())
                .doctorName(a.getDoctorId() != null ? "Doctor-" + a.getDoctorId() : null)
                .build();
    }

}