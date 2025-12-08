package com.sih.telemed.telemedbackend.dto.Doctor;

import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String hospital;
    private DoctorStatus status;
}
