package com.sih.telemed.telemedbackend.service;

import com.sih.telemed.telemedbackend.Enums.Role;
import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import com.sih.telemed.telemedbackend.Repository.DoctorRepository;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import com.sih.telemed.telemedbackend.dto.Doctor.DoctorCreateRequest;
import com.sih.telemed.telemedbackend.dto.Doctor.DoctorResponse;
import com.sih.telemed.telemedbackend.model.Doctor;
import com.sih.telemed.telemedbackend.model.User;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public DoctorResponse createDoctor(DoctorCreateRequest req) {

        // CREATE USER
        User user = User.builder()
                .username(req.getUsername())
                .password(req.getPassword())
                .role(Role.DOCTOR)
                .fullName(req.getFullName())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        // CREATE DOCTOR RECORD
        Doctor doctor = Doctor.builder()
                .user(savedUser)
                .name(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .specialization(req.getSpecialization())
                .hospital(req.getHospital())
                .active(req.getActive())
                .status(DoctorStatus.AVAILABLE)
                .build();

        Doctor saved = doctorRepository.save(doctor);

        return DoctorResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .specialization(saved.getSpecialization())
                .hospital(saved.getHospital())
                .status(saved.getStatus())
                .build();
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(d -> DoctorResponse.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .email(d.getEmail())
                        .phone(d.getPhone())
                        .specialization(d.getSpecialization())
                        .hospital(d.getHospital())
                        .status(d.getStatus())
                        .build())
                .toList();
    }

    @Transactional
    public DoctorResponse updateStatus(Long doctorId, DoctorStatus status) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus(status);
        doctorRepository.save(doctor);

        return DoctorResponse.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .hospital(doctor.getHospital())
                .status(doctor.getStatus())
                .build();
    }
}
