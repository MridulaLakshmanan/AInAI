import React from "react";

const SubmitTool = () => {
  return (
    <section id="submit" className="fade-in" style={{ padding: "80px 24px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "32px" }}>Submit Your AI Tool</h2>
      <form className="submit-form">
        <input type="text" placeholder="Tool Name" />
        <input type="text" placeholder="Category" />
        <textarea placeholder="Description" rows={4}></textarea>
        <button type="submit">Submit Tool</button>
      </form>
    </section>
  );
};

export default SubmitTool;
