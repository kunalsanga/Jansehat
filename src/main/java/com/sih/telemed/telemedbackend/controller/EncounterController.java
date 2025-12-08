package com.sih.telemed.telemedbackend.controller;



import com.sih.telemed.telemedbackend.dto.encounter.EncounterAssignRequest;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterCompleteRequest;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterRequest;
import com.sih.telemed.telemedbackend.dto.encounter.EncounterResponse;
import com.sih.telemed.telemedbackend.service.EncounterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encounters")
@RequiredArgsConstructor
public class EncounterController {

    private final EncounterService encounterService;

    // ---------------------------------------------------------
    // CREATE ENCOUNTER (CHW creates)
    // ---------------------------------------------------------
    @PostMapping
    public ResponseEntity<EncounterResponse> createEncounter(
            @RequestBody EncounterRequest request) {

        return ResponseEntity.ok(encounterService.createEncounter(request));
    }

    // ---------------------------------------------------------
    // ASSIGN DOCTOR
    // ---------------------------------------------------------
    @PostMapping("/{id}/assign")
    public ResponseEntity<EncounterResponse> assignDoctor(
            @PathVariable Long id,
            @RequestBody EncounterAssignRequest request) {

        return ResponseEntity.ok(encounterService.assignDoctor(id, request));
    }

    // ---------------------------------------------------------
    // COMPLETE ENCOUNTER
    // ---------------------------------------------------------
    @PostMapping("/{id}/complete")
    public ResponseEntity<EncounterResponse> completeEncounter(
            @PathVariable Long id,
            @RequestBody EncounterCompleteRequest request) {

        return ResponseEntity.ok(encounterService.completeEncounter(id, request));
    }

    // ---------------------------------------------------------
    // GET ENCOUNTER BY ID
    // ---------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<EncounterResponse> getEncounter(@PathVariable Long id) {
        return ResponseEntity.ok(encounterService.getEncounter(id));
    }

    // ---------------------------------------------------------
    // LIST FOR PATIENT
    // ---------------------------------------------------------
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<EncounterResponse>> getEncountersForPatient(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(encounterService.getEncountersForPatient(patientId));
    }

    // ---------------------------------------------------------
    // LIST FOR CHW
    // ---------------------------------------------------------
    @GetMapping("/chw/{chwId}")
    public ResponseEntity<List<EncounterResponse>> getEncountersForCHW(
            @PathVariable Long chwId) {

        return ResponseEntity.ok(encounterService.getEncountersForCHW(chwId));
    }

    // ---------------------------------------------------------
    // LIST FOR DOCTOR
    // ---------------------------------------------------------
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<EncounterResponse>> getEncountersForDoctor(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(encounterService.getEncountersForDoctor(doctorId));
    }
}
