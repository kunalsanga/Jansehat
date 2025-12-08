package com.sih.telemed.telemedbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // VERY IMPORTANT: prevents infinite recursion
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User owner;

    // general info
    private String name;
    private String dob;
    private String email;

    @Column(unique = true)
    private String phone;

    private String address;

    // medical info
    private String bloodGroup;
    private String gender;
    private String bloodPressure;
    private String weight;
    private String height;
    private String age;

    //New Fields
    private String village; // e.g., "Alhoran"
    private String block;

    // abha ID
    private String abhaId;

    private LocalDateTime createdAt = LocalDateTime.now();
}
