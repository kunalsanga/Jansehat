package com.sih.telemed.telemedbackend.dto.Patient;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientSignupResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String abhaId;
    private String phoneNumber;
}
