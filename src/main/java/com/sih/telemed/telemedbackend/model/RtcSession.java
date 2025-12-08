package com.sih.telemed.telemedbackend.model;

import com.sih.telemed.telemedbackend.Enums.RtcSessionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rtc_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RtcSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // encounter or appointment this call belongs to
    private Long encounterId;      // or appointmentId

    // randomly generated room code, used by frontend to join
    @Column(unique = true, nullable = false, length = 64)
    private String roomCode;

    // creator of the session (patient / doctor / chw userId)
    private Long createdByUserId;

    @Enumerated(EnumType.STRING)
    private RtcSessionStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
}
