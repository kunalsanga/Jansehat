package com.sih.telemed.telemedbackend.Repository;



import com.sih.telemed.telemedbackend.model.Encounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncounterRepository extends JpaRepository<Encounter, Long> {

    List<Encounter> findByPatientId(Long patientId);

    List<Encounter> findByChwId(Long chwId);

    List<Encounter> findByDoctorId(Long doctorId);

}

