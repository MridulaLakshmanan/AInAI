import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Galaxy from "./components/galaxy";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Trending from "./components/Trending";
import ToolDetail from "./components/ToolDetail";
import Categories from "./components/Categories";
import SubmitTool from "./components/SubmitTool";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollFactor, setScrollFactor] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setScrollFactor(Math.min(scrollTop / docHeight, 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* 🌌 Galaxy Background */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            repulsionStrength={1.0} // stronger interaction
            density={2.0} // more particles
            glowIntensity={0.7}
            scrollFactor={scrollFactor}
          />
        </div>

        {/* 🌠 Foreground */}
        <div style={{ position: "relative", zIndex: 5, pointerEvents: "auto" }}>
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* 🦋 Hero Section */}
                  <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                  {/* 🔥 Trending Section with its own wrapper */}
                  <section
                    id="trending"
                    style={{
                      position: "relative",
                      minHeight: "700px",
                      padding: "100px 0",
                      marginTop: "150px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      zIndex: 5,
                    }}
                  >
                    <Trending searchQuery={searchQuery} />
                  </section>

                  {/* 🧭 Other Sections */}
                  <Categories searchQuery={searchQuery} />
                  <SubmitTool />
                </>
              }
            />

            {/* Tool detail route */}
            <Route path="/tool/:toolName" element={<ToolDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
<section
  id="trending"
  style={{
    position: "relative",
    minHeight: "700px",
    marginTop: "120px",
    zIndex: 5,
  }}
>
  <Trending />
</section>

export default App;
