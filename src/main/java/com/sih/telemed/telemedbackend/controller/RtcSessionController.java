package com.sih.telemed.telemedbackend.controller;


import com.sih.telemed.telemedbackend.service.RtcSessionService;
import com.sih.telemed.telemedbackend.model.RtcSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rtc")
@RequiredArgsConstructor
public class RtcSessionController {

    private final RtcSessionService rtcSessionService;

    @PostMapping("/sessions")
    public RtcSession createSession(@RequestParam Long encounterId,
                                    @RequestParam Long userId) {
        // you’ll later extract userId from JWT instead of query param
        return rtcSessionService.createSession(encounterId, userId);
    }

    @GetMapping("/sessions/{roomCode}")
    public RtcSession getSession(@PathVariable String roomCode) {
        return rtcSessionService.getByRoomCode(roomCode);
    }

    @PostMapping("/sessions/{roomCode}/end")
    public void endSession(@PathVariable String roomCode) {
        rtcSessionService.endSession(roomCode);
    }
}
