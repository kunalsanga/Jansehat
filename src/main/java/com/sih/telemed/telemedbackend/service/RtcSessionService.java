package com.sih.telemed.telemedbackend.service;

import com.sih.telemed.telemedbackend.Enums.RtcSessionStatus;
import com.sih.telemed.telemedbackend.Repository.RtcSessionRepository;
import com.sih.telemed.telemedbackend.model.RtcSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RtcSessionService {

    private final RtcSessionRepository rtcSessionRepository;
    private final SecureRandom random = new SecureRandom();

    public RtcSession createSession(Long encounterId, Long userId) {
        String roomCode = generateRoomCode();

        RtcSession session = RtcSession.builder()
                .encounterId(encounterId)
                .createdByUserId(userId)
                .roomCode(roomCode)
                .status(RtcSessionStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        return rtcSessionRepository.save(session);
    }

    public RtcSession getByRoomCode(String roomCode) {
        return rtcSessionRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("RTC room not found"));
    }

    public void endSession(String roomCode) {
        RtcSession session = getByRoomCode(roomCode);
        session.setStatus(RtcSessionStatus.ENDED);
        session.setEndedAt(LocalDateTime.now());
        rtcSessionRepository.save(session);
    }

    private String generateRoomCode() {
        // simple: 10-char random alphanumeric
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
