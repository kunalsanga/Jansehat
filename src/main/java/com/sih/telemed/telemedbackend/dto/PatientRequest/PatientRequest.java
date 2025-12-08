package com.sih.telemed.telemedbackend.dto.PatientRequest;

import lombok.Data;

@Data
public class PatientRequest {
    private Long ownerUserId;
    private String name;
    private String dob;
    private String email;
    private String phone;
    private String address;
    private String bloodGroup;
    private String gender;
    private String bloodPressure;
    private String weight;
    private String height;
    private String age;
    private String abhaId;
}
