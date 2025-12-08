package com.sih.telemed.telemedbackend.model;

import com.sih.telemed.telemedbackend.Enums.AppointmentType;
import com.sih.telemed.telemedbackend.Enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tele_slot", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"doctor_id", "startTime"})
})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Teleslot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id",nullable = false)
    private Doctor doctor;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private AppointmentType  appointmentType;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Integer maxPatients;
    private Integer minPatients;


}
