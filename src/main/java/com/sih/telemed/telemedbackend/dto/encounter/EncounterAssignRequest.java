package com.sih.telemed.telemedbackend.dto.encounter;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EncounterAssignRequest {
    @NotNull
    private Long doctorId;
    private String DoctorName;
}
