import { useState, useRef, useEffect } from "react"

function App() {
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(135deg, #0a0a1a, #0f0e2a, #0a0a1a)"
)


  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey! 👋 I'm SoundBot — your AI music companion.\n\nJust tell me how you're feeling, and I'll curate the perfect soundtrack for your mood! 🎵",
      songs: null,
      tags: null
    }
  ])

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: "user", text: input, songs: null, tags: null }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

     //await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input })
      })
      const data = await response.json()
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Here's your playlist 🎶",
        songs: data.songs,
        tags: data.tags
      }])

      setBgGradient(moodConfig[data.tags.mood]?.bgGradient || "linear-gradient(135deg, #0a0a1a, #0f0e2a, #0a0a1a)")



    } catch (err) {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Oops! Could not connect. Is the backend running?",
        songs: null,
        tags: null
      }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    "😢 Sad and lonely",
    "💪 Gym workout",
    "☕ Chill study",
    "🌧️ Rainy day",
    "🌅 Peaceful morning"
  ]

  // Mood ke hisaab se color aur emoji
  // const moodConfig = {
  //   sad:       { color: "#3b82f6", bg: "rgba(59,130,246,0.15)", emoji: "😢", label: "Sad" },
  //   happy:     { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", emoji: "😊", label: "Happy" },
  //   energetic: { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  emoji: "⚡", label: "Energetic" },
  //   calm:      { color: "#10b981", bg: "rgba(16,185,129,0.15)", emoji: "🌿", label: "Calm" },
  //   romantic:  { color: "#ec4899", bg: "rgba(236,72,153,0.15)", emoji: "❤️", label: "Romantic" },
  //   focused:   { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", emoji: "🎯", label: "Focused" }
  // }

  const moodConfig = {
    sad:       { color: "#3b82f6", bg: "rgba(59,130,246,0.15)",  emoji: "😢", label: "Sad",       bgGradient: "linear-gradient(135deg, #0a0a2e, #0f1a3d, #0a0a1a)" },
    happy:     { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  emoji: "😊", label: "Happy",     bgGradient: "linear-gradient(135deg, #1a1200, #2d1f00, #0a0a1a)" },
    energetic: { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   emoji: "⚡", label: "Energetic", bgGradient: "linear-gradient(135deg, #1a0000, #2d0a0a, #0a0a1a)" },
    calm:      { color: "#10b981", bg: "rgba(16,185,129,0.15)",  emoji: "🌿", label: "Calm",      bgGradient: "linear-gradient(135deg, #001a0f, #002d1a, #0a0a1a)" },
    romantic:  { color: "#ec4899", bg: "rgba(236,72,153,0.15)",  emoji: "❤️", label: "Romantic",  bgGradient: "linear-gradient(135deg, #1a0010, #2d0020, #0a0a1a)" },
    focused:   { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)",  emoji: "🎯", label: "Focused",   bgGradient: "linear-gradient(135deg, #0d001a, #1a0030, #0a0a1a)" }
}

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      background: bgGradient,

      transition: "background 1.5s ease", 

      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: "#0f0e2a",
        borderBottom: "1px solid #1e1b4b"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "44px", height: "44px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "20px"
          }}>🎵</div>
          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "17px" }}>SoundBot</div>
            <div style={{ color: "#4ade80", fontSize: "12px" }}>● AI Music Companion</div>
          </div>
        </div>
        <div style={{ color: "#a78bfa", fontSize: "13px" }}>🎧 Mood-based music recommendations</div>
      </div>

      {/* MESSAGES */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "28px 20%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background:  "transparent",
        scrollbarWidth: "none"
      }}>

        {messages.map((msg, index) => (
          <div key={index} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start"
          }}>

            {/* Label */}
            <div style={{
              fontSize: "11px", color: "#6b7280", marginBottom: "5px",
              paddingLeft: msg.role === "bot" ? "4px" : "0",
              paddingRight: msg.role === "user" ? "4px" : "0"
            }}>
              {msg.role === "user" ? "You" : "🎵 SoundBot"}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: "75%",
              padding: "14px 18px",
              borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: msg.role === "user" ? "linear-gradient(135deg, #7c3aed, #db2777)" : "#13122a",
              border: msg.role === "bot" ? "1px solid #1e1b4b" : "none",
              color: "white", fontSize: "14px",
              lineHeight: "1.8", whiteSpace: "pre-wrap"
            }}>
              {msg.text}
            </div>

            {/* Mood Badge Card — tags hain toh dikhao */}
            {msg.tags && (
              <div style={{
                marginTop: "12px",
                width: "80%",
                background: moodConfig[msg.tags.mood]?.bg || "rgba(124,58,237,0.15)",
                border: "1px solid " + (moodConfig[msg.tags.mood]?.color || "#7c3aed"),
                borderRadius: "16px",
                padding: "16px 20px"
              }}>

                {/* Mood heading */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "28px" }}>
                    {moodConfig[msg.tags.mood]?.emoji || "🎵"}
                  </span>
                  <div>
                    <div style={{
                      color: moodConfig[msg.tags.mood]?.color || "#7c3aed",
                      fontWeight: "700", fontSize: "18px", textTransform: "capitalize"
                    }}>
                      {msg.tags.mood}
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                      Mood detected
                    </div>
                  </div>
                </div>

                {/* Energy aur Tempo badges */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <span style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white", fontSize: "12px",
                    padding: "4px 12px", borderRadius: "20px"
                  }}>
                    ⚡ {msg.tags.energy} energy
                  </span>
                  <span style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white", fontSize: "12px",
                    padding: "4px 12px", borderRadius: "20px"
                  }}>
                    🎵 {msg.tags.tempo} tempo
                  </span>
                </div>

                {/* Reason */}
                <div style={{
                  color: "#d1d5db", fontSize: "13px",
                  fontStyle: "italic", lineHeight: "1.6"
                }}>
                  "{msg.tags.reason}"
                </div>

              </div>
            )}

            {/* Song Cards */}
            {msg.songs && (
              <div style={{
                marginTop: "12px", width: "80%",
                display: "flex", flexDirection: "column", gap: "10px"
              }}>
                {msg.songs.map((song, i) => (
                  <div key={i} style={{
                    background: "#13122a",
                    border: "1px solid #1e1b4b",
                    borderRadius: "16px",
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "34px", height: "34px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7c3aed, #db2777)",
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        color: "white", fontWeight: "bold",
                        fontSize: "13px", flexShrink: 0
                      }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                          {song.title}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "2px" }}>
                          {song.artist}
                        </div>
                        <span style={{
                          background: "rgba(124,58,237,0.2)",
                          border: "1px solid rgba(124,58,237,0.4)",
                          color: "#c4b5fd", fontSize: "10px",
                          padding: "2px 10px", borderRadius: "20px",
                          marginTop: "5px", display: "inline-block",
                          textTransform: "capitalize"
                        }}>
                          {song.mood}
                        </span>
                      </div>
                    </div>
                    <a href={song.lastfm_url} target="_blank" rel="noreferrer"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #db2777)",
                        color: "white", padding: "9px 18px",
                        borderRadius: "12px", fontSize: "13px",
                        fontWeight: "600", textDecoration: "none", flexShrink: 0
                      }}>
                      ▶ Listen
                    </a>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>🎵 SoundBot</div>
            <div style={{
              background: "#13122a",
              border: "1px solid #1e1b4b",
              borderRadius: "20px 20px 20px 4px",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              {/* Music notes animation */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px", animation: "spin 1s linear infinite" }}>🎵</span>
                <span style={{ color: "#a78bfa", fontSize: "13px" }}>Analyzing your mood...</span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: "200px", height: "4px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "10px", overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #7c3aed, #db2777)",
                  borderRadius: "10px",
                  animation: "progress 1.5s ease-in-out infinite"
                }} />
              </div>

              {/* Dots */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "8px", height: "8px",
                    borderRadius: "50%",
                    background: "#7c3aed",
                    animation: "bounce 1s ease-in-out " + (i * 0.2) + "s infinite"
                  }} />
                ))}
                <span style={{ color: "#6b7280", fontSize: "12px", marginLeft: "4px" }}>
                  Finding perfect songs...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* SUGGESTIONS */}
      <div style={{
        padding: "10px 20%",
        background:  "transparent",
        display: "flex", gap: "8px",
        flexWrap: "wrap",
        borderTop: "1px solid #1e1b4b"
      }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setInput(s)} style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "20px", color: "#c4b5fd",
            padding: "6px 16px", fontSize: "12px", cursor: "pointer"
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div style={{
        padding: "16px 20%",
        background: "transparent",
        borderTop: "1px solid #1e1b4b",
        display: "flex", gap: "12px", alignItems: "flex-end"
      }}>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Tell me how you're feeling"
          style={{
            flex: 1, background: "#13122a",
            border: "1px solid #3730a3",
            borderRadius: "14px", padding: "12px 18px",
            color: "white", fontSize: "14px",
            resize: "none", outline: "none", lineHeight: "1.6"
          }}
        />
        <button onClick={sendMessage} disabled={loading} style={{
          width: "48px", height: "48px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #7c3aed, #db2777)",
          border: "none", color: "white",
          fontSize: "20px", cursor: loading ? "not-allowed" : "pointer",
          flexShrink: 0
        }}>
          ➤
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>

    </div>
  )
}

export default App