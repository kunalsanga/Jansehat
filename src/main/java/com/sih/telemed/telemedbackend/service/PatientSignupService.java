package com.sih.telemed.telemedbackend.service;

import com.sih.telemed.telemedbackend.Enums.Role;
import com.sih.telemed.telemedbackend.Repository.PatientRepository;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import com.sih.telemed.telemedbackend.dto.Patient.PatientSignupDto;
import com.sih.telemed.telemedbackend.dto.Patient.PatientSignupResponse;
import com.sih.telemed.telemedbackend.model.Patient;
import com.sih.telemed.telemedbackend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientSignupService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientSignupResponse register(PatientSignupDto dto) {

        // -----------------------------
        // VALIDATIONS
        // -----------------------------
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (patientRepository.existsByAbhaId(dto.getAbhaId())) {
            throw new RuntimeException("ABHA ID already registered");
        }

        if (patientRepository.existsByPhone(dto.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }


        // -----------------------------
        // 1️⃣ CREATE USER FIRST
        // -----------------------------
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());   // encode if needed
        user.setRole(Role.PATIENT);
        user.setActive(true);

        User savedUser = userRepository.save(user);


        // -----------------------------
        // 2️⃣ CREATE PATIENT AND LINK USER
        // -----------------------------
        Patient patient = new Patient();
        patient.setOwner(savedUser);  // ❗ MUST SET THIS

        patient.setName(dto.getFullName());
        patient.setAge(String.valueOf(dto.getAge()));
        patient.setDob(dto.getDob());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhoneNumber());
        patient.setBloodGroup(dto.getBloodGroup());

        patient.setVillage(dto.getVillage());
        patient.setBlock(dto.getBlock());
        patient.setAddress(dto.getVillage() + ", " + dto.getBlock() + ", " + dto.getCity());

        if (dto.getHeight() != null)
            patient.setHeight(dto.getHeight().toString());
        if (dto.getWeight() != null)
            patient.setWeight(dto.getWeight().toString());

        patient.setAbhaId(dto.getAbhaId());

        Patient saved = patientRepository.save(patient);


        // -----------------------------
        // RESPONSE
        // -----------------------------
        return PatientSignupResponse.builder()
                .id(saved.getId())
                .userId(savedUser.getId())
                .fullName(saved.getName())
                .abhaId(saved.getAbhaId())
                .phoneNumber(saved.getPhone())
                .build();
    }
}
