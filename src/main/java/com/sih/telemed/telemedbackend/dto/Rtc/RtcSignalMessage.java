package com.sih.telemed.telemedbackend.dto.Rtc;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RtcSignalMessage {

    private String type;       // "offer", "answer", "candidate"
    private String roomCode;

    private Object offer;      // WebRTC Offer SDP
    private Object answer;     // WebRTC Answer SDP
    private Object candidate;  // full ICE candidate JSON

    private Long fromUserId;
    private Long toUserId;
}
