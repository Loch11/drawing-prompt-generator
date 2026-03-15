import { useState, useEffect, useRef } from "react";

const categories = {
  animal: {
    label: "Animal",
    emoji: "🐾",
    color: "#FF6B35",
    items: [
      "axolotl", "capybara", "fennec fox", "red panda", "quokka",
      "mantis shrimp", "tardigrade", "pangolin", "okapi", "narwhal",
      "blobfish", "glass frog", "dumbo octopus", "platypus", "snow leopard",
      "secretary bird", "binturong", "fossa", "tarsier", "shoebill stork",
    ],
  },
  personality: {
    label: "Personality",
    emoji: "✨",
    color: "#A855F7",
    items: [
      "grumpy", "overly dramatic", "absurdly cheerful", "aloof and mysterious",
      "clumsy", "incredibly smug", "exhausted", "aggressively optimistic",
      "easily startled", "secretly evil", "lovably chaotic", "deeply philosophical",
      "perpetually confused", "annoyingly competent", "sleepy", "dramatically heroic",
    ],
  },
  job: {
    label: "Job",
    emoji: "💼",
    color: "#06B6D4",
    items: [
      "barista", "astronaut", "mime", "professional napper", "wizard",
      "food critic", "time traveler", "competitive knitter", "lighthouse keeper",
      "ghost hunter", "professional hugger", "intergalactic postman",
      "cloud architect", "dragon dentist", "retired pirate", "museum guard",
      "submarine chef", "cryptid researcher", "discount superhero", "sock philosopher",
    ],
  },
  action: {
    label: "Action",
    emoji: "⚡",
    color: "#10B981",
    items: [
      "dramatically failing to open a jar", "judging a baking contest",
      "learning to skateboard", "filing important paperwork",
      "giving a TED talk", "training for the Olympics",
      "arguing with a vending machine", "writing their memoir",
      "competing in a staring contest", "running very late",
      "discovering a conspiracy", "inventing something useless",
      "accepting an award", "reorganizing their sock drawer",
      "starting a book club", "debugging ancient code",
    ],
  },
  setting: {
    label: "Setting",
    emoji: "🌍",
    color: "#F59E0B",
    items: [
      "on the moon", "in a grocery store at 2am", "at a Renaissance fair",
      "inside a snow globe", "on a game show", "in a haunted library",
      "at the bottom of the ocean", "in a subway car", "at a fancy gala",
      "in a parallel dimension", "at a drive-through", "inside a volcano",
      "at a tiny desk concert", "in a cardboard box fort", "on a cloud",
      "at a medieval tournament", "inside a painting", "at a retirement party",
    ],
  },
  twist: {
    label: "Twist",
    emoji: "🌀",
    color: "#EC4899",
    items: [
      "but everything is made of cheese", "and they're wearing a tiny hat",
      "but it's the size of a bus", "and nobody is concerned",
      "but in the style of a Renaissance painting", "and it's raining confetti",
      "but they're also a robot", "and there's a dog watching judgmentally",
      "but underwater for some reason", "and they have googly eyes",
      "but everything is neon", "and a ghost is helping",
      "but it's 3am and they're tired", "and it's somehow their fault",
    ],
  },
};

const categoryKeys = Object.keys(categories);

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function Chip({ label, value, color, emoji, visible, animKey }) {
  return (
    <div
      key={animKey}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      <span style={{
        fontSize: "10px",
        fontFamily: "'Space Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: color,
        fontWeight: 700,
      }}>
        {emoji} {label}
      </span>
      <div style={{
        background: `${color}18`,
        border: `2px solid ${color}`,
        borderRadius: "999px",
        padding: "8px 20px",
        fontSize: "15px",
        fontFamily: "'Fraunces', serif",
        fontWeight: 600,
        color: "#1a1a2e",
        whiteSpace: "nowrap",
        boxShadow: `0 2px 12px ${color}30`,
      }}>
        {value}
      </div>
    </div>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCategories, setActiveCategories] = useState(
    Object.fromEntries(categoryKeys.map((k) => [k, true]))
  );
  const rollTimeout = useRef(null);

  function generatePrompt() {
    const active = categoryKeys.filter((k) => activeCategories[k]);
    if (active.length === 0) return;
    return Object.fromEntries(
      active.map((k) => [k, getRandom(categories[k].items)])
    );
  }

  function roll() {
    if (rolling) return;
    setRolling(true);
    setVisible(false);

    let flashes = 0;
    const max = 6;
    function flash() {
      setPrompt(generatePrompt());
      setAnimKey((k) => k + 1);
      flashes++;
      if (flashes < max) {
        rollTimeout.current = setTimeout(flash, 80 + flashes * 30);
      } else {
        const final = generatePrompt();
        setPrompt(final);
        setHistory((h) => [final, ...h].slice(0, 10));
        setTimeout(() => setVisible(true), 60);
        setRolling(false);
      }
    }
    flash();
  }

  function copyPrompt() {
    if (!prompt) return;
    const text = Object.entries(prompt)
      .map(([k, v]) => `${categories[k].label}: ${v}`)
      .join(" | ");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function toggleCategory(k) {
    setActiveCategories((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      const anyOn = Object.values(next).some(Boolean);
      return anyOn ? next : prev;
    });
  }

  const promptText = prompt
    ? Object.entries(prompt)
        .map(([k, v]) => v)
        .join(", ")
    : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf6ec 0%, #fce8f3 50%, #e8f0fe 100%)",
      fontFamily: "'Fraunces', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      {[
        { top: "-80px", left: "-80px", color: "#FF6B3530", size: 300 },
        { bottom: "-100px", right: "-60px", color: "#A855F730", size: 350 },
        { top: "40%", left: "-120px", color: "#10B98125", size: 200 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "fixed",
          top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          width: b.size, height: b.size,
          borderRadius: "50%",
          background: b.color,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 680 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-block",
            background: "#1a1a2e",
            color: "#fdf6ec",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: "999px",
            marginBottom: "16px",
          }}>
            ✏️ Drawing Prompt Generator
          </div>
          <h1 style={{
            fontSize: "clamp(38px, 8vw, 64px)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#1a1a2e",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            What Should<br />
            <span style={{
              background: "linear-gradient(90deg, #FF6B35, #A855F7, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>I Draw?</span>
          </h1>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px",
            color: "#666",
            marginTop: "12px",
            letterSpacing: "0.05em",
          }}>
            Spin the wheel. Get a prompt. Make art.
          </p>
        </div>

        {/* Category toggles */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
          marginBottom: "32px",
        }}>
          {categoryKeys.map((k) => {
            const cat = categories[k];
            const on = activeCategories[k];
            return (
              <button
                key={k}
                onClick={() => toggleCategory(k)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: `2px solid ${on ? cat.color : "#ccc"}`,
                  background: on ? `${cat.color}15` : "#f5f5f5",
                  color: on ? cat.color : "#aaa",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>

        {/* Main Roll Button */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <button
            onClick={roll}
            disabled={rolling}
            style={{
              padding: "20px 56px",
              fontSize: "20px",
              fontFamily: "'Fraunces', serif",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              background: rolling
                ? "#999"
                : "linear-gradient(135deg, #FF6B35 0%, #A855F7 50%, #06B6D4 100%)",
              color: "white",
              border: "none",
              borderRadius: "999px",
              cursor: rolling ? "not-allowed" : "pointer",
              boxShadow: rolling ? "none" : "0 8px 32px rgba(168,85,247,0.35)",
              transform: rolling ? "scale(0.97)" : "scale(1)",
              transition: "all 0.2s",
            }}>
            {rolling ? "Rolling..." : prompt ? "🎲 Roll Again" : "🎲 Roll the Dice"}
          </button>
        </div>

        {/* Prompt Output */}
        {prompt && (
          <div style={{
            background: "white",
            border: "3px solid #1a1a2e",
            borderRadius: "24px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "6px 6px 0px #1a1a2e",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "24px",
            }}>
              {Object.entries(prompt).map(([k, v]) => (
                <Chip
                  key={`${k}-${animKey}`}
                  animKey={`${k}-${animKey}`}
                  label={categories[k].label}
                  value={v}
                  color={categories[k].color}
                  emoji={categories[k].emoji}
                  visible={visible}
                />
              ))}
            </div>

            <div style={{
              borderTop: "2px dashed #eee",
              paddingTop: "20px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#aaa",
                marginBottom: "8px",
              }}>Your Drawing Prompt</p>
              <p style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.5,
                margin: "0 0 20px",
              }}>
                {Object.entries(prompt).map(([k, v], i, arr) => (
                  <span key={k}>
                    <span style={{ color: categories[k].color }}>{v}</span>
                    {i < arr.length - 1 && <span style={{ color: "#ccc" }}> · </span>}
                  </span>
                ))}
              </p>
              <button
                onClick={copyPrompt}
                style={{
                  padding: "10px 24px",
                  background: copied ? "#10B981" : "#1a1a2e",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}>
                {copied ? "✓ Copied!" : "📋 Copy Prompt"}
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setShowHistory((v) => !v)}
              style={{
                background: "none",
                border: "2px solid #ddd",
                borderRadius: "999px",
                padding: "8px 20px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "#888",
                cursor: "pointer",
                textTransform: "uppercase",
              }}>
              {showHistory ? "▲ Hide" : "▼ Show"} History ({history.length - 1} previous)
            </button>
            {showHistory && (
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {history.slice(1).map((p, i) => (
                  <div key={i} style={{
                    background: "white",
                    border: "2px solid #eee",
                    borderRadius: "16px",
                    padding: "14px 20px",
                    textAlign: "left",
                    fontSize: "14px",
                    color: "#555",
                    fontFamily: "'Fraunces', serif",
                  }}>
                    {Object.entries(p).map(([k, v], j, arr) => (
                      <span key={k}>
                        <span style={{ color: categories[k].color, fontWeight: 600 }}>{v}</span>
                        {j < arr.length - 1 && <span style={{ color: "#ddd" }}> · </span>}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { filter: brightness(1.05); }
      `}</style>
    </div>
  );
}