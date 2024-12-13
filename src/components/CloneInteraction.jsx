import { SunOutlined, UserOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { Avatar } from "antd";
import ChatUI from "./chat";
import ButtonWithIcon from "./ButtonWithIcon";

// Reusable Mic, Video, and Screen Share Button Component

const CloneInteraction = () => {
  const [micOn, setMicOn] = useState(false);
  const [chatOn, setChatOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimeoutRef = useRef(null);
  const isSpeakingRef = useRef(false);

  const apiKey =
    "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";

  // Start recording audio
  const handleStartRecording = async () => {
    try {
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
        console.log("Audio file created:", audioFile);
        await handleTranslate(audioFile);
      };

      mediaRecorder.start();
      monitorSilence(mediaRecorder, stream);
    } catch (err) {
      console.error("Failed to access microphone:", err);
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  // Monitor silence and stop recording after 10 seconds of silence
  const monitorSilence = (mediaRecorder, stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.fftSize);

    source.connect(analyser);

    const detectSilence = () => {
      analyser.getByteTimeDomainData(dataArray);
      const isSilent = dataArray.every((val) => val === 128); // Silence threshold

      if (!isSilent) {
        clearTimeout(silenceTimeoutRef.current);
        isSpeakingRef.current = true;
      } else if (isSpeakingRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          isSpeakingRef.current = false;
          mediaRecorder.stop();
        }, 10000); // 10 seconds of silence
      }

      if (mediaRecorder.state === "recording") {
        requestAnimationFrame(detectSilence);
      }
    };

    detectSilence();
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Toggle recording
  const toggleMic = () => {
    if (micOn) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
    setMicOn(!micOn);
  };

  // Translate audio to text
  const handleTranslate = async (file) => {
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
      console.log("Transcription:", data.text);
      await handleChatCompletion(data.text);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle chat completion
  const handleChatCompletion = async (prompt) => {
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
      playTextToSpeech(chatText);
    } catch (err) {
      setError(err.message);
    }
  };

  // Play text-to-speech
  const playTextToSpeech = (text) => {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-Speech is not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => console.log("Speech finished.");
    utterance.onerror = (err) =>
      setError("Error during speech synthesis: " + err.message);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="md:ml-60 ml-20 flex flex-col gap-4 h-full border-2 bg-white rounded-md p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center px-5">
        <h1 className="font-semibold text-2xl text-slate-900">
          Clone Interaction
        </h1>
        <div className="flex items-center gap-4">
          <SunOutlined />
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
          <div>
            <p className="text-slate-900 font-medium">sanjeevkumar</p>
            <p className="text-slate-400 text-sm">Engineer</p>
          </div>
        </div>
      </div>
      {/* video session */}
      <div className="flex h-full gap-4">
        <div
          className={`flex flex-col ${chatOn ? "w-[80%]" : "w-full"} h-full`}
        >
          <div className="flex justify-center items-center bg-slate-950 h-full rounded-lg">
            <div className="flex gap-4 p-4">
              <img
                src="https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg"
                alt="doctor"
                className="w-[436px] h-[192px] rounded-tl-lg object-cover"
              />
              <img
                src="https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg"
                alt="doctor"
                className="w-[436px] h-[192px] rounded-tl-lg object-cover"
              />
            </div>
          </div>
          {/* button session */}
          <div className="flex justify-between items-center p-8">
            <div className="flex gap-4">
              <ButtonWithIcon
                onClick={() => {}}
                isActive={micOn}
                icon={`fa-solid fa-microphone${!micOn ? "-slash" : ""} text-${
                  micOn ? "slate-400" : "slate-400"
                }`}
              />
              <ButtonWithIcon
                onClick={() => setVideoOn(!videoOn)}
                isActive={videoOn}
                icon={`fa-solid fa-video${
                  videoOn ? "" : "-slash"
                } text-slate-400`}
              />
              <ButtonWithIcon
                onClick={() => console.log("Screen sharing toggled")}
                icon="fa-solid fa-desktop text-slate-400"
              />
            </div>

            <div className="flex gap-4">
              <button
                className={`border border-1 rounded-full w-10 h-10 flex justify-center items-center ${
                  micOn ? "bg-red-500" : "bg-green-500"
                }`}
                onClick={toggleMic}
              >
                <i className="fa-solid fa-phone text-white"></i>
              </button>
              <div className="border border-l-1"></div>
              <button
                className="bg-slate-950 border border-1 rounded-full w-10 h-10 flex justify-center items-center"
                onClick={() => setChatOn(!chatOn)}
              >
                <i className="fa-regular fa-comments text-white"></i>
              </button>
            </div>
          </div>
        </div>

        {/* chat session */}
        {chatOn && (
          <div className="w-[20%] ">
            <ChatUI />
          </div>
        )}
      </div>
    </div>
  );
};

export default CloneInteraction;
