package com.sih.telemed.telemedbackend.service;

import com.sih.telemed.telemedbackend.Enums.AppointmentRountingStatus;
import com.sih.telemed.telemedbackend.Enums.AppointmentStatus;
import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import com.sih.telemed.telemedbackend.Repository.AppointmentRepository;
import com.sih.telemed.telemedbackend.Repository.DoctorRepository;
import com.sih.telemed.telemedbackend.Repository.PatientRepository;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import com.sih.telemed.telemedbackend.dto.Appoinment.AppointmentRequest;
import com.sih.telemed.telemedbackend.dto.Appoinment.AppointmentResponse;
import com.sih.telemed.telemedbackend.model.Appointment;
import com.sih.telemed.telemedbackend.model.Doctor;
import com.sih.telemed.telemedbackend.model.Patient;
import com.sih.telemed.telemedbackend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    // Accept timestamps with or without seconds
    private LocalDateTime parseFlexible(String input) {
        try {
            return LocalDateTime.parse(input);          // yyyy-MM-ddTHH:mm:ss
        } catch (DateTimeParseException e) {
            return LocalDateTime.parse(input + ":00"); // yyyy-MM-ddTHH:mm
        }
    }

    // Public book API: performs routing if doctorId not provided
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request) {

        LocalDateTime start = parseFlexible(request.getStartTime());
        LocalDateTime end   = parseFlexible(request.getEndTime());

        if (!end.isAfter(start)) throw new IllegalArgumentException("endTime must be after startTime.");
        if (start.isBefore(LocalDateTime.now())) throw new IllegalArgumentException("Cannot book appointment in the past.");

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        // If patientVillage not provided, try to derive from patient's address (best-effort)
        String patientVillage = Optional.ofNullable(request.getPatientVillage())
                .filter(s -> !s.isBlank())
                .orElseGet(() -> deriveVillageFromPatient(patient));

        // If user explicitly requested a doctor, try to book with them first
        if (request.getDoctorId() != null) {
            // validate doctor exists and is DOCTOR role
            User docUser = userRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
            if (!docUser.getRole().name().equals("DOCTOR")) {
                throw new IllegalArgumentException("User is not a doctor.");
            }
            // check conflicts
            long overlaps = appointmentRepository.countOverlappingScheduledAppointments(request.getDoctorId(), start, end);
            // You may want to consult Doctor.maxConcurrentPatients — fetch the doctor entity
            // For simplicity: if overlaps == 0 allow, else reject
            if (overlaps > 0) {
                // requested doc busy -> we'll attempt automatic routing below (treat as no explicit doctor)
                request.setDoctorId(null);
            } else {
                return saveWithDoctor(request, start, end, patient, docUser, patientVillage);
            }
        }

        // Automatic routing (Option B detailed)
        // Priority order:
        // 1) doctors whose coverageVillages contains patientVillage
        // 2) doctors in same block
        // 3) doctors in same district
        // 4) other hospitals in district
        AppointmentRountingStatus routingStatus = AppointmentRountingStatus.REQUESTED;
        Doctor chosen = null;

        if (patientVillage != null && !patientVillage.isBlank()) {
            chosen = assignFromCandidates(
                    doctorRepository.findByCoverageVillagesContainingIgnoreCase(patientVillage),
                    start, end
            );
            if (chosen != null) routingStatus = AppointmentRountingStatus.ASSIGNED;
        }

        if (chosen == null) {
            // fallback: find patient block from patient's stored address (try from patient)
            String block = deriveBlockFromPatient(patient);
            if (block != null) {
                chosen = assignFromCandidates(
                        doctorRepository.findByBlockIgnoreCase(block),
                        start, end
                );
                if (chosen != null) routingStatus = AppointmentRountingStatus.ASSIGNED;
                else routingStatus = AppointmentRountingStatus.ASSIGNING;
            }
        }

        if (chosen == null) {
            // district fallback
            String district = deriveDistrictFromPatient(patient);
            if (district != null) {
                chosen = assignFromCandidates(
                        doctorRepository.findByDistrictIgnoreCase(district),
                        start, end
                );
                if (chosen != null) routingStatus = AppointmentRountingStatus.ASSIGNED;
                else routingStatus = AppointmentRountingStatus.ASSIGNING;
            }
        }

        if (chosen == null) {
            // try other hospitals in the district (closest remote support)
            String district = deriveDistrictFromPatient(patient);
            if (district != null) {
                List<Doctor> districtDoctors = doctorRepository.findByDistrictIgnoreCase(district);
                chosen = assignFromCandidates(districtDoctors, start, end);
                if (chosen != null) routingStatus = AppointmentRountingStatus.ASSIGNED;
            }
        }

        if (chosen == null) {
            routingStatus = AppointmentRountingStatus.NO_DOCTOR_AVAILABLE;
            // Save appointment nonetheless with routing status NO_DOCTOR_AVAILABLE so UI can show queued state
            Appointment appt = Appointment.builder()
                    .patientId(request.getPatientId())
                    .doctorId(null)
                    .appointmentType(request.getAppointmentType())
                    .startTime(start)
                    .endTime(end)
                    .teleSlotId(request.getTeleSlotId())
                    .symptoms(request.getSymptoms())
                    .status(AppointmentStatus.SCHEDULED)
                    .routingStatus(routingStatus)
                    .assignedHospital(null)
                    .build();
            Appointment saved = appointmentRepository.save(appt);
            return toResponse(saved);
        }

        // found a doctor => create and assign
        // set assignedHospital from doctor.hospital
        Appointment appt = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(chosen.getId())
                .appointmentType(request.getAppointmentType())
                .startTime(start)
                .endTime(end)
                .teleSlotId(request.getTeleSlotId())
                .symptoms(request.getSymptoms())
                .status(AppointmentStatus.SCHEDULED)
                .routingStatus(AppointmentRountingStatus.ASSIGNED)
                .assignedHospital(chosen.getHospital())
                .build();

        Appointment saved = appointmentRepository.save(appt);

        return buildResponseWithDoctor(saved, patient, chosen);
    }

    // Helper: try to assign an available doctor from candidates (sorted by priority)
    private Doctor assignFromCandidates(List<Doctor> candidates, LocalDateTime start, LocalDateTime end) {
        if (candidates == null || candidates.isEmpty()) return null;

        // Filter active and AVAILABLE
        List<Doctor> filtered = candidates.stream()
                .filter(Objects::nonNull)
                .filter(d -> d.getActive() != null && d.getActive())
                .filter(d -> d.getStatus() == DoctorStatus.AVAILABLE)
                .sorted(Comparator.comparingInt(d -> Optional.ofNullable(d.getPriority()).orElse(100)))
                .collect(Collectors.toList());

        for (Doctor d : filtered) {
            long overlapping = appointmentRepository.countOverlappingScheduledAppointments(d.getId(), start, end);
            int maxConcurrent = Optional.ofNullable(d.getMaxConcurrentPatients()).orElse(1);
            if (overlapping < maxConcurrent) {
                return d;
            }
        }
        return null;
    }

    private String deriveVillageFromPatient(Patient p) {
        // best-effort parse: if patient.address contains village name or we've stored separate field
        // In your real system, store village separately. For now just return null if not present.
        return null;
    }

    private String deriveBlockFromPatient(Patient p) {
        // TODO: implement block extraction (if you store block)
        return null;
    }

    private String deriveDistrictFromPatient(Patient p) {
        // fallback to Patiala if you know patients are in this district
        return "Patiala";
    }

    // When explicit doctor requested and available
    private AppointmentResponse saveWithDoctor(AppointmentRequest request, LocalDateTime start, LocalDateTime end,
                                               Patient patient, User docUser, String patientVillage) {
        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentType(request.getAppointmentType())
                .startTime(start)
                .endTime(end)
                .teleSlotId(request.getTeleSlotId())
                .symptoms(request.getSymptoms())
                .status(AppointmentStatus.SCHEDULED)
                .routingStatus(AppointmentRountingStatus.ASSIGNED)
                .assignedHospital(null)
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        return AppointmentResponse.builder()
                .id(saved.getId())
                .startTime(saved.getStartTime().toString())
                .endTime(saved.getEndTime().toString())
                .teleSlotId(saved.getTeleSlotId())
                .status(saved.getStatus())
                .appointmentType(saved.getAppointmentType())
                .patientName(patient.getName())
                .doctorName(docUser.getFullName())
                .assignedDoctorId(docUser.getId())
                .assignedDoctorName(docUser.getFullName())
                .routingStatus(AppointmentRountingStatus.ASSIGNED)
                .build();
    }

    // Response assembly when we assigned with Doctor entity
    private AppointmentResponse buildResponseWithDoctor(Appointment saved, Patient patient, Doctor doctor) {
        return AppointmentResponse.builder()
                .id(saved.getId())
                .startTime(saved.getStartTime().toString())
                .endTime(saved.getEndTime().toString())
                .teleSlotId(saved.getTeleSlotId())
                .status(saved.getStatus())
                .appointmentType(saved.getAppointmentType())
                .patientName(patient.getName())
                .doctorName(doctor.getName())
                .assignedDoctorId(doctor.getId())
                .assignedDoctorName(doctor.getName())
                .assignedHospital(doctor.getHospital())
                .routingStatus(saved.getRoutingStatus())
                .build();
    }

    // Cancel and the other methods unchanged (keep earlier implementations)
    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentResponse> getUpcomingAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientIdAndStatus(patientId, AppointmentStatus.SCHEDULED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AppointmentResponse> getUpcomingAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.SCHEDULED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .startTime(a.getStartTime().toString())
                .endTime(a.getEndTime().toString())
                .teleSlotId(a.getTeleSlotId())
                .status(a.getStatus())
                .appointmentType(a.getAppointmentType())
                .patientName("Patient-" + a.getPatientId())
                .doctorName(a.getDoctorId() == null ? null : "Doctor-" + a.getDoctorId())
                .routingStatus(a.getRoutingStatus())
                .assignedDoctorId(a.getDoctorId())
                .assignedHospital(a.getAssignedHospital())
                .build();
    }
}
