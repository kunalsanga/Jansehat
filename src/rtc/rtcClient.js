// src/rtc/rtcClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

/**
 * Connects to backend STOMP (SockJS) and subscribes to /topic/rtc/{roomCode}.
 * onMessage receives parsed JSON payload.
 */
export function connectStomp(roomCode, onMessage) {
    if (stompClient && stompClient.active) return;

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        reconnectDelay: 5000,
        debug: () => {}, // set to console.log to debug
    });

    stompClient.onConnect = () => {
        stompClient.subscribe(`/topic/rtc/${roomCode}`, (msg) => {
            try {
                const body = JSON.parse(msg.body);
                onMessage(body);
            } catch (e) {
                console.error("Invalid STOMP message", e);
            }
        });
    };

    stompClient.onStompError = (err) => {
        console.error("STOMP error", err);
    };

    stompClient.activate();
}

export function disconnectStomp() {
    if (!stompClient) return;
    try {
        stompClient.deactivate();
    } catch (e) {
        console.warn("stomp deactivate error", e);
    }
    stompClient = null;
}

/**
 * Send signalling payload to backend mapping /app/rtc/signal
 * payload examples:
 *   { type: 'offer', offer }
 *   { type: 'answer', answer }
 *   { type: 'candidate', candidate }
 */
export function sendSignal(roomCode, payload) {
    if (!stompClient || !stompClient.active) {
        console.warn("STOMP not connected yet");
        return;
    }

    stompClient.publish({
        destination: "/app/rtc/signal",
        body: JSON.stringify({ roomCode, ...payload }),
    });
}
