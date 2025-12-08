package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findByOwnerId(Long ownerId);

    boolean existsByAbhaId(String abhaId);   // ✔ Correct spelling & signature

    boolean existsByPhone(String phone);     // ✔ Also correct
}
