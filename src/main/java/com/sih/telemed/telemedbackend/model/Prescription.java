package com.sih.telemed.telemedbackend.model;

import lombok.*;
import jakarta.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long encounterId;
    private Long patientId;
    private Long doctorId;

    @Column(columnDefinition = "TEXT")
    private String medicationsJson;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String Dosage;

    private LocalDateTime followUpDate;

    @Column(columnDefinition = "TEXT")
    private String qrCodeData;

    private LocalDateTime createdAt = LocalDateTime.now();
}
