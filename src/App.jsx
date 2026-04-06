import { useState, useRef } from "react";

const categories = {
  animal: {
    label: "Animal",
    emoji: "◆",
    items: [
      "axolotl", "capybara", "fennec fox", "red panda", "quokka",
      "mantis shrimp", "tardigrade", "pangolin", "okapi", "narwhal",
      "blobfish", "glass frog", "dumbo octopus", "platypus", "snow leopard",
      "secretary bird", "binturong", "fossa", "tarsier", "shoebill stork",
    ],
  },
  personality: {
    label: "Personality",
    emoji: "◆",
    items: [
      "grumpy", "overly dramatic", "absurdly cheerful", "aloof and mysterious",
      "clumsy", "incredibly smug", "exhausted", "aggressively optimistic",
      "easily startled", "secretly evil", "lovably chaotic", "deeply philosophical",
      "perpetually confused", "annoyingly competent", "sleepy", "dramatically heroic",
    ],
  },
  job: {
    label: "Job",
    emoji: "◆",
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
    emoji: "◆",
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
    emoji: "◆",
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
    emoji: "◆",
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

export default function App() {
  const [prompt, setPrompt] = useState(null);
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
    if (active.length === 0) return null;
    return Object.fromEntries(active.map((k) => [k, getRandom(categories[k].items)]));
  }

  function roll() {
    if (rolling) return;
    setRolling(true);
    setVisible(false);

    let flashes = 0;
    const max = 7;
    function flash() {
      setPrompt(generatePrompt());
      flashes++;
      if (flashes < max) {
        rollTimeout.current = setTimeout(flash, 70 + flashes * 35);
      } else {
        const final = generatePrompt();
        setPrompt(final);
        setHistory((h) => [final, ...h].slice(0, 10));
        setTimeout(() => setVisible(true), 80);
        setRolling(false);
      }
    }
    flash();
  }

  function copyPrompt() {
    if (!prompt) return;
    const text = Object.entries(prompt)
      .map(([k, v]) => `${categories[k].label}: ${v}`)
      .join(" / ");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function toggleCategory(k) {
    setActiveCategories((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      return Object.values(next).some(Boolean) ? next : prev;
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      color: "#000",
      fontFamily: "'Barlow Condensed', sans-serif",
      padding: "0",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Barlow:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .roll-btn {
          background: #000;
          color: #fff;
          border: 4px solid #000;
          padding: 20px 56px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          display: block;
          width: 100%;
        }
        .roll-btn:hover:not(:disabled) {
          background: #fff;
          color: #000;
        }
        .roll-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cat-toggle {
          border: 3px solid #000;
          background: #fff;
          color: #000;
          padding: 6px 16px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .cat-toggle.off {
          background: #fff;
          color: #bbb;
          border-color: #ccc;
        }
        .cat-toggle.on {
          background: #000;
          color: #fff;
          border-color: #000;
        }
        .cat-toggle:hover {
          background: #000;
          color: #fff;
          border-color: #000;
        }

        .copy-btn {
          border: 3px solid #000;
          background: #fff;
          color: #000;
          padding: 10px 28px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .copy-btn:hover {
          background: #000;
          color: #fff;
        }
        .copy-btn.copied {
          background: #000;
          color: #fff;
        }

        .history-btn {
          border: none;
          background: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
        .history-btn:hover { color: #000; }

        .ticker {
          overflow: hidden;
          border-top: 3px solid #000;
          border-bottom: 3px solid #000;
          padding: 10px 0;
          margin-bottom: 0;
          white-space: nowrap;
        }
        .ticker-inner {
          display: inline-block;
          animation: ticker 18s linear infinite;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #000;
        }
        @keyframes ticker {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }

        .chip {
          border: 3px solid #000;
          padding: 10px 18px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .chip-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #888;
          font-family: 'Barlow Condensed', sans-serif;
        }
        .chip-value {
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: 'Barlow Condensed', sans-serif;
          color: #000;
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "4px solid #000",
        padding: "32px 40px 28px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "6px",
          }}>
            ◆ Drawing Prompt Generator
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(52px, 10vw, 96px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            color: "#000",
          }}>
            What Do<br />I Draw?
          </h1>
        </div>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: "13px",
          color: "#888",
          maxWidth: "180px",
          lineHeight: 1.5,
          textAlign: "right",
        }}>
          Spin the categories.<br />Get a prompt.<br />Make something.
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker">
        <span className="ticker-inner">
          Draw Something Weird &nbsp;&nbsp;◆&nbsp;&nbsp; Draw Something Weird &nbsp;&nbsp;◆&nbsp;&nbsp; Draw Something Weird &nbsp;&nbsp;◆&nbsp;&nbsp; Draw Something Weird &nbsp;&nbsp;◆&nbsp;&nbsp; Draw Something Weird &nbsp;&nbsp;◆&nbsp;&nbsp; Draw Something Weird &nbsp;&nbsp;◆&nbsp;&nbsp;
        </span>
      </div>

      <div style={{ padding: "40px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Category toggles */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "12px",
          }}>
            Active Categories
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categoryKeys.map((k) => (
              <button
                key={k}
                className={`cat-toggle ${activeCategories[k] ? "on" : "off"}`}
                onClick={() => toggleCategory(k)}
              >
                {categories[k].label}
              </button>
            ))}
          </div>
        </div>

        {/* Roll button */}
        <div style={{ marginBottom: "40px" }}>
          <button className="roll-btn" onClick={roll} disabled={rolling}>
            {rolling ? "Rolling—" : prompt ? "◆ Roll Again" : "◆ Roll the Dice"}
          </button>
        </div>

        {/* Prompt output */}
        {prompt && (
          <div style={{
            border: "4px solid #000",
            marginBottom: "32px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
            {/* Chips grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              borderBottom: "4px solid #000",
            }}>
              {Object.entries(prompt).map(([k, v], i, arr) => (
                <div
                  key={k}
                  className="chip"
                  style={{
                    borderRight: i < arr.length - 1 ? "3px solid #000" : "none",
                    borderBottom: "none",
                  }}
                >
                  <span className="chip-label">{categories[k].label}</span>
                  <span className="chip-value">{v}</span>
                </div>
              ))}
            </div>

            {/* Full prompt + copy */}
            <div style={{ padding: "24px 24px 20px" }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "10px",
              }}>
                Your Prompt
              </div>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: 1.4,
                color: "#000",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}>
                {Object.values(prompt).join(" · ")}
              </p>
              <button
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={copyPrompt}
              >
                {copied ? "✓ Copied" : "Copy Prompt"}
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div>
            <button
              className="history-btn"
              onClick={() => setShowHistory((v) => !v)}
            >
              {showHistory ? "▲ Hide" : "▼ Show"} Previous Rolls ({history.length - 1})
            </button>

            {showHistory && (
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "0" }}>
                {history.slice(1).map((p, i) => (
                  <div key={i} style={{
                    borderTop: i === 0 ? "3px solid #000" : "1px solid #ddd",
                    padding: "14px 0",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}>
                    {Object.values(p).join(" · ")}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer rule */}
      <div style={{
        borderTop: "4px solid #000",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#999",
        }}>
          Drawing Prompt Generator
        </span>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#999",
        }}>
          Make Something Weird ◆
        </span>
      </div>
    </div>
  );
}