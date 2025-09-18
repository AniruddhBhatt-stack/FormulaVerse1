import React from "react";
import Orb from "./Orb";
import CardNav from "./CardNav"; // <-- import your CardNav
import logo from "./logo.png";   // <-- use your own logo

function Landing() {
  const handleLogin = () => {
    // Redirect to Flask backend for Google OAuth
    window.location.href = "http://localhost:5000/auth/login";
  };

  const goToChat = () => {
    window.location.href = "/chat";
  };

  // CardNav items
  const navItems = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company", href: "/company" },
        { label: "Careers", ariaLabel: "About Careers", href: "/careers" },
      ],
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects", href: "/featured" },
        { label: "Case Studies", ariaLabel: "Project Case Studies", href: "/case-studies" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us", href: "mailto:info@example.com" },
        { label: "Twitter", ariaLabel: "Twitter", href: "https://twitter.com" },
        { label: "LinkedIn", ariaLabel: "LinkedIn", href: "https://linkedin.com" },
      ],
    },
  ];

  return (
    <div className="landing-page">
      {/* Orb Background Component */}
      <div className="orb-wrapper">
        <Orb
          hoverIntensity={0.4}
          rotateOnHover={true}
          hue={1}
          forceHoverState={false}
        />
      </div>

      {/* Math Background Symbols */}
      <div className="math-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <span
            key={i}
            className="math-symbol"
            style={{
              "--x": Math.random(),
              "--y": Math.random(),
              animationDuration: `${10 + Math.random() * 20}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
            }}
          >
            {["∑", "√", "π", "∞", "∫", "∆", "≈", "∇"][i % 8]}
          </span>
        ))}
      </div>

      {/* Card Navigation */}
      <CardNav
        logo={logo}
        logoAlt="MathNarrator Logo"
        items={navItems}
        baseColor="rgba(255, 255, 255, 0.1)"
        menuColor="#000"
        buttonBgColor="#fff"
        buttonTextColor="#fff"
        ease="power3.out"
      />

      {/* Main Hero Content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Formula<span className="highlight">Verse</span>
          </h1>
          <p className="hero-subtitle">
            A Deep-Dive into contextual scenario generation from mathematical
            expressions
          </p>

          <div className="cta-buttons">
            <button className="btn-primary" onClick={handleLogin}>
              <span>Sign in with Google</span>
              <div className="btn-shine"></div>
            </button>

            <button className="btn-secondary" onClick={goToChat}>
              Quick Chat <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style jsx="true">{`
        /* --- Font Import & Global Styles --- */
        
        

        .landing-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-family: "Kode Mono", monospace;
          background: #0c0a18; /* Darker, moodier background */
          color: #e2e8f0;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        
        /* --- Background Elements (Orb & Math Symbols) --- */
        .orb-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          pointer-events: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .math-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .math-symbol {
          position: absolute;
          opacity: 0.15;
          color: #fff;
          animation: float 20s linear infinite;
          left: calc(100% * var(--x, 0));
          top: calc(100% * var(--y, 0));
        }
        @keyframes float {
          from {
            transform: translateY(100vh) rotate(0deg);
          }
          to {
            transform: translateY(-100vh) rotate(360deg);
          }
        }
        
        /* --- Main Content & Hero Section --- */
        .main-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          padding: 2rem;
        }

        .hero-section {
          max-width: 650px;
          opacity: 0;
          animation: fadeInUp 1.5s ease 0.2s forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* --- Text Styling (NEW) --- */
        .hero-title {
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 800;
          color: #ffffffff;
          margin: 0 0 1rem 0;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .highlight {
          color: #0004fdff;
  
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #a0aec0; /* Lighter grey for better readability */
          max-width: 85%;
          line-height: 1.6;
          margin: 0 auto 2.5rem auto;
        }
        
        /* --- Button Styling (UPDATED for Google Gradient) --- */
.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 12px 28px;
  font-family: "Kode Mono", monospace;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 999px; /* Pill shape */
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* ✅ Google gradient colors */
.btn-primary {
  background: 
    #0004fdff 60%;
  background-size: 300% 300%;
  color: #fff;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  background-position: 100% 0;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.35);
}

/* Shine Effect */
.btn-shine {
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 80%
  );
}

.btn-primary:hover .btn-shine {
  transform: translateX(250%);
  transition: transform 0.7s ease-in-out;
}

/* Secondary Button */
.btn-secondary {
  
  color: #0004fdff 60%;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover .btn-shine {
  transform: translateX(250%);
  transition: transform 0.7s ease-in-out;
}

.arrow {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.btn-secondary:hover .arrow {
  transform: translateX(4px);
}

      `}</style>
    </div>
  );
}

export default Landing;