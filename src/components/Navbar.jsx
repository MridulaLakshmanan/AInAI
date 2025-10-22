import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import SubmitTool from "./SubmitTool";

const Navbar = () => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 🚪 Dummy logout handler (you can link to Supabase/Auth later)
  const handleLogout = () => {
    alert("You have been logged out! 👋");
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <nav
          className="navbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* 🌌 Logo */}
          <div className="logo">
            <div className="logo-icon">🌌 ALL I NEED AI</div>
          </div>

          {/* 🌠 Navigation Menu */}
          <div
            className="nav-menu"
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <Link to="/" className="nav-link active">
              Home
            </Link>
            <a href="#trending" className="nav-link">
              Trending
            </a>
            <a href="#categories" className="nav-link">
              Categories
            </a>

            {/* 🚀 Submit Tool */}
            <button
              onClick={() => setShowSubmit(true)}
              className="nav-link glow-button"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                padding: "8px 18px",
                color: "white",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              Submit Tool
            </button>
          </div>

          {/* 📊 Dashboard Dropdown (replaces 3-dash icon) */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
                color: "white",
                fontSize: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              <MdDashboard />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",
                  right: "0",
                  background: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 0 25px rgba(0,255,255,0.25)",
                  padding: "10px 0",
                  minWidth: "200px",
                  zIndex: 1000,
                  animation: "fadeIn 0.25s ease",
                }}
              >
                <Link to="/profile" className="dropdown-item" style={dropdownItemStyle}>
                  👤 Profile
                </Link>
                <Link to="/settings" className="dropdown-item" style={dropdownItemStyle}>
                  ⚙️ Settings
                </Link>
                <Link to="/" className="dropdown-item" style={dropdownItemStyle}>
                  🏠 Home
                </Link>
                <Link to="/favorites" className="dropdown-item" style={dropdownItemStyle}>
                  ⭐ Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item"
                  style={{ ...dropdownItemStyle, color: "#ff5f5f" }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* 💫 Submit Tool Popup */}
      <SubmitTool isOpen={showSubmit} onClose={() => setShowSubmit(false)} />
    </>
  );
};

// 🧊 Shared dropdown styles
const dropdownItemStyle = {
  display: "block",
  padding: "10px 18px",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  background: "transparent",
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
};

export default Navbar;
