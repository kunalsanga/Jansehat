package com.sih.telemed.telemedbackend.controller;

import com.sih.telemed.telemedbackend.Repository.UserRepository;
import com.sih.telemed.telemedbackend.dto.PatientRequest.PatientRequest;
import com.sih.telemed.telemedbackend.dto.PatientRequest.PatientResponse;
import com.sih.telemed.telemedbackend.model.Patient;
import com.sih.telemed.telemedbackend.Repository.PatientRepository;
import com.sih.telemed.telemedbackend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @PostMapping
    public PatientResponse createPatient(@RequestBody PatientRequest request) {

        User owner = userRepository.findById(request.getOwnerUserId())
                .orElseThrow(() -> new RuntimeException("Owner user not found"));

        Patient patient = new Patient();
        patient.setOwner(owner);
        patient.setName(request.getName());
        patient.setDob(request.getDob());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setGender(request.getGender());
        patient.setBloodPressure(request.getBloodPressure());
        patient.setWeight(request.getWeight());
        patient.setHeight(request.getHeight());
        patient.setAge(request.getAge());
        patient.setAbhaId(request.getAbhaId());
        patient.setCreatedAt(LocalDateTime.now());

        Patient saved = patientRepository.save(patient);

        return PatientResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .phone(saved.getPhone())
                .abhaId(saved.getAbhaId())
                .build();
    }
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // GET PATIENT BY ID
    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // GET PATIENTS BY USER
    @GetMapping("/user/{userId}")
    public List<Patient> getPatientsByUser(@PathVariable Long userId) {
        return patientRepository.findByOwnerId(userId);
    }
}
