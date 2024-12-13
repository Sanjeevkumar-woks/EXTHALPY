import React, { useState, useRef, useEffect } from "react";

function VoiceAssistance() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [translation, setTranslation] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // stop the speech if the user starts a new recording
  useEffect(() => {
    if (recording) {
      window.speechSynthesis.cancel();
    }
  });

  // start recording
  const handleStartRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        // Send audio to OpenAI for translation
        await handleTranslate(audioFile);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  // stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // translate audio
  const handleTranslate = async (file) => {
    const apiKey =
      "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";

    if (!apiKey) {
      setError("API key is not set.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/translations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTranslation(data.text);

      // Send translation to ChatGPT
      await handleChatCompletion(data.text);
    } catch (err) {
      setError(err.message);
    }
  };

  // chat with ChatGPT
  const handleChatCompletion = async (prompt) => {
    const apiKey =
      "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";

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: prompt },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const chatText = data.choices[0].message.content;
      setChatResponse(chatText);

      // Convert ChatGPT response to speech
      playTextToSpeech(chatText);
    } catch (err) {
      setError(err.message);
    }
  };

  // play text to speech
  const playTextToSpeech = (text) => {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-Speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set language as needed
    utterance.onend = () => console.log("Speech finished.");
    utterance.onerror = (err) =>
      setError("Error during speech synthesis: " + err.message);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-700 flex flex-col items-center justify-center p-4 w-screen h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Voice Recorder and Translator
        </h1>
        {!recording ? (
          <button
            onClick={handleStartRecording}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-red-600 transition"
          >
            Stop Recording
          </button>
        )}
        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Recorded Audio:
            </h2>
            <audio controls src={audioUrl} className="mt-2 w-full"></audio>
          </div>
        )}
        {translation && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Translation:
            </h2>
            <p className="bg-gray-100 p-3 rounded-md mt-2 text-gray-800">
              {translation}
            </p>
          </div>
        )}
        {chatResponse && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700">
              ChatGPT Response:
            </h2>
            <p className="bg-gray-100 p-3 rounded-md mt-2 text-gray-800">
              {chatResponse}
            </p>
          </div>
        )}
        {error && (
          <p className="text-red-600 mt-4 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

export default VoiceAssistance;
