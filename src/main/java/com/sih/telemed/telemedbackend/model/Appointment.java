package com.sih.telemed.telemedbackend.model;

import com.sih.telemed.telemedbackend.Enums.AppointmentRountingStatus;
import com.sih.telemed.telemedbackend.Enums.AppointmentStatus;
import com.sih.telemed.telemedbackend.Enums.AppointmentType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AppointmentRountingStatus routingStatus = AppointmentRountingStatus.REQUESTED;

    private Long patientId;
    private Long doctorId; // assigned doctor id (nullable until assigned)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType appointmentType;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    private String symptoms;

    private String teleSlotId;

    // Optional: which hospital was assigned to handle this appointment
    private String assignedHospital;
}
