import { useState, useRef, useEffect } from "react";

const BOT_AVATAR = "SR";
const USER_AVATAR = "U";

const suggestedQuestions = [
  "Best laptop under ₹50,000?",
  "Order track karna hai",
  "Return policy kya hai?",
  "Headphones recommend karo",
];

const TypingDots = () => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#2563EB",
          display: "inline-block",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! 👋 Main Smart-Retech ka assistant hoon. Laptops, electronics ya orders ke baare mein kuch poochna ho toh batao!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Kuch problem aayi, dobara try karein.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Server se connect nahi ho paya. Thodi der baad try karein.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat clear ho gaya! Kuch naya poochna hai? 😊",
      },
    ]);
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }
        .chatbot-btn:hover { transform: scale(1.08) !important; }
        .chatbot-btn:active { transform: scale(0.96) !important; }
        .chatbot-msg-user { animation: fadeIn 0.25s ease forwards; }
        .chatbot-msg-bot { animation: fadeIn 0.3s ease forwards; }
        .chat-send-btn:hover { background: #1d4ed8 !important; }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .suggested-btn:hover { background: #eff6ff !important; border-color: #2563EB !important; color: #2563EB !important; }
        .chat-input:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        .clear-btn:hover { color: #ef4444 !important; }
      `}</style>

      {/* Floating Toggle Button */}
      <button
        className="chatbot-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563EB 0%, #1e40af 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "transform 0.2s ease",
          animation: !isOpen ? "pulse 2.5s infinite" : "none",
          boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
        }}
        title="Chat with Smart-Retech"
      >
        {isOpen ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {/* Unread indicator */}
        {!isOpen && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid white",
              fontSize: 8,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 28,
            width: 370,
            maxHeight: isMinimized ? 56 : 560,
            borderRadius: 18,
            background: "#ffffff",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(37,99,235,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9998,
            animation: "slideUp 0.3s ease",
            transition: "max-height 0.3s ease",
            border: "1px solid rgba(37,99,235,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1e40af 100%)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "white",
                fontSize: 13,
                letterSpacing: 0.5,
                border: "2px solid rgba(255,255,255,0.35)",
              }}
            >
              SR
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
                Smart-Retech Assistant
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                  }}
                />
                Online • Abhi jawab dega
              </div>
            </div>
            <button
              className="clear-btn"
              onClick={clearChat}
              title="Clear chat"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.7)",
                padding: 4,
                transition: "color 0.2s",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expand" : "Minimize"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.7)",
                padding: 4,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                {isMinimized ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: "#f8faff",
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.role === "user"
                        ? "chatbot-msg-user"
                        : "chatbot-msg-bot"
                    }
                    style={{
                      display: "flex",
                      flexDirection:
                        msg.role === "user" ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      gap: 8,
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background:
                          msg.role === "user"
                            ? "#e0e7ff"
                            : "linear-gradient(135deg, #2563EB, #1e40af)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: msg.role === "user" ? "#3730a3" : "white",
                      }}
                    >
                      {msg.role === "user" ? USER_AVATAR : BOT_AVATAR}
                    </div>

                    {/* Bubble */}
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "10px 14px",
                        borderRadius:
                          msg.role === "user"
                            ? "18px 4px 18px 18px"
                            : "4px 18px 18px 18px",
                        background:
                          msg.role === "user"
                            ? "linear-gradient(135deg, #2563EB, #1d4ed8)"
                            : "white",
                        color: msg.role === "user" ? "white" : "#1e293b",
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        boxShadow:
                          msg.role === "user"
                            ? "0 2px 10px rgba(37,99,235,0.3)"
                            : "0 1px 6px rgba(0,0,0,0.08)",
                        border:
                          msg.role === "assistant"
                            ? "1px solid rgba(37,99,235,0.08)"
                            : "none",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div
                    className="chatbot-msg-bot"
                    style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #2563EB, #1e40af)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      SR
                    </div>
                    <div
                      style={{
                        padding: "10px 16px",
                        borderRadius: "4px 18px 18px 18px",
                        background: "white",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                        border: "1px solid rgba(37,99,235,0.08)",
                      }}
                    >
                      <TypingDots />
                    </div>
                  </div>
                )}

                {/* Suggested questions (show only after first bot message) */}
                {messages.length === 1 && !isLoading && (
                  <div style={{ marginTop: 4 }}>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        marginBottom: 8,
                        paddingLeft: 4,
                      }}
                    >
                      Yeh pooch sakte ho:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          className="suggested-btn"
                          onClick={() => sendMessage(q)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 20,
                            border: "1px solid #dbeafe",
                            background: "white",
                            color: "#374151",
                            fontSize: 11.5,
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                            fontFamily: "inherit",
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: "12px 14px",
                  borderTop: "1px solid rgba(37,99,235,0.1)",
                  background: "white",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Kuch bhi poochho..."
                  rows={1}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 24,
                    border: "1.5px solid #e2e8f0",
                    fontSize: 13.5,
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    maxHeight: 80,
                    overflowY: "auto",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    background: "#f8faff",
                    color: "#1e293b",
                  }}
                  disabled={isLoading}
                />
                <button
                  className="chat-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#2563EB",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "6px 14px 8px",
                  background: "white",
                  textAlign: "center",
                  fontSize: 10.5,
                  color: "#94a3b8",
                }}
              >
                Powered by Smart-Retech AI
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
