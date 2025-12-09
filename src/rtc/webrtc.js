import { sendSignal } from "./rtcClient";

let pc = null;
let localStream = null;
let localRef = null;
let remoteRef = null;

const CONFIG = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ],
};

export async function initWebRTC(localVideoRef, remoteVideoRef, roomCode) {
    localRef = localVideoRef;
    remoteRef = remoteVideoRef;

    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
    } catch (e) {
        console.error("getUserMedia error", e);
        throw e;
    }

    if (localRef?.current) {
        localRef.current.srcObject = localStream;
    }

    createPeerConnection(roomCode);
}

function createPeerConnection(roomCode) {
    if (pc) return;

    pc = new RTCPeerConnection(CONFIG);

    // Add local tracks
    if (localStream) {
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });
    }

    // Remote stream
    pc.ontrack = (event) => {
        if (remoteRef?.current) {
            remoteRef.current.srcObject = event.streams[0];
        }
    };

    // ICE candidates
    pc.onicecandidate = (ev) => {
        if (ev.candidate) {
            sendSignal(roomCode, {
                type: "candidate",
                candidate: JSON.stringify(ev.candidate)
            });
        }
    };

    pc.onconnectionstatechange = () => {
        console.log("PeerConnection state:", pc.connectionState);
    };
}

export async function createOffer(roomCode) {
    if (!pc) createPeerConnection(roomCode);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendSignal(roomCode, {
        type: "offer",
        sdp: offer.sdp
    });
}

export async function handleIncomingSignal(roomCode, data) {
    if (!pc) createPeerConnection(roomCode);

    try {
        if (data.type === "offer") {
            const desc = {
                type: "offer",
                sdp: data.sdp
            };

            await pc.setRemoteDescription(desc);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            sendSignal(roomCode, {
                type: "answer",
                sdp: answer.sdp
            });

        } else if (data.type === "answer") {
            const desc = {
                type: "answer",
                sdp: data.sdp
            };
            await pc.setRemoteDescription(desc);

        } else if (data.type === "candidate") {
            if (data.candidate) {
                const candidateObj = JSON.parse(data.candidate);
                await pc.addIceCandidate(candidateObj);
            }
        }

    } catch (e) {
        console.error("Error in handleIncomingSignal:", e);
    }
}

export function closeConnection() {
    try {
        if (pc) {
            pc.getSenders()?.forEach(s => s.track?.stop?.());
            pc.close();
        }
    } catch {}

    pc = null;

    try {
        localStream?.getTracks().forEach(t => t.stop());
    } catch {}

    localStream = null;
    localRef = null;
    remoteRef = null;
}
