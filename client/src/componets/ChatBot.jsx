import { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Welcome to Wandersphere travel assistant. How can we help you today?.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user's message locally
    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText("");

    // Show processing indicator
    setIsProcessing(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await res.json();
      if (res.ok) {
        const botReply = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botReply]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, something went wrong." },
        ]);
      }
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, unable to connect." },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Chat icon button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaComments size={24} />
        </button>
      )}

      {/* Chat window when open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 w-80 max-w-full bg-white rounded-lg shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <span className="font-bold">Chat With Us</span>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>
          {/* Messages List */}
          <div className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: "300px" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-blue-100 text-blue-900 self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isProcessing && (
              <div className="mb-2 p-2 rounded bg-yellow-100 text-yellow-800 self-end animate-pulse">
                Processing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Type your message..."
            />
          </div>
        </motion.div>
      )}
    </>
  );
}
