import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // For now, get from localStorage
    const stored = JSON.parse(localStorage.getItem("tools")) || [];
    const filtered = stored.filter((tool) =>
      tool.category.toLowerCase().replace(/\s+/g, "-") === categoryId
    );
    setTools(filtered);

    // 🔹 Later connect Supabase:
    /*
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("category", categoryId.replace(/-/g, " "));
    if (!error) setTools(data);
    */
  }, [categoryId]);

  return (
    <section style={{ padding: "80px 24px", color: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
        {categoryId.replace(/-/g, " ").toUpperCase()} Tools
      </h2>

      {tools.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {tools.map((tool) => (
            <div
              key={tool.id}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "20px",
                width: "280px",
                color: "white",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3>{tool.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
                {tool.description}
              </p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00FFFF" }}
              >
                Visit Tool →
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#aaa" }}>
          No tools yet in this category.
        </p>
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Link
          to="/"
          style={{
            color: "#00FFFF",
            textDecoration: "none",
            border: "1px solid rgba(0,255,255,0.3)",
            borderRadius: "8px",
            padding: "10px 20px",
            background: "rgba(0,255,255,0.1)",
          }}
        >
          ← Back to Categories
        </Link>
      </div>
    </section>
  );
};

export default CategoryPage;
