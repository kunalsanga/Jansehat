package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByOwnerId(Long ownerId);
}
