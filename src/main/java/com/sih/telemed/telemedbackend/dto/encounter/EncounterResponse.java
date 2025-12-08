package com.sih.telemed.telemedbackend.dto.encounter;

import com.sih.telemed.telemedbackend.Enums.EncounterStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EncounterResponse {
    private Long id;
    private Long patientId;
    private Long chwId;
    private Long doctorId;
    private String symptoms;
    private String provisionalDiagnosis;
    private Double Riskscore;
    private String vitalsJson;
    private EncounterStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
