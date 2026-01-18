"use client"; // Make it a client component for interactivity

import React from "react";
import Link from "next/link";
import Image from "next/image"; // For optimized images
import "./landingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Odyssey</span>
        </div>

        <div className="nav-right">
          <a className="active" href="#">
            About
          </a>
          <a href="#">Destinations</a>
          <a href="#">Pricing</a>
          {/* Sign-in navigates to /login */}
          <Link href="/login">
            <button className="signin-btn">Sign-in</button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="header">
        <div className="first">
          <div id="text">
            <h1>
              Your Journey, <br /> Unified
            </h1>
            <p>
              Simplify trip organization with intuitive planning tools and connect with a vibrant
              community of travelers. Powered by AI for personalized itineraries and optimized
              routes.
            </p>
            <br />
            <button className="btn" id="travel">
              Start Planning Now
            </button>
            <button className="btn" id="learn">
              Learn more
            </button>
          </div>

          <div id="travelIMG">
            <Image src="/cover.png" alt="Travel Cover" width={600} height={400} />
          </div>
        </div>

        {/* Features */}
        <div className="second">
          <div className="box ai">
            <h3>✨ AI Assistant</h3>
            <p>Personalized itineraries generated in seconds</p>
          </div>

          <div className="box routes">
            <h3>🗺️ Smart Routes</h3>
            <p>
              AI-powered route optimization that saves time and money, ensuring you visit
              attractions in the most efficient sequence.
            </p>
          </div>

          <div className="box explore">
            <h3>🌍 Discover and Explore</h3>
            <p>
              Browse destinations categorized by <strong>Nature</strong>,{" "}
              <strong>Urban Lifestyle</strong>, and <strong>History & Museums</strong> to find
              your perfect adventure.
            </p>
          </div>

          <div className="box memory">
            <h3>📸 Memory Lane</h3>
            <p>
              Automatically chronicle your travel history with a beautiful timeline of all the
              places you've visited.
            </p>
          </div>

          <div className="box community">
            <h3>👥 Community</h3>
            <p>Connect with travelers worldwide</p>
          </div>

          <div className="box budget">
            <h3>💰 Budget Estimates</h3>
            <p>
              Get accurate cost estimates for transportation, accommodation, and activities
              before you book.
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="third">
        <div className="sec">
          <h3>120K+</h3>
          <p>Happy Travellers</p>
        </div>

        <div className="sec">
          <h3>500K+</h3>
          <p>Destinations</p>
        </div>

        <div className="sec">
          <h3>10K+</h3>
          <p>Shared itineraries</p>
        </div>

        <div className="sec">
          <h3>5K+</h3>
          <p>New users daily</p>
        </div>
      </section>

      {/* How it works */}
      <section className="pad">
        <div className="four">
          <h1>How It Works</h1>
          <p>Start your journey in three simple steps</p>
          <h2>1</h2>
          <h4>
            Search for your target destination and browse through our curated selection of
            attractions
          </h4>
          <h2>2</h2>
          <h4>
            Use our AI assistant or manual planner to create the perfect itinerary with optimized
            routes and estimated costs
          </h4>
          <h2>3</h2>
          <h4>
            Share your journey with the community and discover hidden gems from fellow travelers.
          </h4>
        </div>
      </section>

      {/* Call to action */}
      <section className="pad">
        <div className="five">
          <div className="plan">
            <h3>Ready to Start Your Adventure?</h3>
            <p>Join thousands of travelers planning their perfect trips</p>
            <button className="start-btn">Start Planning Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pad">
        <div className="six">
          <h6>© Odyssey. Made with ❤️ by Route6</h6>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


