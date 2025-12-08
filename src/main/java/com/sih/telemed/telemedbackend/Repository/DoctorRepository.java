package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import com.sih.telemed.telemedbackend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // doctors that explicitly cover the village
    List<Doctor> findByCoverageVillagesContainingIgnoreCase(String village);

    // doctors in the same block (filter by status in service)
    List<Doctor> findByBlockIgnoreCase(String block);

    // doctors in the same district
    List<Doctor> findByDistrictIgnoreCase(String district);

    // doctors in the same hospital
    List<Doctor> findByHospitalIgnoreCase(String hospital);

    // convenience
    List<Doctor> findByStatus(DoctorStatus status);
}
