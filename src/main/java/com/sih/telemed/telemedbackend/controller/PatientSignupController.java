package com.sih.telemed.telemedbackend.controller;


import com.sih.telemed.telemedbackend.dto.Patient.PatientSignupDto;
import com.sih.telemed.telemedbackend.dto.Patient.PatientSignupResponse;
import com.sih.telemed.telemedbackend.service.PatientSignupService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientSignupController {


    private final PatientSignupService patientSignupService;

    @GetMapping("/test")
    public String test() {
        return "Backend is reachable";
    }

    @PostMapping("/register")
    public ResponseEntity<PatientSignupResponse> register(@RequestBody PatientSignupDto dto) {
        return ResponseEntity.ok(patientSignupService.register(dto));
    }
}
