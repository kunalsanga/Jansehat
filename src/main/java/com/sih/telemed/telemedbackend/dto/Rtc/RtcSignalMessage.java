package com.sih.telemed.telemedbackend.dto.Rtc;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RtcSignalMessage {

    private String type;          // "offer", "answer", "candidate", "end", "chat"

    private String roomCode;      // which RTC session
    private Long fromUserId;
    private Long toUserId;        // optional; often you just broadcast in a room

    private String sdp;           // for offer/answer
    private String candidate;     // for ICE
    private String chatMessage;   // for chat type
}
