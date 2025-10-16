import React from "react";
// import "./ToolModal.css";

export default function ToolModal({ tool, onClose }) {
  if (!tool) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <img src={tool.icon} alt={tool.name} className="modal-icon" />
          <div>
            <h2 className="modal-title">{tool.name}</h2>
            <span className="modal-category">{tool.category}</span>
          </div>
          <span className="modal-close" onClick={onClose}>✕</span>
        </div>

        <p className="modal-desc">{tool.description}</p>

        <div className="modal-info">
          <p><strong>Pricing:</strong> {tool.pricing}</p>
          <p><strong>Popularity:</strong> {tool.popularity}</p>
        </div>

        <h3 className="reviews-title">Reviews & Sentiment Analysis</h3>
        <div className="reviews">
          {tool.reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="review-user">{r.user}</span>
                <span className="review-stars">
                  {"⭐".repeat(r.stars)} {r.stars >= 4 ? "😊" : r.stars === 3 ? "😐" : "😕"}
                </span>
              </div>
              <p className="review-text">{r.comment}</p>
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="try-btn">
            Try {tool.name}
          </a>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
