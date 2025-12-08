package com.sih.telemed.telemedbackend.controller;



import com.sih.telemed.telemedbackend.dto.Appoinment.AppointmentRequest;
import com.sih.telemed.telemedbackend.dto.Appoinment.AppointmentResponse;
import com.sih.telemed.telemedbackend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> book(@RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.bookAppointment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getForPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointmentsForPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointmentsForDoctor(doctorId));
    }
}
