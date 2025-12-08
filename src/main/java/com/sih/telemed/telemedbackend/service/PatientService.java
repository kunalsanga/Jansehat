package com.sih.telemed.telemedbackend.service;

import com.sih.telemed.telemedbackend.dto.Patient.PatientRequest;
import com.sih.telemed.telemedbackend.dto.Patient.PatientResponse;
import com.sih.telemed.telemedbackend.model.Patient;
import com.sih.telemed.telemedbackend.model.User;
import com.sih.telemed.telemedbackend.Repository.PatientRepository;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Transactional
    public PatientResponse createPatient(PatientRequest request) {
        User owner = userRepository.findById(request.getOwnerUserId())
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found"));

        Patient patient = Patient.builder()
                .owner(owner)
                .name(request.getName())
                .dob(request.getDob())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .gender(request.getGender())
                .bloodPressure(request.getBloodPressure())
                .weight(request.getWeight())
                .height(request.getHeight())
                .age(request.getAge())
                .abhaId(request.getAbhaId())
                .build();

        Patient saved = patientRepository.save(patient);

        return toResponse(saved);
    }

    public List<PatientResponse> getPatientsForUser(Long userId) {
        return patientRepository.findByOwnerId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    private PatientResponse toResponse(Patient p) {
        return PatientResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .phone(p.getPhone())
                .abhaId(p.getAbhaId())
                .build();
    }
}
