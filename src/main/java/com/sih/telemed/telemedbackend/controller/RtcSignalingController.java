package com.sih.telemed.telemedbackend.controller;



import com.sih.telemed.telemedbackend.dto.Rtc.RtcSignalMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class RtcSignalingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/rtc/signal")
    public void handleSignal(@Payload RtcSignalMessage message) {
        // You can add validation: check room exists, user allowed, etc.

        String destination = "/topic/rtc/" + message.getRoomCode();
        messagingTemplate.convertAndSend(destination, message);
    }
}
