// src/components/VoiceCommandMic.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import aiService from "../services/aiService";

export default function VoiceCommandMic() {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const navigate = useNavigate();

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

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
    } catch {}
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech Recognition not supported in this browser.");
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    // Let the browser auto-detect language; fallback to English
    recognition.lang = navigator.language || "en-US";

    recognition.onstart = () => { setListening(true); setStatus("Listening…"); };
    recognition.onend = () => { setListening(false); setStatus(""); };
    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setStatus(`Mic error: ${e.error || 'unknown'}`);
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
      setLastTranscript(text);
      setStatus("Interpreting…");
      await handleCommand(text);
      setStatus("");
      // Stop listening to avoid capturing our own spoken response
      try { recognition.stop(); } catch {}
    };

    recognition.start();
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
      
      // Show detected language
      if (result?.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
        setTimeout(() => setDetectedLanguage(""), 3000); // Clear after 3 seconds
      }

      const speakAndGo = (phrase, path) => {
        speak(phrase);
        if (path) navigate(path);
      };

      // Use AI response text if available, otherwise fallback
      const getResponseText = (action, aiResponse) => {
        if (aiResponse?.responseText) return aiResponse.responseText;
        
        // Fallback responses based on detected language
        const lang = result?.detectedLanguage?.toLowerCase() || 'en';
        const responses = {
          'hindi': {
            'OPEN_HEALTH_RECORDS': 'स्वास्थ्य रिकॉर्ड खोल रहे हैं',
            'OPEN_EMERGENCY': 'आपातकालीन मोड खोल रहे हैं',
            'OPEN_SYMPTOM_CHECKER': 'लक्षण जांचकर्ता खोल रहे हैं',
            'OPEN_VIDEO_CONSULTATION': 'वीडियो परामर्श खोल रहे हैं',
            'OPEN_MEDICINE': 'दवा खोजक खोल रहे हैं',
            'OPEN_NAVIGATION': 'अस्पताल नेविगेशन खोल रहे हैं'
          },
          'punjabi': {
            'OPEN_HEALTH_RECORDS': 'ਸਿਹਤ ਰਿਕਾਰਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
            'OPEN_EMERGENCY': 'ਐਮਰਜੈਂਸੀ ਮੋਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
            'OPEN_SYMPTOM_CHECKER': 'ਲੱਛਣ ਚੈਕਰ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
            'OPEN_VIDEO_CONSULTATION': 'ਵੀਡੀਓ ਸਲਾਹ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
            'OPEN_MEDICINE': 'ਦਵਾਈ ਖੋਜਕ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
            'OPEN_NAVIGATION': 'ਹਸਪਤਾਲ ਨੈਵੀਗੇਸ਼ਨ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ'
          },
          'en': {
            'OPEN_HEALTH_RECORDS': 'Opening Health Records',
            'OPEN_EMERGENCY': 'Opening Emergency Mode',
            'OPEN_SYMPTOM_CHECKER': 'Opening Symptom Checker',
            'OPEN_VIDEO_CONSULTATION': 'Opening Video Consultation',
            'OPEN_MEDICINE': 'Opening Medicine Finder',
            'OPEN_NAVIGATION': 'Opening Hospital Navigation'
          }
        };
        
        return responses[lang]?.[action] || responses['en'][action] || 'Opening...';
      };

      if (confidence < 0.4 && action !== 'UNKNOWN') {
        // Low confidence; ask to repeat in user's language
        const lang = result?.detectedLanguage?.toLowerCase() || 'en';
        const repeatMsg = {
          'hindi': 'मुझे समझ नहीं आया। कृपया दोबारा बोलें।',
          'punjabi': 'ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਦੁਬਾਰਾ ਬੋਲੋ।',
          'en': 'I am not sure I understood. Please repeat your command.'
        };
        speak(repeatMsg[lang] || repeatMsg['en']);
        return;
      }

      switch (action) {
        case 'OPEN_HEALTH_RECORDS':
          speakAndGo(getResponseText('OPEN_HEALTH_RECORDS', result), "/records");
          break;
        case 'OPEN_EMERGENCY':
          speakAndGo(getResponseText('OPEN_EMERGENCY', result), "/emergency");
          break;
        case 'OPEN_SYMPTOM_CHECKER':
          // If AI returned symptom text, prefill and auto-analyze; otherwise auto-listen
          localStorage.removeItem('voiceTranscript');
          localStorage.removeItem('autoAnalyze');
          const aiSymptoms = result?.symptomsText && String(result.symptomsText).trim();

          if (isOnSymptomChecker()) {
            if (aiSymptoms) {
              localStorage.setItem('voiceTranscript', aiSymptoms);
              localStorage.setItem('autoAnalyze', '1');
              notifySymptomChecker({ text: aiSymptoms, autoAnalyze: true });
              // Do not speak "opening" to avoid re-capture; keep UI quiet
            } else {
              localStorage.setItem('autoListen', '1');
              notifySymptomChecker({ autoListen: true });
              // Suppress speak while already on page
            }
          } else {
            if (aiSymptoms) {
              localStorage.setItem('voiceTranscript', aiSymptoms);
              localStorage.setItem('autoAnalyze', '1');
            } else {
              localStorage.setItem('autoListen', '1');
            }
            speakAndGo(getResponseText('OPEN_SYMPTOM_CHECKER', result), "/symptoms");
          }
          break;
        case 'OPEN_VIDEO_CONSULTATION':
          speakAndGo(getResponseText('OPEN_VIDEO_CONSULTATION', result), "/video");
          break;
        case 'OPEN_MEDICINE':
          speakAndGo(getResponseText('OPEN_MEDICINE', result), "/medicine");
          break;
        case 'OPEN_NAVIGATION':
          speakAndGo(getResponseText('OPEN_NAVIGATION', result), "/navigation");
          break;
        default:
          // Fallback to old keyword rules if AI couldn't determine
          const lc = text.toLowerCase();
          if (lc.includes("health records")) return speakAndGo("Opening Health Records", "/records");
          if (lc.includes("emergency")) return speakAndGo("Opening Emergency Mode", "/emergency");
          if (lc.includes("symptom")) {
            // Try to extract symptoms after the keyword
            localStorage.removeItem('voiceTranscript');
            localStorage.removeItem('autoAnalyze');
            const cleaned = text.replace(/^(.*?symptom(s)?( checker)?( kholo| open)?[:,]?\s*)/i, '');

            if (isOnSymptomChecker()) {
              if (cleaned && cleaned.trim().length > 0) {
                const s = cleaned.trim();
                localStorage.setItem('voiceTranscript', s);
                localStorage.setItem('autoAnalyze', '1');
                notifySymptomChecker({ text: s, autoAnalyze: true });
              } else {
                localStorage.setItem('autoListen', '1');
                notifySymptomChecker({ autoListen: true });
              }
              // Suppress voice to avoid it being captured as input
              return;
            }

            if (cleaned && cleaned.trim().length > 0) {
              localStorage.setItem('voiceTranscript', cleaned.trim());
              localStorage.setItem('autoAnalyze', '1');
            } else {
              localStorage.setItem('autoListen', '1');
            }
            return speakAndGo("Opening Symptom Checker", "/symptoms");
          }
          if (lc.includes("video")) return speakAndGo("Opening Video Consultation", "/video");
          if (lc.includes("medicine")) return speakAndGo("Opening Medicine Finder", "/medicine");
          if (lc.includes("navigation") || lc.includes("hospital")) return speakAndGo("Opening Hospital Navigation", "/navigation");
          speak("Command not recognized");
      }
    } catch (e) {
      console.error(e);
      speak("There was a problem understanding your command.");
      setStatus("AI error while interpreting command");
    }
  };

  return (
    <>
      {/* Mic Button */}
      <button
        onClick={startListening}
        className={`fixed flex items-center justify-center rounded-full shadow-lg bg-emerald-500 text-white text-xl transition-transform duration-200 z-40
                    w-14 h-14 bottom-20 sm:bottom-6 right-6
                    ${listening ? "scale-110 animate-pulse" : ""}`}
        title="Click to speak"
      >
        <FaMicrophone />
      </button>

      {/* Optional message display */}
      {message && (
        <div className="fixed bottom-32 right-6 bg-white px-3 py-2 rounded shadow-md text-sm text-zinc-700 z-40">
          You said: {message}
        </div>
      )}
      {detectedLanguage && (
        <div className="fixed bottom-56 right-6 bg-blue-50 border border-blue-200 px-3 py-2 rounded shadow-sm text-xs text-blue-800 z-40">
          Language: {detectedLanguage}
        </div>
      )}
      {status && (
        <div className="fixed bottom-44 right-6 bg-amber-50 border border-amber-200 px-3 py-2 rounded shadow-sm text-xs text-amber-800 z-40">
          {status}
        </div>
      )}
    </>
  );
}