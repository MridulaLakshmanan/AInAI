import React, { useState, useEffect } from "react";
// import { createClient } from "@supabase/supabase-js"; // 🔹 Uncomment later

// const supabase = createClient("https://YOUR_PROJECT_REF.supabase.co", "YOUR_PUBLIC_ANON_KEY");

const AllToolsSection = ({ searchQuery }) => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // 🔹 Fetch locally for now
    const stored = JSON.parse(localStorage.getItem("tools")) || [];
    setTools(stored);

    // 🔹 Future Supabase connection:
    /*
    const fetchFromDB = async () => {
      const { data, error } = await supabase.from("tools").select("*");
      if (!error) setTools(data);
    };
    fetchFromDB();
    */
  }, []);

  const filtered = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="all-tools" style={{ padding: "60px 24px" }}>
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>All Tools</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
        {filtered.map(tool => (
          <div key={tool.id} style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "20px",
            width: "280px",
            color: "white",
            backdropFilter: "blur(10px)",
          }}>
            <h3>{tool.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{tool.description}</p>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: "#00FFFF" }}>
              Visit Tool →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllToolsSection;
