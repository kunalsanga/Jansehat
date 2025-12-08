package com.sih.telemed.telemedbackend.dto.encounter;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncounterRequest {
    @NotNull
    private Long patientId;
    @NotNull
    private Long chwId;

    private Long doctorId;

    private String symptoms;

    private Double bloodSugar;

    private String provisionalDiagnosis;

    private Double Riskscore;

    private String vitalsJson;


}
