import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Galaxy from "./components/galaxy";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import SubmitTool from "./components/SubmitTool";
import ToolDetail from "./components/ToolDetail";
import CircularGallery from "./components/CircularGallery";
import CategoryPage from "./components/Categorypage";
import AllToolsPage from "./components/AllToolsPage"; // ✅ New All Tools Page
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollFactor, setScrollFactor] = useState(0);

  // 🌠 Scroll tracking for galaxy parallax
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
            repulsionStrength={1.0}
            density={2.0}
            glowIntensity={0.7}
            scrollFactor={scrollFactor}
          />
        </div>

        {/* 🌠 Foreground UI */}
        <div style={{ position: "relative", zIndex: 5, pointerEvents: "auto" }}>
          <Navbar />

          <Routes>
            {/* 🏠 Home Page */}
            <Route
              path="/"
              element={
                <>
                  {/* 🦋 Hero Section */}
                  <Hero
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />

                  {/* 💫 Trending Section */}
                  <section
                    id="trending"
                    className="trending-section"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "80px",
                    }}
                  >
                    <h2 className="trending-title">🌟 Trending AI Tools</h2>

                    <CircularGallery
                      textColor="#ffffff"
                      borderRadius={0.05}
                      scrollEase={0.04}
                      scrollSpeed={2}
                    />
                  </section>

                  {/* 🧭 Categories Section */}
                  <Categories searchQuery={searchQuery} />

                  {/* 🚀 Submit Tool Popup (controlled in Navbar) */}
                </>
              }
            />

            {/* 🔹 Category Dynamic Route */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* 🔹 Tool Detail Page */}
            <Route path="/tool/:toolName" element={<ToolDetail />} />

            {/* 🌌 NEW All Tools Page Route */}
            <Route path="/all-tools" element={<AllToolsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
