package com.sih.telemed.telemedbackend.Repository;

import com.sih.telemed.telemedbackend.model.RtcSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RtcSessionRepository extends JpaRepository<RtcSession, Long> {

    Optional<RtcSession> findByRoomCode(String roomCode);
}
