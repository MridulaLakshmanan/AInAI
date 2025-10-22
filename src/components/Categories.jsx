import React from "react";
import { Link } from "react-router-dom";

const categories = [
  // --- AI & Automation ---
  "AI Assistant",
  "Chatbots",
  "Writing AI",
  "Image Generation",
  "Video Editing",
  "Audio Enhancement",
  "Speech to Text",
  "Text to Speech",
  "Prompt Engineering",
  "Code Generation",
  "Data Analysis",
  "Automation Tools",
  "AI Agents",

  // --- Development & Engineering ---
  "Full Stack",
  "Frontend",
  "Backend",
  "APIs",
  "DevOps",
  "Database Management",
  "Version Control",
  "Testing Tools",

  // --- Cloud & Infrastructure ---
  "Cloud Computing",
  "Serverless",
  "Containerization",
  "CI/CD",
  "Networking",
  "Cloud Storage",

  // --- Machine Learning & Data Science ---
  "Machine Learning",
  "Deep Learning",
  "Data Visualization",
  "Model Training",
  "MLOps",
  "Data Pipelines",

  // --- Security & Networking ---
  "Cybersecurity",
  "Penetration Testing",
  "Encryption",
  "Authentication",
  "Network Monitoring",

  // --- Design & Productivity ---
  "UI/UX Design",
  "Productivity",
  "Collaboration",
  "Project Management",
  "Education",
  "Marketing",
  "SEO Tools",
  "Research",

  // --- Other Useful Tech Categories ---
  "Browser Extensions",
  "APIs & SDKs",
  "Mobile App Development",
  "Game Development",
  "Blockchain",
  "AR/VR",
];

const Categories = ({ searchQuery }) => {
  const filtered = categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="categories" className="fade-in" style={{ padding: "80px 24px" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "32px",
          color: "white",
        }}
      >
        Categories
      </h2>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <Link
              key={i}
              to={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="tool-card"
              style={{
                padding: "16px 24px",
                borderRadius: "16px",
                cursor: "pointer",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                backdropFilter: "blur(8px)",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              {cat}
            </Link>
          ))
        ) : (
          <p style={{ color: "gray" }}>No categories found</p>
        )}
      </div>
    </section>
  );
};

export default Categories;
