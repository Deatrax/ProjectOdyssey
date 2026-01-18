'use client';

import { useState } from 'react';
import './dbnew.css';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          {/* Logo + Text */}
          <div className="nav-logo">
            <div className="logo-image">
              <img src="Odyssey_Logo.png" alt="Odyssey Logo" />
            </div>
            <span className="logo-text">Odyssey</span>
          </div>

          {/* Desktop Links */}
          <div className="nav-links">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Planner</a>
            <a href="#" className="nav-link">My Trips</a>
            <a href="#" className="nav-link">Saved places</a>
            <a href="#" className="nav-link">Co-Travellers</a>
          </div>

          {/* Buttons */}
          <div className="nav-buttons">
            <button className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
              </svg>
            </button>
            <button className="icon-button">
              <svg className="user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn-wrapper">
            <button 
              id="mobile-menu-button" 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Section with Search */}
        <div className="hero-section">
          <img src="dashboard-bg.jpg" alt="Travel" className="hero-image" />
          <div className="hero-overlay">
            <div className="search-wrapper">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search your next destination..."
                  className="search-input"
                />
                <button className="search-button">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#F19E39">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Drafts Section */}
        <div className="section">
          <h2 className="section-title">Recent Drafts</h2>
          <div className="drafts-grid">
            <div className="draft-card">
              <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=300&fit=crop" alt="Bali Trip" className="draft-image" />
              <div className="draft-gradient"></div>
              <span className="draft-label">Bali Trip</span>
            </div>
            <div className="draft-card">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop" alt="Darjeeling Trip" className="draft-image" />
              <div className="draft-gradient"></div>
              <span className="draft-label">Darjeeling Trip</span>
            </div>
            <div className="draft-card add-card">
              <svg className="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="section">
          <h2 className="section-title-center">Recommended For You:</h2>
          <div className="recommended-grid">
            <div className="recommended-card">
              <img src="https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&h=300&fit=crop" alt="Lorem Ipsum" className="recommended-image" />
              <div className="recommended-gradient"></div>
              <span className="recommended-label">Summer Vibes</span>
            </div>
            <div className="recommended-card">
              <img src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop" alt="Winter Trips near you" className="recommended-image" />
              <div className="recommended-gradient"></div>
              <span className="recommended-label">Winter Trips near you</span>
            </div>
            <div className="recommended-card">
              <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop" alt="Shopping this season" className="recommended-image" />
              <div className="recommended-gradient"></div>
              <span className="recommended-label">Shopping this season</span>
            </div>
            <div className="recommended-card">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop" alt="Safari" className="recommended-image" />
              <div className="recommended-gradient"></div>
              <span className="recommended-label">Safari</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card-large">
            <h3 className="action-title-large">Check out what your Friends are doing!</h3>
            <button className="action-button">
              <span className="arrow">→</span>
            </button>
          </div>
          <div className="action-cards-right">
            <div className="action-card-small pictures">
              <h3 className="action-title-small">Share Pictures</h3>
            </div>
            <div className="action-card-small review">
              <h3 className="action-title-small">Review a place</h3>
            </div>
          </div>
        </div>

        {/* Your Timeline Section */}
        <div className="timeline-section">
          <h2 className="timeline-title">Your Timeline</h2>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          ©Odyssey. Made with <span className="heart">❤️</span> by Route6
        </p>
      </footer>
    </>
  );
}