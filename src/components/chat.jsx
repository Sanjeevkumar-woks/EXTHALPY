import React, { useState, useRef, useEffect } from "react";

const ChatUI = () => {
  const [messages, setMessages] = useState([]); // State to store all messages
  const [userInput, setUserInput] = useState(""); // State to track the input box
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const chatContainerRef = useRef(null); // Ref for the chat container scroll

  const apikey =
    "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";

  //Get current time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Automatically scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle sending the user input
  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages

    // Add the user message to the chat
    const userMessage = {
      role: "user",
      content: userInput,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    try {
      setIsLoading(true);

      // Send the user input to OpenAI using fetch
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userInput }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from OpenAI");
      }

      const data = await response.json();

      // Add OpenAI's response to the chat
      const botMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);

      // Optionally show an error message to the user
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: getCurrentTime(),
        },
      ]);
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-2 bg-white border-2 rounded-md">
      {/* Header */}
      <div className="mb-4 text-lg font-semibold text-slate-950">Messages</div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef} // Attach the ref to the chat container
        className="flex-grow overflow-y-auto space-y-4 mb-3"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex  ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow ${
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-slate-100 text-slate-950"
              }`}
            >
              {msg.content}
              <span className="block mt-2 text-xs text-gray-500">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="self-start max-w-xs p-3 rounded-lg shadow bg-gray-200 text-black">
            <p className="text-sm">Thinking...</p>
            <span className="block mt-2 text-xs text-gray-500">
              {getCurrentTime()}
            </span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-2 bg-slate-100 rounded border-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Enter a Message..."
          className="flex-grow px-4 py-2 text-sm border-none focus:outline-none bg-slate-100"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className={`p-2 text-slate-900 rounded-full `}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
