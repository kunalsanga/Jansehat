import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple "Serverless" Signaling for Localhost Demos using BroadcastChannel
// This allows tabs to talk to each other without a backend.
const channel = new BroadcastChannel('jansehat_video_call');

export function CallReceiver({ children }) {
    const navigate = useNavigate();
    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'CALL_REQUEST') {
                setIncomingCall(event.data.payload);
                // Play ringtone if desired
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.log('Audio play failed', e));
            }
        };

        channel.onmessage = handleMessage;
        return () => { channel.onmessage = null; };
    }, []);

    const acceptCall = () => {
        // Notify patient
        channel.postMessage({ type: 'CALL_ACCEPTED', payload: { roomID: incomingCall.roomID } });
        setIncomingCall(null);
        navigate('/doctor/video-call?roomID=' + incomingCall.roomID);
    };

    const declineCall = () => {
        channel.postMessage({ type: 'CALL_DECLINED' });
        setIncomingCall(null);
    };

    return (
        <>
            {children}
            {incomingCall && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <span className="text-4xl">📞</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Incoming Call...</h3>
                        <p className="text-gray-500 mb-6">{incomingCall.patientName} is requesting a consultation.</p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={declineCall}
                                className="px-6 py-3 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
                            >
                                Decline
                            </button>
                            <button
                                onClick={acceptCall}
                                className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 shadow-lg shadow-green-200 transition"
                            >
                                Accept Video
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function sendCallRequest(patientName, roomID) {
    channel.postMessage({
        type: 'CALL_REQUEST',
        payload: { patientName, roomID }
    });
}

export function useCallStatus() {
    const [callState, setCallState] = useState({ status: 'idle', data: null });

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'CALL_ACCEPTED') {
                setCallState({ status: 'accepted', data: event.data.payload });
            } else if (event.data.type === 'CALL_DECLINED') {
                setCallState({ status: 'declined', data: null });
            }
        };
        channel.onmessage = handleMessage;
        return () => { channel.onmessage = null; };
    }, []);

    return callState;
}
