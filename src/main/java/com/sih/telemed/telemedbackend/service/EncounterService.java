package com.sih.telemed.telemedbackend.service;



import com.sih.telemed.telemedbackend.Enums.EncounterStatus;
import com.sih.telemed.telemedbackend.Repository.EncounterRepository;
import com.sih.telemed.telemedbackend.Repository.PatientRepository;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterAssignRequest;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterCompleteRequest;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterRequest;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterResponse;
import com.sih.telemed.telemedbackend.model.Encounter;
import com.sih.telemed.telemedbackend.model.Patient;
import com.sih.telemed.telemedbackend.model.User;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Setter
@Getter
public class EncounterService {

    private final EncounterRepository encounterRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    // ---------------------------------------------------------
    // CREATE ENCOUNTER (CHW creates)
    // ---------------------------------------------------------
    @Transactional
    public EncounterResponse createEncounter(EncounterRequest req) {

        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        User chw = userRepository.findById(req.getChwId())
                .orElseThrow(() -> new RuntimeException("CHW user not found"));

        Encounter encounter = Encounter.builder()
                .patientId(req.getPatientId())
                .chwId(req.getChwId())
                .doctorId(null)               // doctor not assigned yet
                .symptoms(req.getSymptoms())
                .provisionalDiagnosis(req.getProvisionalDiagnosis())
                .Riskscore(req.getRiskscore())
                .vitalsJson(req.getVitalsJson())
                .status(EncounterStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Encounter saved = encounterRepository.save(encounter);

        return toResponse(saved);
    }

    // ---------------------------------------------------------
    // ASSIGN DOCTOR
    // ---------------------------------------------------------
    @Transactional
    public EncounterResponse assignDoctor(Long encounterId, EncounterAssignRequest req) {

        Encounter enc = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        User doctor = userRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getRole().name().equals("DOCTOR")) {
            throw new RuntimeException("User is not a doctor");
        }

        enc.setDoctorId(req.getDoctorId());
        enc.setStatus(EncounterStatus.ASSIGNED);
        enc.setUpdatedAt(Instant.now());

        encounterRepository.save(enc);

        return toResponse(enc);
    }

    // ---------------------------------------------------------
    // COMPLETE ENCOUNTER (Doctor finishes)
    // ---------------------------------------------------------
    @Transactional
    public EncounterResponse completeEncounter(Long encounterId, EncounterCompleteRequest req) {

        Encounter enc = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));

        if (enc.getStatus() == EncounterStatus.COMPLETED) {
            throw new RuntimeException("Encounter already completed");
        }

        enc.setProvisionalDiagnosis(req.getFinalDiagnosis());
        enc.setVitalsJson(req.getFinalNotes());
        enc.setStatus(EncounterStatus.COMPLETED);
        enc.setUpdatedAt(Instant.now());

        encounterRepository.save(enc);

        return toResponse(enc);
    }

    // ---------------------------------------------------------
    // GET SINGLE ENCOUNTER
    // ---------------------------------------------------------
    public EncounterResponse getEncounter(Long id) {
        Encounter enc = encounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encounter not found"));
        return toResponse(enc);
    }

    // ---------------------------------------------------------
    // LIST FOR PATIENT
    // ---------------------------------------------------------
    public List<EncounterResponse> getEncountersForPatient(Long patientId) {
        return encounterRepository.findByPatientId(patientId)
                .stream().map(this::toResponse).toList();
    }

    // ---------------------------------------------------------
    // LIST FOR CHW
    // ---------------------------------------------------------
    public List<EncounterResponse> getEncountersForCHW(Long chwId) {
        return encounterRepository.findByChwId(chwId)
                .stream().map(this::toResponse).toList();
    }

    // ---------------------------------------------------------
    // LIST FOR DOCTOR
    // ---------------------------------------------------------
    public List<EncounterResponse> getEncountersForDoctor(Long doctorId) {
        return encounterRepository.findByDoctorId(doctorId)
                .stream().map(this::toResponse).toList();
    }

    // ---------------------------------------------------------
    // MAPPER: Entity -> DTO
    // ---------------------------------------------------------
    private EncounterResponse toResponse(Encounter e) {
        return EncounterResponse.builder()
                .id(e.getId())
                .patientId(e.getPatientId())
                .chwId(e.getChwId())
                .doctorId(e.getDoctorId())
                .symptoms(e.getSymptoms())
                .provisionalDiagnosis(e.getProvisionalDiagnosis())
                .Riskscore(e.getRiskscore())
                .vitalsJson(e.getVitalsJson())
                .status(e.getStatus())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
