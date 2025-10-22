import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Import navigation hook

const Hero = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate(); // 🔹 Initialize router navigation

  // Local AI tools dataset (temporary)
  const aiTools = [
    { name: "ChatGPT", category: "AI Assistant", tag: "Productivity" },
    { name: "Midjourney", category: "Image Generator", tag: "Art & Design" },
    { name: "Notion AI", category: "Writing", tag: "Docs & Notes" },
    { name: "RunwayML", category: "Video Gen", tag: "Media AI" },
    { name: "Perplexity AI", category: "Search", tag: "Knowledge" },
    { name: "Claude 3", category: "Chatbot", tag: "Analysis" },
    { name: "Synthesia", category: "Video Avatar", tag: "Media" },
    { name: "Leonardo AI", category: "Image Gen", tag: "Design" },
  ];

  // 🔍 Debounced input handling
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
      if (inputValue.trim() === "") {
        setSuggestions([]);
      } else {
        const filtered = aiTools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            tool.category.toLowerCase().includes(inputValue.toLowerCase()) ||
            tool.tag.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  const handleSearch = (e) => e.preventDefault();

  return (
    <section id="home" className="hero fade-in">
      <h1 className="hero-title">Discover Tomorrow&apos;s AI Tools Today</h1>
      <p className="hero-subtitle">
        Curated directory of cutting-edge AI tools powered by Machine Learning
      </p>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hero-search"
        style={{ marginTop: "32px", position: "relative" }}
      >
        <input
          type="text"
          placeholder="🔍 Search AI Tools..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            padding: "14px 22px",
            borderRadius: "30px",
            border: "1px solid rgba(0,255,255,0.5)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            width: "320px",
            maxWidth: "90%",
            textAlign: "center",
            fontSize: "16px",
            outline: "none",
            boxShadow: "0 0 10px rgba(0,255,255,0.3)",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 0 20px rgba(0,255,255,0.6)")
          }
          onBlur={(e) =>
            (e.target.style.boxShadow = "0 0 10px rgba(0,255,255,0.3)")
          }
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.7)",
              borderRadius: "12px",
              border: "1px solid rgba(0,255,255,0.4)",
              width: "320px",
              maxWidth: "90%",
              padding: "10px 0",
              backdropFilter: "blur(15px)",
              boxShadow: "0 0 15px rgba(0,255,255,0.2)",
              zIndex: 50,
            }}
          >
            {suggestions.map((tool, index) => (
              <div
                key={index}
                onClick={() => setInputValue(tool.name)}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  color: "#00ffff",
                  fontWeight: 500,
                  fontSize: "15px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                {tool.name}{" "}
                <span style={{ color: "#ff69b4", fontSize: "13px" }}>
                  ({tool.category})
                </span>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* 🚀 Explore Tools Button */}
      <button
        onClick={() => navigate("/all-tools")}
        style={{
          marginTop: "40px",
          padding: "12px 28px",
          borderRadius: "30px",
          border: "1px solid rgba(0,255,255,0.4)",
          background: "rgba(255,255,255,0.08)",
          color: "white",
          fontSize: "16px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 0 15px rgba(0,255,255,0.3)",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 25px rgba(0,255,255,0.6), 0 0 50px rgba(170,0,255,0.4)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 15px rgba(0,255,255,0.3)")
        }
      >
        🚀 Explore Tools
      </button>
    </section>
  );
};

export default Hero;
