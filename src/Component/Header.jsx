import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <div className="header__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
          <span className="header__logo-text">ApexChat AI</span>
        </div>

        {/* Desktop Nav */}
        <nav className="header__nav">
          <a href="#product" className="header__nav-link">Product</a>
          <a href="#customers" className="header__nav-link">Customers</a>
          <a href="#pricing" className="header__nav-link">Pricing</a>
          <a href="#docs" className="header__nav-link">Docs</a>
        </nav>

        {/* CTA Buttons */}
        <div className="header__actions">
          <a href="/login" className="header__signin">Sign in</a>
          <a href="/signup" className="header__cta">Get Started</a>
        </div>

   
        <button
          className={`header__hamburger ${menuOpen ? "header__hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

    
      <div className={`header__mobile-menu ${menuOpen ? "header__mobile-menu--open" : ""}`}>
        <nav className="header__mobile-nav">
          <a href="#product" className="header__mobile-link" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="#customers" className="header__mobile-link" onClick={() => setMenuOpen(false)}>Customers</a>
          <a href="#pricing" className="header__mobile-link" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#docs" className="header__mobile-link" onClick={() => setMenuOpen(false)}>Docs</a>
        </nav>
        <div className="header__mobile-actions">
          <a href="#signin" className="header__signin">Sign in</a>
          <a href="/signup" className="header__cta">Get Started</a>
        </div>
      </div>
    </header>
  );
};

export default Header;