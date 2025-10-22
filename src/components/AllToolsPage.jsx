import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ToolModal from "./ToolModal";

const AllToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("ai_tools").select("*");

      if (error) {
        console.error("❌ Error fetching tools from Supabase:", error.message);
      } else {
        console.log("✅ Tools fetched:", data);
        setTools(data);
      }
      setLoading(false);
    };

    fetchTools();
  }, []);

  const filtered = tools.filter(
    (tool) =>
      tool.name?.toLowerCase().includes(search.toLowerCase()) ||
      tool.description?.toLowerCase().includes(search.toLowerCase()) ||
      tool.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openTool = (tool) => setSelectedTool(tool);
  const closeTool = () => setSelectedTool(null);

  return (
    <section
      style={{
        padding: "100px 40px",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "28px",
        }}
      >
        All AI Tools
      </h2>

      {/* Search Input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px 22px",
            borderRadius: "30px",
            border: "1px solid rgba(0,255,255,0.5)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            width: "700px",
            textAlign: "left",
            fontSize: "16px",
            outline: "none",
            boxShadow: "0 0 15px rgba(0,255,255,0.2)",
          }}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>
          Loading tools from Supabase...
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((tool) => (
              <div
                key={tool.id}
                className="glass-tool-card"
                onClick={() => openTool(tool)}
                style={{
                  cursor: "pointer",
                  width: "280px",
                  minHeight: "260px",
                  borderRadius: "20px",
                  padding: "24px",
                  background:
                    "rgba(255, 255, 255, 0.1)", // Transparent liquid glass look
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  boxShadow:
                    "0 0 20px rgba(0,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 0 25px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.15)";
                  e.currentTarget.style.border =
                    "1px solid rgba(0,255,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(0,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.1)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.2)";
                }}
              >
                {/* Optional image */}
                {tool.image && (
                  <img
                    src={tool.image}
                    alt={tool.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      margin: "0 auto 12px",
                    }}
                  />
                )}

                {/* Tool Info */}
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    textAlign: "center",
                    color: "white",
                    marginBottom: "8px",
                  }}
                >
                  {tool.name}
                </h3>
                <p
                  style={{
                    color: "#00FFFF",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {tool.category}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#ccc",
                    textAlign: "center",
                    flexGrow: "1",
                    minHeight: "40px",
                  }}
                >
                  {tool.description || "No description available."}
                </p>

                {/* Visit link */}
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#00FFFF",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        padding: "8px 16px",
                        border: "1px solid rgba(0,255,255,0.4)",
                        borderRadius: "20px",
                        transition: "0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(0,255,255,0.1)";
                        e.currentTarget.style.boxShadow =
                          "0 0 8px rgba(0,255,255,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Visit →
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>
              No tools found.
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={closeTool}
          onViewDetail={() => window.open(selectedTool.url, "_blank")}
        />
      )}
    </section>
  );
};

export default AllToolsPage;
