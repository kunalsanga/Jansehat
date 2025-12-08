package com.sih.telemed.telemedbackend.dto.Patient;

import lombok.Data;

@Data
public class PatientSignupDto {
    private String username;
    private String password;

    private String abhaId;
    private String fullName;
    private Integer age;
    private String dob;
    private String phoneNumber;

    private String village;
    private String block;
    private String city;

    private String bloodGroup;
    private String email;
    private Integer height;
    private Integer weight;
}
