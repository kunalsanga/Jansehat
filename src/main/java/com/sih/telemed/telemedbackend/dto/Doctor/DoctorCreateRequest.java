package com.sih.telemed.telemedbackend.dto.Doctor;

import lombok.Data;

@Data
public class DoctorCreateRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private String specialization;
    private String hospital;
    private Boolean active;
}
