// src/doctor/pages/PatientVideoCall.jsx
import React, { useRef, useEffect, useState } from "react";
import { connectStomp, disconnectStomp } from "../../rtc/rtcClient";
import { initWebRTC, handleIncomingSignal, closeConnection } from "../../rtc/webrtc";

export default function PatientVideoCall() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [roomCode, setRoomCode] = useState("");
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // For testing: get room from query param ?room=ROOMCODE or ask prompt
        const params = new URLSearchParams(window.location.search);
        const rc = params.get("room") || prompt("Enter room code to join:");
        if (!rc) {
            alert("No room code provided");
            return;
        }
        setRoomCode(rc);

        connectStomp(rc, (msg) => handleIncomingSignal(rc, msg));

        (async () => {
            try {
                await initWebRTC(localVideoRef, remoteVideoRef, rc);
                setConnected(true);
            } catch (e) {
                console.error("initWebRTC error", e);
                alert("Allow camera and microphone and refresh the page");
            }
        })();

        return () => {
            disconnectStomp();
            closeConnection();
        };
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Patient — Join Call</h1>

            <div className="flex gap-6">
                <div>
                    <div className="text-sm text-gray-600 mb-1">You (local)</div>
                    <video ref={localVideoRef} autoPlay muted playsInline style={{ width: 360, height: 270, background: "#000" }} />
                </div>

                <div>
                    <div className="text-sm text-gray-600 mb-1">Remote</div>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 360, height: 270, background: "#000" }} />
                </div>
            </div>

            <div>Room: <span className="font-mono px-2 py-1 bg-gray-100 rounded">{roomCode || "—"}</span></div>

            <div className="text-sm text-gray-600">
                Waiting for doctor to start the call...
            </div>

            <button onClick={() => { disconnectStomp(); closeConnection(); }} className="px-3 py-2 bg-red-500 text-white rounded">
                Leave
            </button>
        </div>
    );
}
