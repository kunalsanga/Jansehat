package com.sih.telemed.telemedbackend.model;

import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User (owner of doctor profile)
    private Long userId;

    @NotNull
    private String name;

    @NotNull
    private String email;

    @NotNull
    private String phone;

    private String address;

    @NotNull
    private String specialization;

    @NotNull
    private String hospital;      // e.g. "Nabha Civil Hospital"

    @NotNull
    private String block;         // e.g. "Nabha" or "Bhadson"

    @NotNull
    private String district;      // e.g. "Patiala"

    @NotNull
    private Boolean active = true;

    // allowed concurrent scheduled patients
    private Integer maxConcurrentPatients = 1;

    // lower number = higher priority
    private Integer priority = 100;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status = DoctorStatus.AVAILABLE;

    // villages covered by this doctor (ElementCollection => separate table)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "doctor_coverage_villages", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "village")
    private List<String> coverageVillages;
}
