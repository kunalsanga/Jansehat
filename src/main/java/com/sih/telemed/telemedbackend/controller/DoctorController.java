package com.sih.telemed.telemedbackend.controller;

import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import com.sih.telemed.telemedbackend.dto.Doctor.DoctorCreateRequest;
import com.sih.telemed.telemedbackend.dto.Doctor.DoctorResponse;
import com.sih.telemed.telemedbackend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public DoctorResponse createDoctor(@RequestBody DoctorCreateRequest request) {
        return doctorService.createDoctor(request);
    }

    @GetMapping
    public List<DoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @PutMapping("/{doctorId}/status")
    public DoctorResponse updateStatus(
            @PathVariable Long doctorId,
            @RequestParam DoctorStatus status
    ) {
        return doctorService.updateStatus(doctorId, status);
    }
}
