import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import trendingTools from "../data/trendingTools";
import ToolModal from "./ToolModal";

export default function CircularGallery({
  bend = 2.8,
  scrollEase = 0.05,
  autoSpeed = 0.008,
  spacing = 450,
}) {
  const galleryRef = useRef(null);
  const scroll = useRef({ current: 0, target: 0, ease: scrollEase });
  const rafRef = useRef(null);
  const userInteracting = useRef(false);
  const autoScroll = useRef(false);
  const inactivityTimer = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cards = Array.from(gallery.querySelectorAll(".tool-card"));
    const totalCards = cards.length;
    const totalWidth = totalCards * spacing;

    let isDragging = false;
    let startX = 0;

    // 🖱 Manual Scroll / Drag
    const handleWheel = (e) => {
      e.preventDefault();
      const delta =
        (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.0015;
      scroll.current.target += delta;
      userInteracting.current = true;
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(
        () => (userInteracting.current = false),
        1500
      );
    };

    const onDown = (e) => {
      isDragging = true;
      startX = e.clientX || e.touches[0].clientX;
      userInteracting.current = true;
    };

    const onUp = () => {
      isDragging = false;
      inactivityTimer.current = setTimeout(
        () => (userInteracting.current = false),
        1500
      );
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || e.touches[0].clientX;
      const dx = x - startX;
      scroll.current.target -= dx * 0.01;
      startX = x;
    };

    // 👁️ Detect visible section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (autoScroll.current = entry.isIntersecting));
      },
      { threshold: 0.3 }
    );
    observer.observe(gallery);

    // 🌀 Smooth animation loop
    const animate = () => {
      if (autoScroll.current && !userInteracting.current)
        scroll.current.target += autoSpeed;

      // soft easing
      scroll.current.current +=
        (scroll.current.target - scroll.current.current) * scroll.current.ease;

      // maintain loop
      if (scroll.current.current > totalCards) scroll.current.current = 0;
      if (scroll.current.current < 0) scroll.current.current = totalCards;

      const radius = bend * 380;
      const centerX = gallery.offsetWidth / 2;
      const centerY = 100;

      cards.forEach((card, i) => {
        // precise index looping with margins on both ends
        const indexOffset =
          ((i - scroll.current.current) % totalCards + totalCards) % totalCards;
        const xPos = (indexOffset - totalCards / 2) * spacing;

        const normX = (xPos / gallery.offsetWidth) * Math.PI;
        const y = Math.sin(normX) * radius * 0.05;
        const z = Math.cos(normX) * radius * 0.02;

        card.style.transform = `translate3d(${centerX + xPos}px, ${
          centerY + y
        }px, ${z}px) scale(1)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Event listeners
    gallery.addEventListener("wheel", handleWheel, { passive: false });
    gallery.addEventListener("mousedown", onDown);
    gallery.addEventListener("mouseup", onUp);
    gallery.addEventListener("mouseleave", onUp);
    gallery.addEventListener("mousemove", onMove);
    gallery.addEventListener("touchstart", onDown);
    gallery.addEventListener("touchmove", onMove);
    gallery.addEventListener("touchend", onUp);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      gallery.removeEventListener("wheel", handleWheel);
      gallery.removeEventListener("mousedown", onDown);
      gallery.removeEventListener("mouseup", onUp);
      gallery.removeEventListener("mouseleave", onUp);
      gallery.removeEventListener("mousemove", onMove);
      gallery.removeEventListener("touchstart", onDown);
      gallery.removeEventListener("touchmove", onMove);
      gallery.removeEventListener("touchend", onUp);
    };
  }, [bend, scrollEase, autoSpeed, spacing]);

  // 🧩 Modal Logic
  const openTool = (tool) => setSelectedTool(tool);
  const closeTool = () => setSelectedTool(null);

  const goToDetail = (tool) => {
    setSelectedTool(null);
    navigate(`/tool/${tool.name}`, { state: { tool } });
  };

  return (
    <>
      <div className="circular-gallery" ref={galleryRef}>
        {trendingTools.map((tool, i) => (
          <div
            key={i}
            className="tool-card glass-card"
            onClick={() => openTool(tool)}
          >
            <div className="tool-header">
              <span className="tool-tag">🔥 Trending</span>
            </div>
            <img src={tool.image} alt={tool.name} className="tool-logo" />
            <h3 className="tool-name">{tool.name}</h3>
            <p className="tool-category">{tool.category}</p>
            <p className="tool-description">{tool.description}</p>
            <div className="tool-footer">
              <span className="rating">⭐ {tool.rating}</span>
              <span className="pricing">{tool.pricing}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={closeTool}
          onViewDetail={() => goToDetail(selectedTool)}
        />
      )}
    </>
  );
}
