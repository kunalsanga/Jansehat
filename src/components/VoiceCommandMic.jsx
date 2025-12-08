import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import aiService from "../services/aiService";

export default function VoiceCommandMic() {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const isOnSymptomChecker = () => {
    try {
      return (window.location && window.location.pathname.includes('/symptoms'));
    } catch {
      return false;
    }
  };

  const notifySymptomChecker = (detail) => {
    try {
      const evt = new CustomEvent('voice-symptom-input', { detail });
      window.dispatchEvent(evt);
    } catch { }
  };

  // Initialize recognition on mount and cleanup on unmount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = true; // KEEP: Enable real-time feedback

    recognition.onstart = () => { setListening(true); setStatus("Listening…"); };
    recognition.onend = () => { setListening(false); };
    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setStatus(`Mic error: ${e.error || 'unknown'}`);
      setListening(false);
    };

    recognition.onresult = async (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript) {
        setMessage(interimTranscript);
        setStatus("Listening...");
      }

      if (finalTranscript) {
        setMessage(finalTranscript);
        setStatus("Interpreting…");
        await handleCommand(finalTranscript);
        setTimeout(() => { setMessage(""); setStatus(""); }, 5000);
      }
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { }
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatus("Speech Recognition not supported in this browser.");
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("Already listening or error:", e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { }
      setListening(false);
    }
  };

  const handleCommand = async (text) => {
    try {
      // Quick health check to ensure Gemini is configured
      const health = await aiService.checkHealth();
      if (health.status !== 'OK') {
        setStatus("AI not configured. Set VITE_GEMINI_API_KEY in .env");
        const lc = text.toLowerCase();
        if (lc.includes("health")) return navigate("/records");
        if (lc.includes("emerg")) return navigate("/emergency");
        if (lc.includes("symptom")) return navigate("/symptoms");
        if (lc.includes("video")) return navigate("/video");
        if (lc.includes("medicine")) return navigate("/medicine");
        if (lc.includes("navig")) return navigate("/navigation");
        return;
      }

      const result = await aiService.interpretVoiceCommand(text, { locale: navigator.language });
      const action = result?.action || 'UNKNOWN';
      const confidence = typeof result?.confidence === 'number' ? result.confidence : 0;

      setStatus(`Action: ${action} (${(confidence * 100).toFixed(0)}%)`);

      // Show detected language
      if (result?.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
        setTimeout(() => setDetectedLanguage(""), 3000); // Clear after 3 seconds
      }

      const speak = (text, lang) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        if (lang) utterance.lang = lang;
        synth.speak(utterance);
      };

      const speakAndGo = (phrase, lang, path) => {
        speak(phrase, lang);
        if (path) navigate(path);
      };

      const responseText = result?.responseText || "Opening...";
      const langCode = result?.languageCode || 'en-US';

      // If confidence IS low but we have a CHAT response, just speak it.
      if (action === 'CHAT' || action === 'UNKNOWN') {
        speak(responseText, langCode);
        return;
      }

      if (confidence < 0.6 && action !== 'UNKNOWN') {
        // Ambiguous but mapped to an action? check if we have a robust response
        speak(responseText, langCode);
        return;
      }

      switch (action) {
        case 'OPEN_HOME':
          speakAndGo(responseText, langCode, "/");
          break;
        case 'OPEN_HEALTH_RECORDS':
          speakAndGo(responseText, langCode, "/records");
          break;
        case 'OPEN_EMERGENCY':
          speakAndGo(responseText, langCode, "/emergency");
          break;
        case 'OPEN_SYMPTOM_CHECKER':
          localStorage.removeItem('voiceTranscript');
          localStorage.removeItem('autoAnalyze');
          const aiSymptoms = result?.parameters?.symptoms || result?.symptomsText; // Check param first

          if (isOnSymptomChecker()) {
            if (aiSymptoms) {
              notifySymptomChecker({ text: aiSymptoms, autoAnalyze: true });
            } else {
              notifySymptomChecker({ autoListen: true });
            }
            speak(responseText, langCode); // Confirm action
          } else {
            if (aiSymptoms) {
              localStorage.setItem('voiceTranscript', aiSymptoms);
              localStorage.setItem('autoAnalyze', '1');
            } else {
              localStorage.setItem('autoListen', '1');
            }
            speakAndGo(responseText, langCode, "/symptoms");
          }
          break;
        case 'OPEN_VIDEO_CONSULTATION':
          speakAndGo(responseText, langCode, "/video");
          break;
        case 'OPEN_MEDICINE':
          speakAndGo(responseText, langCode, "/medicine");
          break;
        case 'OPEN_NAVIGATION':
          speakAndGo(responseText, langCode, "/navigation");
          break;
        default:
          speak(responseText || "Command not recognized", langCode);
      }
    } catch (e) {
      console.error(e);
      const synth = window.speechSynthesis;
      synth.speak(new SpeechSynthesisUtterance("There was a problem. Check the screen."));
      setStatus(`Error: ${e.message || e.toString()}`);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col-reverse items-end gap-3 pointer-events-none">
      {/* Mic Button - Toggle Stop/Start */}
      <div className="pointer-events-auto relative">
        {listening && (
          <>
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
            <div className="absolute inset-[-4px] border border-red-500 rounded-full opacity-50 animate-pulse"></div>
          </>
        )}
        <button
          onClick={listening ? stopListening : startListening}
          className={`relative flex items-center justify-center rounded-full shadow-xl text-white text-xl transition-all duration-300
                      w-14 h-14 ${listening
              ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/30'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:scale-105 active:scale-95 shadow-emerald-500/30'}`}
          title={listening ? "Stop listening" : "Start voice command"}
        >
          {listening ? (
            <div className="flex gap-1 h-4 items-center">
              <div className="w-1 bg-white h-4 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite]"></div>
              <div className="w-1 bg-white h-2 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite_0.1s]"></div>
              <div className="w-1 bg-white h-3 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]"></div>
            </div>
          ) : (
            <FaMicrophone />
          )}
        </button>
      </div>

      {/* Messages Stack */}
      <div className="flex flex-col items-end gap-2 w-64">
        {message && (
          <div className="bg-white/90 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl rounded-br-none shadow-lg text-sm text-zinc-700 font-medium animate-in slide-in-from-bottom-2 fade-in duration-200">
            <span className="text-xs text-zinc-400 block mb-1">Hearing...</span>
            "{message}"
          </div>
        )}

        {detectedLanguage && (
          <div className="bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg text-xs text-white font-medium animate-in slide-in-from-right-4 fade-in duration-300">
            Detected: {detectedLanguage}
          </div>
        )}

        {status && (
          <div className="bg-zinc-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-xs text-white animate-in zoom-in-95 fade-in">
            {status}
          </div>
        )}
      </div>

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}