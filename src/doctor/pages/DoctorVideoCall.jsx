// src/doctor/pages/DoctorVideoCall.jsx
import React, { useRef, useEffect, useState } from "react";
import { connectStomp, disconnectStomp } from "../../rtc/rtcClient";
import {
    initWebRTC,
    createOffer,
    handleIncomingSignal,
    closeConnection,
} from "../../rtc/webrtc";

export default function DoctorVideoCall() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [roomCode, setRoomCode] = useState("");
    const [connected, setConnected] = useState(false);

    // ✅ FIXED — Backend URL now points to Spring Boot (8080)
    async function createSession(encounterId = 1, userId = 1) {
        try {
            const url = `http://localhost:8080/api/rtc/sessions?encounterId=${encounterId}&userId=${userId}`;

            const res = await fetch(url, { method: "POST" });

            if (!res.ok) {
                console.warn("create session failed, fallback to TESTROOM");
                return null;
            }

            const data = await res.json();

            return data.roomCode || data.room_code || data.room || null;

        } catch (e) {
            console.error("createSession error", e);
            return null;
        }
    }

    useEffect(() => {
        let finalRoom = null;

        (async () => {
            // Try creating session in backend
            const rc = await createSession(123, 456); // dummy IDs for now

            finalRoom = rc || "TESTROOM";
            setRoomCode(finalRoom);

            // Connect STOMP signalling server
            connectStomp(finalRoom, (msg) => {
                handleIncomingSignal(finalRoom, msg);
            });

            // Initialize WebRTC (camera + RTCPeerConnection)
            try {
                await initWebRTC(localVideoRef, remoteVideoRef, finalRoom);
                setConnected(true);
            } catch (err) {
                console.error("initWebRTC failed", err);
                alert("Please allow camera/microphone & refresh the page.");
            }
        })();

        return () => {
            disconnectStomp();
            closeConnection();
        };
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Doctor — Live Video Call</h1>

            <div className="flex gap-6">
                <div>
                    <div className="text-sm text-gray-600 mb-1">You (local)</div>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: 360, height: 270, background: "#000" }}
                    />
                </div>

                <div>
                    <div className="text-sm text-gray-600 mb-1">Remote</div>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: 360, height: 270, background: "#000" }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div>
                    Room:{" "}
                    <span className="font-mono px-2 py-1 bg-gray-100 rounded">
                        {roomCode || "—"}
                    </span>
                </div>

                <button
                    onClick={() => createOffer(roomCode)}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                    disabled={!connected}
                >
                    Start Call (create offer)
                </button>

                <button
                    onClick={() => {
                        disconnectStomp();
                        closeConnection();
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded"
                >
                    End Call
                </button>
            </div>
        </div>
    );
}
