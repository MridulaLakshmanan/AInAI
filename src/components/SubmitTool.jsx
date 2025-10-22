import React, { useState } from "react";
// import { createClient } from "@supabase/supabase-js"; // 🔹 Uncomment when backend is ready
import { supabase } from "../lib/supabaseClient";

// 🔹 When backend is ready, just replace these and uncomment
// const supabase = createClient(
//   "https://YOUR_PROJECT_REF.supabase.co",
//   "YOUR_PUBLIC_ANON_KEY"
// );

const categories = [
  "AI Assistant", "Chatbots", "Image Generation", "Writing AI", "Video Editing",
  "Audio Enhancement", "Speech to Text", "Text to Speech", "Prompt Engineering",
  "Code Generation", "Data Analysis", "Automation Tools", "AI Agents",
  "Full Stack", "Frontend", "Backend", "Machine Learning", "Cloud Computing",
  "Cybersecurity", "UI/UX Design", "Productivity", "Marketing", "Research"
];

const SubmitTool = ({ isOpen, onClose }) => {
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toolName || !description || !url || !category) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Step 1: Save locally (temporary testing)
      const newTool = {
        id: Date.now(),
        name: toolName,
        description,
        url,
        category,
        created_at: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("tools")) || [];
      existing.push(newTool);
      localStorage.setItem("tools", JSON.stringify(existing));

      // 🔹 Step 2 (future): Uncomment to connect Supabase
      /*
      const { error } = await supabase.from("tools").insert([newTool]);
      if (error) throw error;
      */

      alert("🎉 Tool submitted successfully!");
      setToolName("");
      setDescription("");
      setUrl("");
      setCategory("");
      onClose();
    } catch (err) {
      console.error("Error submitting tool:", err);
      alert("❌ Failed to submit tool. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="glass-form"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "500px",
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 0 30px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(25px)",
          color: "white",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.6rem" }}>Submit Your AI Tool</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "16px" }}>
          Share your amazing AI tool with the community
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Tool Name</label>
          <input
            type="text"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="e.g., GPT-4 Writer"
            style={inputStyle}
          />

          <label style={labelStyle}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your tool..."
            style={inputStyle}
          />

          <label style={labelStyle}>Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourtool.com"
            style={inputStyle}
          />

          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select a category...</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(0,255,255,0.3)",
              background: "transparent",
              color: "#00FFFF",
              fontWeight: "bold",
              marginTop: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {loading ? "Submitting..." : "🚀 Submit Tool"}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "0.9rem",
  color: "#ccc",
};

export default SubmitTool;
