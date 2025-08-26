import React, { useState, useEffect, useRef } from "react";
import "../App.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null); // ✅ add ref

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    setMessages((prev) => [...prev, { type: "bot", text: "Typing..." }]);

    try {
      const res = await fetch("https://ai-emopal-264n.vercel.app/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "bot", text: data.reply },
      ]);
    } catch (err) {
      console.error("❌ Error communicating with backend:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "bot", text: "Server error. Please try again later." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>EmoPal 💬</h2>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* ✅ anchor for auto-scroll */}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your feelings..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;


