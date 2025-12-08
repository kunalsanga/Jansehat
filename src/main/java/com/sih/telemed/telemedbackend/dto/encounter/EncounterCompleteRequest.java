package com.sih.telemed.telemedbackend.dto.encounter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EncounterCompleteRequest {
    private Long id;
    private String finalDiagnosis;
    private String finalNotes;
}
