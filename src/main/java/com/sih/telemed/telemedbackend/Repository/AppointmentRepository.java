package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.Enums.AppointmentStatus;
import com.sih.telemed.telemedbackend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("""
        SELECT a FROM Appointment a
        WHERE a.doctorId = :doctorId
          AND a.status = :status
          AND (a.startTime < :endTime AND a.endTime > :startTime)
    """)
    List<Appointment> findConflicts(@Param("doctorId") Long doctorId,
                                    @Param("status") AppointmentStatus status,
                                    @Param("startTime") LocalDateTime startTime,
                                    @Param("endTime") LocalDateTime endTime);

    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);

    // Count scheduled overlapping appointments for a given doctor (used to check availability)
    @Query("""
        SELECT COUNT(a) FROM Appointment a
        WHERE a.doctorId = :doctorId
          AND a.status = com.sih.telemed.telemedbackend.Enums.AppointmentStatus.SCHEDULED
          AND (a.startTime < :endTime AND a.endTime > :startTime)
    """)
    long countOverlappingScheduledAppointments(@Param("doctorId") Long doctorId,
                                               @Param("startTime") LocalDateTime startTime,
                                               @Param("endTime") LocalDateTime endTime);
}
