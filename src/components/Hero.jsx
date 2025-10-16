import React, { useState, useEffect } from "react";

const Hero = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 250); // 250ms debounce

    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault(); // prevent form submission
  };

  return (
    <section id="home" className="hero fade-in">
      <h1 className="hero-title">
        Discover Tomorrow&apos;s AI Tools Today
      </h1>
      <p className="hero-subtitle">
        Curated directory of cutting-edge AI tools powered by ML
      </p>

      <form onSubmit={handleSearch} className="hero-search" style={{ marginTop: "32px" }}>
        <input
          type="text"
          placeholder="Search AI Tools..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            padding: "12px 20px",
            borderRadius: "30px",
            border: "1px solid rgba(0,255,255,0.5)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            width: "300px",
            maxWidth: "90%",
            textAlign: "center",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </form>
    </section>
  );
};

export default Hero;
