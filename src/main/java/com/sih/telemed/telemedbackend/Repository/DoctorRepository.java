package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.model.Doctor;
import com.sih.telemed.telemedbackend.Enums.DoctorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByHospital(String hospital);
    List<Doctor> findByStatus(DoctorStatus status);
}
