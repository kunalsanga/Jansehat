// src/doctor/pages/PatientVideoCall.jsx
import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// 🔥 Your Secrets
const APP_ID = 1889844249;
const SERVER_SECRET = "29b17cf5347cefbd9f5801c547bc597a";

export default function PatientVideoCall() {
    // Get room ID from URL params or default
    const getUrlParams = (url = window.location.href) => {
        let urlStr = url.split('?')[1];
        return new URLSearchParams(urlStr);
    };
    const roomID = getUrlParams().get('roomID') || "JanSehatGenericRoom";

    const myMeeting = async (element) => {
        // Generate Kit Token
        const appID = APP_ID;
        const serverSecret = SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            Date.now().toString(),
            "Anonymous Patient"
        );

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: false,
        });
    };

    return (
        <div
            className="myCallContainer"
            ref={myMeeting}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}
