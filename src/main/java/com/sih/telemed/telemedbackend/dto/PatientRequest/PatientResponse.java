package com.sih.telemed.telemedbackend.dto.PatientRequest;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientResponse {
    private Long id;
    private String name;
    private String phone;
    private String abhaId;
}
