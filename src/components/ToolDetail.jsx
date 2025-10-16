import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "./ToolModal.css";

export default function ToolDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const tool = location.state?.tool;

  if (!tool) {
    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <p>Tool details not found.</p>
          <button className="close-btn" onClick={() => navigate("/")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card fade-in">
        <div className="modal-header">
          <img src={tool.icon} alt={tool.name} className="modal-icon" />
          <div>
            <h2 className="modal-title">{tool.name}</h2>
            <span className="modal-category">{tool.category}</span>
          </div>
          <span className="modal-close" onClick={() => navigate("/")}>✕</span>
        </div>

        <p className="modal-desc">{tool.description}</p>

        <div className="modal-info">
          <p><strong>Pricing:</strong> {tool.pricing}</p>
          <p><strong>Popularity:</strong> {tool.popularity}</p>
        </div>

        <div className="reviews">
          <h3>Reviews & Sentiment Analysis</h3>
          <div className="review-card">
            <div className="review-header">
              <span className="review-user">Sarah K.</span>
              <span className="review-stars">⭐⭐⭐⭐⭐ 😊</span>
            </div>
            <p>Absolutely game-changing for workflow!</p>
          </div>
          <div className="review-card">
            <div className="review-header">
              <span className="review-user">Mike R.</span>
              <span className="review-stars">⭐⭐⭐⭐ 😐</span>
            </div>
            <p>Sometimes outdated but still useful.</p>
          </div>
        </div>

        <div className="modal-buttons">
          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="try-btn">
            Try {tool.name}
          </a>
          <button className="close-btn" onClick={() => navigate("/")}>Close</button>
        </div>
      </div>
    </div>
  );
}
