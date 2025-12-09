// src/doctor/pages/DoctorVideoCall.jsx
import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// 🔥 Your Secrets
const APP_ID = 1889844249;
const SERVER_SECRET = "29b17cf5347cefbd9f5801c547bc597a";

export default function DoctorVideoCall() {
    // Generate a random room ID or use a fixed one for testing
    const roomID = "JanSehatGenericRoom";

    // Generate a Kit Token
    const myMeeting = async (element) => {
        const appID = APP_ID;
        const serverSecret = SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            Date.now().toString(),
            "Dr. Kunal" // Name of the user
        );

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Patient Link',
                    url:
                        window.location.protocol + '//' +
                        window.location.host + window.location.pathname +
                        '?roomID=' + roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 calls
            },
            showScreenSharingButton: true,
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
