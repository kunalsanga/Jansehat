package com.sih.telemed.telemedbackend.model;

import com.sih.telemed.telemedbackend.Enums.EncounterStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "encounters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Encounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---------------------------------------------------------
    // Foreign Keys as IDs (Simple and Bug-free)
    // ---------------------------------------------------------
    private Long patientId;
    private Long chwId;       // ASHA worker
    private Long doctorId;    // Nullable until assigned

    // ---------------------------------------------------------
    // Medical Details
    // ---------------------------------------------------------
    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String provisionalDiagnosis;

    private Double Riskscore;

    private Double bloodSugar;

    @Column(columnDefinition = "TEXT")
    private String vitalsJson;

    // ---------------------------------------------------------
    // Status
    // ---------------------------------------------------------
    @Enumerated(EnumType.STRING)
    private EncounterStatus status;

    // ---------------------------------------------------------
    // Timestamps
    // ---------------------------------------------------------
    private Instant createdAt;
    private Instant updatedAt;
}
