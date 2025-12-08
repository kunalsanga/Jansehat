package com.sih.telemed.telemedbackend.model;

import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // PK

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    private String address;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String hospital;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status = DoctorStatus.AVAILABLE;

    private Boolean active = true;
}
