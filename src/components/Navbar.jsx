import React from 'react';
import { FaBars } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">🌌 ALL I NEED AI</div>
          <span className="logo-text"> </span>
        </div>

        <div className="nav-menu">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#trending" className="nav-link">Trending</a>
          <a href="#tools" className="nav-link">Tools</a>
          <a href="#submit" className="nav-link">Submit</a>
        </div>

        <button className="mobile-menu-toggle">
          <FaBars />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
