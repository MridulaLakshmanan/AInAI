import React from "react";

const categories = [
  "AI Assistant", "Image Generation", "Writing AI", "Video Editing", "Data Analysis", "Chatbots"
];

const Categories = ({ searchQuery }) => {
  const filtered = categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="categories" className="fade-in" style={{ padding: "80px 24px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "32px" }}>Categories</h2>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <div key={i} className="tool-card" style={{ padding: "16px 24px", cursor: "pointer" }}>
              {cat}
            </div>
          ))
        ) : (
          <p style={{ color: "gray" }}>No categories found</p>
        )}
      </div>
    </section>
  );
};

export default Categories;
