package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    User findByUsername(String username);
}
